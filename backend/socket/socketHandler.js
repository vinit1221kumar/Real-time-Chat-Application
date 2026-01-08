import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Message from '../models/Message.js';
import Chat from '../models/Chat.js';

export const setupSocketIO = (io) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.username = user.username;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.username} (${socket.userId})`);

    // Update user online status
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
      lastSeen: new Date()
    });

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Get user's chats and join their rooms
    const chats = await Chat.find({
      participants: socket.userId
    });

    chats.forEach(chat => {
      socket.join(`chat:${chat._id}`);
    });

    // Notify others that user is online
    socket.broadcast.emit('user:online', {
      userId: socket.userId,
      username: socket.username
    });

    // Handle new message
    socket.on('message:send', async (data) => {
      try {
        const { chatId, content, type = 'text' } = data;

        // Verify user is participant
        const chat = await Chat.findById(chatId);
        if (!chat || !chat.participants.includes(socket.userId)) {
          return socket.emit('error', { message: 'Access denied' });
        }

        const message = new Message({
          chat: chatId,
          sender: socket.userId,
          content,
          type
        });

        await message.save();
        await message.populate('sender', 'username avatar');

        // Update chat's last message
        chat.lastMessage = message._id;
        chat.lastMessageAt = new Date();
        await chat.save();

        // Emit to all participants in the chat
        io.to(`chat:${chatId}`).emit('message:new', message);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle typing indicator
    socket.on('typing:start', (data) => {
      socket.to(`chat:${data.chatId}`).emit('typing:start', {
        userId: socket.userId,
        username: socket.username,
        chatId: data.chatId
      });
    });

    socket.on('typing:stop', (data) => {
      socket.to(`chat:${data.chatId}`).emit('typing:stop', {
        userId: socket.userId,
        chatId: data.chatId
      });
    });

    // Handle message read
    socket.on('message:read', async (data) => {
      try {
        const { messageId, chatId } = data;

        const message = await Message.findById(messageId);
        if (!message) return;

        // Check if already read by this user
        const alreadyRead = message.readBy.some(
          read => read.user.toString() === socket.userId
        );

        if (!alreadyRead) {
          message.readBy.push({
            user: socket.userId,
            readAt: new Date()
          });
          message.isRead = true;
          await message.save();

          // Notify sender
          io.to(`chat:${chatId}`).emit('message:read', {
            messageId,
            userId: socket.userId
          });
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.username} (${socket.userId})`);

      // Update user offline status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date()
      });

      // Notify others that user is offline
      socket.broadcast.emit('user:offline', {
        userId: socket.userId,
        username: socket.username
      });
    });
  });
};

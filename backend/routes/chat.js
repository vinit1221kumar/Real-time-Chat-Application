import express from 'express';
import multer from 'multer';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { uploadFile } from '../config/minio.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Get all chats for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
      .populate('participants', 'username email avatar isOnline')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get or create a chat
router.post('/', authenticate, async (req, res) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ message: 'Participant ID is required' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      type: 'direct',
      participants: { $all: [req.user._id, participantId] }
    })
      .populate('participants', 'username email avatar isOnline')
      .populate('lastMessage');

    if (chat) {
      return res.json(chat);
    }

    // Create new chat
    chat = new Chat({
      participants: [req.user._id, participantId],
      type: 'direct'
    });

    await chat.save();
    await chat.populate('participants', 'username email avatar isOnline');

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages for a chat
router.get('/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is participant
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a message (text)
router.post('/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;

    // Verify user is participant
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const message = new Message({
      chat: chatId,
      sender: req.user._id,
      content,
      type: 'text'
    });

    await message.save();
    await message.populate('sender', 'username avatar');

    // Update chat's last message
    chat.lastMessage = message._id;
    chat.lastMessageAt = new Date();
    await chat.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload file (image or file)
router.post('/:chatId/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Verify user is participant
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Upload to MinIO
    const fileData = await uploadFile(req.file, req.file.originalname);

    // Determine message type
    const isImage = req.file.mimetype.startsWith('image/');
    const messageType = isImage ? 'image' : 'file';

    const message = new Message({
      chat: chatId,
      sender: req.user._id,
      content: isImage ? null : req.file.originalname,
      type: messageType,
      fileUrl: fileData.url,
      fileName: fileData.fileName,
      fileSize: fileData.size
    });

    await message.save();
    await message.populate('sender', 'username avatar');

    // Update chat's last message
    chat.lastMessage = message._id;
    chat.lastMessageAt = new Date();
    await chat.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (for finding contacts)
router.get('/users/all', authenticate, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id }
    }).select('username email avatar isOnline lastSeen');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

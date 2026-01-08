import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import UserList from './UserList';

function Chat() {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const token = localStorage.getItem('token');
    socketRef.current = io('http://localhost:5000', {
      auth: { token }
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('message:new', (message) => {
      setMessages(prev => [...prev, message]);
      // Update chat list
      setChats(prev => {
        const updated = prev.map(chat => {
          if (chat._id === message.chat) {
            return { ...chat, lastMessage: message, lastMessageAt: new Date() };
          }
          return chat;
        });
        return updated.sort((a, b) => 
          new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
        );
      });
    });

    socketRef.current.on('user:online', (data) => {
      setUsers(prev => prev.map(u => 
        u._id === data.userId ? { ...u, isOnline: true } : u
      ));
      setChats(prev => prev.map(chat => ({
        ...chat,
        participants: chat.participants.map(p => 
          p._id === data.userId ? { ...p, isOnline: true } : p
        )
      })));
    });

    socketRef.current.on('user:offline', (data) => {
      setUsers(prev => prev.map(u => 
        u._id === data.userId ? { ...u, isOnline: false } : u
      ));
      setChats(prev => prev.map(chat => ({
        ...chat,
        participants: chat.participants.map(p => 
          p._id === data.userId ? { ...p, isOnline: false } : p
        )
      })));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    fetchChats();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      const response = await axios.get('/api/chat');
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/chat/users/all');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await axios.get(`/api/chat/${chatId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleStartChat = async (userId) => {
    try {
      const response = await axios.post('/api/chat', {
        participantId: userId
      });
      
      const chat = response.data;
      setChats(prev => {
        const exists = prev.find(c => c._id === chat._id);
        if (exists) return prev;
        return [chat, ...prev];
      });
      setSelectedChat(chat);
      setShowUserList(false);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleSendMessage = (content) => {
    if (!selectedChat || !content.trim()) return;

    socketRef.current.emit('message:send', {
      chatId: selectedChat._id,
      content: content.trim(),
      type: 'text'
    });
  };

  const handleFileUpload = async (file) => {
    if (!selectedChat) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `/api/chat/${selectedChat._id}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Emit socket event to notify others
      socketRef.current.emit('message:send', {
        chatId: selectedChat._id,
        content: response.data.content,
        type: response.data.type
      });

      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-gray-800">{user?.username}</div>
              <div className="text-xs text-green-500">Online</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowUserList(!showUserList)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              title="New Chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* User List or Chat List */}
        {showUserList ? (
          <UserList
            users={users}
            onSelectUser={handleStartChat}
            onClose={() => setShowUserList(false)}
          />
        ) : (
          <ChatList
            chats={chats}
            currentUserId={user?.id}
            onSelectChat={handleSelectChat}
            selectedChatId={selectedChat?._id}
          />
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            messages={messages}
            currentUser={user}
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            socket={socketRef.current}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;

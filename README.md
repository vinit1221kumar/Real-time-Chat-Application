# Real-Time Chat Application

A full-stack real-time chat application built with React, Node.js, Socket.io, MongoDB, and MinIO.

## Features

- 🔐 User authentication (Register/Login)
- 💬 Real-time messaging with Socket.io
- 👥 Direct messaging between users
- 📁 File and image uploads using MinIO
- 🟢 Online/Offline status indicators
- ⌨️ Typing indicators
- 📱 Responsive and modern UI with Tailwind CSS

## Tech Stack

### Backend
- **Node.js** with Express
- **Socket.io** for real-time communication
- **MongoDB** with Mongoose for database
- **MinIO** for object storage
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React** with Vite
- **Socket.io-client** for real-time updates
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or connection string)
- MinIO server (running locally or connection details)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Real-time-Chat-Application-1
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_jwt_secret_key_here_change_this
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=chat-files
MINIO_USE_SSL=false
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### Start MongoDB

Make sure MongoDB is running on your system. If using Docker:

```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### Start MinIO

If using Docker for MinIO:

```bash
docker run -d -p 9000:9000 -p 9001:9001 --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"
```

Access MinIO Console at: http://localhost:9001

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Register a new account or login with existing credentials
3. Click the "+" button to start a new chat with another user
4. Select a user to start messaging
5. Send text messages, images, or files
6. See real-time updates as messages arrive

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Chat
- `GET /api/chat` - Get all chats for current user
- `POST /api/chat` - Create or get a chat
- `GET /api/chat/:chatId/messages` - Get messages for a chat
- `POST /api/chat/:chatId/messages` - Send a text message
- `POST /api/chat/:chatId/upload` - Upload a file/image
- `GET /api/chat/users/all` - Get all users

## Socket.IO Events

### Client to Server
- `message:send` - Send a message
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `message:read` - Mark message as read

### Server to Client
- `message:new` - New message received
- `typing:start` - Someone is typing
- `typing:stop` - Someone stopped typing
- `user:online` - User came online
- `user:offline` - User went offline
- `message:read` - Message was read

## Project Structure

```
Real-time-Chat-Application-1/
├── backend/
│   ├── config/
│   │   └── minio.js          # MinIO configuration
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── models/
│   │   ├── User.js           # User model
│   │   ├── Chat.js           # Chat model
│   │   └── Message.js        # Message model
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   └── chat.js           # Chat routes
│   ├── socket/
│   │   └── socketHandler.js  # Socket.IO handlers
│   ├── server.js             # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── ChatList.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   └── UserList.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
└── README.md
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `MINIO_ENDPOINT` - MinIO server endpoint
- `MINIO_PORT` - MinIO server port
- `MINIO_ACCESS_KEY` - MinIO access key
- `MINIO_SECRET_KEY` - MinIO secret key
- `MINIO_BUCKET_NAME` - MinIO bucket name
- `MINIO_USE_SSL` - Use SSL for MinIO (true/false)
- `FRONTEND_URL` - Frontend URL for CORS

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!

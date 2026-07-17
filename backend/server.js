require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,         // e.g. https://eventmate.vercel.app
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  /^http:\/\/10\.\d+\.\d+\.\d+:5173$/, // local network mobile
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.set('io', io);

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EventMate API is running' });
});

// Socket.io for Real-time notifications and Live Chat
const Message = require('./models/Message');

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Join an event room
  socket.on('joinRoom', ({ eventId }) => {
    socket.join(eventId);
    console.log(`User ${socket.id} joined room: ${eventId}`);
  });

  // Handle incoming chat messages
  socket.on('sendMessage', async ({ eventId, senderId, text, senderName, senderRole }) => {
    try {
      // 1. Save message to DB
      const newMessage = await Message.create({
        event: eventId,
        sender: senderId,
        text: text
      });

      // 2. Broadcast to everyone in the room (including sender)
      io.to(eventId).emit('receiveMessage', {
        _id: newMessage._id,
        event: eventId,
        sender: { _id: senderId, name: senderName, role: senderRole },
        text: text,
        createdAt: newMessage.createdAt
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.log('No MONGO_URI found in .env. Starting in-memory MongoDB...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    }

    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB at ${mongoUri}`);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

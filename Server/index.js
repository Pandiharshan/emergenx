// Updated: 2025-12-19 12:03:26 - perf(ui): update error handling in ui
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import triageRoutes from './routes/triageRoutes.js';
import callRoutes from './routes/callRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/calls', callRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'EmergenX Backend API is running!' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Create HTTP server and Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Store active users and their socket connections
const activeUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins with their user ID
  socket.on('join', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Handle call initiation
  socket.on('initiate-call', (data) => {
    const { receiverId, callData } = data;
    const receiverSocketId = activeUsers.get(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('incoming-call', {
        ...callData,
        callerId: socket.userId
      });
    }
  });

  // Handle call answer
  socket.on('answer-call', (data) => {
    const { callerId, callData } = data;
    const callerSocketId = activeUsers.get(callerId);
    
    if (callerSocketId) {
      io.to(callerSocketId).emit('call-answered', callData);
    }
  });

  // Handle call rejection
  socket.on('reject-call', (data) => {
    const { callerId, callData } = data;
    const callerSocketId = activeUsers.get(callerId);
    
    if (callerSocketId) {
      io.to(callerSocketId).emit('call-rejected', callData);
    }
  });

  // Handle call end
  socket.on('end-call', (data) => {
    const { otherUserId, callData } = data;
    const otherSocketId = activeUsers.get(otherUserId);
    
    if (otherSocketId) {
      io.to(otherSocketId).emit('call-ended', callData);
    }
  });

  // Handle WebRTC signaling
  socket.on('webrtc-offer', (data) => {
    const { receiverId, offer } = data;
    const receiverSocketId = activeUsers.get(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('webrtc-offer', {
        offer,
        callerId: socket.userId
      });
    }
  });

  socket.on('webrtc-answer', (data) => {
    const { callerId, answer } = data;
    const callerSocketId = activeUsers.get(callerId);
    
    if (callerSocketId) {
      io.to(callerSocketId).emit('webrtc-answer', {
        answer,
        receiverId: socket.userId
      });
    }
  });

  socket.on('webrtc-ice-candidate', (data) => {
    const { targetUserId, candidate } = data;
    const targetSocketId = activeUsers.get(targetUserId);
    
    if (targetSocketId) {
      io.to(targetSocketId).emit('webrtc-ice-candidate', {
        candidate,
        fromUserId: socket.userId
      });
    }
  });

  // Handle emergency calls
  socket.on('emergency-call', (data) => {
    // Broadcast to all emergency contacts or available medical staff
    socket.broadcast.emit('emergency-alert', {
      ...data,
      callerId: socket.userId
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.userId) {
      activeUsers.delete(socket.userId);
      console.log(`User ${socket.userId} disconnected`);
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`ðŸš€ EmergenX Server running on port ${PORT}`);
  console.log(`ðŸ“ž WebSocket server ready for real-time calls`);
});


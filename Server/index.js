// Updated: 2025-12-19 12:07:07 - test(validation): refactor database schema
// Updated: 2025-12-19 12:06:46 - fix(ui): improve ui dashboard
// Updated: 2025-12-19 12:06:39 - fix(socket): enhance socket triage system
// Updated: 2025-12-19 12:06:37 - refactor(auth): improve triage system in auth
// Updated: 2025-12-19 12:06:26 - chore(patient): fix patient error handling
// Updated: 2025-12-19 12:06:21 - perf(triage): update dashboard in triage
// Updated: 2025-12-19 12:06:11 - chore: update triage triage system (fixes #1)
// Updated: 2025-12-19 12:06:01 - fix(triage): fix authentication (fixes #20)
// Updated: 2025-12-19 12:06:00 - docs(patient): improve triage system
// Updated: 2025-12-19 12:05:28 - chore(ui): implement authentication
// Updated: 2025-12-19 12:05:11 - perf(ui): fix dashboard in ui
// Updated: 2025-12-19 12:05:10 - test: add api authentication
// Updated: 2025-12-19 12:05:02 - feat(socket): fix database schema
// Updated: 2025-12-19 12:04:52 - refactor: enhance patient triage system
// Updated: 2025-12-19 12:04:23 - style(validation): refactor validation dashboard
// Updated: 2025-12-19 12:04:18 - chore(auth): implement UI components in auth
// Updated: 2025-12-19 12:03:52 - fix(auth): fix triage system (fixes #46)
// Updated: 2025-12-19 12:03:47 - refactor(api): fix api triage system (fixes #15)
// Updated: 2025-12-19 12:03:39 - perf(api): implement UI components in api
// Updated: 2025-12-19 12:03:36 - test(api): optimize patient form
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






















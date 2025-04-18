import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import { Document } from './models/document.model.js';
import { User } from './models/user.model.js';
import userRouter from './routes/user.route.js';
import documentRouter from './routes/document.route.js';
import invitationRouter from './routes/invitation.route.js'

const app = express();
const server = http.createServer(app);

// Socket.IO Configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

// Middleware Setup
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));
app.use(cookieParser());

// Route Handlers
app.use('/api/v1/user', userRouter);
app.use('/api/v1/document', documentRouter);
app.use('/api/v1/invitation', invitationRouter);

// Socket.IO Event Handlers
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', ({ userId }) => {
    if (!userId) {
      console.log('No user ID provided, cannot join room.');
      return;
    }
    socket.join(userId);
    console.log(`User with ID ${userId} joined room.`);
  });``

  // Join Document Room
  socket.on('joinDocument', (documentId) => {
    socket.join(documentId);
    console.log(`User ${socket.id} joined document: ${documentId}`);
  });

  // Handle Text Change Event
  socket.on('text-change', async ({ documentId, delta, userId, content }, callback) => {
    if (!documentId || !userId || !content) {
      const error = 'Missing required fields';
      console.error(error);
      callback?.({ error });
      return socket.emit('update-error', error);
    }

    try {
      const document = await Document.findById(documentId);
      if (!document) {
        const error = 'Document not found';
        console.error(error);
        callback?.({ error });
        return socket.emit('update-error', error);
      }

      // Update document content and add version history
      document.content = content;
  
      await document.save();

      // Get editor's name
      const user = await User.findById(userId);
      const editorName = user ? user.fullName : 'Unknown User';

      // Broadcast changes to other clients
      socket.to(documentId).emit('text-change', {
        delta,
        editorName,
        content,
      });

      callback?.({ success: true });
      socket.emit('update-success');

    } catch (error) {
      console.error('Error updating document:', error);
      callback?.({ error: error.message });
      socket.emit('update-error', 'Failed to update document');
    }
  });

  // Handle Disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

export {io, app, server };

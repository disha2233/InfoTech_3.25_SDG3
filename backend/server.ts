import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

import authRoutes from './routes/auth';
import ambulanceRoutes from './routes/ambulance';
import emergencyRoutes from './routes/emergency';
import hospitalRoutes from './routes/hospital';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/emergency-db';

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Socket.io Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    socket.on('update_location', (data) => {
        // data: { ambulanceId, lat, lng }
        io.to('dispatch_center').emit('ambulance_location_update', data);
        console.log('Location update:', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Make io accessible in routes
app.set('socketio', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ambulance', ambulanceRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/hospital', hospitalRoutes);

app.get('/', (req, res) => {
    res.send('Backend is running with MongoDB & Socket.io');
});

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

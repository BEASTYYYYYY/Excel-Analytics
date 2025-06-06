// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import password from '../../excel/src/api/password.js';
import authRoutes from './routes/authRoutes.js';
import fileUploadRoute from './routes/fileUpload.js';
import profileRoutes from './routes/profileRoutes.js';
import insights from './routes/insights.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from 'fs';
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/upload', fileUploadRoute);
app.use('/api/profile', profileRoutes);
app.use('/api/insight', insights);
app.use('/api/password', password); 
app.use('/api/users', userRoutes)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB atlas connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });
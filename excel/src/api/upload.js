import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import * as XLSX from 'xlsx';
import mongoose from 'mongoose';
import CanvasData from '../models/canvasData.js'; // adjust path as needed
import process from 'process';

const router = express.Router();

// MongoDB connection
const connectToDB = async () => {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'upload');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// Upload Route
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        await connectToDB();

        const newRecord = new CanvasData({
            filename: req.file.originalname,
            uploadDate: new Date(),
            fileSize: (req.file.size / 1024).toFixed(2) + ' KB',
            parsedData: data,
        });

        await newRecord.save();

        res.status(200).json({
            success: true,
            message: 'File uploaded and data saved to DB',
            data,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Upload failed' });
    }
});

export default router;

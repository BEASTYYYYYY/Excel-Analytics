// backend/routes/canvasRoutes.js
import express from 'express';
import CanvasData from '../models/CanvasData.js';

const router = express.Router();

// Save canvas data
router.post('/', async (req, res) => {
    try {
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({ message: 'Canvas data is required.' });
        }

        let canvasDoc = await CanvasData.findOne();
        if (canvasDoc) {
            canvasDoc.data = data;
            await canvasDoc.save();
        } else {
            canvasDoc = new CanvasData({ data });
            await canvasDoc.save();
        }

        res.status(200).json({ message: 'Canvas data saved successfully.' });
    } catch (err) {
        console.error('Error saving canvas data:', err.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Load canvas data
router.get('/', async (req, res) => {
    try {
        const canvasDoc = await CanvasData.findOne();
        if (canvasDoc && canvasDoc.data) {
            res.status(200).json({ data: canvasDoc.data });
        } else {
            res.status(200).json({ data: {} }); // ✅ Changed from null to empty object
        }
    } catch (err) {
        console.error('Error retrieving canvas data:', err.message);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

export default router;

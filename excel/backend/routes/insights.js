import express from 'express';
import FileUploadHistory from '../models/fileUploadHistory.js';
import { verifyFirebaseToken } from '../middleware/verifyToken.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
router.use(verifyFirebaseToken);

// Load Gemini API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_API_KEY);

router.get('/:id', async (req, res) => {
    try {
        const record = await FileUploadHistory.findOne({
            _id: req.params.id,
            userId: req.user.uid,
        });

        if (!record || !record.parsedData) {
            return res.status(404).json({ success: false, message: 'File not found or no data' });
        }

        const parsedData = record.parsedData;
        const rowCount = parsedData.length;
        const columns = Object.keys(parsedData[0] || {});
        const sample = parsedData.slice(0, 20);

        const prompt = `
You are a highly skilled data analyst. The user has uploaded an Excel file with ${rowCount} rows.

Here are the columns in the dataset:
${columns.map((col) => `- ${col}`).join('\n')}

Here are a few sample rows from the data:
${JSON.stringify(sample, null, 2)}

Based on this dataset:
1. Identify key trends and patterns.
2. Highlight anomalies or outliers, if any.
3. Summarize each column briefly based on its values (e.g., average for numerical, most frequent for categorical).
4. If the data looks like a time series, provide time-based insights.
5. If possible, infer what this dataset is about (e.g., sales report, HR data, etc.) and provide domain-specific insights.

Be concise, accurate, and use bullet points where possible and beautily format the output.
Only give insights based on the data — no assumptions beyond what’s shown and no need to ask for whole data.
Conclude with a summary of the most important insights and not with a saying like "data is limited ."
    `.trim();

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ success: true, insights: text });
    } catch (err) {
        console.error('Gemini insight error:', err);
        res.status(500).json({ success: false, message: 'Failed to generate insights' });
    }
});

export default router;

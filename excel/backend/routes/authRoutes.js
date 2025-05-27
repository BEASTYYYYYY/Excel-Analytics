import express from 'express';
import { verifyFirebaseToken } from '../middleware/verifyToken.js';
import User from '../models/userModel.js'; // Import the User model
import admin from '../firebaseAdmin.js'; // Import Firebase admin SDK

const router = express.Router();

router.post('/firebase-login', async (req, res) => {
    const { token } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, name, email, picture } = decodedToken;
        const updateData = {
            uid,
            email,
            name: name || email?.split('@')[0],
        };
        if (picture) {
            updateData.photo = picture;
        }
        const user = await User.findOneAndUpdate(
            { uid },
            updateData,
            { new: true, upsert: true }
        );

        res.status(200).json(user);
    } catch (err) {
        console.error('Token verification failed:', err.message);
        res.status(401).json({ message: 'Unauthorized' });
    }
});

export default router;
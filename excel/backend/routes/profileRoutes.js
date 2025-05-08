// backend/routes/userRoutes.js (or profileRoutes.js)
import express from 'express';
import { verifyFirebaseToken } from '../middleware/verifyToken.js'; // Ensure middleware is in the correct folder

const router = express.Router();

// Example protected route
router.get('/profile', verifyFirebaseToken, (req, res) => {
    res.json({
        message: 'User profile accessed',
        uid: req.user.uid,
        email: req.user.email,
    });
});

export default router;

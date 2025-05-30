import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    updateUserSettings,
    changePassword
} from '../controllers/userControllers.js';
import { verifyFirebaseToken } from '../middleware/verifyToken.js';

const router = express.Router();

// All routes are protected with Firebase token verification
router.use(verifyFirebaseToken);

// User profile routes 
router.get('/', getUserProfile); // Changed from /profile to / since base path is already /api/profile
router.put('/', updateUserProfile); // Changed from /profile to /

// User settings routes
router.put('/settings', updateUserSettings);
router.post('/password', changePassword);

export default router;
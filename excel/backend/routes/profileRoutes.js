import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    updateUserSettings,
    changePassword
} from '../controllers/userControllers.js';
import { verifyFirebaseToken } from '../middleware/verifyToken.js';

const router = express.Router();
router.use(verifyFirebaseToken);
router.put('', updateUserProfile); // Changed from /profile to /
router.get('/', getUserProfile);
router.get('', getUserProfile);
router.put('/settings', updateUserSettings);
router.post('/password', changePassword);

export default router;
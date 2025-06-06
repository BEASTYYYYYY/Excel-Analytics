import express from 'express';
import { getAuth } from 'firebase-admin/auth';
import { verifyFirebaseToken } from "../../backend/middleware/verifyToken.js";

const router = express.Router();

router.post('/', verifyFirebaseToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const uid = req.user.uid;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 8 characters long'
            });
        }
        // Update the user's password
        await getAuth().updateUser(uid, {
            password: newPassword
        });
        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Error changing password:', error);

        if (error.code === 'auth/requires-recent-login') {
            return res.status(403).json({
                success: false,
                message: 'For security reasons, please sign out and sign in again before changing your password'
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update password'
        });
    }
});

export default router;
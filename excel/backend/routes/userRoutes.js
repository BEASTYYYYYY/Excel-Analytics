import express from 'express';
import {
    changeUserRole,
    getAllUsers,
    getUserStats,
    toggleUserBlock,
    submitUnblockRequest,
    getUnblockRequests,
    deleteUnblockRequest,
    getRecentActivities,
    getRecentUploads, deleteUpload
} from '../controllers/userControllers.js';
import { changePassword, broadcastEmail, adminDeleteUpload } from '../controllers/adminController.js';
import { verifyFirebaseToken } from '../middleware/verifyToken.js';

const router = express.Router();

// ⚠️ Static routes must come before any :uid dynamic routes
router.get('/', verifyFirebaseToken, getAllUsers);
router.get('/stats', verifyFirebaseToken, getUserStats);
router.post('/unblock-request', verifyFirebaseToken, submitUnblockRequest);
router.get('/unblock-requests', verifyFirebaseToken, getUnblockRequests);
router.get('/recent-activities', verifyFirebaseToken, getRecentActivities);
router.get('/uploads/recent', verifyFirebaseToken, getRecentUploads);
router.delete('/uploads/:id', verifyFirebaseToken, deleteUpload);

router.patch('/:uid/role', verifyFirebaseToken, changeUserRole);
router.patch('/:uid/block', verifyFirebaseToken, toggleUserBlock);
router.delete('/unblock-requests/:uid', verifyFirebaseToken, deleteUnblockRequest);
router.post('/change-password', changePassword);
router.delete('/admin/uploads/:id', verifyFirebaseToken, adminDeleteUpload);

// POST /admin/email-broadcast
router.post('/email-broadcast', broadcastEmail);
  
export default router;

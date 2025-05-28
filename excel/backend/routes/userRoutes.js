// routes/userRoutes.js
import express from 'express';
import { changeUserRole, getAllUsers } from '../controllers/userControllers.js';
import { verifyFirebaseToken } from '../middleware/verifyToken.js';
import { getUserStats } from '../controllers/userControllers.js';
import { toggleUserBlock } from '../controllers/userControllers.js';

const router = express.Router();

router.get('/', verifyFirebaseToken, getAllUsers);
router.patch('/:uid/role', verifyFirebaseToken, changeUserRole);
router.patch('/:uid/block', verifyFirebaseToken, toggleUserBlock);
router.get('/stats', verifyFirebaseToken, getUserStats);


export default router;

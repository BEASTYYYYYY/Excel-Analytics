// api/users.js
import express from 'express';
import userRoutes from '../routes/userRoutes.js';

const router = express.Router();

router.use('/', userRoutes); // `/users` route inside

export default router;

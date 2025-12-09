import express from 'express';
import { recommendDish } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/recommend', protect, recommendDish);

export default router;
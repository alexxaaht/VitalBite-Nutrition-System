import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, getAIRecommendations } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/recommendations', protect, getAIRecommendations);

export default router;
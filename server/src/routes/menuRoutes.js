import express from 'express';
import { getMenu, addDish, deleteDish, updateDish } from '../controllers/menuController.js';
import { getCategories } from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/', getMenu);
router.get('/categories', getCategories);

// Адмінські маршрути 
router.post('/', protect, admin, addDish);
router.delete('/:id', protect, admin, deleteDish);
router.put('/:id', protect, admin, updateDish);

export default router;
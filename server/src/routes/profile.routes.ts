import { Router } from 'express';
import { getProfile, updateProfile, getContributions } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getProfile);
router.put('/', authMiddleware, updateProfile);
router.get('/contributions', authMiddleware, getContributions);

export default router; 
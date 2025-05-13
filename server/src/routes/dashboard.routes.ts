import { Router } from 'express';
import { getStats, getRecentScans, getTopVulnerabilities } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All dashboard routes require authentication
router.use(authMiddleware);

// Get user dashboard stats
router.get('/stats', getStats);

// Get recent scans
router.get('/recent-scans', getRecentScans);

// Get top vulnerabilities
router.get('/top-vulnerabilities', getTopVulnerabilities);

export default router; 
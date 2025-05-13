import { Router } from 'express';
import { param } from 'express-validator';
import { 
  getScanHistory, 
  getScanDetails, 
  downloadScanReport, 
  deleteScan 
} from '../controllers/history.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All history routes require authentication
router.use(authMiddleware);

// Get scan history
router.get('/', getScanHistory);

// Get scan details
router.get(
  '/:scanId',
  [
    param('scanId').isMongoId().withMessage('Invalid scan ID')
  ],
  getScanDetails
);

// Download scan report
router.get(
  '/:scanId/download',
  [
    param('scanId').isMongoId().withMessage('Invalid scan ID')
  ],
  downloadScanReport
);

// Delete scan
router.delete(
  '/:scanId',
  [
    param('scanId').isMongoId().withMessage('Invalid scan ID')
  ],
  deleteScan
);

export default router; 
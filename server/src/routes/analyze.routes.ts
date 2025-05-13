import { Router } from 'express';
import multer from 'multer';
import { body, param, query } from 'express-validator';
import { 
  analyzeCode, 
  analyzeFile, 
  analyzeContract, 
  getAnalysisResults,
  getBlockchainAnalytics
} from '../controllers/analyze.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { BlockchainNetwork } from '../models/Scan';

const router = Router();

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only Solidity files or plain text
    if (
      file.mimetype === 'text/plain' ||
      file.originalname.endsWith('.sol')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only Solidity (.sol) or plain text files are allowed'));
    }
  }
});

// All analyze routes require authentication
router.use(authMiddleware);

// Analyze code
router.post(
  '/code',
  [
    body('code').notEmpty().withMessage('Code is required')
  ],
  analyzeCode
);

// Analyze file
router.post(
  '/file',
  upload.single('file'),
  analyzeFile
);

// Analyze contract
router.post(
  '/contract',
  [
    body('contractAddress').notEmpty().withMessage('Contract address is required'),
    body('network')
      .notEmpty().withMessage('Network is required')
      .isIn(Object.values(BlockchainNetwork)).withMessage('Invalid network')
  ],
  analyzeContract
);

// Get analysis results
router.get(
  '/results/:scanId',
  [
    param('scanId').isMongoId().withMessage('Invalid scan ID')
  ],
  getAnalysisResults
);

// Get blockchain analytics
router.get(
  '/blockchain/:address',
  [
    param('address').notEmpty().withMessage('Contract address is required'),
    query('network')
      .notEmpty().withMessage('Network is required')
      .isIn(Object.values(BlockchainNetwork)).withMessage('Invalid network')
  ],
  getBlockchainAnalytics
);

export default router; 
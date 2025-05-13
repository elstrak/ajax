import { Router } from 'express';
import { param } from 'express-validator';
import { 
  getAllVulnerabilities, 
  getVulnerabilityById, 
  getCategories, 
  getVulnerabilitiesBySeverity 
} from '../controllers/knowledge.controller';

const router = Router();

// Get all vulnerabilities (with optional filtering)
router.get('/vulnerabilities', getAllVulnerabilities);

// Get vulnerability by id
router.get(
  '/vulnerabilities/:id',
  [
    param('id').isMongoId().withMessage('Invalid vulnerability ID')
  ],
  getVulnerabilityById
);

// Get categories
router.get('/categories', getCategories);

// Get vulnerabilities by severity
router.get('/severity', getVulnerabilitiesBySeverity);

export default router; 
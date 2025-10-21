import { Router } from 'express';
import { body } from 'express-validator';
import {
  applyForJob,
  getCandidatesByJob,
  getCandidateById,
  getDashboardStats,
  uploadResume,
} from '../controllers/candidate.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = Router();

// Validation rules for candidate application
const applyForJobValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').notEmpty().withMessage('Phone number is required').trim(),
  body('experience')
    .isInt({ min: 0 })
    .withMessage('Experience must be a positive number'),
];

// Public route - Candidate application (no auth required)
router.post(
  '/apply/:jobId',
  uploadResume,
  applyForJobValidation,
  handleValidationErrors,
  applyForJob
);

// Protected routes - HR users only
// IMPORTANT: Specific routes MUST come before dynamic routes (:param)
router.get('/dashboard/stats', authenticateUser, getDashboardStats);

router.get('/job/:jobId', authenticateUser, getCandidatesByJob);

// Dynamic routes MUST come last
router.get('/:candidateId', authenticateUser, getCandidateById);

export default router;

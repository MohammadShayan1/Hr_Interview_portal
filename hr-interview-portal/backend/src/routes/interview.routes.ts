import { Router } from 'express';
import { body } from 'express-validator';
import {
  createInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  submitInterviewReport,
} from '../controllers/interview.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = Router();

// Validation rules
const createInterviewValidation = [
  body('candidateId').notEmpty().withMessage('Candidate ID is required'),
  body('scheduledTime').notEmpty().withMessage('Scheduled time is required'),
];

const updateInterviewValidation = [
  body('scheduledTime').optional().notEmpty().withMessage('Scheduled time cannot be empty'),
  body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be positive'),
];

const reportValidation = [
  body('score').isInt({ min: 0, max: 10 }).withMessage('Score must be between 0-10'),
  body('summary').notEmpty().withMessage('Summary is required'),
  body('recommendation').notEmpty().withMessage('Recommendation is required'),
];

// All routes require authentication
router.use(authenticateUser);

// POST routes
router.post(
  '/',
  createInterviewValidation,
  handleValidationErrors,
  createInterview
);

router.post(
  '/:interviewId/report',
  reportValidation,
  handleValidationErrors,
  submitInterviewReport
);

// GET routes
router.get('/', getInterviews);

// Dynamic routes MUST come last
router.get('/:interviewId', getInterviewById);

// PUT routes
router.put(
  '/:interviewId',
  updateInterviewValidation,
  handleValidationErrors,
  updateInterview
);

// DELETE routes
router.delete('/:interviewId', deleteInterview);

export default router;


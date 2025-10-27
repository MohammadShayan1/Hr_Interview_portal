import { Router } from 'express';
import { body } from 'express-validator';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  generateJobDescription,
  getPublicJob,
  testGeminiConfig,
} from '../controllers/job.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = Router();

// Validation rules
const createJobValidation = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('description').notEmpty().withMessage('Description is required'),
];

const updateJobValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty').trim(),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
];

const generateJobDescriptionValidation = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('requirements').notEmpty().withMessage('Requirements are required').trim(),
];

// Routes
// IMPORTANT: Specific routes MUST come before dynamic routes (:param)
// Otherwise Express will match /:jobId first and specific routes will never be reached

// POST routes
router.post(
  '/',
  authenticateUser,
  createJobValidation,
  handleValidationErrors,
  createJob
);

router.post(
  '/ai/generate-description',
  authenticateUser,
  generateJobDescriptionValidation,
  handleValidationErrors,
  generateJobDescription
);

// Test endpoint for Gemini configuration (no auth required for testing)
router.get('/ai/test-config', testGeminiConfig);

// GET routes - specific paths first
router.get('/', authenticateUser, getJobs);

router.get('/public/:jobId', getPublicJob);

// Dynamic routes MUST come last
router.get('/:jobId', authenticateUser, getJobById);

// PUT/DELETE routes
router.put(
  '/:jobId',
  authenticateUser,
  updateJobValidation,
  handleValidationErrors,
  updateJob
);

router.delete('/:jobId', authenticateUser, deleteJob);

export default router;

import { Router } from 'express';
import { body } from 'express-validator';
import { updateInterview } from '../controllers/webhook.controller';
import { verifyWebhookSecret } from '../middleware/webhook.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = Router();

// Validation rules
const updateInterviewValidation = [
  body('candidateId').notEmpty().withMessage('Candidate ID is required'),
];

// Webhook route - secured with webhook secret
router.post(
  '/update-interview',
  verifyWebhookSecret,
  updateInterviewValidation,
  handleValidationErrors,
  updateInterview
);

export default router;

import { Router } from 'express';
import { body } from 'express-validator';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUserAccount,
} from '../controllers/user.controller';
import { authenticateUser } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateUser);

// GET profile
router.get('/profile', getUserProfile);

// PUT profile
router.put(
  '/profile',
  body('displayName').optional().notEmpty().withMessage('Display name cannot be empty'),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('title').optional().trim(),
  handleValidationErrors,
  updateUserProfile
);

// PUT password
router.put(
  '/password',
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
  changePassword
);

// DELETE account
router.delete('/account', deleteUserAccount);

export default router;


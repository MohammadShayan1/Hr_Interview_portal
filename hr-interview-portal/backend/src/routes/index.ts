import { Router } from 'express';
import jobRoutes from './job.routes';
import candidateRoutes from './candidate.routes';
import webhookRoutes from './webhook.routes';
import interviewRoutes from './interview.routes';
import userRoutes from './user.routes';

const router = Router();

// API Routes
router.use('/jobs', jobRoutes);
router.use('/candidates', candidateRoutes);
router.use('/interviews', interviewRoutes);
router.use('/users', userRoutes);
router.use('/webhooks', webhookRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;

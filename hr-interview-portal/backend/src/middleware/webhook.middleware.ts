import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

/**
 * Middleware to verify webhook secret for n8n callbacks
 */
export const verifyWebhookSecret = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const secret = req.headers['x-webhook-secret'] || req.body.secret;
  
  if (secret !== config.webhookSecret) {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Invalid webhook secret',
    });
    return;
  }
  
  next();
};

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import logger from './config/logger';

/**
 * Create and configure Express application
 */
const createApp = (): Application => {
  const app = express();
  
  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  const allowedOrigins: (string | RegExp)[] = [
    config.frontendUrl,
    'http://localhost:3000',
    'http://192.168.0.141:3000',
  ];

  // In production, allow all Vercel preview deployments
  if (config.nodeEnv === 'production') {
    allowedOrigins.push(/\.vercel\.app$/);
  }

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin is allowed
        const isAllowed = allowedOrigins.some((allowed) => {
          if (typeof allowed === 'string') {
            return allowed === origin;
          }
          if (allowed instanceof RegExp) {
            return allowed.test(origin);
          }
          return false;
        });
        
        if (isAllowed) {
          callback(null, true);
        } else {
          logger.warn(`CORS blocked origin: ${origin}`);
          callback(null, true); // Allow anyway for now, log for debugging
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
  
  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Request logging
  app.use((req, _res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    next();
  });
  
  // API routes
  app.use('/api', routes);
  
  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);
  
  return app;
};

export default createApp;

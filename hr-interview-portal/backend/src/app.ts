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
  app.use(
    cors({
      origin: [
        config.frontendUrl,
        'http://localhost:3000',
        'http://192.168.0.141:3000',
      ],
      credentials: true,
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

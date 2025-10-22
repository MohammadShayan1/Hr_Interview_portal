import createApp from './app';
import { config, validateConfig } from './config';
import initializeFirebase from './config/firebase';
import logger from './config/logger';

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Validate environment variables
    validateConfig();
    
    // Initialize Firebase
    initializeFirebase();
    
    // Create Express app
    const app = createApp();
    
    // Start server
    const server = app.listen(config.port, '0.0.0.0', () => {
      const isProduction = config.nodeEnv === 'production';
      const host = isProduction 
        ? process.env.RAILWAY_PUBLIC_DOMAIN || 'your-app.railway.app'
        : 'localhost';
      
      logger.info(`
🚀 Server is running!
📡 Environment: ${config.nodeEnv}
🔗 URL: ${isProduction ? 'https' : 'http'}://${host}${isProduction ? '' : ':' + config.port}
📊 API: ${isProduction ? 'https' : 'http'}://${host}${isProduction ? '' : ':' + config.port}/api
✅ Health Check: ${isProduction ? 'https' : 'http'}://${host}${isProduction ? '' : ':' + config.port}/api/health
      `);
    });
    
    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };
    
    // Handle shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

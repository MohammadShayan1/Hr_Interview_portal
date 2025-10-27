import { Request, Response, NextFunction } from 'express';
import { getAuth } from '../config/firebase';
import logger from '../config/logger';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

/**
 * Middleware to verify Firebase JWT token
 */
export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Missing or invalid authorization header', {
        path: req.path,
        hasAuth: !!authHeader,
      });
      res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided',
      });
      return;
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    // Verify the token with Firebase
    const decodedToken = await getAuth().verifyIdToken(token);
    
    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    
    logger.debug('User authenticated', {
      uid: decodedToken.uid,
      email: decodedToken.email,
      path: req.path,
    });
    
    next();
  } catch (error: any) {
    logger.error('Authentication error:', {
      error: error.message,
      code: error.code,
      path: req.path,
    });
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
    });
  }
};

import { Request, Response } from 'express';
import { getDb } from '../config/firebase';
import logger from '../config/logger';
import { ApiError } from '../middleware/error.middleware';

// Helper to get db instance
const db = () => getDb();

/**
 * Webhook endpoint for n8n to update interview status and post reports
 */
export const updateInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      candidateId,
      interviewLink,
      status,
      interviewReport,
    } = req.body;
    
    if (!candidateId) {
      throw new ApiError(400, 'Candidate ID is required');
    }
    
    const candidateRef = db().collection('candidates').doc(candidateId);
    const candidateDoc = await candidateRef.get();
    
    if (!candidateDoc.exists) {
      throw new ApiError(404, 'Candidate not found');
    }
    
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };
    
    // Update interview link if provided
    if (interviewLink) {
      updateData.interviewLink = interviewLink;
    }
    
    // Update status if provided
    if (status) {
      updateData.status = status;
    }
    
    // Update interview report if provided
    if (interviewReport) {
      updateData.interviewReport = interviewReport;
    }
    
    await candidateRef.update(updateData);
    
    logger.info('Interview data updated successfully:', {
      candidateId,
      status,
    });
    
    res.status(200).json({
      success: true,
      message: 'Interview data updated successfully',
    });
  } catch (error) {
    logger.error('Error updating interview data:', error);
    throw error;
  }
};

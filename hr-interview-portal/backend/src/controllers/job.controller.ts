import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { getDb } from '../config/firebase';
import openRouterService from '../services/openrouter.service';
import logger from '../config/logger';
import { ApiError } from '../middleware/error.middleware';

// Helper to get db instance
const db = () => getDb();

/**
 * Create a new job post
 */
export const createJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.uid;
    
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }
    
    const jobData = {
      title,
      description,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    
    const jobRef = await db().collection('jobs').add(jobData);
    
    logger.info('Job created successfully:', { jobId: jobRef.id, userId });
    
    res.status(201).json({
      success: true,
      message: 'Job post created successfully',
      data: {
        jobId: jobRef.id,
        ...jobData,
      },
    });
  } catch (error) {
    logger.error('Error creating job:', error);
    throw error;
  }
};

/**
 * Get all jobs for authenticated user
 */
export const getJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }
    
    // Fetch jobs and sort in memory to avoid needing composite index
    const jobsSnapshot = await db()
      .collection('jobs')
      .where('createdBy', '==', userId)
      .get();
    
    const jobs = jobsSnapshot.docs
      .map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a: any, b: any) => {
        // Sort by createdAt descending (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    
    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    logger.error('Error fetching jobs:', error);
    throw error;
  }
};

/**
 * Get a single job by ID
 */
export const getJobById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.uid;
    
    const jobDoc = await db().collection('jobs').doc(jobId).get();
    
    if (!jobDoc.exists) {
      throw new ApiError(404, 'Job not found');
    }
    
    const jobData = jobDoc.data();
    
    // Check if user owns this job (for authenticated requests)
    if (userId && jobData?.createdBy !== userId) {
      throw new ApiError(403, 'Access denied');
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: jobDoc.id,
        ...jobData,
      },
    });
  } catch (error) {
    logger.error('Error fetching job:', error);
    throw error;
  }
};

/**
 * Get job by ID for public access (no auth required)
 */
export const getPublicJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    
    const jobDoc = await db().collection('jobs').doc(jobId).get();
    
    if (!jobDoc.exists) {
      throw new ApiError(404, 'Job not found');
    }
    
    const jobData = jobDoc.data();
    
    // Only return public fields
    res.status(200).json({
      success: true,
      data: {
        id: jobDoc.id,
        title: jobData?.title,
        description: jobData?.description,
      },
    });
  } catch (error) {
    logger.error('Error fetching public job:', error);
    throw error;
  }
};

/**
 * Update a job post
 */
export const updateJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    const { title, description } = req.body;
    const userId = req.user?.uid;
    
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }
    
    const jobDoc = await db().collection('jobs').doc(jobId).get();
    
    if (!jobDoc.exists) {
      throw new ApiError(404, 'Job not found');
    }
    
    if (jobDoc.data()?.createdBy !== userId) {
      throw new ApiError(403, 'Access denied');
    }
    
    const updateData = {
      title,
      description,
      updatedAt: new Date().toISOString(),
    };
    
    await db().collection('jobs').doc(jobId).update(updateData);
    
    logger.info('Job updated successfully:', { jobId, userId });
    
    res.status(200).json({
      success: true,
      message: 'Job post updated successfully',
      data: {
        id: jobId,
        ...updateData,
      },
    });
  } catch (error) {
    logger.error('Error updating job:', error);
    throw error;
  }
};

/**
 * Delete a job post
 */
export const deleteJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.uid;
    
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }
    
    const jobDoc = await db().collection('jobs').doc(jobId).get();
    
    if (!jobDoc.exists) {
      throw new ApiError(404, 'Job not found');
    }
    
    if (jobDoc.data()?.createdBy !== userId) {
      throw new ApiError(403, 'Access denied');
    }
    
    await db().collection('jobs').doc(jobId).delete();
    
    logger.info('Job deleted successfully:', { jobId, userId });
    
    res.status(200).json({
      success: true,
      message: 'Job post deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting job:', error);
    throw error;
  }
};

/**
 * Generate job description using AI
 */
export const generateJobDescription = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, requirements } = req.body;
    
    const generatedDescription = await openRouterService.generateJobDescription({
      title,
      requirements,
    });
    
    res.status(200).json({
      success: true,
      data: {
        description: generatedDescription,
      },
    });
  } catch (error) {
    logger.error('Error generating job description:', error);
    throw new ApiError(500, 'Failed to generate job description');
  }
};

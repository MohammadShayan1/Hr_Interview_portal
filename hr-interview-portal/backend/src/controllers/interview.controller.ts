import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { getDb } from '../config/firebase';
import logger from '../config/logger';
import { ApiError } from '../middleware/error.middleware';

const db = () => getDb();

/**
 * Create an interview for a candidate
 */
export const createInterview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { candidateId, scheduledTime, duration, notes } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    // Get candidate to verify ownership
    const candidateDoc = await db().collection('candidates').doc(candidateId).get();

    if (!candidateDoc.exists) {
      throw new ApiError(404, 'Candidate not found');
    }

    const candidateData = candidateDoc.data();
    const jobDoc = await db().collection('jobs').doc(candidateData?.jobId).get();

    if (!jobDoc.exists || jobDoc.data()?.createdBy !== userId) {
      throw new ApiError(403, 'Access denied');
    }

    // Create interview record
    const interviewData = {
      candidateId,
      jobId: candidateData?.jobId,
      createdBy: userId,
      scheduledTime,
      duration: duration || 30,
      notes: notes || '',
      status: 'scheduled',
      report: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const interviewRef = await db().collection('interviews').add(interviewData);

    // Update candidate status
    await db().collection('candidates').doc(candidateId).update({
      status: 'Interview Scheduled',
      interviewLink: `/interview/${interviewRef.id}`,
    });

    logger.info('Interview created:', { interviewId: interviewRef.id, candidateId });

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: {
        interviewId: interviewRef.id,
        ...interviewData,
      },
    });
  } catch (error) {
    logger.error('Error creating interview:', error);
    throw error;
  }
};

/**
 * Get all interviews for user's candidates
 */
export const getInterviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    // Get user's jobs
    const jobsSnapshot = await db()
      .collection('jobs')
      .where('createdBy', '==', userId)
      .get();

    const jobIds = jobsSnapshot.docs.map((doc) => doc.id);

    if (jobIds.length === 0) {
      res.status(200).json({
        success: true,
        data: [],
      });
      return;
    }

    // Get interviews for user's candidates
    const interviewsSnapshot = await db()
      .collection('interviews')
      .where('jobId', 'in', jobIds)
      .get();

    const interviews = interviewsSnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    logger.error('Error fetching interviews:', error);
    throw error;
  }
};

/**
 * Get interview by ID
 */
export const getInterviewById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { interviewId } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const interviewDoc = await db().collection('interviews').doc(interviewId).get();

    if (!interviewDoc.exists) {
      throw new ApiError(404, 'Interview not found');
    }

    const interviewData = interviewDoc.data();

    // Verify user owns this interview
    if (interviewData?.createdBy !== userId) {
      throw new ApiError(403, 'Access denied');
    }

    res.status(200).json({
      success: true,
      data: {
        id: interviewDoc.id,
        ...interviewData,
      },
    });
  } catch (error) {
    logger.error('Error fetching interview:', error);
    throw error;
  }
};

/**
 * Update interview
 */
export const updateInterview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { interviewId } = req.params;
    const { scheduledTime, duration, notes, status } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const interviewDoc = await db().collection('interviews').doc(interviewId).get();

    if (!interviewDoc.exists) {
      throw new ApiError(404, 'Interview not found');
    }

    if (interviewDoc.data()?.createdBy !== userId) {
      throw new ApiError(403, 'Access denied');
    }

    const updateData = {
      ...(scheduledTime && { scheduledTime }),
      ...(duration && { duration }),
      ...(notes !== undefined && { notes }),
      ...(status && { status }),
      updatedAt: new Date().toISOString(),
    };

    await db().collection('interviews').doc(interviewId).update(updateData);

    logger.info('Interview updated:', { interviewId });

    res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      data: {
        id: interviewId,
        ...updateData,
      },
    });
  } catch (error) {
    logger.error('Error updating interview:', error);
    throw error;
  }
};

/**
 * Delete interview
 */
export const deleteInterview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { interviewId } = req.params;
    const userId = req.user?.uid;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const interviewDoc = await db().collection('interviews').doc(interviewId).get();

    if (!interviewDoc.exists) {
      throw new ApiError(404, 'Interview not found');
    }

    if (interviewDoc.data()?.createdBy !== userId) {
      throw new ApiError(403, 'Access denied');
    }

    const interviewData = interviewDoc.data();

    // Update candidate status back to Applied
    await db().collection('candidates').doc(interviewData?.candidateId).update({
      status: 'Applied',
      interviewLink: null,
    });

    await db().collection('interviews').doc(interviewId).delete();

    logger.info('Interview deleted:', { interviewId });

    res.status(200).json({
      success: true,
      message: 'Interview deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting interview:', error);
    throw error;
  }
};

/**
 * Submit interview report
 */
export const submitInterviewReport = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { interviewId } = req.params;
    const { score, summary, recommendation, strengths, weaknesses } = req.body;
    const userId = req.user?.uid;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const interviewDoc = await db().collection('interviews').doc(interviewId).get();

    if (!interviewDoc.exists) {
      throw new ApiError(404, 'Interview not found');
    }

    if (interviewDoc.data()?.createdBy !== userId) {
      throw new ApiError(403, 'Access denied');
    }

    const reportData = {
      score,
      summary,
      recommendation,
      strengths,
      weaknesses,
      submittedAt: new Date().toISOString(),
    };

    await db().collection('interviews').doc(interviewId).update({
      report: reportData,
      status: 'completed',
      updatedAt: new Date().toISOString(),
    });

    const interviewData = interviewDoc.data();

    // Update candidate with report
    await db().collection('candidates').doc(interviewData?.candidateId).update({
      status: 'Interview Completed',
      evaluationReport: reportData,
    });

    logger.info('Interview report submitted:', { interviewId });

    res.status(200).json({
      success: true,
      message: 'Interview report submitted successfully',
      data: reportData,
    });
  } catch (error) {
    logger.error('Error submitting interview report:', error);
    throw error;
  }
};


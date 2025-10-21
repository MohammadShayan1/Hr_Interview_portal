import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { getDb, getStorage } from '../config/firebase';
import n8nService from '../services/n8n.service';
import logger from '../config/logger';
import { ApiError } from '../middleware/error.middleware';
import multer from 'multer';
import path from 'path';

// Helpers to get Firebase instances
const db = () => getDb();
const storage = () => getStorage();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and DOC files are allowed.'));
    }
  },
});

export const uploadResume = upload.single('resume');

/**
 * Submit candidate application
 */
export const applyForJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    const { name, email, phone, experience } = req.body;
    const file = req.file;
    
    if (!file) {
      throw new ApiError(400, 'Resume file is required');
    }
    
    // Verify job exists
    const jobDoc = await db().collection('jobs').doc(jobId).get();
    
    if (!jobDoc.exists) {
      throw new ApiError(404, 'Job not found');
    }
    
    const jobData = jobDoc.data();
    
    // Upload resume to Firebase Storage
    const bucket = storage().bucket();
    const fileName = `resumes/${jobId}/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });
    
    // Make the file publicly accessible
    await fileUpload.makePublic();
    const resumeUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    
    // Create candidate record
    const candidateData = {
      jobId,
      name,
      email,
      phone,
      experience: parseInt(experience, 10),
      resumeUrl,
      status: 'Applied',
      interviewLink: null,
      interviewReport: null,
      appliedAt: new Date().toISOString(),
    };
    
    const candidateRef = await db().collection('candidates').add(candidateData);
    
    logger.info('Candidate application submitted:', { 
      candidateId: candidateRef.id,
      jobId,
    });
    
    // Trigger n8n workflow
    await n8nService.triggerCandidateWorkflow({
      candidateId: candidateRef.id,
      candidateName: name,
      candidateEmail: email,
      candidatePhone: phone,
      jobId,
      jobTitle: jobData?.title || 'Unknown Position',
      resumeUrl,
    });
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        candidateId: candidateRef.id,
      },
    });
  } catch (error) {
    logger.error('Error submitting application:', error);
    throw error;
  }
};

/**
 * Get all candidates for a specific job
 */
export const getCandidatesByJob = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.uid;
    
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }
    
    // Verify user owns this job
    const jobDoc = await db().collection('jobs').doc(jobId).get();
    
    if (!jobDoc.exists) {
      throw new ApiError(404, 'Job not found');
    }
    
    if (jobDoc.data()?.createdBy !== userId) {
      throw new ApiError(403, 'Access denied');
    }
    
    // Get candidates and sort in memory to avoid composite index
    const candidatesSnapshot = await db()
      .collection('candidates')
      .where('jobId', '==', jobId)
      .get();
    
    const candidates = candidatesSnapshot.docs
      .map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a: any, b: any) => {
        // Sort by appliedAt descending (newest first)
        return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
      });
    
    res.status(200).json({
      success: true,
      data: candidates,
    });
  } catch (error) {
    logger.error('Error fetching candidates:', error);
    throw error;
  }
};

/**
 * Get candidate details by ID
 */
export const getCandidateById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { candidateId } = req.params;
    const userId = req.user?.uid;
    
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }
    
    const candidateDoc = await db().collection('candidates').doc(candidateId).get();
    
    if (!candidateDoc.exists) {
      throw new ApiError(404, 'Candidate not found');
    }
    
    const candidateData = candidateDoc.data();
    
    // Verify user owns the job this candidate applied to
    const jobDoc = await db().collection('jobs').doc(candidateData?.jobId).get();
    
    if (!jobDoc.exists || jobDoc.data()?.createdBy !== userId) {
      throw new ApiError(403, 'Access denied');
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: candidateDoc.id,
        ...candidateData,
      },
    });
  } catch (error) {
    logger.error('Error fetching candidate:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.uid;
    
    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }
    
    // Get total jobs
    const jobsSnapshot = await db()
      .collection('jobs')
      .where('createdBy', '==', userId)
      .get();
    
    const jobIds = jobsSnapshot.docs.map((doc: any) => doc.id);
    
    // Get all candidates for user's jobs
    let totalCandidates = 0;
    let interviewsCompleted = 0;
    
    if (jobIds.length > 0) {
      const candidatesSnapshot = await db()
        .collection('candidates')
        .where('jobId', 'in', jobIds)
        .get();
      
      totalCandidates = candidatesSnapshot.size;
      interviewsCompleted = candidatesSnapshot.docs.filter(
        (doc: any) => doc.data().status === 'Interview Completed' || doc.data().status === 'Report Ready'
      ).length;
    }
    
    res.status(200).json({
      success: true,
      data: {
        totalJobs: jobsSnapshot.size,
        totalCandidates,
        interviewsCompleted,
      },
    });
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

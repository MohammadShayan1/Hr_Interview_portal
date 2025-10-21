import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { getDb, getAuth } from '../config/firebase';
import logger from '../config/logger';
import { ApiError } from '../middleware/error.middleware';

const db = () => getDb();
const authAdmin = () => getAuth();

/**
 * Get user profile
 */
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    // Get user document from Firestore
    const userDoc = await db().collection('users').doc(userId).get();

    if (!userDoc.exists) {
      // Return basic Firebase user info if no Firestore document
      const firebaseUser = await authAdmin().getUser(userId);
      
      res.status(200).json({
        success: true,
        data: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          createdAt: firebaseUser.metadata.creationTime,
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        uid: userId,
        ...userDoc.data(),
      },
    });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    const { displayName, photoURL, phone, company, title, bio } = req.body;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    // Update Firebase Auth user
    if (displayName || photoURL) {
      await authAdmin().updateUser(userId, {
        ...(displayName && { displayName }),
        ...(photoURL && { photoURL }),
      });
    }

    // Update Firestore document
    const profileData = {
      ...(displayName && { displayName }),
      ...(photoURL && { photoURL }),
      ...(phone && { phone }),
      ...(company && { company }),
      ...(title && { title }),
      ...(bio && { bio }),
      updatedAt: new Date().toISOString(),
    };

    await db().collection('users').doc(userId).set(profileData, { merge: true });

    logger.info('User profile updated:', { userId });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        uid: userId,
        ...profileData,
      },
    });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Change password
 */
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;
    const { newPassword } = req.body;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    // Get user email
    const firebaseUser = await authAdmin().getUser(userId);
    const email = firebaseUser.email;

    if (!email) {
      throw new ApiError(400, 'User email not found');
    }

    // Note: Firebase Admin SDK doesn't support password verification directly
    // This should be handled by the frontend using Firebase Client SDK
    // Backend will just update the password if frontend provides confirmation

    await authAdmin().updateUser(userId, { password: newPassword });

    logger.info('Password changed:', { userId });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    logger.error('Error changing password:', error);
    throw error;
  }
};

/**
 * Delete user account
 */
export const deleteUserAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }

    // Delete user document
    await db().collection('users').doc(userId).delete();

    // Delete user jobs
    const jobsSnapshot = await db()
      .collection('jobs')
      .where('createdBy', '==', userId)
      .get();

    for (const doc of jobsSnapshot.docs) {
      await doc.ref.delete();
    }

    // Delete user's candidates
    const candidatesSnapshot = await db()
      .collection('candidates')
      .where('createdBy', '==', userId)
      .get();

    for (const doc of candidatesSnapshot.docs) {
      await doc.ref.delete();
    }

    // Delete Firebase Auth user
    await authAdmin().deleteUser(userId);

    logger.info('User account deleted:', { userId });

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting user account:', error);
    throw error;
  }
};


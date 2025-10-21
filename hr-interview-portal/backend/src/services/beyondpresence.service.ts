import axios from 'axios';
import { config } from '../config';
import logger from '../config/logger';

export interface CreateMeetingRequest {
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
}

export interface CreateMeetingResponse {
  meetingId: string;
  meetingLink: string;
  expiresAt: string;
}

/**
 * Service to interact with BeyondPresence API
 */
class BeyondPresenceService {
  private apiKey: string;
  private apiUrl: string;
  
  constructor() {
    this.apiKey = config.beyondPresence.apiKey;
    this.apiUrl = config.beyondPresence.apiUrl;
  }
  
  /**
   * Create a unique interview meeting link
   */
  async createMeeting(data: CreateMeetingRequest): Promise<CreateMeetingResponse> {
    try {
      // Note: This is a mock implementation as the actual BeyondPresence API
      // structure may vary. Adjust according to their documentation.
      const response = await axios.post(
        `${this.apiUrl}/meetings`,
        {
          title: `Interview for ${data.jobTitle}`,
          participantName: data.candidateName,
          participantEmail: data.candidateEmail,
          duration: 60, // 60 minutes
          recordingEnabled: true,
          transcriptionEnabled: true,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      const meetingData = response.data;
      logger.info('Meeting created successfully:', { meetingId: meetingData.id });
      
      return {
        meetingId: meetingData.id,
        meetingLink: meetingData.joinUrl,
        expiresAt: meetingData.expiresAt,
      };
    } catch (error) {
      logger.error('Error creating meeting:', error);
      
      // For development/testing, return a mock meeting link if API fails
      if (config.nodeEnv === 'development') {
        logger.warn('Using mock meeting link for development');
        return {
          meetingId: `mock-${Date.now()}`,
          meetingLink: `https://meet.example.com/interview/${Date.now()}`,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
      }
      
      throw new Error('Failed to create meeting');
    }
  }
  
  /**
   * Get meeting transcript
   */
  async getMeetingTranscript(meetingId: string): Promise<string> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/meetings/${meetingId}/transcript`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );
      
      logger.info('Transcript retrieved successfully:', { meetingId });
      return response.data.transcript;
    } catch (error) {
      logger.error('Error retrieving transcript:', error);
      throw new Error('Failed to retrieve transcript');
    }
  }
}

export default new BeyondPresenceService();

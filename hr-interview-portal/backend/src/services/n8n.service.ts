import axios from 'axios';
import { config } from '../config';
import logger from '../config/logger';

export interface TriggerN8nWorkflowData {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  jobId: string;
  jobTitle: string;
  resumeUrl: string;
}

/**
 * Service to interact with n8n workflows
 */
class N8nService {
  private webhookUrl: string;
  private webhookSecret: string;
  
  constructor() {
    this.webhookUrl = config.n8n.webhookUrl;
    this.webhookSecret = config.n8n.webhookSecret;
  }
  
  /**
   * Trigger n8n workflow for candidate application
   */
  async triggerCandidateWorkflow(data: TriggerN8nWorkflowData): Promise<void> {
    try {
      if (!this.webhookUrl) {
        logger.warn('n8n webhook URL not configured, skipping workflow trigger');
        return;
      }
      
      await axios.post(
        this.webhookUrl,
        {
          ...data,
          secret: this.webhookSecret,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 seconds timeout
        }
      );
      
      logger.info('n8n workflow triggered successfully:', { candidateId: data.candidateId });
    } catch (error) {
      logger.error('Error triggering n8n workflow:', error);
      // Don't throw error - we don't want to fail the application if n8n is down
      logger.warn('Continuing despite n8n workflow failure');
    }
  }
}

export default new N8nService();

import apiClient from '@/lib/api';
import { Candidate, DashboardStats } from '@/types';

export const candidateService = {
  // Apply for a job (public endpoint)
  async applyForJob(
    jobId: string,
    formData: FormData
  ): Promise<{ candidateId: string }> {
    const response = await apiClient.post(`/candidates/apply/${jobId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Get candidates by job ID
  async getCandidatesByJob(jobId: string): Promise<Candidate[]> {
    const response = await apiClient.get(`/candidates/job/${jobId}`);
    return response.data.data;
  },

  // Get candidate by ID
  async getCandidateById(id: string): Promise<Candidate> {
    const response = await apiClient.get(`/candidates/${id}`);
    return response.data.data;
  },

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get('/candidates/dashboard/stats');
    return response.data.data;
  },

  // Send email to candidate
  async sendEmailToCandidate(
    candidateId: string,
    subject: string,
    message: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(
      `/candidates/${candidateId}/send-email`,
      { subject, message }
    );
    return response.data;
  },
};

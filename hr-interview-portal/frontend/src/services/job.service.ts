import apiClient from '@/lib/api';
import { Job } from '@/types';

export const jobService = {
  // Create a new job
  async createJob(data: { title: string; description: string }): Promise<Job> {
    const response = await apiClient.post('/jobs', data);
    return response.data.data;
  },

  // Get all jobs
  async getJobs(): Promise<Job[]> {
    const response = await apiClient.get('/jobs');
    return response.data.data;
  },

  // Get job by ID
  async getJobById(id: string): Promise<Job> {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data.data;
  },

  // Get public job (no auth)
  async getPublicJob(id: string): Promise<Job> {
    const response = await apiClient.get(`/jobs/public/${id}`);
    return response.data.data;
  },

  // Update job
  async updateJob(id: string, data: { title?: string; description?: string }): Promise<Job> {
    const response = await apiClient.put(`/jobs/${id}`, data);
    return response.data.data;
  },

  // Delete job
  async deleteJob(id: string): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  },

  // Generate job description with AI
  async generateJobDescription(data: {
    title: string;
    requirements: string;
  }): Promise<string> {
    const response = await apiClient.post('/jobs/ai/generate-description', data);
    return response.data.data.description;
  },
};

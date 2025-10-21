export interface Job {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  status: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  resumeUrl: string;
  status: 'Applied' | 'Interview Scheduled' | 'Interview Completed' | 'Report Ready';
  interviewLink?: string;
  interviewReport?: InterviewReport;
  appliedAt: string;
}

export interface InterviewReport {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  summary: string;
}

export interface DashboardStats {
  totalJobs: number;
  totalCandidates: number;
  interviewsCompleted: number;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { candidateService } from '@/services/candidate.service';
import { jobService } from '@/services/job.service';
import { Users, Mail, Phone, Calendar, FileText, ExternalLink, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: number;
  resumeUrl?: string;
  jobId: string;
  status: string;
  appliedAt: string;
  interviewLink?: string;
  evaluationReport?: any;
}

interface Job {
  id: string;
  title: string;
}

function CandidatesContent() {
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get('jobId');

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<string>(jobIdParam || 'all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [emailModal, setEmailModal] = useState<{ isOpen: boolean; candidate: Candidate | null }>({ isOpen: false, candidate: null });
  const [emailForm, setEmailForm] = useState({ subject: '', message: '' });
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      if (selectedJobId && selectedJobId !== 'all') {
        fetchCandidatesByJob(selectedJobId);
      }
    }
  }, [selectedJobId, jobs]);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getJobs();
      setJobs(data);
      
      if (data.length > 0 && !jobIdParam) {
        setSelectedJobId(data[0].id);
      }
    } catch (error) {
      toast.error('Failed to fetch jobs');
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchCandidatesByJob = async (jobId: string) => {
    try {
      setLoading(true);
      const data = await candidateService.getCandidatesByJob(jobId);
      setCandidates(data);
    } catch (error) {
      toast.error('Failed to fetch candidates');
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Interview Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Interview Completed':
        return 'bg-green-100 text-green-800';
      case 'Report Ready':
        return 'bg-purple-100 text-purple-800';
      case 'Applied':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendEmail = async () => {
    if (!emailForm.subject.trim() || !emailForm.message.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }

    try {
      setEmailLoading(true);
      await candidateService.sendEmailToCandidate(
        emailModal.candidate!.id,
        emailForm.subject,
        emailForm.message
      );
      toast.success('Email sent successfully');
      setEmailModal({ isOpen: false, candidate: null });
      setEmailForm({ subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send email');
      console.error('Error sending email:', error);
    } finally {
      setEmailLoading(false);
    }
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
            <p className="mt-2 text-gray-600">View and manage job applicants</p>
          </div>

          {/* Job Filter */}
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Filter by Job:</label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Candidates List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Loading candidates...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs yet</h3>
              <p className="text-gray-600">Create a job posting first to receive candidates</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates yet</h3>
              <p className="text-gray-600">
                {selectedJob ? `No applications for "${selectedJob.title}" yet` : 'No candidates found'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                          {candidate.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${candidate.email}`} className="hover:text-primary-600">
                            {candidate.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${candidate.phone}`} className="hover:text-primary-600">
                            {candidate.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{candidate.experience} years experience</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Applied: {new Date(candidate.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 mt-4">
                        {candidate.resumeUrl && (
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}${candidate.resumeUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                          >
                            <FileText className="w-4 h-4" />
                            View Resume
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <button
                          onClick={() => setEmailModal({ isOpen: true, candidate })}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                        >
                          <Mail className="w-4 h-4" />
                          Send Email
                        </button>
                        {candidate.interviewLink && (
                          <a
                            href={candidate.interviewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Interview Link
                          </a>
                        )}
                        {candidate.evaluationReport && (
                          <button
                            onClick={() => setSelectedCandidate(candidate)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                          >
                            <FileText className="w-4 h-4" />
                            View Report
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Evaluation Report Modal */}
          {selectedCandidate?.evaluationReport && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Evaluation Report - {selectedCandidate.name}
                    </h2>
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="bg-primary-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Overall Score</div>
                      <div className="text-4xl font-bold text-primary-600">
                        {selectedCandidate.evaluationReport.score}/10
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommendation</h3>
                      <p className="text-gray-700">{selectedCandidate.evaluationReport.recommendation}</p>
                    </div>

                    {/* Summary */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
                      <p className="text-gray-700">{selectedCandidate.evaluationReport.summary}</p>
                    </div>

                    {/* Strengths */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Strengths</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {selectedCandidate.evaluationReport.strengths?.map((strength: string, index: number) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Areas for Improvement</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {selectedCandidate.evaluationReport.weaknesses?.map((weakness: string, index: number) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Send Email Modal */}
          {emailModal.isOpen && emailModal.candidate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Send Email to {emailModal.candidate.name}</h2>
                    <button
                      onClick={() => {
                        setEmailModal({ isOpen: false, candidate: null });
                        setEmailForm({ subject: '', message: '' });
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                      placeholder="Email subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={emailLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={emailForm.message}
                      onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                      placeholder="Type your message here..."
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      disabled={emailLoading}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSendEmail}
                      disabled={emailLoading}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {emailLoading ? 'Sending...' : 'Send Email'}
                    </button>
                    <button
                      onClick={() => {
                        setEmailModal({ isOpen: false, candidate: null });
                        setEmailForm({ subject: '', message: '' });
                      }}
                      disabled={emailLoading}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default function CandidatesPage() {
  return (
    <Suspense fallback={<CandidatesLoading />}>
      <CandidatesContent />
    </Suspense>
  );
}

function CandidatesLoading() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">Loading candidates...</p>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

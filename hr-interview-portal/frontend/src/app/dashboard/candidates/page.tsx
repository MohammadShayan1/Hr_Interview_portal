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
  
  // Interview scheduling modal
  const [interviewModal, setInterviewModal] = useState<{ isOpen: boolean; candidate: Candidate | null }>({ isOpen: false, candidate: null });
  const [interviewType, setInterviewType] = useState<'ai' | 'manual' | null>(null);
  const [interviewForm, setInterviewForm] = useState({ date: '', time: '', calendlyLink: '' });
  const [interviewLoading, setInterviewLoading] = useState(false);

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

  const handleScheduleInterview = async () => {
    if (!interviewType) {
      toast.error('Please select an interview type');
      return;
    }

    if (interviewType === 'ai') {
      if (!interviewForm.date || !interviewForm.time) {
        toast.error('Please select date and time for the interview');
        return;
      }
    } else if (interviewType === 'manual') {
      if (!interviewForm.calendlyLink.trim()) {
        toast.error('Please enter your Calendly link');
        return;
      }
    }

    try {
      setInterviewLoading(true);
      
      if (interviewType === 'ai') {
        await candidateService.scheduleAIInterview(
          interviewModal.candidate!.id,
          interviewForm.date,
          interviewForm.time
        );
        toast.success('AI Interview scheduled! Candidate will receive an email with the interview link.');
      } else {
        await candidateService.scheduleManualInterview(
          interviewModal.candidate!.id,
          interviewForm.calendlyLink
        );
        toast.success('Manual interview scheduled! Candidate will receive an email with the Calendly link.');
      }
      
      setInterviewModal({ isOpen: false, candidate: null });
      setInterviewType(null);
      setInterviewForm({ date: '', time: '', calendlyLink: '' });
      
      // Refresh candidates
      if (selectedJobId) {
        fetchCandidatesByJob(selectedJobId);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to schedule interview');
      console.error('Error scheduling interview:', error);
    } finally {
      setInterviewLoading(false);
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Filter by Job:</label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full sm:flex-1 sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
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
                <div key={candidate.id} className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col items-start">
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{candidate.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)} w-fit`}>
                          {candidate.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <a href={`mailto:${candidate.email}`} className="hover:text-primary-600 truncate">
                            {candidate.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <a href={`tel:${candidate.phone}`} className="hover:text-primary-600">
                            {candidate.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          <span>{candidate.experience} years experience</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>Applied: {new Date(candidate.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {candidate.resumeUrl && (
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}${candidate.resumeUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="hidden sm:inline">View Resume</span>
                            <span className="sm:hidden">Resume</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {!candidate.interviewLink && candidate.status === 'Applied' && (
                          <button
                            onClick={() => setInterviewModal({ isOpen: true, candidate })}
                            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs sm:text-sm"
                          >
                            <Calendar className="w-4 h-4" />
                            <span className="hidden sm:inline">Schedule Interview</span>
                            <span className="sm:hidden">Schedule</span>
                          </button>
                        )}
                        <button
                          onClick={() => setEmailModal({ isOpen: true, candidate })}
                          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs sm:text-sm"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="hidden sm:inline">Send Email</span>
                          <span className="sm:hidden">Email</span>
                        </button>
                        {candidate.interviewLink && (
                          <a
                            href={candidate.interviewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs sm:text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span className="hidden sm:inline">Interview Link</span>
                            <span className="sm:hidden">Interview</span>
                          </a>
                        )}
                        {candidate.evaluationReport && (
                          <button
                            onClick={() => setSelectedCandidate(candidate)}
                            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs sm:text-sm"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="hidden sm:inline">View Report</span>
                            <span className="sm:hidden">Report</span>
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

          {/* Schedule Interview Modal */}
          {interviewModal.isOpen && interviewModal.candidate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Schedule Interview for {interviewModal.candidate.name}</h2>
                    <button
                      onClick={() => {
                        setInterviewModal({ isOpen: false, candidate: null });
                        setInterviewType(null);
                        setInterviewForm({ date: '', time: '', calendlyLink: '' });
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Interview Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Interview Type *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => setInterviewType('ai')}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          interviewType === 'ai'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                        disabled={interviewLoading}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">🤖</div>
                          <div className="font-semibold text-gray-900">AI Interview</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Automated AI-powered interview
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setInterviewType('manual')}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          interviewType === 'manual'
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                        disabled={interviewLoading}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">📅</div>
                          <div className="font-semibold text-gray-900">Manual Interview</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Schedule with Calendly
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* AI Interview Form */}
                  {interviewType === 'ai' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          📧 The candidate will receive an email with the interview link and scheduled time.
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Interview Date *
                        </label>
                        <input
                          type="date"
                          value={interviewForm.date}
                          onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={interviewLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Interview Time *
                        </label>
                        <input
                          type="time"
                          value={interviewForm.time}
                          onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={interviewLoading}
                        />
                      </div>
                    </div>
                  )}

                  {/* Manual Interview Form */}
                  {interviewType === 'manual' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-800">
                          📧 The candidate will receive an email with your Calendly scheduling link.
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Calendly Link *
                        </label>
                        <input
                          type="url"
                          value={interviewForm.calendlyLink}
                          onChange={(e) => setInterviewForm({ ...interviewForm, calendlyLink: e.target.value })}
                          placeholder="https://calendly.com/your-username/30min"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          disabled={interviewLoading}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Enter your Calendly event scheduling link
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleScheduleInterview}
                      disabled={interviewLoading || !interviewType}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {interviewLoading ? 'Scheduling...' : 'Schedule Interview'}
                    </button>
                    <button
                      onClick={() => {
                        setInterviewModal({ isOpen: false, candidate: null });
                        setInterviewType(null);
                        setInterviewForm({ date: '', time: '', calendlyLink: '' });
                      }}
                      disabled={interviewLoading}
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

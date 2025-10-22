'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { jobService } from '@/services/job.service';
import { useRouter } from 'next/navigation';
import { Plus, Briefcase, Users, Eye, Pencil, Trash2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  createdBy: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [aiTitle, setAiTitle] = useState('');
  const [aiRequirements, setAiRequirements] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobs();
      setJobs(data);
    } catch (error) {
      toast.error('Failed to fetch jobs');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedJob) {
        // Update existing job
        await jobService.updateJob(selectedJob.id, { title, description });
        toast.success('Job updated successfully!');
      } else {
        // Create new job
        await jobService.createJob({ title, description });
        toast.success('Job created successfully!');
      }
      
      setShowCreateModal(false);
      setSelectedJob(null);
      setTitle('');
      setDescription('');
      fetchJobs();
    } catch (error) {
      toast.error(selectedJob ? 'Failed to update job' : 'Failed to create job');
      console.error('Error saving job:', error);
    }
  };

  const handleGenerateWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setGeneratingAI(true);
      const generatedDescription = await jobService.generateJobDescription({
        title: aiTitle,
        requirements: aiRequirements,
      });
      
      // Close AI modal and open create modal with generated content
      setShowAIModal(false);
      setTitle(aiTitle);
      setDescription(generatedDescription);
      setShowCreateModal(true);
      setAiTitle('');
      setAiRequirements('');
      
      toast.success('AI-generated job description ready!');
    } catch (error) {
      toast.error('Failed to generate job description');
      console.error('Error generating description:', error);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      await jobService.deleteJob(jobId);
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to delete job');
      console.error('Error deleting job:', error);
    }
  };

  const viewCandidates = (jobId: string) => {
    router.push(`/dashboard/candidates?jobId=${jobId}`);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
            <p className="mt-2 text-gray-600">Create and manage your job postings</p>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New Job
            </button>
            <button
              onClick={() => setShowAIModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Generate with AI
            </button>
          </div>

          {/* Jobs List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first job posting</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="w-5 h-5" />
                Create Job
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1 w-full">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm sm:text-base">{job.description}</p>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.status}
                        </span>
                        <span>
                          Created: {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => viewCandidates(job.id)}
                        className="flex-1 sm:flex-none p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Candidates"
                      >
                        <Users className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setTitle(job.title);
                          setDescription(job.description);
                          setShowCreateModal(true);
                        }}
                        className="flex-1 sm:flex-none p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="flex-1 sm:flex-none p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Application Link */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Application Link:</p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-gray-50 rounded text-xs sm:text-sm text-gray-700 overflow-x-auto break-all">
                        {typeof window !== 'undefined' && `${window.location.origin}/apply/${job.id}`}
                      </code>
                      <button
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            navigator.clipboard.writeText(`${window.location.origin}/apply/${job.id}`);
                            toast.success('Link copied to clipboard!');
                          }
                        }}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Create/Edit Job Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    {selectedJob ? 'Edit Job' : 'Create New Job'}
                  </h2>
                  
                  <form onSubmit={handleCreateJob}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title *
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                          placeholder="e.g., Senior Software Engineer"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Description *
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                          rows={10}
                          placeholder="Enter job description, requirements, responsibilities..."
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
                      >
                        {selectedJob ? 'Update Job' : 'Create Job'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateModal(false);
                          setSelectedJob(null);
                          setTitle('');
                          setDescription('');
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* AI Generation Modal */}
          {showAIModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                      Generate Job Description with AI
                    </h2>
                  </div>
                  
                  <form onSubmit={handleGenerateWithAI}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title *
                        </label>
                        <input
                          type="text"
                          value={aiTitle}
                          onChange={(e) => setAiTitle(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                          placeholder="e.g., Senior Frontend Developer"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Key Requirements *
                        </label>
                        <textarea
                          value={aiRequirements}
                          onChange={(e) => setAiRequirements(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                          rows={6}
                          placeholder="e.g., 5+ years React experience, TypeScript, Next.js, Team leadership..."
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <button
                        type="submit"
                        disabled={generatingAI}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        {generatingAI ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Generate with AI
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAIModal(false);
                          setAiTitle('');
                          setAiRequirements('');
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { candidateService } from '@/services/candidate.service';
import { jobService } from '@/services/job.service';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { Job } from '@/types';

export default function ApplicationPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
  });
  const [resume, setResume] = useState<File | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await jobService.getPublicJob(jobId);
        setJob(jobData);
      } catch (error) {
        toast.error('Job not found');
        router.push('/');
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resume) {
      toast.error('Please upload your resume');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('experience', formData.experience);
      formDataToSend.append('resume', resume);

      await candidateService.applyForJob(jobId, formDataToSend);
      
      toast.success('Application submitted successfully! You will receive an email with interview details.');
      
      // Reset form
      setFormData({ name: '', email: '', phone: '', experience: '' });
      setResume(null);
      
      // Redirect after 2 seconds
      setTimeout(() => router.push('/'), 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card title={`Apply for: ${job.title}`} subtitle="Fill out the form below to submit your application">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div dangerouslySetInnerHTML={{ __html: job.description }} />
            </div>

            <div className="space-y-4">
              <Input
                label="Full Name *"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />

              <Input
                label="Email Address *"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />

              <Input
                label="Phone Number *"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />

              <Input
                label="Years of Experience *"
                type="number"
                required
                min="0"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="5"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume * (PDF, DOC, DOCX - Max 5MB)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                  onChange={(e) => setResume(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {resume && (
                  <p className="mt-1 text-sm text-gray-600">
                    Selected: {resume.name} ({(resume.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Submit Application
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

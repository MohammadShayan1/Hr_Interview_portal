'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import Card from '@/components/ui/Card';
import { candidateService } from '@/services/candidate.service';
import { DashboardStats } from '@/types';
import { Briefcase, Users, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await candidateService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome back! Here's an overview of your recruitment activity.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.totalJobs || 0}</p>
                </div>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.totalCandidates || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews Completed</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stats?.interviewsCompleted || 0}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card title="Quick Actions" subtitle="Get started with common tasks">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/dashboard/jobs">
                <Button className="w-full">Create New Job Post</Button>
              </Link>
              <Link href="/dashboard/jobs">
                <Button variant="secondary" className="w-full">View All Jobs</Button>
              </Link>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

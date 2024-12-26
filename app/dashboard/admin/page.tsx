'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { PageContainer } from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp,
  UserPlus,
  BookPlus,
  BarChart,
  RefreshCw
} from 'lucide-react';
import { getUsers } from '@/lib/api/users';
import { getCourses } from '@/lib/api/courses';
import { handleError } from '@/lib/utils/error-handler';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    students: 0,
    faculty: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [users, courses] = await Promise.all([
        getUsers(),
        getCourses(),
      ]);

      setStats({
        users: users.length,
        courses: courses.length,
        students: users.filter(u => u.role === 'student').length,
        faculty: users.filter(u => u.role === 'faculty').length,
      });
    } catch (error) {
      handleError(error, 'Failed to load dashboard statistics');
      setError('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (isLoading) {
    return (
      <DashboardShell>
        <LoadingState />
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell>
        <ErrorState message={error} onRetry={loadStats} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <PageContainer>
        <Section>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <Button
              variant="outline"
              onClick={loadStats}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Users"
              value={stats.users}
              icon={Users}
              trend={{ value: 12, label: 'vs last month' }}
            />
            <StatsCard
              title="Total Courses"
              value={stats.courses}
              icon={BookOpen}
              trend={{ value: 8, label: 'vs last month' }}
            />
            <StatsCard
              title="Students"
              value={stats.students}
              icon={GraduationCap}
              trend={{ value: 15, label: 'vs last month' }}
            />
            <StatsCard
              title="Faculty"
              value={stats.faculty}
              icon={TrendingUp}
              trend={{ value: 5, label: 'vs last month' }}
            />
          </div>
        </Section>

        {/* Quick Actions Section */}
        <Section>
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QuickActionCard
              title="Add Faculty"
              description="Create new faculty account"
              icon={UserPlus}
              href="/dashboard/admin/faculty"
            />
            <QuickActionCard
              title="Add Student"
              description="Create new student account"
              icon={UserPlus}
              href="/dashboard/admin/students"
            />
            <QuickActionCard
              title="Create Course"
              description="Set up a new course"
              icon={BookPlus}
              href="/dashboard/admin/courses"
            />
            <QuickActionCard
              title="View Analytics"
              description="Check system analytics"
              icon={BarChart}
              href="/dashboard/admin/analytics"
            />
          </div>
        </Section>
      </PageContainer>
    </DashboardShell>
  );
}
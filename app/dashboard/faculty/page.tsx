'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { PageContainer } from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, CheckCircle, TrendingUp, Plus } from 'lucide-react';
import { getCourses } from '@/lib/api/courses';
import { getUsers, getFacultySubjects } from '@/lib/api/users';
import { CourseList } from '@/components/lists/CourseList';
import { handleError } from '@/lib/utils/error-handler';
import { toast } from 'sonner';

export default function FacultyDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    completionRate: 0,
    activeStudents: 0,
  });
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const [coursesData, studentsData, subjectsData] = await Promise.all([
        getCourses(session?.user?.id),
        getUsers('student'),
        getFacultySubjects(session.user.id)
      ]);

      setCourses(coursesData);
      setSubjects(subjectsData);
      setStats({
        courses: coursesData.length,
        students: studentsData.length,
        completionRate: 85,
        activeStudents: studentsData.filter(s => s.last_active > Date.now() - 7*24*60*60*1000).length,
      });
    } catch (error) {
      handleError(error, 'Failed to load dashboard data');
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
        <ErrorState message={error} onRetry={loadData} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <PageContainer>
        <Section>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
            <Button onClick={() => router.push('/dashboard/faculty/courses/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Courses"
              value={stats.courses}
              icon={BookOpen}
              trend={{ value: 12, label: 'vs last month' }}
            />
            <StatsCard
              title="Total Students"
              value={stats.students}
              icon={Users}
              trend={{ value: 8, label: 'vs last month' }}
            />
            <StatsCard
              title="Completion Rate"
              value={`${stats.completionRate}%`}
              icon={CheckCircle}
              trend={{ value: 5, label: 'vs last month' }}
            />
            <StatsCard
              title="Active Students"
              value={stats.activeStudents}
              icon={TrendingUp}
              trend={{ value: 15, label: 'this week' }}
            />
          </div>
        </Section>

        <Section>
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QuickActionCard
              title="Grade Submissions"
              description="Review and grade pending submissions"
              icon={CheckCircle}
              href="/dashboard/faculty/grading"
            />
            <QuickActionCard
              title="Create Task"
              description="Add new task to a course"
              icon={Plus}
              href="/dashboard/faculty/tasks/new"
            />
            <QuickActionCard
              title="View Students"
              description="Manage your students"
              icon={Users}
              href="/dashboard/faculty/students"
            />
            <QuickActionCard
              title="My Subjects"
              description={`${subjects.length} subjects assigned`}
              icon={BookOpen}
              href="/dashboard/faculty/subjects"
            />
          </div>
        </Section>

        <Section>
          <h2 className="text-2xl font-semibold mb-6">My Courses</h2>
          <Card>
            <CardContent>
              <CourseList
                courses={courses}
                userRole="faculty"
                onDelete={loadData}
              />
            </CardContent>
          </Card>
        </Section>
      </PageContainer>
    </DashboardShell>
  );
}
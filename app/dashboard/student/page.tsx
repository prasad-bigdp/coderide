'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { PageContainer } from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp,
  GraduationCap,
  CheckCircle,
  BookMarked
} from 'lucide-react';
import { getCourses } from '@/lib/api/courses';
import { getStudentProgress } from '@/lib/api/progress';
import { CourseList } from '@/components/lists/CourseList';
import { handleError } from '@/lib/utils/error-handler';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { LeaderboardWidget } from '@/components/dashboard/LeaderboardWidget';

export default function StudentDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    courses: 0,
    completedTasks: 0,
    averageScore: 0,
    hoursSpent: 0,
  });
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState([]);

  const loadData = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const [coursesData, progressData] = await Promise.all([
        getCourses(),
        getStudentProgress(session?.user?.id!),
      ]);

      // Filter courses for student's batch
      const filteredCourses = coursesData.filter(
        course => course.batch_id === session?.user?.batch?.id
      );

      const completedTasks = progressData.filter(p => p.status === 'completed').length;
      const totalScore = progressData.reduce((sum, p) => sum + (p.score || 0), 0);
      const averageScore = progressData.length ? Math.round(totalScore / progressData.length) : 0;

      setCourses(filteredCourses);
      setRecentActivity(progressData.slice(0, 5));
      setStats({
        courses: filteredCourses.length,
        completedTasks,
        averageScore,
        hoursSpent: 24, // Calculate from activity logs
      });
    } catch (error) {
      handleError(error, 'Failed to load dashboard data');
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, session?.user?.batch?.id]);

  return (
    <DashboardShell>
      <PageContainer>
        <Section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name}!</h1>
              <p className="text-muted-foreground mt-1">Track your progress and continue learning</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Enrolled Courses"
            value={stats.courses}
            icon={BookOpen}
            trend={{ value: 0, label: 'total' }}
          />
          <StatsCard
            title="Completed Tasks"
            value={stats.completedTasks}
            icon={Award}
            trend={{ value: 12, label: 'vs last week' }}
          />
          <StatsCard
            title="Average Score"
            value={`${stats.averageScore}%`}
            icon={TrendingUp}
            trend={{ value: 5, label: 'vs last week' }}
          />
          <StatsCard
            title="Hours Spent"
            value={stats.hoursSpent}
            icon={Clock}
            trend={{ value: 8, label: 'this week' }}
          />
        </div>
        </Section>

        <Section>
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QuickActionCard
              title="Continue Learning"
              description="Resume your last course"
              icon={BookOpen}
              href={`/dashboard/student/courses/${courses[0]?.id}`}
            />
            <QuickActionCard
              title="View Progress"
              description="Check your learning progress"
              icon={TrendingUp}
              href="/dashboard/student/progress"
            />
            <QuickActionCard
              title="Achievements"
              description={`${stats.completedTasks} tasks completed`}
              icon={Award}
              href="/dashboard/student/achievements"
            />
            <QuickActionCard
              title="Study Materials"
              description="Access course resources"
              icon={BookMarked}
              href="/dashboard/student/resources"
            />
          </div>
        </Section>
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <CourseList
              courses={courses}
              userRole="student"
            />
          </CardContent>
        </Card>
    </DashboardShell>
  );
}
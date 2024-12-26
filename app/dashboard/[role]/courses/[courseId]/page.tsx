'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { PageContainer } from '@/components/layout/page-container';
import { Section } from '@/components/layout/section';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getCourse, getCourseProgress } from '@/lib/api/courses';
import { LevelList } from '@/components/courses/LevelList';
import { handleError } from '@/lib/utils/error-handler';
import { Course, Level } from '@/types';

export default function CoursePage() {
  const params = useParams();
  const { data: session } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLevelId, setCurrentLevelId] = useState<string>();
  const [progress, setProgress] = useState(0);

  const loadCourse = useCallback(async () => {
    if (!params.courseId || !session?.user?.id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const [courseData, progressData] = await Promise.all([
        getCourse(params.courseId),
        getCourseProgress(params.courseId, session.user.id)
      ]);

      setCourse(courseData);
      setLevels(courseData.levels || []);
      
      // Calculate overall progress
      const totalTasks = courseData.levels?.reduce((sum, level) => 
        sum + (level.tasks?.length || 0), 0) || 0;
      const completedTasks = progressData?.completed_tasks || 0;
      setProgress(totalTasks ? (completedTasks / totalTasks) * 100 : 0);

      // Set current level
      const currentLevel = courseData.levels?.find(level => 
        !level.tasks?.every(task => task.progress?.[0]?.status === 'completed')
      );
      setCurrentLevelId(currentLevel?.id);
    } catch (error) {
      handleError(error, 'Failed to load course');
      setError('Failed to load course data');
    } finally {
      setIsLoading(false);
    }
  }, [params.courseId, session?.user?.id]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const handleLevelClick = (levelId: string) => {
    router.push(`/dashboard/${params.role}/courses/${params.courseId}/levels/${levelId}`);
  };

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
        <ErrorState message={error} onRetry={loadCourse} />
      </DashboardShell>
    );
  }

  if (!course) {
    return (
      <DashboardShell>
        <ErrorState message="Course not found" />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <PageContainer>
        <Section>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
            </div>

          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-2" 
                  aria-label={`Course progress: ${Math.round(progress)}%`}
                />
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">Course Levels</h2>
            <LevelList
              levels={levels}
              onLevelClick={handleLevelClick}
              currentLevelId={currentLevelId}
            />
          </div>
        </Section>
      </PageContainer>
    </DashboardShell>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { PageContainer } from '@/components/layout/page-container';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { getTask } from '@/lib/api/tasks';
import { updateTaskProgress } from '@/lib/api/progress';
import { Task, TestResult } from '@/types';
import { toast } from 'sonner';
import { handleError } from '@/lib/utils/error-handler';
import { TaskQuestion } from '@/components/tasks/TaskQuestion';
import { CodeWorkspace } from '@/components/tasks/CodeWorkspace';

export default function TaskPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [task, setTask] = useState<Task | null>(null);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  useEffect(() => {
    if (params.taskId) {
      loadTask();
    }
  }, [params.taskId]);

  async function loadTask() {
    setIsLoading(true);
    setError(null);
    try {
      const taskData = await getTask(params.taskId as string);
      setTask(taskData);
      // Set initial code from previous progress if available
      if (taskData.progress?.[0]?.code) {
        setCode(taskData.progress[0].code);
      }
    } catch (error) {
      handleError(error, 'Failed to load task');
      setError('Failed to load task data');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit() {
    if (!session?.user?.id || !task) return;

    setIsSubmitting(true);
    try {
      // Run tests
      const results = await runTests(code, task.test_cases || []);
      setTestResults(results);

      // Calculate score
      const allPassed = results.every(r => r.passed);
      const score = allPassed ? task.max_score : 0;

      // Update progress
      await updateTaskProgress(task.id, session.user.id, {
        status: allPassed ? 'completed' : 'in-progress',
        score,
        code
      });

      toast[allPassed ? 'success' : 'error'](
        allPassed 
          ? 'All tests passed! Moving to next task...' 
          : 'Some tests failed. Keep trying!'
      );

      if (allPassed) {
        // Navigate to next task or back to course
        setTimeout(() => {
          router.push(`/dashboard/${params.role}/courses/${params.courseId}`);
        }, 1500);
      }
    } catch (error) {
      handleError(error, 'Failed to submit task');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <DashboardShell>
        <LoadingState />
      </DashboardShell>
    );
  }

  if (error || !task) {
    return (
      <DashboardShell>
        <ErrorState message={error || 'Task not found'} onRetry={loadTask} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <PageContainer>
        <div className="h-[calc(100vh-8rem)] grid grid-cols-2 gap-6">
          {/* Left side - Task Question */}
          <TaskQuestion 
            task={task} 
            testResults={testResults}
          />

          {/* Right side - Code Editor */}
          <div className="flex flex-col space-y-4">
            <CodeWorkspace
              code={code}
              onChange={setCode}
              language={task.task_type}
              testCases={task.test_cases}
            />
            <Button
              onClick={handleSubmit}
              disabled={!code.trim() || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Solution'}
            </Button>
          </div>
        </div>
      </PageContainer>
    </DashboardShell>
  );
}
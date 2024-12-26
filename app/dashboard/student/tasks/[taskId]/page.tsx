'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { CodeWorkspace } from '@/components/workspace/CodeWorkspace';
import { getTask } from '@/lib/api/tasks';
import { updateTaskProgress } from '@/lib/api/progress';
import { Task, TestResult } from '@/types';
import { toast } from 'sonner';

export default function TaskPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [task, setTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.taskId) {
      loadTask();
    }
  }, [params.taskId]);

  async function loadTask() {
    try {
      const taskData = await getTask(params.taskId as string);
      setTask(taskData);
    } catch (error) {
      console.error('Error loading task:', error);
      toast.error('Failed to load task');
    }
  }

  async function handleSubmit(code: string, results: TestResult[]) {
    if (!session?.user?.id || !task) return;

    setIsSubmitting(true);
    try {
      const allPassed = results.every(r => r.passed);
      const score = allPassed ? task.max_score : 0;

      await updateTaskProgress(task.id, session.user.id, {
        status: allPassed ? 'completed' : 'in-progress',
        score,
        code
      });

      toast.success(
        allPassed 
          ? 'Congratulations! All tests passed!' 
          : 'Some tests failed. Keep trying!'
      );
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error('Failed to submit task');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!task) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="h-[calc(100vh-4rem)]">
        <CodeWorkspace
          task={task}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardShell>
  );
}
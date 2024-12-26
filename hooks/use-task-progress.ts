import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Task, Progress } from '@/types';
import { getTaskProgress, updateTaskProgress, getNextTask } from '@/lib/api/progress';
import { toast } from 'sonner';

export function useTaskProgress(task: Task) {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user?.id && task?.id) {
      loadProgress();
    }
  }, [session?.user?.id, task?.id]);

  async function loadProgress() {
    try {
      const data = await getTaskProgress(task.id, session!.user.id);
      setProgress(data);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function submitTask(code: string, testResults: { passed: boolean }[]) {
    if (!session?.user?.id) return;

    setIsSubmitting(true);
    try {
      const allPassed = testResults.every(r => r.passed);
      const score = allPassed ? task.max_score : 0;

      await updateTaskProgress(task.id, session.user.id, {
        status: allPassed ? 'completed' : 'in-progress',
        score,
        code
      });

      if (allPassed) {
        toast.success('Task completed! Moving to next task...');
        const nextTask = await getNextTask(task.id, session.user.id);
        return nextTask;
      } else {
        toast.error('Some tests failed. Keep trying!');
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      toast.error('Failed to submit task');
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    progress,
    isLoading,
    isSubmitting,
    submitTask,
    loadProgress
  };
}
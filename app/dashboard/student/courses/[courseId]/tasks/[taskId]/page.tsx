'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { TaskWorkspace } from '@/components/workspace/TaskWorkspace';
import { getTask } from '@/lib/api/tasks';
import { Task, TestCase } from '@/types';

export default function TaskPage() {
  const params = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  useEffect(() => {
    if (params.taskId) {
      loadTask();
    }
  }, [params.taskId]);

  async function loadTask() {
    try {
      const data = await getTask(params.taskId as string);
      setTask(data);
      setTestCases(data.test_cases || []);
    } catch (error) {
      console.error('Error loading task:', error);
    }
  }

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardShell>
      <div className="h-[calc(100vh-4rem)]">
        <TaskWorkspace
          task={task}
          testCases={testCases}
          onComplete={loadTask}
        />
      </div>
    </DashboardShell>
  );
}
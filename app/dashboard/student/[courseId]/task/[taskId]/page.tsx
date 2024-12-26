'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { CodeWorkspace } from '@/components/workspace/CodeWorkspace';
import { Task, TestCase } from '@/types';
import { supabase } from '@/lib/supabase';

export default function TaskPage() {
  const params = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  useEffect(() => {
    loadTask();
  }, [params.taskId]);

  async function loadTask() {
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', params.taskId)
      .single();

    if (taskError) {
      console.error('Error loading task:', taskError);
      return;
    }

    const { data: testCasesData, error: testCasesError } = await supabase
      .from('test_cases')
      .select('*')
      .eq('task_id', params.taskId);

    if (testCasesError) {
      console.error('Error loading test cases:', testCasesError);
      return;
    }

    setTask(taskData);
    setTestCases(testCasesData || []);
  }

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardShell>
      <div className="h-[calc(100vh-4rem)]">
        <CodeWorkspace
          task={task}
          testCases={testCases}
        />
      </div>
    </DashboardShell>
  );
}
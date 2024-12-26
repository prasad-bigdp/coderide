'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskAssignmentForm } from '@/components/forms/TaskAssignmentForm';
import { getTask } from '@/lib/api/tasks';
import { getBatches } from '@/lib/api/batches';
import { Task, Batch } from '@/types';

export default function AssignTaskPage() {
  const params = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    if (params.taskId) {
      loadData();
    }
  }, [params.taskId]);

  async function loadData() {
    try {
      const [taskData, batchesData] = await Promise.all([
        getTask(params.taskId as string),
        getBatches()
      ]);
      setTask(taskData);
      setBatches(batchesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  return (
    <DashboardShell>
      <Card>
        <CardHeader>
          <CardTitle>Assign Task: {task?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {task && (
            <TaskAssignmentForm
              task={task}
              batches={batches}
              onAssigned={() => {
                window.location.href = '/dashboard/faculty/tasks';
              }}
            />
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
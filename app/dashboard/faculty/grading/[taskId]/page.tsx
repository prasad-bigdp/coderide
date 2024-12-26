'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTaskSubmissions } from '@/lib/api/progress';
import { getTask } from '@/lib/api/tasks';
import { Task, Progress } from '@/types';
import { TaskGrading } from '@/components/grading/TaskGrading';

export default function GradingPage() {
  const params = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [submissions, setSubmissions] = useState<Progress[]>([]);

  useEffect(() => {
    if (params.taskId) {
      loadData();
    }
  }, [params.taskId]);

  async function loadData() {
    try {
      const [taskData, submissionsData] = await Promise.all([
        getTask(params.taskId as string),
        getTaskSubmissions(params.taskId as string)
      ]);
      setTask(taskData);
      setSubmissions(submissionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardShell>
      <Card>
        <CardHeader>
          <CardTitle>{task.title} - Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {submissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {submission.users?.name} ({submission.users?.email})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TaskGrading
                    taskId={params.taskId as string}
                    studentId={submission.student_id}
                    maxScore={task.max_score}
                    code={submission.code}
                    onGraded={loadData}
                  />
                </CardContent>
              </Card>
            ))}
            {submissions.length === 0 && (
              <p className="text-center text-muted-foreground">
                No submissions yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskGrading } from '@/components/grading/TaskGrading';
import { getTaskSubmissions } from '@/lib/api/progress';
import { Progress } from '@/types';

export default function GradingPage() {
  const params = useParams();
  const [submissions, setSubmissions] = useState<Progress[]>([]);

  useEffect(() => {
    loadSubmissions();
  }, [params.taskId]);

  async function loadSubmissions() {
    try {
      const data = await getTaskSubmissions(params.taskId as string);
      setSubmissions(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Grade Submissions</h1>
      <div className="space-y-6">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <CardTitle>
                {submission.users?.name} ({submission.users?.email})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskGrading
                taskId={params.taskId as string}
                studentId={submission.student_id}
                maxScore={submission.tasks?.max_score || 100}
                onGraded={loadSubmissions}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
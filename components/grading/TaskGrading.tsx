'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { updateTaskProgress } from '@/lib/api/progress';

const gradingSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string().min(1, 'Feedback is required'),
});

type GradingFormData = z.infer<typeof gradingSchema>;

interface TaskGradingProps {
  taskId: string;
  studentId: string;
  maxScore: number;
  code?: string;
  onGraded: () => void;
}

export function TaskGrading({ taskId, studentId, maxScore, code, onGraded }: TaskGradingProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GradingFormData>({
    resolver: zodResolver(gradingSchema),
  });

  async function onSubmit(data: GradingFormData) {
    try {
      await updateTaskProgress(taskId, studentId, {
        score: data.score,
        feedback: data.feedback,
        status: 'completed',
      });
      onGraded();
    } catch (error) {
      console.error('Error updating grade:', error);
    }
  }

  return (
    <div className="space-y-6">
      {code && (
        <Card className="p-4">
          <Label>Student's Code</Label>
          <pre className="mt-2 p-4 bg-muted rounded-lg overflow-auto">
            <code>{code}</code>
          </pre>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="score">Score (max: {maxScore})</Label>
          <Input
            id="score"
            type="number"
            {...register('score', { valueAsNumber: true })}
            max={maxScore}
          />
          {errors.score && (
            <p className="text-sm text-red-500">{errors.score.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback">Feedback</Label>
          <Textarea 
            id="feedback" 
            {...register('feedback')}
            placeholder="Provide constructive feedback for the student..."
            className="h-32"
          />
          {errors.feedback && (
            <p className="text-sm text-red-500">{errors.feedback.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Submit Grade
        </Button>
      </form>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Task, Batch } from '@/types';
import { assignTask } from '@/lib/api/tasks';

const assignmentSchema = z.object({
  batch_id: z.string().min(1, 'Batch is required'),
  deadline: z.string().min(1, 'Deadline is required'),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface TaskAssignmentFormProps {
  task: Task;
  batches: Batch[];
  onAssigned: () => void;
}

export function TaskAssignmentForm({ task, batches, onAssigned }: TaskAssignmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
  });

  async function onSubmit(data: AssignmentFormData) {
    try {
      setIsSubmitting(true);
      await assignTask(task.id, {
        batch_id: data.batch_id,
        deadline: new Date(data.deadline).toISOString(),
      });
      onAssigned();
    } catch (error) {
      console.error('Error assigning task:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Batch</Label>
        <Select onValueChange={(value) => setValue('batch_id', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select batch" />
          </SelectTrigger>
          <SelectContent>
            {batches.map((batch) => (
              <SelectItem key={batch.id} value={batch.id}>
                {batch.name} ({batch.year})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.batch_id && (
          <p className="text-sm text-red-500">{errors.batch_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Deadline</Label>
        <Input
          type="datetime-local"
          {...register('deadline')}
          min={new Date().toISOString().slice(0, 16)}
        />
        {errors.deadline && (
          <p className="text-sm text-red-500">{errors.deadline.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Assigning...' : 'Assign Task'}
      </Button>
    </form>
  );
}
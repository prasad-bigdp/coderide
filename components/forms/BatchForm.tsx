'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Batch } from '@/types';

const batchSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  year: z.number().min(2000).max(2100),
});

type BatchFormData = z.infer<typeof batchSchema>;

interface BatchFormProps {
  onSubmit: (data: Partial<Batch>) => void;
  onCancel: () => void;
  initialData?: Partial<Batch>;
}

export function BatchForm({ onSubmit, onCancel, initialData }: BatchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      ...initialData,
      year: initialData?.year || new Date().getFullYear(),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Batch Name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          type="number"
          {...register('year', { valueAsNumber: true })}
        />
        {errors.year && (
          <p className="text-sm text-red-500">{errors.year.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Batch' : 'Create Batch'}
        </Button>
      </div>
    </form>
  );
}
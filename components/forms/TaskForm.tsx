'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Task, TestCase } from '@/types';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  task_type: z.enum(['programming', 'html', 'css', 'javascript']),
  max_score: z.number().min(0).max(100),
  expected_output: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (data: Partial<Task>, testCases: Partial<TestCase>[]) => void;
  onCancel: () => void;
  initialData?: Partial<Task>;
  initialTestCases?: TestCase[];
}

export function TaskForm({ 
  onSubmit, 
  onCancel, 
  initialData,
  initialTestCases = []
}: TaskFormProps) {
  const [testCases, setTestCases] = useState<Partial<TestCase>[]>(initialTestCases);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      ...initialData,
      max_score: initialData?.max_score || 100,
    },
  });

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', expected_output: '' }]);
  };

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: string) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit(data, testCases);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="task_type">Task Type</Label>
          <Select onValueChange={(value) => setValue('task_type', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select task type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectContent>
          </Select>
          {errors.task_type && (
            <p className="text-sm text-red-500">{errors.task_type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register('title')} />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_score">Maximum Score</Label>
          <Input 
            id="max_score" 
            type="number" 
            {...register('max_score', { valueAsNumber: true })} 
          />
          {errors.max_score && (
            <p className="text-sm text-red-500">{errors.max_score.message}</p>
          )}
        </div>
      </div>

      {watch('task_type') === 'programming' && (
        <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Test Cases</Label>
          <Button type="button" variant="outline" size="sm" onClick={addTestCase}>
            <Plus className="h-4 w-4 mr-2" />
            Add Test Case
          </Button>
        </div>

        {testCases.map((testCase, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Test Case {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTestCase(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Input</Label>
              <Input
                value={testCase.input}
                onChange={(e) => updateTestCase(index, 'input', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Expected Output</Label>
              <Input
                value={testCase.expected_output}
                onChange={(e) => updateTestCase(index, 'expected_output', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      )}

      {watch('task_type') !== 'programming' && (
        <div className="space-y-2">
          <Label htmlFor="expected_output">Expected Output</Label>
          <Textarea
            id="expected_output"
            {...register('expected_output')}
            placeholder={
              watch('task_type') === 'html'
                ? 'Expected HTML structure...'
                : watch('task_type') === 'css'
                ? 'Expected CSS styles...'
                : 'Expected JavaScript functionality...'
            }
            className="h-40 font-mono"
          />
          {errors.expected_output && (
            <p className="text-sm text-red-500">{errors.expected_output.message}</p>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Course, Level, Task, Subject, Batch } from '@/types';
import { getBatches } from '@/lib/api/batches';
import { getSubjects } from '@/lib/api/subjects';

const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  subject_id: z.string().min(1, 'Subject is required'),
  batch_id: z.string().min(1, 'Batch is required'),
  levels: z.array(z.object({
    title: z.string().min(2, 'Level title is required'),
    description: z.string().optional(),
    tasks: z.array(z.object({
      title: z.string().min(2, 'Task title is required'),
      description: z.string().min(10, 'Task description is required'),
      max_score: z.number().min(1).max(100),
      testCases: z.array(z.object({
        input: z.string().min(1, 'Input is required'),
        expected_output: z.string().min(1, 'Expected output is required')
      })).min(1, 'At least one test case is required')
    })).min(1, 'At least one task is required')
  })).min(1, 'At least one level is required')
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  initialData?: Partial<Course>;
}

export function CourseForm({ onSubmit, onCancel, initialData }: CourseFormProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [levels, setLevels] = useState<any[]>([{
    title: '',
    description: '',
    tasks: [{
      title: '',
      description: '',
      max_score: 100,
      testCases: [{
        input: '',
        expected_output: ''
      }]
    }]
  }]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      levels: levels
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [subjectsData, batchesData] = await Promise.all([
        getSubjects(),
        getBatches()
      ]);
      setSubjects(subjectsData);
      setBatches(batchesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  const addLevel = () => {
    setLevels([...levels, {
      title: '',
      description: '',
      tasks: []
    }]);
  };

  const addTask = (levelIndex: number) => {
    const newLevels = [...levels];
    newLevels[levelIndex].tasks.push({
      title: '',
      description: '',
      max_score: 100,
      testCases: []
    });
    setLevels(newLevels);
  };

  const addTestCase = (levelIndex: number, taskIndex: number) => {
    const newLevels = [...levels];
    newLevels[levelIndex].tasks[taskIndex].testCases.push({
      input: '',
      expected_output: ''
    });
    setLevels(newLevels);
  };

  const removeLevel = (index: number) => {
    setLevels(levels.filter((_, i) => i !== index));
  };

  const removeTask = (levelIndex: number, taskIndex: number) => {
    const newLevels = [...levels];
    newLevels[levelIndex].tasks.splice(taskIndex, 1);
    setLevels(newLevels);
  };

  const removeTestCase = (levelIndex: number, taskIndex: number, testCaseIndex: number) => {
    const newLevels = [...levels];
    newLevels[levelIndex].tasks[taskIndex].testCases.splice(testCaseIndex, 1);
    setLevels(newLevels);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6">
        <div className="space-y-4">
          <Label htmlFor="title">Course Title</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Enter course title"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="description">Course Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Enter course description"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <Label>Subject</Label>
            <Select onValueChange={(value) => setValue('subject_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject_id && (
              <p className="text-sm text-red-500">{errors.subject_id.message}</p>
            )}
          </div>

          <div className="space-y-4">
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
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Course Levels</h3>
          <Button type="button" onClick={addLevel} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Level
          </Button>
        </div>

        {levels.map((level, levelIndex) => (
          <div key={levelIndex} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-4 flex-1">
                <Input
                  {...register(`levels.${levelIndex}.title`)}
                  placeholder="Level title"
                />
                <Textarea
                  {...register(`levels.${levelIndex}.description`)}
                  placeholder="Level description"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeLevel(levelIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Tasks</h4>
                <Button
                  type="button"
                  onClick={() => addTask(levelIndex)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>

              {level.tasks.map((task: any, taskIndex: number) => (
                <div key={taskIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-4 flex-1">
                      <Input
                        {...register(`levels.${levelIndex}.tasks.${taskIndex}.title`)}
                        placeholder="Task title"
                      />
                      <Textarea
                        {...register(`levels.${levelIndex}.tasks.${taskIndex}.description`)}
                        placeholder="Task description"
                      />
                      <Input
                        type="number"
                        {...register(`levels.${levelIndex}.tasks.${taskIndex}.max_score`, {
                          valueAsNumber: true
                        })}
                        placeholder="Maximum score"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTask(levelIndex, taskIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">Test Cases</h5>
                      <Button
                        type="button"
                        onClick={() => addTestCase(levelIndex, taskIndex)}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Test Case
                      </Button>
                    </div>

                    {task.testCases.map((testCase: any, testCaseIndex: number) => (
                      <div key={testCaseIndex} className="grid grid-cols-2 gap-4 items-start">
                        <Input
                          {...register(
                            `levels.${levelIndex}.tasks.${taskIndex}.testCases.${testCaseIndex}.input`
                          )}
                          placeholder="Input"
                        />
                        <div className="flex gap-2">
                          <Input
                            {...register(
                              `levels.${levelIndex}.tasks.${taskIndex}.testCases.${testCaseIndex}.expected_output`
                            )}
                            placeholder="Expected output"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTestCase(levelIndex, taskIndex, testCaseIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Course' : 'Create Course'}
        </Button>
      </div>
    </form>
  );
}
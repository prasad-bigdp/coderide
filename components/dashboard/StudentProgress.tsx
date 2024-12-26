'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { getStudentProgress } from '@/lib/api/progress';
import { Progress as ProgressType } from '@/types';

interface StudentProgressProps {
  studentId?: string;
}

export function StudentProgress({ studentId }: StudentProgressProps) {
  const [progress, setProgress] = useState<ProgressType[]>([]);
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    pending: 0,
  });

  useEffect(() => {
    if (studentId) {
      loadProgress();
    }
  }, [studentId]);

  async function loadProgress() {
    try {
      const data = await getStudentProgress(studentId!);
      setProgress(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }

  function calculateStats(progressData: ProgressType[]) {
    const stats = progressData.reduce(
      (acc, curr) => {
        acc[curr.status]++;
        return acc;
      },
      { completed: 0, 'in-progress': 0, pending: 0 }
    );

    setStats({
      completed: stats.completed,
      inProgress: stats['in-progress'],
      pending: stats.pending,
    });
  }

  const totalTasks = progress.length;
  const completionRate = totalTasks ? (stats.completed / totalTasks) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600">In Progress</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.inProgress}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-gray-700">{stats.pending}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Overall Progress</span>
          <span>{Math.round(completionRate)}%</span>
        </div>
        <Progress value={completionRate} />
      </div>
    </div>
  );
}
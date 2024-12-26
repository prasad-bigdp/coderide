'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCourses } from '@/lib/api/courses';
import { Course, Task } from '@/types';
import { ChevronRight } from 'lucide-react';

export default function TasksPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (session?.user?.id) {
      loadCourses();
    }
  }, [session]);

  async function loadCourses() {
    try {
      const data = await getCourses(session?.user?.id);
      setCourses(data);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.levels?.map((level) => (
                  <div key={level.id} className="space-y-2">
                    <h3 className="font-medium">{level.title}</h3>
                    <div className="grid gap-2">
                      {level.tasks?.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-4 bg-muted rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Max Score: {task.max_score}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              window.location.href = `/dashboard/faculty/grading/${task.id}`;
                            }}
                          >
                            Grade Submissions
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Level, Task, Course } from '@/types';
import { getLevels } from '@/lib/api/levels';
import { getTasks } from '@/lib/api/tasks';
import { getCourses } from '@/lib/api/courses';

export default function CoursePage() {
  const params = useParams();
  const { data: session } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({});

  useEffect(() => {
    loadCourse();
    loadLevels();
  }, [params.courseId]);

  async function loadCourse() {
    try {
      const courses = await getCourses();
      const course = courses.find(c => c.id === params.courseId);
      setCourse(course || null);
    } catch (error) {
      console.error('Error loading course:', error);
    }
  }

  async function loadLevels() {
    try {
      const levelsData = await getLevels(params.courseId as string);
      setLevels(levelsData);
      
      const tasksData: { [key: string]: Task[] } = {};
      for (const level of levelsData) {
        const levelTasks = await getTasks(level.id);
        tasksData[level.id] = levelTasks;
      }
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading levels:', error);
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{course?.title}</h1>
          <p className="text-muted-foreground">{course?.description}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {levels.map((level, index) => (
            <div key={level.id} className="group">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                  {index + 1}
                </div>
                <h2 className="text-xl font-semibold">{level.title}</h2>
              </div>

              <div className="grid gap-4">
                {tasks[level.id]?.map((task) => (
                  <Card key={task.id} className="group relative overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="font-medium">{task.max_score}</span>
                            <span className="text-muted-foreground"> points</span>
                          </div>
                          {session?.user?.role === 'student' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="relative z-10 opacity-0 group-hover:opacity-100"
                              onClick={() => {
                                window.location.href = `/dashboard/student/${params.courseId}/task/${task.id}`;
                              }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
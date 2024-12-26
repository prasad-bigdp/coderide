'use client';
import { Course } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, BookOpen, Clock, CheckCircle, Trash2 } from 'lucide-react';
import { deleteCourse } from '@/lib/api/courses';


interface CourseListProps {
  courses: Course[];
  userRole?: string;
  onDelete?: () => void;
}

export function CourseList({ courses, userRole = 'student', onDelete }: CourseListProps) {
  const handleDelete = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
      <div className="grid gap-6">
      {courses.map((course) => (
        <div key={course.id} className="group relative">
          <div className="flex items-start gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold leading-none tracking-tight">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {course.description}
              </p>
              
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>8 weeks</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  <span>4 levels</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Ongoing
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{course.progress || 0}%</span>
                </div>
                <Progress value={course.progress || 0} className="h-2" />
              </div>
            </div>

            <Link 
              href={`/dashboard/courses/${course.id}`}
              className="absolute inset-0"
              aria-label={`View ${course.title}`}
            >
              <span className="sr-only">View course</span>
            </Link>

            <div className="relative z-10 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {(userRole === 'admin' || userRole === 'faculty') && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(course.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

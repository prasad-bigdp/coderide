'use client';

import { motion } from 'framer-motion';
import { Course } from '@/types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Users, ChevronRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  progress?: number;
  onClick: (courseId: string) => void;
}

export function CourseCard({ course, progress = 0, onClick }: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={() => onClick(course.id)}
      role="article"
      aria-label={`${course.title} course`}
    >
      <Card className="overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {course.faculty?.name || 'No instructor assigned'}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <p className="text-muted-foreground mb-6 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span aria-label="Number of levels">
                {course.levels?.length || 0} Levels
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span aria-label="Number of enrolled students">
                25 Students
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium" aria-label={`${progress}% complete`}>
                {progress}%
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-2" 
              aria-label="Course progress"
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
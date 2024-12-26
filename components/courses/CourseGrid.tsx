'use client';

import { Course } from '@/types';
import { CourseCard } from './CourseCard';
import { useRouter } from 'next/navigation';

interface CourseGridProps {
  courses: Course[];
  userRole: string;
}

export function CourseGrid({ courses, userRole }: CourseGridProps) {
  const router = useRouter();

  const handleCourseClick = (courseId: string) => {
    router.push(`/dashboard/${userRole}/courses/${courseId}`);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          progress={45} // Replace with actual progress
          onClick={handleCourseClick}
        />
      ))}
    </div>
  );
}
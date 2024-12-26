'use client';

export function ClientCourseForm({ initialData }: { initialData?: Partial<Course> }) {
  return (
    <CourseForm 
      onCancel={() => window.history.back()} 
      initialData={initialData}
    />
  );
} 
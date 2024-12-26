'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getCourses, createCourse } from '@/lib/api/courses';
import { CourseForm } from '@/components/forms/CourseForm';
import { CourseList } from '@/components/lists/CourseList';
import { toast } from 'sonner';
import { handleError } from '@/lib/utils/error-handler';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      handleError(error, 'Failed to load courses');
    }
  }

  async function handleCreateCourse(data: any) {
    try {
      await createCourse(data);
      setShowForm(false);
      loadCourses();
      toast.success('Successfully created course');
    } catch (error) {
      handleError(error, 'Failed to create course');
    }
  }

  return (
    <DashboardShell>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Management</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6">
              <CourseForm
                onSubmit={handleCreateCourse}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}
          <CourseList
            courses={courses}
            userRole="admin"
            onDelete={loadCourses}
          />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
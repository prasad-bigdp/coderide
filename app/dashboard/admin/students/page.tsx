'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getUsers, createUser } from '@/lib/api/users';
import { UserForm } from '@/components/forms/UserForm';
import { UserList } from '@/components/lists/UserList';
import { toast } from 'sonner';
import { handleError } from '@/lib/utils/error-handler';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      const data = await getUsers('student');
      setStudents(data);
    } catch (error) {
      handleError(error, 'Failed to load students');
    }
  }

  async function handleCreateStudent(data: any) {
    try {
      await createUser({ ...data, role: 'student' });
      setShowForm(false);
      loadStudents();
      toast.success('Successfully added student');
    } catch (error) {
      handleError(error, 'Failed to add student');
    }
  }

  return (
    <DashboardShell>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Student Management</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6">
              <UserForm
                onSubmit={handleCreateStudent}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}
          <UserList
            users={students}
            onDelete={loadStudents}
          />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
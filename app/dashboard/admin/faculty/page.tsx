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

export default function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadFaculty();
  }, []);

  async function loadFaculty() {
    try {
      const data = await getUsers('faculty');
      setFaculty(data);
    } catch (error) {
      handleError(error, 'Failed to load faculty members');
    }
  }

  async function handleCreateFaculty(data: any) {
    try {
      await createUser({ ...data, role: 'faculty' });
      setShowForm(false);
      loadFaculty();
      toast.success('Successfully added faculty member');
    } catch (error) {
      handleError(error, 'Failed to add faculty member');
    }
  }

  return (
    <DashboardShell>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Faculty Management</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Faculty
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6">
              <UserForm
                onSubmit={handleCreateFaculty}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}
          <UserList
            users={faculty}
            onDelete={loadFaculty}
          />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
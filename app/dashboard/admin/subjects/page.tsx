'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getSubjects, createSubject, deleteSubject } from '@/lib/api/subjects';
import { Subject } from '@/types';
import { SubjectForm } from '@/components/forms/SubjectForm';
import { SubjectList } from '@/components/lists/SubjectList';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  async function loadSubjects() {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  }

  async function handleCreateSubject(data: Partial<Subject>) {
    try {
      await createSubject(data);
      setShowForm(false);
      loadSubjects();
    } catch (error) {
      console.error('Error creating subject:', error);
    }
  }

  async function handleDeleteSubject(id: string) {
    try {
      await deleteSubject(id);
      loadSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  }

  return (
    <DashboardShell>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subject Management</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6">
              <SubjectForm
                onSubmit={handleCreateSubject}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}
          <SubjectList subjects={subjects} onDelete={handleDeleteSubject} />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
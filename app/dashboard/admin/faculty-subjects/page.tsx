'use client';

import { useState, useEffect } from 'react';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { getUsers } from '@/lib/api/users';
import { getSubjects } from '@/lib/api/subjects';
import { getFacultySubjects, assignSubjectToFaculty } from '@/lib/api/faculty-subjects';
import { FacultySubjectAssignment } from '@/components/forms/FacultySubjectAssignment';
import { User, Subject, FacultySubject } from '@/types';

export default function FacultySubjectsPage() {
  const [faculty, setFaculty] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<FacultySubject[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [facultyData, subjectsData] = await Promise.all([
        getUsers('faculty'),
        getSubjects()
      ]);
      setFaculty(facultyData);
      setSubjects(subjectsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async function handleAssignment(facultyId: string, subjectId: string) {
    try {
      await assignSubjectToFaculty(facultyId, subjectId);
      setShowForm(false);
      loadData();
    } catch (error) {
      console.error('Error assigning subject:', error);
    }
  }

  return (
    <DashboardShell>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Faculty Subject Assignments</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Assign Subject
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6">
              <FacultySubjectAssignment
                faculty={faculty}
                subjects={subjects}
                onSubmit={handleAssignment}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}
          <div className="space-y-4">
            {faculty.map((f) => (
              <Card key={f.id}>
                <CardHeader>
                  <CardTitle>{f.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {assignments
                      .filter((a) => a.faculty_id === f.id)
                      .map((assignment) => (
                        <div
                          key={assignment.id}
                          className="bg-muted px-3 py-1 rounded-full text-sm"
                        >
                          {assignment.subjects?.name}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
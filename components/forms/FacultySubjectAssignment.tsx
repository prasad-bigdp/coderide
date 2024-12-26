'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { User, Subject } from '@/types';

interface FacultySubjectAssignmentProps {
  faculty: User[];
  subjects: Subject[];
  onSubmit: (facultyId: string, subjectId: string) => void;
  onCancel: () => void;
}

export function FacultySubjectAssignment({
  faculty,
  subjects,
  onSubmit,
  onCancel,
}: FacultySubjectAssignmentProps) {
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFaculty && selectedSubject) {
      onSubmit(selectedFaculty, selectedSubject);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Faculty Member</Label>
        <Select onValueChange={setSelectedFaculty}>
          <SelectTrigger>
            <SelectValue placeholder="Select faculty member" />
          </SelectTrigger>
          <SelectContent>
            {faculty.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Subject</Label>
        <Select onValueChange={setSelectedSubject}>
          <SelectTrigger>
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name} ({subject.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!selectedFaculty || !selectedSubject}
        >
          Assign Subject
        </Button>
      </div>
    </form>
  );
}
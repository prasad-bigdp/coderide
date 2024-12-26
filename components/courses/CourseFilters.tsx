'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CourseFiltersProps {
  onFilterChange: (filters: any) => void;
  subjects?: { id: string; name: string }[];
  faculty?: { id: string; name: string }[];
}

export function CourseFilters({ onFilterChange, subjects = [], faculty = [] }: CourseFiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    instructor: '',
  });

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="search">Search Courses</Label>
        <Input
          id="search"
          placeholder="Search by title..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
        />
      </div>

      {subjects.length > 0 && (
        <div className="space-y-2">
          <Label>Subject</Label>
          <Select
            value={filters.subject}
            onValueChange={(value) => handleChange('subject', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {faculty.length > 0 && (
        <div className="space-y-2">
          <Label>Instructor</Label>
          <Select
            value={filters.instructor}
            onValueChange={(value) => handleChange('instructor', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select instructor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Instructors</SelectItem>
              {faculty.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </Card>
  );
}
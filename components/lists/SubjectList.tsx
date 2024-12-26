'use client';

import { Subject } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SubjectListProps {
  subjects: Subject[];
  onDelete: (id: string) => void;
  onEdit?: (subject: Subject) => void;
}

export function SubjectList({ subjects, onDelete, onEdit }: SubjectListProps) {
  return (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <div
          key={subject.id}
          className="flex items-center justify-between p-4 bg-card rounded-lg border"
        >
          <div>
            <h3 className="font-medium">{subject.name}</h3>
            <p className="text-sm text-muted-foreground">{subject.code}</p>
            {subject.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {subject.description}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(subject)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this subject? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(subject.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
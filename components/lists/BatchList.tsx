'use client';

import { Batch } from '@/types';
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

interface BatchListProps {
  batches: Batch[];
  onDelete: (id: string) => void;
  onEdit?: (batch: Batch) => void;
}

export function BatchList({ batches, onDelete, onEdit }: BatchListProps) {
  return (
    <div className="space-y-4">
      {batches.map((batch) => (
        <div
          key={batch.id}
          className="flex items-center justify-between p-4 bg-card rounded-lg border"
        >
          <div>
            <h3 className="font-medium">{batch.name}</h3>
            <p className="text-sm text-muted-foreground">Year: {batch.year}</p>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(batch)}
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
                  <AlertDialogTitle>Delete Batch</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this batch? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(batch.id)}>
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
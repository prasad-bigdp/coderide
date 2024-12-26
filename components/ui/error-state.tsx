'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from './button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  message = 'Something went wrong', 
  onRetry 
}: ErrorStateProps) {
  return (
    <div 
      role="alert"
      className="flex flex-col items-center justify-center p-8 space-y-4"
    >
      <AlertCircle className="h-12 w-12 text-destructive" />
      <p className="text-muted-foreground">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}
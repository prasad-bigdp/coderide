'use client';

import { LoadingAnimation } from './loading-animation';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 'md' 
}: LoadingStateProps) {
  return (
    <div 
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center min-h-[200px] p-8"
    >
      <LoadingAnimation size={size} />
      {message && (
        <p className="mt-4 text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
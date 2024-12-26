'use client';

import { LoadingAnimation } from './loading-animation';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center p-4">
        <LoadingAnimation size="lg" />
        {message && (
          <p className="mt-4 text-lg text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}
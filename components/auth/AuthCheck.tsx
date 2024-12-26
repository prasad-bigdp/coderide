'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/login');
    },
  });

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
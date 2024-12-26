'use client';

import { useState, Suspense } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';
import { LoadingState } from '@/components/ui/loading-state';
import { PageTransition } from '@/components/transitions/page-transition';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className={`
        fixed inset-y-0 z-50 lg:relative lg:block
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-200 ease-in-out
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 bg-gray-50">
        <DashboardHeader>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </DashboardHeader>
        <main className="p-8">
          <Suspense fallback={<LoadingState />}>
            <PageTransition>
              {children}
            </PageTransition>
          </Suspense>
        </main>
      </div>
      
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
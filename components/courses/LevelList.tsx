'use client';

import { useState } from 'react';
import { Level } from '@/types';
import { LevelCard } from './LevelCard';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { SlideIn } from '@/components/transitions/slide-in';

interface LevelListProps {
  levels: Level[];
  onLevelClick: (levelId: string) => void;
  currentLevelId?: string;
}

export function LevelList({ levels, onLevelClick, currentLevelId }: LevelListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return <LoadingState message="Loading levels..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => setError(null)} />;
  }

  if (!levels.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No levels available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {levels.map((level, index) => (
        <SlideIn key={level.id} delay={index * 0.1}>
          <LevelCard
            level={level}
            isActive={level.id === currentLevelId}
            isLocked={!level.unlocked && index !== 0}
            onClick={() => onLevelClick(level.id)}
          />
        </SlideIn>
      ))}
    </div>
  );
}
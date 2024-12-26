'use client';

import { useState, useEffect } from 'react';
import { Medal } from 'lucide-react';
import { getLeaderboard } from '@/lib/api/leaderboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface LeaderboardEntry {
  user_id: string;
  name: string;
  total_score: number;
  completed_tasks: number;
}

export function LeaderboardWidget() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const data = await getLeaderboard();
        setEntries(data);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!entries.length) {
    return (
      <p className="text-center text-muted-foreground py-4">
        No leaderboard data available
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {entries.slice(0, 5).map((entry, index) => (
        <div
          key={entry.user_id}
          className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              {index < 3 ? (
                <Medal className={`h-4 w-4 ${
                  index === 0 ? 'text-yellow-500' :
                  index === 1 ? 'text-gray-400' :
                  'text-amber-600'
                }`} />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <div>
              <p className="font-medium">{entry.name}</p>
              <p className="text-sm text-muted-foreground">
                {entry.completed_tasks} tasks completed
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">{entry.total_score}</p>
            <p className="text-sm text-muted-foreground">points</p>
          </div>
        </div>
      ))}
    </div>
  );
}
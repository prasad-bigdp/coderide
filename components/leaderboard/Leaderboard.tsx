'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLeaderboard } from '@/lib/api/leaderboard';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  name: string;
  total_score: number;
  completed_tasks: number;
}

export function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    try {
      const data = await getLeaderboard();
      setEntries(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div
              key={entry.user_id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-4">
                {index < 3 && (
                  <Medal className={`h-5 w-5 ${
                    index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-400' :
                    'text-amber-600'
                  }`} />
                )}
                <div>
                  <p className="font-medium">{entry.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.completed_tasks} tasks completed
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold">{entry.total_score}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
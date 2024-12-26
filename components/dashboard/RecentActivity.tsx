'use client';

import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { Progress } from '@/types';

interface RecentActivityProps {
  activities: Progress[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities.length) {
    return (
      <p className="text-center text-muted-foreground py-4">
        No recent activity
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50"
        >
          <div className="mt-1">
            {activity.status === 'completed' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : activity.status === 'in-progress' ? (
              <Clock className="h-5 w-5 text-yellow-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-medium">
              {activity.task?.title}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {activity.score !== undefined && (
                  <span>Score: {activity.score}%</span>
                )}
              </span>
              <time className="text-muted-foreground" dateTime={activity.updated_at}>
                {formatDistanceToNow(new Date(activity.updated_at!), { addSuffix: true })}
              </time>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
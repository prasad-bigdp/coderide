'use client';

import { motion } from 'framer-motion';
import { Level } from '@/types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Lock, Unlock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LevelCardProps {
  level: Level;
  isActive?: boolean;
  isLocked?: boolean;
  onClick: () => void;
}

export function LevelCard({ level, isActive, isLocked, onClick }: LevelCardProps) {
  const completedTasks = level.tasks?.filter(t => t.progress?.[0]?.status === 'completed').length || 0;
  const totalTasks = level.tasks?.length || 0;
  const progressPercentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02 } : undefined}
      whileTap={!isLocked ? { scale: 0.98 } : undefined}
      className={`${isLocked ? 'opacity-75' : ''}`}
    >
      <Card 
        className={`
          overflow-hidden cursor-pointer transition-shadow
          ${isActive ? 'ring-2 ring-primary' : ''}
          ${isLocked ? 'bg-muted' : 'hover:shadow-md'}
        `}
        onClick={!isLocked ? onClick : undefined}
        role="button"
        tabIndex={isLocked ? -1 : 0}
        aria-disabled={isLocked}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={`
                h-10 w-10 rounded-full flex items-center justify-center
                ${isLocked ? 'bg-muted-foreground/10' : 'bg-primary/10'}
              `}>
                {isLocked ? (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Unlock className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{level.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={isLocked ? "outline" : "secondary"}>
                    {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}
                  </Badge>
                  {!isLocked && completedTasks > 0 && (
                    <Badge variant="success">
                      {completedTasks} Completed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <ChevronRight className={`
              h-5 w-5 transition-transform
              ${isLocked ? 'text-muted-foreground' : 'text-primary'}
              ${isActive ? 'rotate-90' : ''}
            `} />
          </div>

          <p className="text-muted-foreground mb-6 line-clamp-2">
            {level.description}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2"
              aria-label={`Level progress: ${Math.round(progressPercentage)}%`}
            />
          </div>

          {isLocked && (
            <p className="mt-4 text-sm text-center text-muted-foreground">
              Complete previous level to unlock
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
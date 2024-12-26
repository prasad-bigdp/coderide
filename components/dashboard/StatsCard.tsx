'use client';

import { FadeIn } from '@/components/transitions/fade-in';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { theme } from '@/lib/theme';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
  return (
    <FadeIn>
      <Card className={theme.animation.transition}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <h3 className="text-2xl font-bold mt-2">{value}</h3>
              {trend && (
                <p className="text-sm mt-2">
                  <span 
                    className={trend.value >= 0 ? 'text-green-500' : 'text-red-500'}
                    aria-label={`${trend.value >= 0 ? 'Increased' : 'Decreased'} by ${Math.abs(trend.value)}%`}
                  >
                    {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
                  </span>
                  <span className="text-muted-foreground ml-1">{trend.label}</span>
                </p>
              )}
            </div>
            <div 
              className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center"
              aria-hidden="true"
            >
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
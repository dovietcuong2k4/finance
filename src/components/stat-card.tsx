import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  className?: string;
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  className 
}: StatCardProps) {
  return (
    <div className={cn("corporate-card p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-muted rounded-lg">
          <Icon className="w-5 h-5 text-secondary" />
        </div>
        {trend && change && (
          <span className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            trend === 'up' ? "text-green-600 bg-green-50" : 
            trend === 'down' ? "text-red-600 bg-red-50" : 
            "text-secondary bg-muted"
          )}>
            {trend === 'up' ? '+' : ''}{change}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-secondary mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
      </div>
    </div>
  );
}

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon: Icon }) => {
  const isUp = trend === 'up';

  return (
    <div className="bento-card group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-xl bg-secondary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
          isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
      </div>
      
      {/* Decorative background shape */}
      <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-muted rounded-full opacity-0 group-hover:opacity-20 transition-all duration-500 blur-2xl group-hover:scale-150"></div>
    </div>
  );
};

export default StatCard;

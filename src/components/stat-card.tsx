import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  variant?: 'indigo' | 'emerald' | 'rose' | 'amber';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, trend, icon: Icon, variant = 'indigo' }) => {
  const isUp = trend === 'up';
  
  const formattedValue = typeof value === 'number' 
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    : value;

  const variants = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bento-card group">
      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div className={`p-1 md:p-1.5 rounded-lg ${variants[variant]} transition-colors duration-300`}>
          <Icon className="w-4 h-4 md:w-4.5 md:h-4.5" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
            {change}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-[10px] md:text-[11px] font-bold text-muted-foreground mb-0.5 md:mb-1 uppercase tracking-widest truncate">{title}</p>
        <h3 className="text-lg md:text-xl font-bold tracking-tight truncate">{formattedValue}</h3>
      </div>
      
      {/* Decorative background shape */}
      <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-muted rounded-full opacity-0 group-hover:opacity-20 transition-all duration-500 blur-2xl group-hover:scale-150"></div>
    </div>
  );
};

export default StatCard;

'use client';

import React, { useState, useEffect } from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  variant?: 'indigo' | 'emerald' | 'rose' | 'amber';
  isHideable?: boolean;
  storageKey?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  variant = 'indigo',
  isHideable = false,
  storageKey,
}) => {
  const isUp = trend === 'up';
  const [isHidden, setIsHidden] = useState(isHideable);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isHideable && storageKey) {
      const stored = localStorage.getItem(`aura-moni-hide-${storageKey}`);
      if (stored !== null) {
        setIsHidden(stored === 'true');
      } else {
        setIsHidden(true);
      }
    }
  }, [isHideable, storageKey]);

  const toggleHidden = () => {
    const newVal = !isHidden;
    setIsHidden(newVal);
    if (storageKey) {
      localStorage.setItem(`aura-moni-hide-${storageKey}`, String(newVal));
    }
  };

  const formattedValue = typeof value === 'number' 
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    : value;

  const displayValue = isHideable && (!isMounted || isHidden) ? '••••••' : formattedValue;

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
        <div className="flex items-center justify-between gap-2 mb-0.5 md:mb-1">
          <p className="text-[10px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-widest truncate">{title}</p>
          {isHideable && (
            <button
              onClick={toggleHidden}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100/80 transition-colors cursor-pointer"
              title={isHidden ? "Hiển thị số tiền" : "Ẩn số tiền"}
            >
              {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
        <h3 className="text-lg md:text-xl font-bold tracking-tight truncate">{displayValue}</h3>
      </div>
      
      {/* Decorative background shape */}
      <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-muted rounded-full opacity-0 group-hover:opacity-20 transition-all duration-500 blur-2xl group-hover:scale-150"></div>
    </div>
  );
};

export default StatCard;

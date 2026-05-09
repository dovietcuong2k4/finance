'use client';

import React from 'react';
import { 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  AlertCircle,
  Zap
} from 'lucide-react';

interface ReportStats {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
  largestExpense: {
    amount: number;
    category: string;
    note?: string;
  } | null;
  averageDaily: number;
  estimatedMonthlyExpense: number;
}

interface Props {
  stats: ReportStats;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const ReportSummaryCards: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      <div className="bento-card bg-linear-to-br from-indigo-50/50 to-white">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="p-1 md:p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <TrendingUp className="w-4 h-4 md:w-4.5 md:h-4.5" />
          </div>
          <span className="text-[10px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-widest truncate">Tỷ lệ tiết kiệm</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 md:gap-2">
          <h4 className="text-lg md:text-2xl font-bold tracking-tight text-indigo-900 truncate">{stats.savingsRate}%</h4>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit">
            {stats.savingsRate >= 20 ? 'Rất tốt' : 'Cần cải thiện'}
          </span>
        </div>
        <div className="mt-3 md:mt-4 w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
            style={{ width: `${Math.min(100, stats.savingsRate)}%` }}
          ></div>
        </div>

      </div>

      <div className="bento-card bg-linear-to-br from-rose-50/50 to-white">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="p-1 md:p-1.5 bg-rose-50 text-rose-600 rounded-lg">
            <AlertCircle className="w-4 h-4 md:w-4.5 md:h-4.5" />
          </div>
          <span className="text-[10px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-widest truncate">Chi tiêu lớn</span>
        </div>
        {stats.largestExpense ? (
          <div>
            <h4 className="text-lg md:text-xl font-bold tracking-tight text-rose-900 truncate">{formatCurrency(stats.largestExpense.amount)}</h4>
            <p className="text-[10px] text-rose-600 font-bold mt-1 uppercase tracking-wider truncate">
              {stats.largestExpense.category}
            </p>
            {stats.largestExpense.note && (
              <p className="text-[10px] text-rose-400 italic mt-1 md:mt-2 truncate">"{stats.largestExpense.note}"</p>
            )}
          </div>
        ) : (
          <p className="text-[11px] md:text-sm text-muted-foreground italic">Chưa có dữ liệu</p>
        )}
      </div>

      <div className="bento-card bg-linear-to-br from-amber-50/50 to-white">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="p-1 md:p-1.5 bg-amber-50 text-amber-600 rounded-lg">
            <Zap className="w-4 h-4 md:w-4.5 md:h-4.5" />
          </div>
          <span className="text-[10px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-widest truncate">Chi tiêu trung bình/ngày</span>
        </div>
        <div>
          <h4 className="text-lg md:text-xl font-bold tracking-tight text-amber-900 truncate">{formatCurrency(stats.averageDaily)}</h4>
          <p className="text-[10px] text-amber-600 font-medium mt-1 truncate">Dựa trên dữ liệu hiện tại</p>
          <div className="flex gap-1 mt-2 md:mt-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full ${i <= 3 ? 'bg-amber-400' : 'bg-amber-100'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="bento-card bg-linear-to-br from-emerald-50/50 to-white">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="p-1 md:p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingDown className="w-4 h-4 md:w-4.5 md:h-4.5" />
          </div>
          <span className="text-[10px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-widest truncate">Dự kiến hết tháng</span>
        </div>
        <div>
          <h4 className="text-lg md:text-xl font-bold tracking-tight text-emerald-900 truncate">{formatCurrency(stats.estimatedMonthlyExpense || 0)}</h4>
          <p className="text-[10px] text-emerald-600 font-medium mt-1 truncate">Dựa trên tốc độ hiện tại</p>
          <div className="mt-3 md:mt-4 w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(100, (stats.estimatedMonthlyExpense || 0) > 0 ? (stats.totalExpense / (stats.estimatedMonthlyExpense || 1)) * 100 : 0)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSummaryCards;

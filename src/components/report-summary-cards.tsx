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
}

interface Props {
  stats: ReportStats;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const ReportSummaryCards: React.FC<Props> = ({ stats }) => {
  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-3 gap-4 md:gap-6 pb-2 md:pb-0">
      <div className="bento-card min-w-[85vw] md:min-w-0 shrink-0 snap-center bg-linear-to-br from-indigo-50/50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <TrendingUp className="w-4.5 h-4.5" />
          </div>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Tỷ lệ tiết kiệm</span>
        </div>
        <div className="flex items-end justify-between">
          <h4 className="text-2xl font-bold tracking-tight text-indigo-900">{stats.savingsRate}%</h4>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            {stats.savingsRate >= 20 ? 'Rất tốt' : 'Cần cải thiện'}
          </span>
        </div>
        <div className="mt-4 w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
            style={{ width: `${Math.min(100, stats.savingsRate)}%` }}
          ></div>
        </div>
      </div>

      <div className="bento-card min-w-[85vw] md:min-w-0 shrink-0 snap-center bg-linear-to-br from-rose-50/50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
            <AlertCircle className="w-4.5 h-4.5" />
          </div>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Chi tiêu lớn nhất</span>
        </div>
        {stats.largestExpense ? (
          <div>
            <h4 className="text-xl font-bold tracking-tight text-rose-900">{formatCurrency(stats.largestExpense.amount)}</h4>
            <p className="text-[10px] text-rose-600 font-bold mt-1 uppercase tracking-wider">
              {stats.largestExpense.category}
            </p>
            {stats.largestExpense.note && (
              <p className="text-[10px] text-rose-400 italic mt-2 truncate">"{stats.largestExpense.note}"</p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">Chưa có dữ liệu</p>
        )}
      </div>

      <div className="bento-card min-w-[85vw] md:min-w-0 shrink-0 snap-center bg-linear-to-br from-amber-50/50 to-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
            <Zap className="w-4.5 h-4.5" />
          </div>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Chi tiêu trung bình/ngày</span>
        </div>
        <div>
          <h4 className="text-xl font-bold tracking-tight text-amber-900">{formatCurrency(stats.averageDaily)}</h4>
          <p className="text-[10px] text-amber-600 font-medium mt-1">Dựa trên dữ liệu hiện tại</p>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full ${i <= 3 ? 'bg-amber-400' : 'bg-amber-100'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSummaryCards;

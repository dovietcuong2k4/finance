'use client';

import React from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-react';
import StatCard from '@/components/stat-card';
import DashboardPeriodSelector from '@/components/dashboard-period-selector';

interface DashboardKpiSectionProps {
  stats: {
    balance: number;
    totalIncome: number;
    totalExpense: number;
    savings: number;
  };
}

export default function DashboardKpiSection({ stats }: DashboardKpiSectionProps) {
  return (
    <>
      {/* Section Header */}
      <div className="col-span-2 lg:col-span-4 flex items-center justify-between">
        <div>
          <h2 className="text-base md:text-lg font-bold text-slate-900">Tổng quan tài chính</h2>
          <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Thống kê theo thời gian</p>
        </div>
        <DashboardPeriodSelector />
      </div>

      {/* KPI Row */}
      <StatCard
        title="Tổng số dư"
        value={stats.balance}
        icon={Wallet}
        variant="indigo"
        isHideable={true}
        storageKey="balance"
      />
      <StatCard
        title="Thu nhập"
        value={stats.totalIncome}
        trend="up"
        icon={ArrowDownLeft}
        variant="emerald"
        isHideable={true}
        storageKey="income"
      />
      <StatCard
        title="Chi tiêu"
        value={stats.totalExpense}
        trend="down"
        icon={ArrowUpRight}
        variant="rose"
      />
      <StatCard
        title="Tỷ lệ tiết kiệm"
        value={`${stats.savings}%`}
        trend="up"
        icon={TrendingUp}
        variant="amber"
      />
    </>
  );
}

import { getDashboardData } from '@/app/dashboard/actions';
import { getInsights } from '@/app/dashboard/insight-actions';
import StatCard from '@/components/stat-card';
import AIAdvisor from '@/components/ai-advisor';
import TransactionTable from '@/components/transaction-table';
import AddTransactionModal from '@/components/add-transaction-modal';
import DashboardSearch from '@/components/dashboard-search';
import DashboardChartSection from '@/components/dashboard-chart-section';
import { Suspense } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp,
  Bell,
  Calendar
} from 'lucide-react';
import { CATEGORIES } from '@/constants/categories';

import DashboardPeriodSelector from '@/components/dashboard-period-selector';

interface PageProps {
  searchParams: Promise<{
    range?: string;
    period?: string;
  }>;
}

async function DashboardAIAdvisor() {
  const insights = await getInsights();
  return <AIAdvisor insights={insights} />;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const range = (params.range as 'recent' | 'month') || 'recent';
  const period = (params.period as any) || 'this_month';
  const data = await getDashboardData(range, period);

  if (!data) {
    return <div className="p-8 text-center">Đang tải dữ liệu hoặc lỗi xác thực...</div>;
  }

  const { user, stats, recentTransactions, chartData } = data;

  const getGreeting = () => {
    const hour = dayjs().tz().hour();
    const greetings = {
      morning: ['Chào buổi sáng', 'Ngày mới tốt lành', 'Khởi đầu ngày mới rực rỡ', 'Sáng an lành'],
      afternoon: ['Chào buổi chiều', 'Chúc bạn buổi chiều năng suất', 'Năng lượng cho buổi chiều'],
      evening: ['Chào buổi tối', 'Chúc bạn tối ấm áp', 'Tận hưởng buổi tối yên bình', 'Buổi tối tuyệt vời'],
    };

    let periodDay: keyof typeof greetings = 'morning';
    if (hour >= 12 && hour < 18) periodDay = 'afternoon';
    else if (hour >= 18 || hour < 5) periodDay = 'evening';

    const choices = greetings[periodDay];
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const greeting = getGreeting();

  return (
    <div className="max-w-none p-3 md:p-8 animate-in fade-in duration-1000">
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-10 pt-4 md:pt-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Live Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {greeting}, <span className="text-aura-indigo">{user.fullName || 'Admin'}</span>
          </h1>
          <p className="text-muted-foreground text-[13px] mt-1 hidden md:block">Dưới đây là tóm lược tình hình tài chính của bạn.</p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="hidden lg:flex items-center gap-2 bg-white border border-border px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground shrink-0">
            <Calendar className="w-5 h-5" />
            <span>{dayjs().tz().format('DD [Th] MM, YYYY')}</span>
          </div>
          
          <DashboardSearch />
          
          <button className="p-2 bg-white border border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-aura-indigo transition-all relative shrink-0">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <AddTransactionModal />
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 auto-rows-min">
        
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
        />
        <StatCard 
          title="Thu nhập" 
          value={stats.totalIncome} 
          trend="up" 
          icon={ArrowUpRight} 
          variant="emerald"
        />
        <StatCard 
          title="Chi tiêu" 
          value={stats.totalExpense} 
          trend="down" 
          icon={ArrowDownLeft} 
          variant="rose"
        />
        <StatCard 
          title="Tỷ lệ tiết kiệm" 
          value={`${stats.savings}%`} 
          trend="up" 
          icon={TrendingUp} 
          variant="amber"
        />

        {/* Main Content Bento Area */}
        <div className="col-span-2 lg:col-span-3 lg:row-span-2">
          <DashboardChartSection data={chartData} />
        </div>
        
        <div className="col-span-2 lg:col-span-1">
          <Suspense fallback={
            <div className="bento-card bg-slate-900 border-none shadow-2xl h-full min-h-[160px] animate-pulse rounded-2xl flex flex-col items-center justify-center text-indigo-400/50">
              <div className="w-8 h-8 mb-3 rounded-full bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Đang phân tích AI...</span>
            </div>
          }>
            <DashboardAIAdvisor />
          </Suspense>
        </div>
        
        {/* Goals or Quick Action Bento Card */}
        <div className="bento-card col-span-2 lg:col-span-1 bg-linear-to-br from-indigo-50 to-white">
          <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-indigo-900/60">Mục tiêu tiết kiệm</h3>
          <div className="flex justify-between items-end mb-2">
            <span className="text-2xl font-bold text-indigo-900">{stats.savings}%</span>
            <span className="text-xs font-bold text-indigo-900/40">Mục tiêu chung</span>
          </div>
          <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
            <div className="h-full bg-aura-indigo rounded-full" style={{ width: `${stats.savings}%` }}></div>
          </div>
          <p className="text-[10px] text-indigo-900/50 mt-4 font-medium italic">
            {stats.savings > 20 ? '"Bạn đang làm rất tốt, hãy duy trì nhé!"' : '"Cố gắng cắt giảm chi tiêu không cần thiết nào!"'}
          </p>
        </div>

        {/* Hệ thống Túi tiền (Pocket Budgets) */}
        <div className="col-span-2 lg:col-span-4 bento-card bg-white border border-slate-100 shadow-xl shadow-slate-100/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-800">Quản lý Túi tiền (Số tiền định chi)</h3>
              <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Sắp xếp theo mức độ ưu tiên tăng dần từ trái qua phải, dưới lên trên</p>
            </div>
            <span className="px-3 py-1 bg-indigo-50 text-aura-indigo rounded-full text-xs font-semibold border border-indigo-100/50">
              Tháng {dayjs().tz().format('MM/YYYY')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.filter(c => c.type === 'expense').map((c) => {
              const Icon = c.icon;
              const limit = user.metadata?.categoryLimits?.[c.value];
              const spent = data.categoryDistribution?.find((cat: any) => cat.name === c.value)?.value || 0;
              const hasLimit = limit !== undefined && limit !== null && limit > 0;
              const percent = hasLimit ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
              
              // Progress bar color based on percentage
              let barColor = 'bg-aura-indigo';
              if (percent > 90) barColor = 'bg-red-500 animate-pulse';
              else if (percent > 75) barColor = 'bg-amber-500';

              return (
                <div key={c.value} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-aura-indigo/30 transition-all duration-300 flex flex-col justify-between group">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-2 rounded-xl ${c.className} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-sm font-bold text-slate-800 truncate">{c.label}</span>
                    </div>
                    {hasLimit && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        percent > 90 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {percent}%
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mt-auto">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">Đã chi:</span>
                      <span className="font-bold text-slate-700">
                        {new Intl.NumberFormat('vi-VN').format(spent)}đ
                      </span>
                    </div>
                    
                    {hasLimit ? (
                      <>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400 font-medium">Định chi:</span>
                          <span className="font-semibold text-slate-500">
                            {new Intl.NumberFormat('vi-VN').format(limit)}đ
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${barColor} rounded-full transition-all duration-500`} 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">Chưa gán định chi</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Full width Transaction Table */}
        <div className="col-span-2 lg:col-span-4 mt-2">
          <TransactionTable transactions={recentTransactions} />
        </div>

      </div>

      {/* Footer minimal info */}
      <footer className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row gap-2 justify-between items-center text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">
        <div>Aura Moni v2.0.4</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}

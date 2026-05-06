import { getDashboardData } from '@/app/dashboard/actions';
import StatCard from '@/components/stat-card';
import FinancialChart from '@/components/financial-chart';
import AIAdvisor from '@/components/ai-advisor';
import TransactionTable from '@/components/transaction-table';
import AddTransactionModal from '@/components/add-transaction-modal';
import dayjs from 'dayjs';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp,
  Search,
  Bell,
  Calendar
} from 'lucide-react';

export default async function Home() {
  const data = await getDashboardData();

  if (!data) {
    return <div className="p-8 text-center">Đang tải dữ liệu hoặc lỗi xác thực...</div>;
  }

  const { user, stats, recentTransactions, chartData } = data;

  return (
    <div className="max-w-none mx-auto p-4 md:p-8 animate-in fade-in duration-1000">
      {/* Premium Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Live Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Chào buổi sáng, <span className="text-aura-indigo">{user.fullName || 'Admin'}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Dưới đây là tóm lược tình hình tài chính của bạn.</p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="hidden lg:flex items-center gap-2 bg-white border border-border px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground shrink-0">
            <Calendar className="w-4 h-4" />
            <span>{dayjs().format('DD [Th] MM, YYYY')}</span>
          </div>
          
          <div className="relative group flex-1 md:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-aura-indigo transition-colors" />
            <input 
              type="text" 
              placeholder="Lệnh nhanh (Cmd+K)" 
              className="pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-aura-indigo/5 focus:border-aura-indigo transition-all w-full md:w-64"
            />
          </div>
          
          <button className="p-2.5 bg-white border border-border rounded-xl text-muted-foreground hover:text-foreground hover:border-aura-indigo transition-all relative shrink-0">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <AddTransactionModal />
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-min">
        
        {/* KPI Row */}
        <StatCard 
          title="Tổng số dư" 
          value={stats.balance} 
          icon={Wallet} 
        />
        <StatCard 
          title="Thu nhập" 
          value={stats.totalIncome} 
          trend="up" 
          icon={ArrowUpRight} 
        />
        <StatCard 
          title="Chi tiêu" 
          value={stats.totalExpense} 
          trend="down" 
          icon={ArrowDownLeft} 
        />
        <StatCard 
          title="Tỷ lệ tiết kiệm" 
          value={`${stats.savings}%`} 
          trend="up" 
          icon={TrendingUp} 
        />

        {/* Main Content Bento Area */}
        <div className="lg:col-span-3 lg:row-span-2">
          <FinancialChart data={chartData} />
        </div>
        
        <div className="lg:col-span-1">
          <AIAdvisor />
        </div>
        
        {/* Goals or Quick Action Bento Card */}
        <div className="bento-card lg:col-span-1 bg-linear-to-br from-indigo-50 to-white">
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

        {/* Full width Transaction Table */}
        <div className="lg:col-span-4 mt-2">
          <TransactionTable transactions={recentTransactions} />
        </div>

      </div>

      {/* Footer minimal info */}
      <footer className="mt-12 pt-8 border-t border-border flex justify-between items-center text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">
        <div>Aura Finance v2.0.4</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}

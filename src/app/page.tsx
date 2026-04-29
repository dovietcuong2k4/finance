import React from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp,
  Plus,
  Search,
  Bell
} from 'lucide-react';
import StatCard from '@/components/stat-card';
import FinancialChart from '@/components/financial-chart';
import AIAdvisor from '@/components/ai-advisor';
import TransactionTable from '@/components/transaction-table';

export default function Home() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Chào buổi sáng, Admin</h1>
          <p className="text-secondary text-sm">Đây là tổng quan tài chính của bạn hôm nay.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-64"
            />
          </div>
          <button className="p-2 bg-card border border-border rounded-lg text-secondary hover:text-foreground transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            Thêm giao dịch
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng số dư" 
          value="45,250,000đ" 
          change="12%" 
          trend="up" 
          icon={Wallet} 
        />
        <StatCard 
          title="Thu nhập tháng" 
          value="18,000,000đ" 
          change="5%" 
          trend="up" 
          icon={ArrowUpRight} 
        />
        <StatCard 
          title="Chi tiêu tháng" 
          value="7,420,000đ" 
          change="8%" 
          trend="down" 
          icon={ArrowDownLeft} 
        />
        <StatCard 
          title="Tiết kiệm" 
          value="10,580,000đ" 
          change="24%" 
          trend="up" 
          icon={TrendingUp} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <FinancialChart />
          <TransactionTable />
        </div>
        
        <div className="space-y-8">
          <AIAdvisor />
          
          <div className="corporate-card p-6 bg-gradient-to-br from-primary to-blue-700 text-white border-none shadow-xl shadow-primary/20 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Nâng cấp Aura Pro</h3>
              <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                Mở khóa các tính năng AI chuyên sâu và dự báo tài chính 12 tháng.
              </p>
              <button className="w-full bg-white text-primary font-bold py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                Thử miễn phí 14 ngày
              </button>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

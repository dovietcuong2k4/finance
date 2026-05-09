import { getReportData } from './actions';
import CategoryDistributionChart from '@/components/category-distribution-chart';
import MonthlyComparisonChart from '@/components/monthly-comparison-chart';
import ReportSummaryCards from '@/components/report-summary-cards';
import { 
  BarChart3, 
  Calendar,
  Filter,
  Download,
  Info
} from 'lucide-react';
import dayjs from 'dayjs';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{
    period?: string;
  }>;
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const period = (params.period as any) || 'this_month';
  const data = await getReportData(period);

  if (!data) {
    return <div className="p-8 text-center">Đang tải dữ liệu hoặc lỗi xác thực...</div>;
  }

  const { categoryData, monthlyTrend, stats } = data;

  const periodLabels: Record<string, string> = {
    'this_month': 'Tháng này',
    'last_month': 'Tháng trước',
    'this_year': 'Năm nay',
    'all_time': 'Tất cả'
  };

  return (
    <div className="max-w-none mx-auto p-3 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-10 pt-4 md:pt-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-aura-indigo" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Phân tích chuyên sâu</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Báo cáo <span className="text-aura-indigo">Tài chính</span>
          </h1>
          <p className="text-muted-foreground text-[13px] mt-1">Cái nhìn tổng quan và chi tiết về thói quen chi tiêu của bạn.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-hidden">
          <div className="flex bg-white border border-border p-1 rounded-lg md:rounded-xl shadow-sm overflow-x-auto snap-x">
            {Object.entries(periodLabels).map(([key, label]) => (
              <Link
                key={key}
                href={`/reports?period=${key}`}
                className={`px-4 py-1.5 rounded md:rounded-[12px] text-[10px] md:text-xs text-nowrap font-bold transition-all ${
                  period === key 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
          
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-xs font-bold hover:border-aura-indigo transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Xuất PDF
          </button>
        </div>
      </header>

      {/* Summary Row */}
      <div className="mb-6 md:mb-10">
        <ReportSummaryCards stats={stats} />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-10">
        <div className="space-y-4 md:space-y-6">
          <CategoryDistributionChart data={categoryData} />
          
          <div className="bento-card bg-slate-900 text-white border-none overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 opacity-60 text-[10px] font-bold uppercase tracking-widest">
                <Info className="w-4 h-4" />
                Gợi ý từ Aura AI
              </div>
              <h4 className="text-lg font-bold mb-2">Tối ưu hóa ngân sách</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Dựa trên báo cáo {periodLabels[period].toLowerCase()}, bạn đang chi tiêu nhiều nhất vào 
                <span className="text-aura-indigo font-bold"> {categoryData[0]?.name || '...'}</span>. 
                Hãy thử đặt hạn mức cho danh mục này để tiết kiệm thêm khoảng 15% vào tháng tới.
              </p>
              <button className="mt-6 px-5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/10">
                Xem chi tiết gợi ý
              </button>
            </div>
            {/* Decorative background element */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-aura-indigo/20 blur-[80px] rounded-full"></div>
          </div>
        </div>

        <div>
          <MonthlyComparisonChart data={monthlyTrend} />
          
          <div className="mt-8 bento-card border-dashed border-2 bg-transparent hover:border-aura-indigo group cursor-pointer transition-all">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Filter className="w-6 h-6 text-slate-400 group-hover:text-aura-indigo" />
              </div>
              <h5 className="font-bold text-slate-900">Thêm bộ lọc tùy chỉnh</h5>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                Sắp có: Khả năng lọc báo cáo theo tài khoản và thẻ cụ thể.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer minimal info */}
      <footer className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row gap-2 justify-between items-center text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">
        <div>Aura Intelligence Engine</div>
        <div className="flex gap-2 items-center">
          <Calendar className="w-3 h-3" />
          <span>Cập nhật lần cuối: {dayjs().format('HH:mm DD/MM/YYYY')}</span>
        </div>
      </footer>
    </div>
  );
}

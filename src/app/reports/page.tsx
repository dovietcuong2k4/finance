import { getReportData } from './actions';
import { getInsights } from '@/app/dashboard/insight-actions';
import CategoryDistributionChart from '@/components/category-distribution-chart';
import MonthlyComparisonChart from '@/components/monthly-comparison-chart';
import ReportSummaryCards from '@/components/report-summary-cards';
import AIAdvisor from '@/components/ai-advisor';
import { Suspense } from 'react';
import { 
  BarChart3, 
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import dayjs from 'dayjs';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{
    period?: string;
  }>;
}

async function ReportAIAdvisor() {
  const insights = await getInsights();
  return <AIAdvisor insights={insights} />;
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const period = (params.period as any) || 'this_month';
  const data = await getReportData(period);

  if (!data) {
    return <div className="p-8 text-center">Đang tải dữ liệu hoặc lỗi xác thực...</div>;
  }

  const { categoryData, monthlyTrend, stats, metadata, topTransactions } = data;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

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
        
        <div className="flex items-center gap-3 w-full md:w-auto min-w-0">
          <div className="flex bg-white border border-border p-1 rounded-lg md:rounded-xl shadow-sm overflow-x-auto snap-x hide-scrollbar max-w-full w-full sm:w-auto">
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

      {/* Reminders / Alerts */}
      {(metadata?.dailyLimit || metadata?.monthlyLimit) && period === 'this_month' && (
        <div className="mb-6 md:mb-10 space-y-3">
          {metadata.monthlyLimit > 0 && stats.limitExpense > metadata.monthlyLimit ? (
            <div className="p-3 md:p-4 rounded-xl flex items-start gap-3 border bg-red-50 border-red-100 text-red-800 shadow-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-bold">Vượt ngân sách tháng!</p>
                <p className="text-xs mt-1">Chi tiêu tính vào giới hạn ({formatCurrency(stats.limitExpense)}) đã vượt quá ngân sách tháng của bạn ({formatCurrency(metadata.monthlyLimit)}).</p>
              </div>
            </div>
          ) : metadata.monthlyLimit > 0 && stats.estimatedMonthlyExpense > metadata.monthlyLimit ? (
            <div className="p-3 md:p-4 rounded-xl flex items-start gap-3 border bg-orange-50 border-orange-100 text-orange-800 shadow-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 text-orange-500" />
              <div>
                <p className="text-sm font-bold">Nguy cơ vượt ngân sách tháng</p>
                <p className="text-xs mt-1">Dự kiến chi tiêu ({formatCurrency(stats.estimatedMonthlyExpense)}) có thể vượt giới hạn ({formatCurrency(metadata.monthlyLimit)}). Hãy chú ý!</p>
              </div>
            </div>
          ) : metadata.monthlyLimit > 0 && (
            <div className="p-3 md:p-4 rounded-xl flex items-start gap-3 border bg-emerald-50 border-emerald-100 text-emerald-800 shadow-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
              <div>
                <p className="text-sm font-bold">Ngân sách tháng an toàn</p>
                <p className="text-xs mt-1">Chi tiêu tháng của bạn đang trong tầm kiểm soát (Giới hạn: {formatCurrency(metadata.monthlyLimit)}).</p>
              </div>
            </div>
          )}

          {metadata.dailyLimit > 0 && stats.averageDaily > metadata.dailyLimit ? (
            <div className="p-3 md:p-4 rounded-xl flex items-start gap-3 border bg-orange-50 border-orange-100 text-orange-800 shadow-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 text-orange-500" />
              <div>
                <p className="text-sm font-bold">Chi tiêu ngày cao</p>
                <p className="text-xs mt-1">Trung bình ngày ({formatCurrency(stats.averageDaily)}) đang vượt giới hạn cho phép ({formatCurrency(metadata.dailyLimit)}).</p>
              </div>
            </div>
          ) : metadata.dailyLimit > 0 && (
            <div className="p-3 md:p-4 rounded-xl flex items-start gap-3 border bg-emerald-50 border-emerald-100 text-emerald-800 shadow-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
              <div>
                <p className="text-sm font-bold">Chi tiêu ngày tốt</p>
                <p className="text-xs mt-1">Trung bình ngày của bạn đang rất ổn (Giới hạn: {formatCurrency(metadata.dailyLimit)}).</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary Row */}
      <div className="mb-6 md:mb-10">
        <ReportSummaryCards stats={stats} dailyLimit={metadata?.dailyLimit} monthlyLimit={metadata?.monthlyLimit} />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-10">
        <div className="space-y-4 md:space-y-6">
          <CategoryDistributionChart data={categoryData} />
          
          <Suspense fallback={
            <div className="bento-card bg-slate-900 border-none shadow-2xl h-[200px] animate-pulse rounded-2xl flex flex-col items-center justify-center text-indigo-400/50">
              <div className="w-8 h-8 mb-3 rounded-full bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Đang phân tích AI...</span>
            </div>
          }>
            <ReportAIAdvisor />
          </Suspense>
        </div>

        <div>
          <MonthlyComparisonChart data={monthlyTrend} />
          <div className="mt-8 bento-card bg-white shadow-xl shadow-black/2 border border-border">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <Trophy className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Top 5 Giao dịch lớn nhất</h3>
            </div>
            
            <div className="space-y-3">
              {topTransactions && topTransactions.length > 0 ? (
                topTransactions.map((tx, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100 group">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-500 text-xs group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                      #{idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate">{tx.title}</p>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mt-0.5">{tx.category}</p>
                    </div>
                    <div className="font-bold text-rose-600 text-sm whitespace-nowrap">
                      {formatCurrency(tx.amount)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic text-center py-4">Chưa có giao dịch chi tiêu nào trong kỳ.</p>
              )}
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

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, CalendarRange } from 'lucide-react';

export default function MobileReportTabs() {
  const pathname = usePathname();
  const isGeneral = pathname === '/reports';
  const isMonthly = pathname === '/reports/monthly';

  return (
    <div className="md:hidden flex bg-slate-100 p-1 rounded-lg shadow-inner mb-4">
      <Link
        href="/reports"
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold text-center transition-all ${
          isGeneral
            ? 'bg-white text-aura-indigo shadow-sm'
            : 'text-slate-500 active:text-slate-800'
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        Báo cáo chung
      </Link>
      <Link
        href="/reports/monthly"
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold text-center transition-all ${
          isMonthly
            ? 'bg-white text-aura-indigo shadow-sm'
            : 'text-slate-500 active:text-slate-800'
        }`}
      >
        <CalendarRange className="w-4 h-4" />
        Chi tiêu tháng
      </Link>
    </div>
  );
}

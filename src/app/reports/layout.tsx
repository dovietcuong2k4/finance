import { Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import MobileReportTabs from './mobile-report-tabs';

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-none p-3 pt-3 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <MobileReportTabs />
      {children}

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

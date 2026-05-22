'use client';

import { Select, ConfigProvider } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { CalendarDays } from 'lucide-react';

export default function DashboardPeriodSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get('period') || 'this_month';

  const handlePeriodChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', value);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-3">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#6366f1',
            borderRadius: 10,
            controlHeight: 36,
            fontSize: 13,
          },
        }}
      >
        <Select
          value={currentPeriod}
          onChange={handlePeriodChange}
          className="w-40"
          options={[
            { value: 'this_week', label: 'Tuần này' },
            { value: 'last_week', label: 'Tuần trước' },
            { value: 'this_month', label: 'Tháng này' },
            { value: 'last_month', label: 'Tháng trước' },
            { value: 'this_year', label: 'Năm nay' },
          ]}
          suffixIcon={<CalendarDays className="w-3.5 h-3.5 text-slate-400" />}
          classNames={{ popup: { root: "overscroll-contain" }}}
        />
      </ConfigProvider>
    </div>
  );
}

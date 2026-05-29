'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import FinancialChart from './financial-chart';

interface Props {
  data: any[];
}

export default function DashboardChartSection({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = (searchParams.get('range') as 'recent' | 'month') || 'month';

  const handleRangeChange = (range: 'recent' | 'month') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('range', range);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <FinancialChart 
      data={data} 
      currentRange={currentRange} 
      onRangeChange={handleRangeChange} 
    />
  );
}

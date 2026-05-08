'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getUser } from '../auth/actions';
import { unstable_cache } from 'next/cache';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

async function fetchReportDataRaw(
  userId: string,
  period: 'this_month' | 'last_month' | 'this_year' | 'all_time' = 'this_month'
) {
  const supabase = createAdminClient();

  // Fetch transactions based on period
  let query = supabase
    .from('transactions')
    .select('amount, type, category, transaction_date, description')
    .eq('user_id', userId);

  if (period !== 'all_time') {
    let startDate = dayjs().tz().startOf('month');
    let endDate = dayjs().tz().endOf('month');

    if (period === 'last_month') {
      startDate = dayjs().tz().subtract(1, 'month').startOf('month');
      endDate = dayjs().tz().subtract(1, 'month').endOf('month');
    } else if (period === 'this_year') {
      startDate = dayjs().tz().startOf('year');
      endDate = dayjs().tz().endOf('year');
    }

    query = query.gte('transaction_date', startDate.format('YYYY-MM-DD'))
                 .lte('transaction_date', endDate.format('YYYY-MM-DD'));
  }

  const { data: transactions, error } = await query.order('transaction_date', { ascending: false });

  if (error || !transactions) {
    console.error('Error fetching transactions for report:', error);
    return null;
  }

  // 1. Category Distribution (Expenses only)
  const categoryMap = new Map<string, number>();
  transactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      const category = tx.category || 'Khác';
      categoryMap.set(category, (categoryMap.get(category) || 0) + Number(tx.amount));
    });

  const categoryData = Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // 2. Monthly Trend (Last 6 months)
  const monthlyTrend: any[] = Array.from({ length: 6 }, (_, i) => {
    const d = dayjs().tz().subtract(i, 'month');
    return {
      name: `Th ${d.month() + 1}`,
      month: d.format('YYYY-MM'),
      income: 0,
      expenses: 0
    };
  }).reverse();

  // Fetch only necessary columns for the trend
  const { data: allTxForTrend } = await supabase
    .from('transactions')
    .select('amount, type, transaction_date')
    .eq('user_id', userId)
    .gte('transaction_date', dayjs().tz().subtract(6, 'month').startOf('month').format('YYYY-MM-DD'));

  allTxForTrend?.forEach(tx => {
    const txMonth = dayjs.tz(tx.transaction_date).format('YYYY-MM');
    const monthData = monthlyTrend.find(m => m.month === txMonth);
    if (monthData) {
      if (tx.type === 'income') monthData.income += Number(tx.amount);
      else monthData.expenses += Number(tx.amount);
    }
  });

  // 3. Stats Summary
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  
  const largestExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((prev, curr) => (Number(prev?.amount || 0) > Number(curr.amount) ? prev : curr), transactions.find(t => t.type === 'expense') || null);

  const averageDaily = totalExpense / (period === 'this_month' ? dayjs().tz().date() : 30);

  return {
    categoryData,
    monthlyTrend,
    stats: {
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      savingsRate: totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0,
      largestExpense: largestExpense ? {
        amount: Number(largestExpense.amount),
        category: largestExpense.category,
        note: largestExpense.description
      } : null,
      averageDaily: Math.round(averageDaily)
    }
  };
}

export const getReportData = async (
  period: 'this_month' | 'last_month' | 'this_year' | 'all_time' = 'this_month'
) => {
  const user = await getUser();
  if (!user) return null;

  return unstable_cache(
    () => fetchReportDataRaw(user.id, period),
    [`reports-${user.id}-${period}`],
    {
      revalidate: 3600, // Cache for 1 hour
      tags: ['reports']
    }
  )();
};

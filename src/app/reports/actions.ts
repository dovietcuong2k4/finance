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

/** Calculate date range for report period */
function getReportDateRange(period: string) {
  if (period === 'all_time') return { startDate: null, endDate: null };

  let startDate = dayjs().tz().startOf('month');
  let endDate = dayjs().tz().endOf('month');

  if (period === 'last_month') {
    startDate = dayjs().tz().subtract(1, 'month').startOf('month');
    endDate = dayjs().tz().subtract(1, 'month').endOf('month');
  } else if (period === 'this_year') {
    startDate = dayjs().tz().startOf('year');
    endDate = dayjs().tz().endOf('year');
  }

  return {
    startDate: startDate.format('YYYY-MM-DD'),
    endDate: endDate.format('YYYY-MM-DD'),
  };
}

async function fetchReportDataRaw(
  userId: string,
  period: 'this_month' | 'last_month' | 'this_year' | 'all_time' = 'this_month'
) {
  const supabase = createAdminClient();
  const { startDate, endDate } = getReportDateRange(period);

  // Trend date range: last 6 months
  const trendStartDate = dayjs().tz().subtract(5, 'month').startOf('month').format('YYYY-MM-DD');
  const trendEndDate = dayjs().tz().endOf('month').format('YYYY-MM-DD');

  // ─── Run ALL queries in parallel ───
  const [categoryResult, trendResult, periodStatsResult, largestExpenseResult] = await Promise.all([
    // 1. Category distribution (RPC)
    supabase.rpc('get_category_distribution', {
      p_user_id: userId,
      ...(startDate ? { p_start_date: startDate } : {}),
      ...(endDate ? { p_end_date: endDate } : {}),
    }),
    // 2. Monthly trend — 6 months (RPC)
    supabase.rpc('get_monthly_chart', {
      p_user_id: userId,
      p_start_date: trendStartDate,
      p_end_date: trendEndDate,
    }),
    // 3. Period stats (RPC)
    startDate
      ? supabase.rpc('get_period_stats', {
          p_user_id: userId,
          p_start_date: startDate,
          p_end_date: endDate,
        })
      : supabase.rpc('get_balance', { p_user_id: userId }),
    // 4. Largest expense in period (single row query)
    (() => {
      let q = supabase
        .from('transactions')
        .select('amount, category, description, title')
        .eq('user_id', userId)
        .eq('type', 'expense')
        .or('exclude_from_limit.is.null,exclude_from_limit.eq.false')
        .order('amount', { ascending: false })
        .limit(5);
      if (startDate) q = q.gte('transaction_date', startDate);
      if (endDate) q = q.lte('transaction_date', endDate);
      return q;
    })(),
  ]);

  // ─── Handle errors ───
  if (categoryResult.error) {
    console.error('Error fetching category distribution:', categoryResult.error);
    return null;
  }
  if (trendResult.error) {
    console.error('Error fetching monthly trend:', trendResult.error);
    return null;
  }
  if (periodStatsResult.error) {
    console.error('Error fetching period stats:', periodStatsResult.error);
    return null;
  }

  // ─── Extract results ───

  // Category data
  const categoryData = (categoryResult.data || []).map((row: any) => ({
    name: row.name,
    value: Number(row.value),
  }));

  // Monthly trend — build 6-month skeleton, fill with RPC results
  const monthlyTrend: any[] = Array.from({ length: 6 }, (_, i) => {
    const d = dayjs().tz().subtract(i, 'month');
    return {
      name: `Th ${d.month() + 1}`,
      month: d.format('YYYY-MM'),
      income: 0,
      expenses: 0,
    };
  }).reverse();

  (trendResult.data || []).forEach((row: any) => {
    const monthData = monthlyTrend.find(m => m.month === row.month);
    if (monthData) {
      monthData.income = Number(row.income);
      monthData.expenses = Number(row.expenses);
    }
  });

  // Period stats
  const statsData = periodStatsResult.data?.[0] || { total_income: 0, total_expense: 0, limit_expense: 0 };
  const totalIncome = Number(statsData.total_income);
  const totalExpense = Number(statsData.total_expense);
  const limitExpense = statsData.limit_expense !== undefined ? Number(statsData.limit_expense) : totalExpense;

  // Largest expense
  const largestExpenseRow = largestExpenseResult.data?.[0] || null;

  const averageDaily = limitExpense / (period === 'this_month' ? dayjs().tz().date() : 30);
  const estimatedMonthlyExpense = averageDaily * (period === 'this_month' ? dayjs().tz().daysInMonth() : 30);

  return {
    categoryData,
    monthlyTrend,
    topTransactions: (largestExpenseResult.data || []).map((row: any) => ({
      amount: Number(row.amount),
      category: row.category,
      title: row.title,
      description: row.description,
    })),
    stats: {
      totalIncome,
      totalExpense,
      limitExpense,
      netSavings: totalIncome - totalExpense,
      savingsRate: totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0,
      largestExpense: largestExpenseRow ? {
        amount: Number(largestExpenseRow.amount),
        category: largestExpenseRow.category,
        title: largestExpenseRow.title,
        note: largestExpenseRow.description,
      } : null,
      averageDaily: Math.round(averageDaily),
      estimatedMonthlyExpense: Math.round(estimatedMonthlyExpense),
    },
  };
}

export const getReportData = async (
  period: 'this_month' | 'last_month' | 'this_year' | 'all_time' = 'this_month'
) => {
  const user = await getUser();
  if (!user) return null;

  const data = await unstable_cache(
    () => fetchReportDataRaw(user.id, period),
    [`reports-v2-${user.id}-${period}`],
    {
      revalidate: 300, // Cache for 5 minutes
      tags: ['reports'],
    }
  )();

  if (data) {
    return { ...data, metadata: user.metadata || {} };
  }
  return null;
};

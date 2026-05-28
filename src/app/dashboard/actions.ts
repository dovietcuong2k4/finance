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

/** Calculate the date range for a given period */
function getDateRange(period: string) {
  let startDate = dayjs().tz().startOf('month');
  let endDate = dayjs().tz().endOf('month');

  if (period === 'this_week') {
    startDate = dayjs().tz().startOf('week');
    endDate = dayjs().tz().endOf('week');
  } else if (period === 'last_week') {
    startDate = dayjs().tz().subtract(1, 'week').startOf('week');
    endDate = dayjs().tz().subtract(1, 'week').endOf('week');
  } else if (period === 'last_month') {
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

async function fetchDashboardDataRaw(
  userId: string,
  userEmail: string,
  userFullName: string,
  range: 'recent' | 'month' = 'recent',
  period: 'this_month' | 'this_week' | 'last_week' | 'last_month' | 'this_year' = 'this_month',
  userMetadata: Record<string, any> = {}
) {
  const supabase = createAdminClient();
  const { startDate, endDate } = getDateRange(period);

  // ─── Run ALL queries in parallel via Promise.all ───
  const chartStartDate = range === 'recent'
    ? dayjs().tz().subtract(5, 'month').startOf('month').format('YYYY-MM-DD')
    : dayjs().tz().startOf('month').format('YYYY-MM-DD');
  const chartEndDate = range === 'recent'
    ? dayjs().tz().endOf('month').format('YYYY-MM-DD')
    : dayjs().tz().endOf('month').format('YYYY-MM-DD');

  const [balanceResult, periodResult, recentResult, chartResult, categoryResult] = await Promise.all([
    // 1. All-time balance (RPC)
    supabase.rpc('get_balance', { p_user_id: userId }),
    // 2. Period stats (RPC)
    supabase.rpc('get_period_stats', {
      p_user_id: userId,
      p_start_date: startDate,
      p_end_date: endDate,
    }),
    // 3. Recent 5 transactions (tiny query)
    supabase
      .from('transactions')
      .select('id, amount, type, category, transaction_date, title, description, exclude_from_limit')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })
      .limit(5),
    // 4. Chart data (RPC — monthly or daily)
    range === 'recent'
      ? supabase.rpc('get_monthly_chart', {
          p_user_id: userId,
          p_start_date: chartStartDate,
          p_end_date: chartEndDate,
        })
      : supabase.rpc('get_daily_chart', {
          p_user_id: userId,
          p_start_date: chartStartDate,
          p_end_date: chartEndDate,
        }),
    // 5. Category distribution
    supabase.rpc('get_category_distribution', {
      p_user_id: userId,
      p_start_date: startDate,
      p_end_date: endDate,
    }),
  ]);

  // ─── Handle errors ───
  if (balanceResult.error) {
    console.error('Error fetching balance:', balanceResult.error);
    return null;
  }
  if (periodResult.error) {
    console.error('Error fetching period stats:', periodResult.error);
    return null;
  }
  if (recentResult.error) {
    console.error('Error fetching recent transactions:', recentResult.error);
    return null;
  }
  if (chartResult.error) {
    console.error('Error fetching chart data:', chartResult.error);
    return null;
  }
  if (categoryResult.error) {
    console.error('Error fetching categories data:', categoryResult.error);
    return null;
  }

  // ─── Extract results ───
  const balanceData = balanceResult.data?.[0] || { total_income: 0, total_expense: 0, balance: 0 };
  const periodData = periodResult.data?.[0] || { total_income: 0, total_expense: 0 };
  const recentTransactions = (recentResult.data || []).map(tx => ({
    ...tx,
    amount: Number(tx.amount),
  }));

  const totalIncome = Number(periodData.total_income);
  const totalExpense = Number(periodData.total_expense);
  const savings = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  // ─── Build chart data ───
  const chartRawData = chartResult.data || [];
  let chartData: any[] = [];

  if (range === 'recent') {
    // Build 6-month skeleton, fill with RPC results
    chartData = Array.from({ length: 6 }, (_, i) => {
      const d = dayjs().tz().subtract(i, 'month');
      return {
        name: `Th ${d.month() + 1}`,
        month: d.format('YYYY-MM'),
        income: 0,
        expenses: 0,
      };
    }).reverse();

    chartRawData.forEach((row: any) => {
      const monthData = chartData.find(m => m.month === row.month);
      if (monthData) {
        monthData.income = Number(row.income);
        monthData.expenses = Number(row.expenses);
      }
    });
  } else {
    // Build daily skeleton for current month, fill with RPC results
    const daysInMonth = dayjs().tz().daysInMonth();
    chartData = Array.from({ length: daysInMonth }, (_, i) => {
      const d = dayjs().tz().date(i + 1);
      return {
        name: d.format('DD/MM'),
        date: d.format('YYYY-MM-DD'),
        income: 0,
        expenses: 0,
      };
    });

    chartRawData.forEach((row: any) => {
      const dayData = chartData.find(d => d.date === row.day);
      if (dayData) {
        dayData.income = Number(row.income);
        dayData.expenses = Number(row.expenses);
      }
    });
  }

  const categoryDistribution = (categoryResult.data || []).map((row: any) => ({
    name: row.name,
    value: Number(row.value),
  }));

  return {
    user: {
      id: userId,
      email: userEmail,
      fullName: userFullName,
      metadata: userMetadata,
    },
    stats: {
      balance: Number(balanceData.balance),
      totalIncome,
      totalExpense,
      savings: Math.max(0, Math.round(savings)),
    },
    recentTransactions,
    chartData,
    categoryDistribution,
  };
}

export const getDashboardData = async (
  range: 'recent' | 'month' = 'recent',
  period: 'this_month' | 'this_week' | 'last_week' | 'last_month' | 'this_year' = 'this_month'
) => {
  const user = await getUser();
  if (!user) return null;

  return unstable_cache(
    () => fetchDashboardDataRaw(user.id, user.email, user.full_name || 'Admin', range, period, user.metadata || {}),
    [`dashboard-${user.id}-${range}-${period}`],
    {
      revalidate: 300, // Cache for 5 minutes for better freshness
      tags: ['dashboard'],
    }
  )();
};

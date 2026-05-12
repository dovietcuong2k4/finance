'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getUser } from '../auth/actions';
import { unstable_cache } from 'next/cache';
import { generateInsights, type Insight, type InsightData } from '@/lib/insights';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

/**
 * Gather all data needed for insight generation from Supabase,
 * then run the insight engine (LLM → rule-based fallback).
 */
async function fetchInsightsRaw(userId: string, userMetadata: Record<string, any>): Promise<Insight[]> {
  const supabase = createAdminClient();

  const now = dayjs().tz();
  const thisMonthStart = now.startOf('month').format('YYYY-MM-DD');
  const thisMonthEnd = now.endOf('month').format('YYYY-MM-DD');
  const lastMonthStart = now.subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
  const lastMonthEnd = now.subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
  const trend6mStart = now.subtract(5, 'month').startOf('month').format('YYYY-MM-DD');

  // ─── Run ALL queries in parallel ───
  const [
    balanceResult,
    thisMonthStats,
    lastMonthStats,
    thisMonthCategories,
    lastMonthCategories,
    trendResult,
  ] = await Promise.all([
    supabase.rpc('get_balance', { p_user_id: userId }),
    supabase.rpc('get_period_stats', {
      p_user_id: userId,
      p_start_date: thisMonthStart,
      p_end_date: thisMonthEnd,
    }),
    supabase.rpc('get_period_stats', {
      p_user_id: userId,
      p_start_date: lastMonthStart,
      p_end_date: lastMonthEnd,
    }),
    supabase.rpc('get_category_distribution', {
      p_user_id: userId,
      p_start_date: thisMonthStart,
      p_end_date: thisMonthEnd,
    }),
    supabase.rpc('get_category_distribution', {
      p_user_id: userId,
      p_start_date: lastMonthStart,
      p_end_date: lastMonthEnd,
    }),
    supabase.rpc('get_monthly_chart', {
      p_user_id: userId,
      p_start_date: trend6mStart,
      p_end_date: thisMonthEnd,
    }),
  ]);

  // Check for critical errors
  if (balanceResult.error || thisMonthStats.error || lastMonthStats.error) {
    console.error('Insight data fetch error:', {
      balance: balanceResult.error,
      thisMonth: thisMonthStats.error,
      lastMonth: lastMonthStats.error,
    });
    return [];
  }

  // ─── Build InsightData ───
  const balanceData = balanceResult.data?.[0] || { balance: 0 };
  const thisStats = thisMonthStats.data?.[0] || { total_income: 0, total_expense: 0, limit_expense: 0 };
  const lastStats = lastMonthStats.data?.[0] || { total_income: 0, total_expense: 0, limit_expense: 0 };

  const thisCategories = (thisMonthCategories.data || []).map((r: any) => ({
    name: r.name,
    value: Number(r.value),
  }));
  const lastCategories = (lastMonthCategories.data || []).map((r: any) => ({
    name: r.name,
    value: Number(r.value),
  }));

  // Build 6-month trend
  const trendRaw = trendResult.data || [];
  const trend6m = Array.from({ length: 6 }, (_, i) => {
    const d = now.subtract(i, 'month');
    return {
      month: d.format('YYYY-MM'),
      income: 0,
      expenses: 0,
    };
  }).reverse();

  trendRaw.forEach((row: any) => {
    const monthData = trend6m.find((m) => m.month === row.month);
    if (monthData) {
      monthData.income = Number(row.income);
      monthData.expenses = Number(row.expenses);
    }
  });

  const insightData: InsightData = {
    currentMonth: {
      totalIncome: Number(thisStats.total_income),
      totalExpense: Number(thisStats.total_expense),
      limitExpense: Number(thisStats.limit_expense ?? thisStats.total_expense),
      categories: thisCategories,
    },
    lastMonth: {
      totalIncome: Number(lastStats.total_income),
      totalExpense: Number(lastStats.total_expense),
      limitExpense: Number(lastStats.limit_expense ?? lastStats.total_expense),
      categories: lastCategories,
    },
    trend6m,
    balance: Number(balanceData.balance),
    daysInMonth: now.daysInMonth(),
    currentDay: now.date(),
    monthlyLimit: Number(userMetadata?.monthlyLimit || 0),
    dailyLimit: Number(userMetadata?.dailyLimit || 0),
  };

  return generateInsights(insightData);
}

/**
 * Public server action: get AI insights for the current user.
 * Cached for 1 hour per user, invalidated when transactions change.
 */
export async function getInsights(): Promise<Insight[]> {
  const user = await getUser();
  if (!user) return [];

  return unstable_cache(
    () => fetchInsightsRaw(user.id, user.metadata || {}),
    [`insights-${user.id}`],
    {
      revalidate: 3600 * 6, // Cache for 1 hour
      tags: ['insights'],
    }
  )();
}

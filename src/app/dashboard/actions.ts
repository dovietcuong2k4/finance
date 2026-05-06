'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import dayjs from 'dayjs';
import { getUser } from '../auth/actions';

export async function getDashboardData() {
  const user = await getUser();
  if (!user) return null;

  const supabase = createAdminClient();

  // Fetch all transactions for stats
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false });

  if (error || !transactions) {
    console.error('Error fetching transactions:', error);
    return null;
  }

  // Basic Stats
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
    
  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
    
  const balance = totalIncome - totalExpense;
  const savings = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  // Chart Data (Last 6 months)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = dayjs().subtract(i, 'month');
    return {
      name: `Th ${d.month() + 1}`,
      month: d.format('YYYY-MM'),
      income: 0,
      expenses: 0
    };
  }).reverse();

  transactions.forEach(tx => {
    const txMonth = dayjs(tx.transaction_date).format('YYYY-MM');
    const monthData = last6Months.find(m => m.month === txMonth);
    if (monthData) {
      if (tx.type === 'income') monthData.income += Number(tx.amount);
      else monthData.expenses += Number(tx.amount);
    }
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name || 'Admin',
    },
    stats: {
      balance,
      totalIncome,
      totalExpense,
      savings: Math.max(0, Math.round(savings))
    },
    recentTransactions: transactions.slice(0, 5),
    chartData: last6Months,
  };
}

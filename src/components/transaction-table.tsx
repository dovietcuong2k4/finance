import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getCategoryIcon, getCategoryColor } from '@/constants/categories';
import Link from 'next/link';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

interface Transaction {
  id: string | number;
  title: string;
  category: string;
  amount: number;
  transaction_date: string;
  type: 'income' | 'expense';
}

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {

  const formatCurrency = (amount: number, type: 'income' | 'expense') => {
    const formatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    return type === 'income' ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className="bento-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base md:text-lg font-bold">Giao dịch gần đây</h3>
        <Link href={'/transactions'} className="text-xs font-bold text-aura-indigo hover:underline">Xem tất cả</Link>
      </div>
      
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">Chưa có giao dịch nào</div>
        ) : (
          transactions.map((tx) => {
            const Icon = getCategoryIcon(tx.category);
            const colorClass = getCategoryColor(tx.category);
            return (
              <div key={tx.id} className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors duration-200">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{tx.title}</p>
                    <p className="text-xs text-muted-foreground uppercase text-[10px] tracking-wider">{tx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-foreground'}`}>
                    {formatCurrency(tx.amount, tx.type)}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-tight font-medium">
                    {dayjs.tz(tx.transaction_date).format('DD [Th] MM, YYYY')}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionTable;

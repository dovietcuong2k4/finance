import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShoppingBag, 
  Coffee, 
  Home, 
  Car,
  MoreHorizontal
} from 'lucide-react';

const transactions = [
  {
    id: 1,
    name: 'Apple Store',
    category: 'Công nghệ',
    amount: '-1.250.000đ',
    date: '24 Th 05, 2026',
    status: 'completed',
    icon: ShoppingBag,
    color: 'bg-slate-100 text-slate-700'
  },
  {
    id: 2,
    name: 'Starbucks Coffee',
    category: 'Ăn uống',
    amount: '-85.000đ',
    date: '24 Th 05, 2026',
    status: 'completed',
    icon: Coffee,
    color: 'bg-emerald-100 text-emerald-700'
  },
  {
    id: 3,
    name: 'Lương tháng 5',
    category: 'Thu nhập',
    amount: '+18.000.000đ',
    date: '23 Th 05, 2026',
    status: 'completed',
    icon: ArrowUpRight,
    color: 'bg-indigo-100 text-indigo-700'
  },
  {
    id: 4,
    name: 'Tiền thuê nhà',
    category: 'Nhà ở',
    amount: '-5.000.000đ',
    date: '21 Th 05, 2026',
    status: 'pending',
    icon: Home,
    color: 'bg-amber-100 text-amber-700'
  }
];

const TransactionTable = () => {
  return (
    <div className="bento-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Giao dịch gần đây</h3>
        <button className="text-xs font-bold text-aura-indigo hover:underline">Xem tất cả</button>
      </div>
      
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors duration-200">
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-xl ${tx.color} group-hover:scale-110 transition-transform duration-300`}>
                <tx.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{tx.name}</p>
                <p className="text-xs text-muted-foreground">{tx.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-bold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-foreground'}`}>
                {tx.amount}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-tight font-medium">{tx.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionTable;

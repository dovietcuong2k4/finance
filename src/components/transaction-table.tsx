import React from 'react';
import { ShoppingCart, Coffee, Car, Home, Utensils } from 'lucide-react';

const transactions = [
  { id: 1, name: 'Siêu thị CoopMart', category: 'Mua sắm', amount: '-1,200,000đ', date: 'Hôm nay', icon: ShoppingCart, color: 'text-blue-500 bg-blue-50' },
  { id: 2, name: 'Starbucks Coffee', category: 'Ăn uống', amount: '-85,000đ', date: 'Hôm qua', icon: Coffee, color: 'text-orange-500 bg-orange-50' },
  { id: 3, name: 'Grab Ride', category: 'Di chuyển', amount: '-42,000đ', date: '25 Th04', icon: Car, color: 'text-green-500 bg-green-50' },
  { id: 4, name: 'Thanh toán tiền điện', category: 'Nhà cửa', amount: '-850,000đ', date: '24 Th04', icon: Home, color: 'text-purple-500 bg-purple-50' },
  { id: 5, name: 'Phở Lý Quốc Sư', category: 'Ăn uống', amount: '-65,000đ', date: '23 Th04', icon: Utensils, color: 'text-orange-500 bg-orange-50' },
];

export default function TransactionTable() {
  return (
    <div className="corporate-card overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Giao dịch gần đây</h3>
        <button className="text-sm font-semibold text-primary hover:underline">Xem tất cả</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-6 py-3 text-xs font-bold text-secondary uppercase tracking-wider">Giao dịch</th>
              <th className="px-6 py-3 text-xs font-bold text-secondary uppercase tracking-wider">Danh mục</th>
              <th className="px-6 py-3 text-xs font-bold text-secondary uppercase tracking-wider">Ngày</th>
              <th className="px-6 py-3 text-xs font-bold text-secondary uppercase tracking-wider text-right">Số tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-muted/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${t.color} group-hover:scale-110 transition-transform`}>
                      <t.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{t.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-secondary">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-secondary">
                  {t.date}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-foreground text-right">
                  {t.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

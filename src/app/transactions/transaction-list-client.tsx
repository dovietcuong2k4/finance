'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
  ArrowUpRight,
  Coffee,
  ShoppingBag,
  Home,
  Car,
  MoreHorizontal,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { deleteTransaction } from './actions';
import { toast } from 'react-hot-toast';
import { EditTransactionModal, TransactionData } from '@/components/add-transaction-modal';

dayjs.locale('vi');

interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  transaction_date: string;
  type: 'income' | 'expense';
  description?: string;
}

interface Props {
  transactions: Transaction[];
  total: number;
  totalPages: number;
  currentPage: number;
  currentType?: 'income' | 'expense';
  currentSearch: string;
}

const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'food': return Coffee;
    case 'shopping': return ShoppingBag;
    case 'utilities': return Home;
    case 'transport': return Car;
    case 'salary': return ArrowUpRight;
    default: return MoreHorizontal;
  }
};

const getCategoryColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'food': return 'bg-emerald-100 text-emerald-700';
    case 'shopping': return 'bg-amber-100 text-amber-700';
    case 'utilities': return 'bg-blue-100 text-blue-700';
    case 'transport': return 'bg-violet-100 text-violet-700';
    case 'salary': return 'bg-indigo-100 text-indigo-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function TransactionListClient({
  transactions,
  total,
  totalPages,
  currentPage,
  currentType,
  currentSearch,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(currentSearch);
  const [isPending, startTransition] = useTransition();
  const [editingTx, setEditingTx] = useState<TransactionData | null>(null);

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    if (currentType) params.set('type', currentType);
    if (currentSearch) params.set('search', currentSearch);
    params.set('page', String(currentPage));

    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    if ('type' in updates || 'search' in updates) {
      params.set('page', '1');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: search || undefined });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) return;
    startTransition(async () => {
      const result = await deleteTransaction(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Đã xóa giao dịch');
        router.refresh();
      }
    });
  };

  const typeFilters = [
    { label: 'Tất cả', value: undefined },
    { label: 'Thu nhập', value: 'income' as const },
    { label: 'Chi tiêu', value: 'expense' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Edit Modal (shared component) */}
      <EditTransactionModal
        transaction={editingTx}
        open={!!editingTx}
        onClose={() => setEditingTx(null)}
        onSaved={() => {
          setEditingTx(null);
          router.refresh();
        }}
      />

      {/* Filters & Search Bar */}
      <div className="bento-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm giao dịch..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-aura-indigo/5 focus:border-aura-indigo transition-all"
            />
          </form>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {typeFilters.map((filter) => (
              <button
                key={filter.label}
                onClick={() => updateParams({ type: filter.value })}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                  currentType === filter.value
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bento-card p-0 overflow-hidden">
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="col-span-5">Giao dịch</div>
          <div className="col-span-2">Danh mục</div>
          <div className="col-span-2">Ngày</div>
          <div className="col-span-2 text-right">Số tiền</div>
          <div className="col-span-1"></div>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-4xl mb-3">📭</div>
            <p className="font-medium">Chưa có giao dịch nào</p>
            <p className="text-xs mt-1">Hãy thêm giao dịch đầu tiên của bạn!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx) => {
              const Icon = getCategoryIcon(tx.category);
              const colorClass = getCategoryColor(tx.category);
              return (
                <div
                  key={tx.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-slate-50/50 transition-colors duration-150 group"
                >
                  <div className="col-span-12 sm:col-span-5 flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${colorClass} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{tx.title}</p>
                      {tx.description && (
                        <p className="text-[11px] text-muted-foreground truncate">{tx.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="hidden sm:block col-span-2">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
                      {tx.category}
                    </span>
                  </div>

                  <div className="hidden sm:block col-span-2">
                    <p className="text-xs text-muted-foreground font-medium">
                      {dayjs(tx.transaction_date).format('DD/MM/YYYY')}
                    </p>
                  </div>

                  <div className="col-span-8 sm:col-span-2 text-right">
                    <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-foreground'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                  </div>

                  <div className="col-span-4 sm:col-span-1 flex justify-end gap-1">
                    <button
                      onClick={() => setEditingTx(tx as TransactionData)}
                      className="p-2 text-slate-400 hover:text-aura-indigo hover:bg-indigo-50 rounded-lg transition-all duration-200"
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      disabled={isPending}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Xóa giao dịch"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-medium">
            Trang <span className="font-bold text-foreground">{currentPage}</span> / {totalPages}
            <span className="ml-2 text-slate-300">·</span>
            <span className="ml-2">{total} giao dịch</span>
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => updateParams({ page: String(currentPage - 1) })}
              disabled={currentPage <= 1}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce<(number | 'dots')[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('dots');
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === 'dots' ? (
                  <span key={`dots-${i}`} className="px-2 text-slate-300 text-sm">···</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => updateParams({ page: String(item) })}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                      currentPage === item
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => updateParams({ page: String(currentPage + 1) })}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { deleteTransaction } from './actions';
import { toast } from 'react-hot-toast';
import { DatePicker, ConfigProvider, Modal } from 'antd';
import { EditTransactionModal, TransactionData, default as AddTransactionModal } from '@/components/add-transaction-modal';
import { getCategoryIcon, getCategoryColor, getCategoryByValue } from '@/constants/categories';

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
  currentCategory?: string;
  currentStartDate?: string;
  currentEndDate?: string;
}

const { RangePicker } = DatePicker;

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
  currentCategory,
  currentStartDate,
  currentEndDate,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(currentSearch);
  const [isPending, startTransition] = useTransition();
  const [editingTx, setEditingTx] = useState<TransactionData | null>(null);

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams();

    // Set current values first
    if (currentType) params.set('type', currentType);
    if (currentSearch) params.set('search', currentSearch);
    if (currentCategory) params.set('category', currentCategory);
    if (currentStartDate) params.set('startDate', currentStartDate);
    if (currentEndDate) params.set('endDate', currentEndDate);
    params.set('page', String(currentPage));

    // Apply updates
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    // Reset page to 1 if any filter (besides page itself) changes
    const filterKeys = ['type', 'search', 'category', 'startDate', 'endDate'];
    if (Object.keys(updates).some(key => filterKeys.includes(key))) {
      params.set('page', '1');
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: search || undefined });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xóa giao dịch?',
      icon: <Trash2 className="w-6 h-6 text-red-500 mb-2 me-2" />,
      content: 'Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa giao dịch này không?',
      okText: 'Xóa ngay',
      cancelText: 'Hủy',
      okButtonProps: {
        danger: true,
        className: 'bg-red-500 hover:bg-red-600! border-none h-10! px-6! font-bold rounded-xl!'
      },
      cancelButtonProps: {
        className: 'h-10! px-6! font-bold rounded-xl! border-slate-200'
      },
      centered: true,
      mask: { closable: true },
      onOk: () => {
        return new Promise((resolve) => {
          startTransition(async () => {
            const result = await deleteTransaction(id);
            if (result.error) {
              toast.error(result.error);
            } else {
              toast.success('Đã xóa giao dịch');
              router.refresh();
            }
            resolve(true);
          });
        });
      },
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

      {/* Modern Horizontal Header (Dashboard Style) */}
      <div className="flex flex-col gap-6 mb-8 pt-6 md:pt-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="shrink-0">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Giao dịch</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Quản lý thu chi · <span className="font-semibold text-foreground">{total}</span> bản ghi
            </p>
          </div>

          <div className="flex-1 flex items-center gap-3 max-w-4xl">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm giao dịch..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-4 focus:ring-aura-indigo/5 focus:border-aura-indigo transition-all"
              />
            </form>

            <AddTransactionModal />
          </div>
        </div>

        {/* Filters Row */}
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#6366f1',
              borderRadius: 12,
              fontFamily: 'inherit',
            },
            components: {
              DatePicker: { controlHeight: 36, fontSize: 13 },
            }
          }}
        >
          <div className="flex flex-wrap items-center gap-3 p-3 bg-white/50 border border-slate-100 rounded-2xl shadow-sm backdrop-blur-sm">
            {/* Type Toggle */}
            <div className="w-full md:w-auto flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {typeFilters.map((filter) => (
                <button
                  key={filter.label}
                  onClick={() => updateParams({ type: filter.value })}
                  className={`w-full md:w-auto px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${currentType === filter.value
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block" />

            {/* Date Range Filter */}
            <div className="w-full md:w-auto flex items-center gap-2 justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Từ:</span>
              <DatePicker
                className="w-32 md:w-36"

                placeholder="Ngày bắt đầu"
                format="DD/MM/YYYY"
                value={currentStartDate ? dayjs(currentStartDate) : undefined}
                onChange={(date) => {
                  updateParams({ startDate: date ? date.format('YYYY-MM-DD') : undefined });
                }}
              />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">đến</span>
              <DatePicker
                className="w-32 md:w-36"
                placeholder="Ngày kết thúc"
                format="DD/MM/YYYY"
                value={currentEndDate ? dayjs(currentEndDate) : undefined}
                onChange={(date) => {
                  updateParams({ endDate: date ? date.format('YYYY-MM-DD') : undefined });
                }}
              />
            </div>
          </div>
        </ConfigProvider>
      </div>

      {/* Transaction List Table */}
      <div className={`bento-card p-2! md:p-6! overflow-hidden border-none shadow-xl shadow-slate-200/50 transition-opacity duration-300 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="hidden sm:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          <div className="col-span-3">Giao dịch</div>
          <div className="col-span-2">Danh mục</div>
          <div className="col-span-2">Ngày thực hiện</div>
          <div className="col-span-2">Ghi chú</div>
          <div className="col-span-2 text-right">Số tiền</div>
          <div className="col-span-1"></div>
        </div>

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground bg-slate-50/30">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-5xl mb-6 animate-bounce duration-3000">
              📭
            </div>
            <p className="text-lg font-bold text-slate-900">Chưa có giao dịch nào</p>
            <p className="text-sm mt-2 opacity-70">Hãy thêm giao dịch đầu tiên để bắt đầu quản lý tài chính!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {transactions.map((tx) => {
              const Icon = getCategoryIcon(tx.category);
              const colorClass = getCategoryColor(tx.category);
              return (
                <div
                  key={tx.id}
                  className="grid grid-cols-12 gap-2 px-4 py-3 md:gap-4 items-center md:px-8 md:py-5 hover:bg-slate-50/50 transition-all duration-200 group"
                >
                  {/* Title + Icon */}
                  <div className="col-span-12 sm:col-span-3 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-2xl ${colorClass} flex items-center justify-center shrink-0 shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{tx.title}</p>
                      <p className="md:hidden text-xs text-slate-500 truncate">{tx.description}</p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="hidden sm:block col-span-2">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
                      {getCategoryByValue(tx.category).label}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="hidden sm:block col-span-2">
                    <p className="text-sm text-slate-500 font-medium">
                      {dayjs(tx.transaction_date).format('DD MMM, YYYY')}
                    </p>
                  </div>

                  {/* Description Column (Position 4) */}
                  <div className="hidden sm:block col-span-2">
                    <p className="text-sm text-slate-400 truncate pr-4" title={tx.description || ''}>
                      {tx.description || '—'}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="col-span-8 sm:col-span-2 text-right">
                    <p className={`text-base font-bold tracking-tight ${tx.type === 'income' ? 'text-green-600' : 'text-red-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="col-span-4 sm:col-span-1 flex justify-end gap-1">
                    <button
                      onClick={() => setEditingTx(tx as TransactionData)}
                      className="p-2.5 text-slate-300 hover:text-aura-indigo hover:bg-indigo-50 rounded-xl transition-all duration-200"
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      disabled={isPending}
                      className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50"
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
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between mt-8 px-2">
          <p className="text-sm text-slate-400 font-medium">
            Trang <span className="font-bold text-slate-900">{currentPage}</span> trên {totalPages}
            <span className="mx-2 text-slate-200">|</span>
            Tổng <span className="font-bold text-slate-900">{total}</span> giao dịch
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => updateParams({ page: String(currentPage - 1) })}
              disabled={currentPage <= 1}
              className="w-10 h-10 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="hidden md:flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | 'dots')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('dots');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === 'dots' ? (
                    <span key={`dots-${i}`} className="px-2 text-slate-300">•••</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => updateParams({ page: String(item) })}
                      className={`w-10 h-10 rounded-2xl text-sm font-bold transition-all ${currentPage === item
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                    >
                      {item}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => updateParams({ page: String(currentPage + 1) })}
              disabled={currentPage >= totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { DatePicker, Select, ConfigProvider, Segmented } from 'antd';
import dayjs from 'dayjs';
import { getMonthlyExpenses } from '@/app/reports/actions';
import { categorySelectOptions, getCategoryColor, getCategoryIcon, getCategoryByValue } from '@/constants/categories';
import { Calendar, Layers, SearchX } from 'lucide-react';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export default function MonthlyExpenseReport() {
  const [filterType, setFilterType] = useState<'month' | 'day'>('month');
  const [month, setMonth] = useState<dayjs.Dayjs>(dayjs());
  const [day, setDay] = useState<dayjs.Dayjs>(dayjs());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'date_desc' | 'amount_asc' | 'amount_desc'>('date_desc');
  
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      const { data, total: sum } = await getMonthlyExpenses(
        month.format('YYYY-MM'), 
        selectedCategories,
        filterType === 'day' ? day.format('YYYY-MM-DD') : undefined
      );
      if (isMounted) {
        setExpenses(data);
        setTotal(sum);
        setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [month, day, filterType, selectedCategories]);

  return (
    <div className="space-y-6">
      {/* Filters and Total Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bento-card bg-white border border-slate-100 shadow-sm p-4 md:p-6 flex flex-col justify-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Bộ lọc dữ liệu
          </h3>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#6366f1',
                borderRadius: 12,
                controlHeight: 40,
              },
            }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="w-full sm:w-auto">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Kiểu lọc</p>
                  <Segmented
                    block
                    options={[
                      { label: 'Theo Tháng', value: 'month', className: 'flex-1' },
                      { label: 'Theo Ngày', value: 'day', className: 'flex-1' }
                    ]}
                    value={filterType}
                    onChange={(val) => setFilterType(val as 'month' | 'day')}
                    className="w-full sm:w-auto"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Tháng</p>
                  <DatePicker 
                    picker="month"
                    value={month}
                    onChange={(val) => val && setMonth(val)}
                    format="MM/YYYY"
                    className="w-full"
                    allowClear={false}
                    disabled={filterType === 'day'}
                  />
                </div>
                <div className="w-full sm:w-48">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Ngày</p>
                  <DatePicker 
                    value={day}
                    onChange={(val) => val && setDay(val)}
                    format="DD/MM/YYYY"
                    className="w-full"
                    allowClear={false}
                    disabled={filterType === 'month'}
                  />
                </div>
              </div>
              <div className="w-full">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Danh mục (chọn nhiều)</p>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Tất cả danh mục"
                  value={selectedCategories}
                  onChange={(vals) => setSelectedCategories(vals)}
                  className="w-full"
                  options={categorySelectOptions}
                  maxTagCount="responsive"
                  classNames={{ popup: { root: "overscroll-contain" }}}
                />
              </div>
            </div>
          </ConfigProvider>
        </div>

        <div className="bento-card br-white border-none shadow-xl shadow-indigo-500/20 p-6 flex flex-col justify-center text-white">
          <h3 className="text-indigo-500 text-sm font-medium mb-1">Tổng chi tiêu</h3>
          <p className="text-3xl font-bold tracking-tight text-gray-800">
            {formatCurrency(total)}
          </p>
          <div className="mt-4 flex items-center gap-2 text-indigo-500 text-xs font-medium">
            <Calendar className="w-4 h-4" />
            <span>{filterType === 'month' ? `Tháng ${month.format('MM/YYYY')}` : `Ngày ${day.format('DD/MM/YYYY')}`}</span>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="bento-card bg-white border border-slate-100 shadow-sm p-0 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-800">Danh sách giao dịch</h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {expenses.length} giao dịch
            </span>
          </div>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#6366f1',
                borderRadius: 12,
              },
            }}
          >
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-bold text-slate-500 uppercase">Sắp xếp:</span>
              <Segmented
                options={[
                  { label: 'Mới nhất', value: 'date_desc' },
                  { label: 'Tăng dần', value: 'amount_asc' },
                  { label: 'Giảm dần', value: 'amount_desc' },
                ]}
                value={sortOrder}
                onChange={(val) => setSortOrder(val as any)}
                className="text-xs font-medium"
              />
            </div>
          </ConfigProvider>
        </div>

        <div className={`transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          {expenses.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <SearchX className="w-12 h-12 mb-4 text-slate-300" />
              <p className="text-sm font-medium">Không tìm thấy giao dịch nào</p>
              <p className="text-xs mt-1 text-slate-400">Thử thay đổi bộ lọc hoặc tháng khác</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {[...expenses].sort((a, b) => {
                if (sortOrder === 'amount_asc') return Number(a.amount) - Number(b.amount);
                if (sortOrder === 'amount_desc') return Number(b.amount) - Number(a.amount);
                return dayjs(b.transaction_date).valueOf() - dayjs(a.transaction_date).valueOf();
              }).map((tx) => {
                const Icon = getCategoryIcon(tx.category);
                const colorClass = getCategoryColor(tx.category);
                
                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 md:px-6 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center shrink-0`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{tx.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {getCategoryByValue(tx.category).label}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-xs text-slate-400 truncate">
                            {dayjs(tx.transaction_date).format('DD/MM/YYYY')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-bold text-rose-600">
                        -{formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

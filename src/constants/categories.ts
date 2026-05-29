import {
  Coffee,
  Car,
  Home,
  Gamepad2,
  AlertCircle,
  ArrowUpRight,
  Gift,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export interface CategoryItem {
  value: string;
  label: string;
  icon: LucideIcon;
  className: string;
  type: 'income' | 'expense';
}

export const CATEGORIES: CategoryItem[] = [
  // 1. Chi tiêu (túi tiền) - Mức độ quan trọng tăng dần từ trên xuống dưới
  { value: 'development',           label: 'Phát triển',             icon: Sparkles,       className: 'bg-indigo-100 text-indigo-700',      type: 'expense' },
  { value: 'entertainment_shopping', label: 'Mua sắm & Giải trí',     icon: Gamepad2,       className: 'bg-pink-100 text-pink-700',          type: 'expense' },
  { value: 'unexpected_expenses',    label: 'Chi phí phát sinh',       icon: AlertCircle,    className: 'bg-slate-100 text-slate-700',        type: 'expense' },
  { value: 'transportation',        label: 'Di chuyển',              icon: Car,            className: 'bg-violet-100 text-violet-700',      type: 'expense' },
  { value: 'food_beverage',         label: 'Ăn uống',                icon: Coffee,         className: 'bg-emerald-100 text-emerald-700',    type: 'expense' },
  { value: 'housing_fixed_costs',   label: 'Nhà cửa & Chi phí cố định', icon: Home,           className: 'bg-blue-100 text-blue-700',          type: 'expense' },

  // 2. Thu nhập
  { value: 'salary',                label: 'Lương',                  icon: ArrowUpRight,   className: 'bg-green-100 text-green-700',        type: 'income' },
  { value: 'bonus',                 label: 'Thưởng',                 icon: Gift,           className: 'bg-amber-100 text-amber-700',        type: 'income' },
];

/** Lookup helpers */
export const getCategoryByValue = (value: string): CategoryItem =>
  CATEGORIES.find(c => c.value === value) ?? CATEGORIES[CATEGORIES.length - 1];

export const getCategoryIcon = (value: string): LucideIcon =>
  getCategoryByValue(value).icon;

export const getCategoryColor = (value: string): string =>
  getCategoryByValue(value).className;

export const getExpenseCategories = () => CATEGORIES.filter(c => c.type === 'expense');
export const getIncomeCategories = () => CATEGORIES.filter(c => c.type === 'income');

/** For antd Select options (value + label only) */
export const categorySelectOptions = CATEGORIES.map(({ value, label }) => ({ value, label }));

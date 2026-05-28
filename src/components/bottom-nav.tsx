'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  User,
  Plus
} from 'lucide-react';
import AddTransactionModal from './add-transaction-modal';

const menuItems = [
  { icon: LayoutDashboard, label: 'Tổng quan', href: '/' },
  { icon: Wallet, label: 'Giao dịch', href: '/transactions' },
  { icon: PieChart, label: 'Báo cáo', href: '/reports' },
  { icon: User, label: 'Tài khoản', href: '/account' },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide bottom nav on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  if (isAuthPage) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] pb-[env(safe-area-inset-bottom)]">
      <nav className="flex items-center justify-around px-2 h-16 relative">
        {menuItems.slice(0, 2).map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${isActive
                ? 'text-aura-indigo'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              <item.icon
                className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] tracking-wide transition-all ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Plus Button (Floating) */}
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="absolute">
            <AddTransactionModal
              trigger={
                <button
                  type="button"
                  className="flex items-center justify-center w-12 h-12 bg-aura-indigo text-white rounded-full shadow-[0_4px_20px_rgba(79,70,229,0.4)] hover:bg-aura-indigo/90 transition-transform active:scale-95 duration-200 border-none outline-none"
                >
                  <Plus className="w-6 h-6" strokeWidth={2.5} />
                </button>
              }
            />
          </div>
        </div>

        {menuItems.slice(2).map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${isActive
                ? 'text-aura-indigo'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              <item.icon
                className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] tracking-wide transition-all ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

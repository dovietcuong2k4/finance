'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  User
} from 'lucide-react';

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
      <nav className="flex items-center justify-around px-2 h-16">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${
                isActive 
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

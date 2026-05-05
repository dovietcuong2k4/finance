'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  Settings, 
  User,
  Shield,
  LogOut
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Bảng điều khiển', href: '/' },
  { icon: Wallet, label: 'Giao dịch', href: '/transactions' },
  { icon: PieChart, label: 'Báo cáo', href: '/reports' },
  { icon: User, label: 'Tài khoản', href: '/account' },
  { icon: Settings, label: 'Cài đặt', href: '/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();

  // Hide sidebar on auth pages
  if (pathname === '/login' || pathname === '/signup') return null;

  return (
    <aside className="w-64 border-r border-border h-screen flex flex-col bg-card sticky top-0">
      <div className="p-6 mb-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Aura</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="p-4 bg-muted/50 rounded-2xl border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
            <div>
              <p className="text-xs font-bold truncate w-24">Admin User</p>
              <p className="text-[10px] text-muted-foreground">Pro Member</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors">
            <LogOut className="w-3 h-3" />
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

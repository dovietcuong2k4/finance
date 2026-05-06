'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  Settings, 
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { signOut } from '@/app/auth/actions';

const menuItems = [
  { icon: LayoutDashboard, label: 'Bảng điều khiển', href: '/' },
  { icon: Wallet, label: 'Giao dịch', href: '/transactions' },
  { icon: PieChart, label: 'Báo cáo', href: '/reports' },
  { icon: User, label: 'Tài khoản', href: '/account' },
  { icon: Settings, label: 'Cài đặt', href: '/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on navigation on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Hide sidebar on auth pages - Move this AFTER all hooks
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  if (isAuthPage) return null;

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-white z-40 sticky top-0 shadow-sm shadow-black/[0.02]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden relative shadow-sm">
            <Image src="/logo.png" alt="Aura Logo" fill className="object-cover" />
          </div>
          <span className="font-bold text-lg tracking-tight">Aura</span>
        </Link>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay background for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop Sidebar & Mobile Overlay */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-6 mb-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20 relative">
              <Image src="/logo.png" alt="Aura Logo" fill className="object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight">Aura</span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
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
              <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse overflow-hidden relative">
                {/* Optional avatar */}
                <User className="w-full h-full p-2 text-slate-400" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">Admin User</p>
                <p className="text-[10px] text-muted-foreground">Pro Member</p>
              </div>
            </div>
            <form action={signOut}>
              <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors">
                <LogOut className="w-3 h-3" />
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

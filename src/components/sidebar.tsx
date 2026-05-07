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
  LogOut
} from 'lucide-react';
import { signOut, getUser, updateAvatarUrl } from '@/app/auth/actions';
import { toast } from 'react-hot-toast';

const menuItems = [
  { icon: LayoutDashboard, label: 'Bảng điều khiển', href: '/' },
  { icon: Wallet, label: 'Giao dịch', href: '/transactions' },
  { icon: PieChart, label: 'Báo cáo', href: '/reports' },
  { icon: User, label: 'Tài khoản', href: '/account' },
  { icon: Settings, label: 'Cài đặt', href: '/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUserData(user);
    };
    fetchUser();
  }, []);

  // Hide sidebar on auth pages - Move this AFTER all hooks
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  if (isAuthPage) return null;

  return (
    <>
      <aside className="hidden md:flex inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex-col">
        <div className="p-6 mb-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/20 relative">
              <Image src="/logo.png" alt="Aura Logo" fill className="object-cover" />
            </div>
            <span className="font-bold text-lg tracking-tight">Aura</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10' 
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <item.icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 mt-auto">
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0 border-2 border-white shadow-sm relative">
                {userData?.avatar_url ? (
                  <Image src={userData.avatar_url} alt="Avatar" fill className="object-cover" />
                ) : (
                  <User className="w-full h-full p-2 text-slate-400" />
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate text-slate-900">
                  {userData?.full_name || userData?.email?.split('@')[0] || 'Đang tải...'}
                </p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Thành viên</p>
              </div>
            </div>
            <form action={signOut}>
              <button className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-500 hover:bg-red-50 py-2 rounded-xl transition-all duration-200">
                <LogOut className="w-3.5 h-3.5" />
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

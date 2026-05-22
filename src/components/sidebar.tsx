'use client';

import { useState, useEffect } from 'react';
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
  ChevronDown,
  BarChart3,
  CalendarRange,
  type LucideIcon,
} from 'lucide-react';
import { signOut } from '@/app/auth/actions';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  children?: { icon: LucideIcon; label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Bảng điều khiển', href: '/' },
  { icon: Wallet, label: 'Giao dịch', href: '/transactions' },
  { 
    icon: PieChart, label: 'Báo cáo', href: '/reports',
    children: [
      { icon: BarChart3, label: 'Báo cáo chung', href: '/reports' },
      { icon: CalendarRange, label: 'Chi tiêu theo tháng', href: '/reports/monthly' },
    ],
  },
  { icon: User, label: 'Tài khoản', href: '/account' },
  { icon: Settings, label: 'Cài đặt', href: '/settings' },
];

interface SidebarProps {
  /** Pre-fetched user data from the server layout — avoids client-side waterfall */
  userData?: {
    full_name?: string;
    email?: string;
    avatar_url?: string;
  } | null;
}

const Sidebar = ({ userData }: SidebarProps) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    // Auto-expand items whose href matches current path on mount
    return menuItems
      .filter(item => item.children && pathname.startsWith(item.href))
      .map(item => item.href);
  });

  // Auto-expand when navigating to a child route
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.children && pathname.startsWith(item.href)) {
        setExpandedItems(prev => prev.includes(item.href) ? prev : [...prev, item.href]);
      }
    });
  }, [pathname]);

  // Hide sidebar on auth pages - Move this AFTER all hooks
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  if (isAuthPage) return null;

  const toggleExpand = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href) ? prev.filter(h => h !== href) : [...prev, href]
    );
  };

  return (
    <>
      <aside className="hidden md:flex inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex-col">
        <div className="p-6 mb-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden relative">
              <Image src="/logo.png" alt="Aura Moni Logo" fill className="object-cover" />
            </div>
            <span className="font-bold text-lg tracking-tight">Aura Moni</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isParentActive = hasChildren
              ? pathname.startsWith(item.href)
              : pathname === item.href;
            const isExpanded = hasChildren && expandedItems.includes(item.href);

            return (
              <div key={item.href + item.label}>
                {hasChildren ? (
                  /* Parent with children — clickable toggle */
                  <div
                    onClick={() => toggleExpand(item.href)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer select-none hover:bg-secondary ${
                      isParentActive
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="w-4.5 h-4.5" />
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isExpanded ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                  </div>
                ) : (
                  /* Normal link item */
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group ${
                      isParentActive
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <item.icon className={`w-4.5 h-4.5 ${isParentActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                    {item.label}
                  </Link>
                )}

                {/* Children */}
                {hasChildren && isExpanded && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-slate-100 pl-3">
                    {item.children!.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all duration-200 ${
                            isChildActive
                              ? 'bg-primary/10 text-primary font-bold'
                              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                          }`}
                        >
                          <child.icon className="w-3.5 h-3.5" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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
                  {userData?.full_name || userData?.email?.split('@')[0] || 'User'}
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


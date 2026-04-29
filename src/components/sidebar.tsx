'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  Settings, 
  LogOut,
  HelpCircle,
  PieChart,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Wallet, label: 'Giao dịch', active: false },
  { icon: PieChart, label: 'Ngân sách', active: false },
  { icon: Target, label: 'Mục tiêu', active: false },
  { icon: TrendingUp, label: 'Đầu tư', active: false },
];

const bottomItems = [
  { icon: HelpCircle, label: 'Trợ giúp' },
  { icon: Settings, label: 'Cài đặt' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card h-screen flex flex-col sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">Aura Finance</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                item.active 
                  ? "bg-primary/10 text-primary" 
                  : "text-secondary hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border">
        <div className="space-y-1 mb-4">
          {bottomItems.map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-secondary hover:bg-muted hover:text-foreground transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>
        
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

'use client';

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Th 1', income: 4000, expenses: 2400 },
  { name: 'Th 2', income: 3000, expenses: 1398 },
  { name: 'Th 3', income: 2000, expenses: 9800 },
  { name: 'Th 4', income: 2780, expenses: 3908 },
  { name: 'Th 5', income: 1890, expenses: 4800 },
  { name: 'Th 6', income: 2390, expenses: 3800 },
  { name: 'Th 7', income: 3490, expenses: 4300 },
];

const FinancialChart = () => {
  return (
    <div className="bento-card h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold">Xu hướng Tài chính</h3>
          <p className="text-sm text-muted-foreground">Phân tích thu chi hàng tháng</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-aura-indigo" />
            <span>Thu nhập</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            <span>Chi tiêu</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: 'none', 
                borderRadius: '12px', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorIncome)" 
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stroke="#e2e8f0" 
              strokeWidth={2}
              fill="transparent" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialChart;

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

import { Select, ConfigProvider } from 'antd';

interface ChartData {
  name: string;
  income: number;
  expenses: number;
}

interface FinancialChartProps {
  data: ChartData[];
  currentRange: 'recent' | 'month';
  onRangeChange: (range: 'recent' | 'month') => void;
}

const FinancialChart: React.FC<FinancialChartProps> = ({ data, currentRange, onRangeChange }) => {
  return (
    <div className="bento-card h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h3 className="text-base md:text-lg font-bold">Xu hướng Tài chính</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Phân tích thu chi</p>
          </div>
          
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#6366f1',
                borderRadius: 12,
              },
            }}
          >
            <Select
              value={currentRange}
              onChange={onRangeChange}
              className="w-40"
              options={[
                { value: 'recent', label: 'Các tháng gần đây' },
                { value: 'month', label: 'Tháng này' },
              ]}
              classNames={{ popup: { root: "overscroll-contain" }}}
            />
          </ConfigProvider>
        </div>
        <div className="hidden lg:flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-nowrap">
            <div className="w-3 h-3 rounded-full bg-aura-indigo" />
            <span>Thu nhập</span>
          </div>
          <div className="flex items-center gap-1.5 text-nowrap">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span>Chi tiêu</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full outline-none">
        <ResponsiveContainer width="100%" height="100%" style={{ outline: 'none' }}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} style={{ outline: 'none' }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
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
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}tr`}
            />
            <Tooltip 
              formatter={(value: any) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: 'none', 
                borderRadius: '16px', 
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                padding: '12px'
              }} 
              itemStyle={{ fontWeight: 600, fontSize: '12px' }}
            />
            <Area 
              name="Thu nhập"
              type="monotone" 
              dataKey="income" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorIncome)" 
            />
            <Area 
              name="Chi tiêu"
              type="monotone" 
              dataKey="expenses" 
              stroke="#f87171" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorExpenses)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialChart;

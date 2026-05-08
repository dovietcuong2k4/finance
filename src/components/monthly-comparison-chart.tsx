'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface MonthlyData {
  name: string;
  income: number;
  expenses: number;
}

interface Props {
  data: MonthlyData[];
}

const MonthlyComparisonChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bento-card h-[400px] flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold">So sánh Thu - Chi</h3>
        <p className="text-sm text-muted-foreground">Xu hướng 6 tháng gần nhất</p>
      </div>
      
      <div className="flex-1 w-full outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} style={{ outline: 'none' }}>
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
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}tr`}
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
            <Legend 
              verticalAlign="top" 
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
            />
            <Bar 
              name="Thu nhập" 
              dataKey="income" 
              fill="#6366f1" 
              radius={[6, 6, 0, 0]} 
              barSize={32}
            />
            <Bar 
              name="Chi tiêu" 
              dataKey="expenses" 
              fill="#f87171" 
              radius={[6, 6, 0, 0]} 
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyComparisonChart;

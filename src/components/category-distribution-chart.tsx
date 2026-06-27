'use client';

import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from 'recharts';
import { getCategoryByValue } from '@/constants/categories';

interface CategoryData {
  name: string;
  value: number;
}

interface Props {
  data: CategoryData[];
}

const COLORS = [
  '#6366f1', // Indigo
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#d946ef', // Fuchsia
  '#64748b'  // Slate
];

const CategoryDistributionChart: React.FC<Props> = ({ data }) => {
  const formattedData = Object.values(
    data.reduce((acc, item) => {
      const label = getCategoryByValue(item.name).label;
      if (!acc[label]) {
        acc[label] = { ...item, name: label, value: 0 };
      }
      acc[label].value += item.value;
      return acc;
    }, {} as Record<string, CategoryData>)
  );

  return (
    <div className="bento-card h-[400px] flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold">Phân bổ chi tiêu</h3>
        <p className="text-sm text-muted-foreground">Theo danh mục</p>
      </div>
      
      <div className="flex-1 w-full outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart style={{ outline: 'none' }}>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
              ))}
            </Pie>
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
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 500 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryDistributionChart;


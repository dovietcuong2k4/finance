'use client';

import React from 'react';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const insights = [
  {
    title: "Tiết kiệm tiềm năng",
    description: "Bạn đã chi tiêu nhiều hơn 15% cho ăn uống so với tuần trước. Tiết kiệm 1 bữa ăn ngoài có thể giúp bạn đạt mục tiêu 'Mua Laptop' sớm hơn 3 ngày.",
    type: "saving"
  },
  {
    title: "Cảnh báo ngân sách",
    description: "Dựa trên tốc độ chi tiêu hiện tại, bạn có thể vượt ngân sách giải trí vào ngày 22 của tháng này.",
    type: "warning"
  }
];

export default function AIAdvisor() {
  return (
    <div className="corporate-card overflow-hidden">
      <div className="p-6 border-b border-border bg-primary/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Cố vấn AI Aura</h2>
        </div>
        <p className="text-sm text-secondary mt-1">Dựa trên thói quen chi tiêu của bạn trong 30 ngày qua.</p>
      </div>
      
      <div className="p-6 space-y-4">
        {insights.map((insight, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-all"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">{insight.title}</h4>
              <p className="text-sm text-secondary mt-1 leading-relaxed">
                {insight.description}
              </p>
              <button className="flex items-center gap-1 text-xs font-bold text-primary mt-3 hover:gap-2 transition-all">
                Xem chi tiết <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="p-6 bg-muted mt-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-secondary font-medium italic">"Hành trình vạn dặm bắt đầu từ một bước tiết kiệm."</p>
          <button className="text-xs font-bold text-primary px-3 py-1 border border-primary/20 rounded-lg hover:bg-primary/5">
            Hỏi AI thêm
          </button>
        </div>
      </div>
    </div>
  );
}

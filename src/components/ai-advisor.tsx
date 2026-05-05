import React from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

const AIAdvisor = () => {
  return (
    <div className="bento-card bg-primary text-primary-foreground border-none shadow-xl shadow-primary/20 relative overflow-hidden group">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/70">Aura AI Advisor</span>
        </div>
        
        <h3 className="text-xl font-bold mb-3 leading-tight">
          Bạn có thể tiết kiệm thêm <span className="text-aura-indigo-light bg-white text-primary px-1.5 rounded">2.5tr</span> trong tháng tới.
        </h3>
        
        <p className="text-sm text-primary-foreground/70 mb-6 leading-relaxed">
          Dựa trên phân tích chi tiêu ăn uống, chúng tôi khuyên bạn nên điều chỉnh thói quen vào cuối tuần.
        </p>
        
        <button className="flex items-center gap-2 text-sm font-bold bg-white text-primary px-4 py-2 rounded-xl hover:bg-slate-50 transition-all group/btn">
          Xem chi tiết
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
      
      {/* Abstract decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-aura-indigo to-aura-violet opacity-30 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 blur-2xl rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <Zap className="absolute top-4 right-4 w-12 h-12 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
    </div>
  );
};

export default AIAdvisor;

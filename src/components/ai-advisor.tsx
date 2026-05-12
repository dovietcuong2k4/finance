import { Sparkles, ArrowRight, Zap } from 'lucide-react';

const AIAdvisor = () => {
  return (
    <div className="bento-card bg-slate-900 border-none shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-md border border-indigo-400/20">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/80">Aura Moni AI Advisor</span>
        </div>
        
        <h3 className="text-base md:text-2xl font-bold mb-4 leading-tight text-gray-700 tracking-tight">
          Bạn có thể tiết kiệm thêm <span className="text-indigo-400">2.5tr</span> trong tháng tới.
        </h3>
        
        <p className="text-xs md:text-sm text-slate-400 mb-8 leading-relaxed font-medium">
          Dựa trên phân tích chi tiêu ăn uống, chúng tôi khuyên bạn nên điều chỉnh thói quen vào cuối tuần.
        </p>
        
        <button className="flex items-center gap-2 text-xs font-bold bg-white text-slate-900 px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-all group/btn shadow-lg shadow-white/10">
          Xem chi tiết
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
      
      {/* Premium decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-600/10 blur-[80px] rounded-full"></div>
      
      <Zap className="absolute top-6 right-6 w-16 h-16 text-white/[0.03] rotate-12 group-hover:rotate-0 transition-all duration-1000 ease-out" />
    </div>
  );
};

export default AIAdvisor;

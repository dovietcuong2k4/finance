'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sparkles, ArrowRight, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Insight } from '@/lib/insights/types';

interface AIAdvisorProps {
  insights: Insight[];
}

const typeStyles: Record<Insight['type'], { accent: string; glow: string }> = {
  warning: { accent: 'text-amber-400', glow: 'shadow-amber-500/20' },
  tip: { accent: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
  achievement: { accent: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  trend: { accent: 'text-violet-400', glow: 'shadow-violet-500/20' },
};

const AIAdvisor = ({ insights }: AIAdvisorProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = insights.length;

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 6000);
    return () => clearInterval(timer);
  }, [total]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  if (total === 0) return null;

  const current = insights[activeIndex];
  const style = typeStyles[current.type] || typeStyles.tip;

  return (
    <div className={`bento-card bg-slate-900 border-none shadow-2xl ${style.glow} relative overflow-hidden group`}>
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-md border border-indigo-400/20">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/80">
              Aura Moni AI
            </span>
          </div>

          {/* Navigation dots */}
          {total > 1 && (
            <div className="flex items-center gap-1.5">
              {insights.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? 'bg-indigo-400 w-4'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Insight ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Insight content with slide animation */}
        <div className="min-h-[100px]">
          <div
            key={activeIndex}
            className="animate-in fade-in slide-in-from-right-2 duration-500"
          >
            <div className="flex items-start gap-2 mb-3">
              <span className="text-lg leading-none">{current.emoji}</span>
              <h3 className={`text-sm md:text-base font-bold leading-tight tracking-tight ${style.accent}`}>
                {current.title}
              </h3>
            </div>

            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
              {current.description}
            </p>
          </div>
        </div>

        {/* Navigation arrows */}
        {total > 1 && (
          <div className="flex items-center justify-between mt-5">
            <button
              onClick={goPrev}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all"
              aria-label="Previous insight"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              {activeIndex + 1} / {total}
            </span>

            <button
              onClick={goNext}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all"
              aria-label="Next insight"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Premium decorative elements */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-600/10 blur-[80px] rounded-full"></div>

      <Zap className="absolute top-6 right-6 w-16 h-16 text-white/[0.03] rotate-12 group-hover:rotate-0 transition-all duration-1000 ease-out" />
    </div>
  );
};

export default AIAdvisor;

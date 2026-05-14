import type { Insight, InsightData } from './types';
import { generateRuleInsights } from './rule-engine';
import { generateLLMInsights } from './llm-engine';

export type { Insight, InsightData };

/**
 * Main orchestrator: tries Gemini LLM first, falls back to rule-based engine.
 *
 * Strategy:
 * 1. If AI_API_KEY exists → call LLM engine
 * 2. If LLM fails (network, parse error, timeout) → fallback to rule engine
 * 3. If no API key → rule engine directly
 */
export async function generateInsights(data: InsightData): Promise<Insight[]> {
  // If we have very little data, return a single helpful message
  if (data.currentMonth.totalExpense === 0 && data.currentMonth.totalIncome === 0) {
    return [
      {
        id: 'no-data',
        type: 'tip',
        emoji: '👋',
        title: 'Bắt đầu ghi chép!',
        description: 'Hãy thêm giao dịch đầu tiên để Aura Moni AI phân tích tài chính cho bạn.',
        priority: 5,
      },
    ];
  }

  // Try LLM engine first
  const hasApiKey = !!process.env.AI_API_KEY;
  if (hasApiKey) {
    try {
      const llmInsights = await generateLLMInsights(data);
      if (llmInsights && llmInsights.length > 0) {
        return llmInsights;
      }
    } catch (err) {
      console.warn('LLM engine failed, falling back to rule engine:', err);
    }
  }

  // Fallback: rule-based engine
  return generateRuleInsights(data);
}

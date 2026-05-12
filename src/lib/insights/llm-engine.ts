import type { Insight, InsightData } from './types';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * LLM-powered insight engine using Gemini API.
 * Sends aggregated data (no raw transactions) to Gemini and receives
 * personalized financial insights in Vietnamese.
 *
 * Returns null on any failure — caller should fallback to rule engine.
 */
export async function generateLLMInsights(data: InsightData): Promise<Insight[] | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const fmt = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  // Build a concise financial summary for the prompt
  const financialSummary = buildFinancialSummary(data, fmt);

  const systemPrompt = `Bạn là Aura Moni AI — cố vấn tài chính cá nhân thông minh, thân thiện và chuyên nghiệp.
Phân tích dữ liệu tài chính người dùng và đưa ra 3-5 insights (gợi ý, cảnh báo, thành tích).

Quy tắc:
- Viết bằng tiếng Việt, ngắn gọn, tự nhiên, dễ hiểu
- Mỗi insight phải cụ thể, có con số, tránh chung chung
- Dùng giọng điệu tích cực, khuyến khích — kể cả khi cảnh báo
- Không bịa thêm số liệu ngoài dữ liệu được cung cấp
- Trả về đúng JSON format, không thêm text ngoài JSON

Trả về JSON theo format:
{
  "insights": [
    {
      "type": "warning | tip | achievement | trend",
      "emoji": "<1 emoji phù hợp>",
      "title": "<tiêu đề ngắn, tối đa 40 ký tự>",
      "description": "<mô tả 1-2 câu, tối đa 120 ký tự>",
      "priority": <1-10, 10 là quan trọng nhất>,
      "category": "<tên danh mục liên quan hoặc null>"
    }
  ]
}`;

  const userPrompt = `Dữ liệu tài chính của tôi:\n\n${financialSummary}\n\nHãy phân tích và đưa ra 3-5 insights quan trọng nhất.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
      signal: AbortSignal.timeout(10_000), // 10s timeout
    });

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const result = await response.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('Gemini API: empty response');
      return null;
    }

    const parsed = JSON.parse(text);
    const rawInsights = parsed?.insights;
    if (!Array.isArray(rawInsights) || rawInsights.length === 0) {
      console.error('Gemini API: invalid insights format');
      return null;
    }

    // Validate and normalize each insight
    return rawInsights
      .filter(
        (i: any) =>
          i.type && i.title && i.description && typeof i.priority === 'number'
      )
      .map((i: any, idx: number) => ({
        id: `llm-${idx}`,
        type: i.type as Insight['type'],
        emoji: i.emoji || '💡',
        title: String(i.title).slice(0, 60),
        description: String(i.description).slice(0, 200),
        priority: Math.min(10, Math.max(1, i.priority)),
        category: i.category || undefined,
      }))
      .sort((a: Insight, b: Insight) => b.priority - a.priority)
      .slice(0, 5);
  } catch (err) {
    console.error('Gemini API call failed:', err);
    return null;
  }
}

/** Build a readable financial summary string for the LLM prompt */
function buildFinancialSummary(
  data: InsightData,
  fmt: (n: number) => string
): string {
  const lines: string[] = [];

  lines.push('=== THÁNG NÀY ===');
  lines.push(`Thu nhập: ${fmt(data.currentMonth.totalIncome)}`);
  lines.push(`Chi tiêu: ${fmt(data.currentMonth.totalExpense)}`);
  lines.push(
    `Tỷ lệ tiết kiệm: ${
      data.currentMonth.totalIncome > 0
        ? Math.round(
            ((data.currentMonth.totalIncome - data.currentMonth.totalExpense) /
              data.currentMonth.totalIncome) *
              100
          )
        : 0
    }%`
  );
  lines.push(`Ngày hiện tại: ${data.currentDay}/${data.daysInMonth}`);

  if (data.currentMonth.categories.length > 0) {
    lines.push('\nChi tiêu theo danh mục (tháng này):');
    data.currentMonth.categories.forEach((c) => {
      lines.push(`  - ${c.name}: ${fmt(c.value)}`);
    });
  }

  lines.push('\n=== THÁNG TRƯỚC ===');
  lines.push(`Thu nhập: ${fmt(data.lastMonth.totalIncome)}`);
  lines.push(`Chi tiêu: ${fmt(data.lastMonth.totalExpense)}`);

  if (data.lastMonth.categories.length > 0) {
    lines.push('\nChi tiêu theo danh mục (tháng trước):');
    data.lastMonth.categories.forEach((c) => {
      lines.push(`  - ${c.name}: ${fmt(c.value)}`);
    });
  }

  lines.push(`\n=== TỔNG QUAN ===`);
  lines.push(`Tổng số dư: ${fmt(data.balance)}`);

  if (data.monthlyLimit > 0) {
    lines.push(`Ngân sách tháng: ${fmt(data.monthlyLimit)}`);
  }
  if (data.dailyLimit > 0) {
    lines.push(`Giới hạn ngày: ${fmt(data.dailyLimit)}`);
  }

  if (data.trend6m.length > 0) {
    lines.push('\n=== XU HƯỚNG 6 THÁNG ===');
    data.trend6m.forEach((m) => {
      lines.push(`  ${m.month}: Thu ${fmt(m.income)} | Chi ${fmt(m.expenses)}`);
    });
  }

  return lines.join('\n');
}

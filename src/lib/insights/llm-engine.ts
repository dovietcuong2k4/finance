import type { Insight, InsightData } from './types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'google/gemma-4-31b-it:free';

/**
 * LLM-powered insight engine using OpenRouter API (OpenAI-compatible).
 * Sends aggregated data (no raw transactions) to the LLM and receives
 * personalized financial insights in Vietnamese.
 *
 * Returns null on any failure — caller should fallback to rule engine.
 */
export async function generateLLMInsights(data: InsightData): Promise<Insight[] | null> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return null;

  const fmt = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  // Build a concise financial summary for the prompt
  const financialSummary = buildFinancialSummary(data, fmt);

  const systemPrompt = `Bạn là Aura Moni — một người bạn thân thiết rành về tài chính cá nhân.
Bạn nói chuyện tự nhiên, gần gũi như nhắn tin với bạn bè — không cứng nhắc, không hàn lâm.
Nhìn vào dữ liệu chi tiêu và đưa ra 3-5 nhận xét (gợi ý, cảnh báo nhẹ nhàng, khen ngợi, xu hướng).

Phong cách:
- Viết tiếng Việt tự nhiên, đời thường — như đang trò chuyện, có thể dùng từ thân mật
- Dùng con số cụ thể từ dữ liệu, nhưng diễn đạt nhẹ nhàng (vd: "Tháng này bạn tiêu khoảng 2 triệu cho ăn uống đó")
- Khi cảnh báo thì nhẹ nhàng, động viên — đừng phán xét
- Khi khen thì chân thành, vui vẻ
- Tiêu đề ngắn gọn, bắt mắt — có thể hơi dí dỏm
- Mô tả 1-2 câu thôi, đọc xong phải thấy "à, đúng rồi!"
- KHÔNG bịa số liệu, chỉ dùng data được cung cấp
- Trả về đúng JSON, không thêm bất kỳ văn bản nào khác ngoài JSON. Không bao gồm các khối mã markdown (\`\`\`json).
- Phải bắt đầu bằng { và kết thúc bằng }.

JSON format:
{
  "insights": [
    {
      "type": "warning | tip | achievement | trend",
      "emoji": "<1 emoji phù hợp>",
      "title": "<tiêu đề bắt mắt, tối đa 40 ký tự>",
      "description": "<nhận xét tự nhiên 1-2 câu, tối đa 150 ký tự>",
      "priority": <1-10, 10 là quan trọng nhất>,
      "category": "<tên danh mục liên quan hoặc null>"
    }
  ]
}`;

  const userPrompt = `Đây là dữ liệu tài chính của mình:\n\n${financialSummary}\n\nBạn thấy có gì đáng chú ý không? Cho mình 3-5 nhận xét nha!`;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        // 'HTTP-Referer': 'https://finance-flame-delta.vercel.app/',
        // 'X-Title': 'Aura Moni',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(45_000),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error(
        `OpenRouter API error: ${response.status} ${response.statusText}`,
        errorBody
      );
      return null;
    }

    const result = await response.json();
    const text = result?.choices?.[0]?.message?.content;
    if (!text) {
      console.error('OpenRouter API: empty response');
      return null;
    }

    // Robust JSON extraction & Repair
    let parsed: any = null;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // Try to extract JSON block
      let jsonPart = text.match(/\{[\s\S]*\}/)?.[0] || text.match(/\{[\s\S]*/)?.[0];
      
      if (jsonPart) {
        try {
          parsed = JSON.parse(jsonPart);
        } catch (e2) {
          // Truncated JSON repair: Try adding closing braces/brackets
          console.warn('JSON truncated, attempting repair...');
          let repaired = jsonPart;
          const openBraces = (repaired.match(/\{/g) || []).length;
          const closeBraces = (repaired.match(/\}/g) || []).length;
          const openBrackets = (repaired.match(/\[/g) || []).length;
          const closeBrackets = (repaired.match(/\]/g) || []).length;

          // Close open strings if any
          if ((repaired.match(/"/g) || []).length % 2 !== 0) repaired += '"';
          // Close brackets and braces
          for (let i = 0; i < openBrackets - closeBrackets; i++) repaired += ']';
          for (let i = 0; i < openBraces - closeBraces; i++) repaired += '}';

          try {
            parsed = JSON.parse(repaired);
          } catch (e3) {
            console.error('JSON repair failed:', e3);
            return null;
          }
        }
      }
    }

    const rawInsights = parsed?.insights;

    if (!Array.isArray(rawInsights) || rawInsights.length === 0) {
      console.error('OpenRouter API: invalid insights format or no insights array');
      return null;
    }

    // Validate and normalize each insight
    return rawInsights
      .filter(
        (i: any) =>
          i && i.type && i.title && i.description && typeof i.priority === 'number'
      )
      .map((i: any, idx: number) => ({
        id: `llm-${idx}-${Date.now()}`,
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
    if (err instanceof Error && err.name === 'TimeoutError') {
      console.error('OpenRouter API call timed out after 45s');
    } else {
      console.error('OpenRouter API call failed:', err);
    }
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

import type { Insight, InsightData, CategorySpending } from './types';

/**
 * Rule-based insight engine.
 * Analyzes aggregated financial data using deterministic rules
 * and returns prioritized insights in Vietnamese.
 */
export function generateRuleInsights(data: InsightData): Insight[] {
  const insights: Insight[] = [];
  const {
    currentMonth,
    lastMonth,
    trend6m,
    balance,
    daysInMonth,
    currentDay,
    monthlyLimit,
  } = data;

  const fmt = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  const fmtShort = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.0', '')}tr`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
    return n.toString();
  };

  // ──────────────────────────────────────────
  // 1. Savings rate analysis
  // ──────────────────────────────────────────
  const savingsRate =
    currentMonth.totalIncome > 0
      ? ((currentMonth.totalIncome - currentMonth.totalExpense) / currentMonth.totalIncome) * 100
      : 0;

  if (currentMonth.totalIncome > 0) {
    if (savingsRate >= 30) {
      insights.push({
        id: 'savings-excellent',
        type: 'achievement',
        emoji: '🏆',
        title: 'Tiết kiệm xuất sắc!',
        description: `Bạn đang tiết kiệm ${Math.round(savingsRate)}% thu nhập — vượt xa mức trung bình. Hãy duy trì phong độ!`,
        priority: 7,
      });
    } else if (savingsRate >= 15) {
      insights.push({
        id: 'savings-good',
        type: 'tip',
        emoji: '💪',
        title: 'Tiết kiệm tốt',
        description: `Tỷ lệ tiết kiệm ${Math.round(savingsRate)}% — bạn đang trên đường hoàn thành mục tiêu tài chính.`,
        priority: 4,
      });
    } else if (savingsRate >= 0) {
      insights.push({
        id: 'savings-low',
        type: 'warning',
        emoji: '⚠️',
        title: 'Tỷ lệ tiết kiệm thấp',
        description: `Chỉ ${Math.round(savingsRate)}% thu nhập được tiết kiệm. Hãy thử cắt giảm 1-2 khoản không cần thiết.`,
        priority: 8,
      });
    } else {
      insights.push({
        id: 'savings-negative',
        type: 'warning',
        emoji: '🚨',
        title: 'Chi vượt thu nhập!',
        description: `Bạn đã chi nhiều hơn thu nhập ${fmt(Math.abs(currentMonth.totalIncome - currentMonth.totalExpense))} trong tháng này.`,
        priority: 10,
      });
    }
  }

  // ──────────────────────────────────────────
  // 2. Category comparison (vs last month)
  // ──────────────────────────────────────────
  const lastMonthMap = new Map<string, number>();
  lastMonth.categories.forEach((c) => lastMonthMap.set(c.name, c.value));

  for (const cat of currentMonth.categories) {
    const prev = lastMonthMap.get(cat.name) || 0;
    if (prev <= 0) continue;

    const changePercent = ((cat.value - prev) / prev) * 100;

    if (changePercent > 30) {
      insights.push({
        id: `cat-increase-${cat.name}`,
        type: 'warning',
        emoji: '📈',
        title: `"${cat.name}" tăng ${Math.round(changePercent)}%`,
        description: `Chi tiêu ${cat.name}: ${fmtShort(prev)} → ${fmtShort(cat.value)} so với tháng trước. Nên xem lại các giao dịch mục này.`,
        priority: 7,
        category: cat.name,
      });
    } else if (changePercent < -20) {
      insights.push({
        id: `cat-decrease-${cat.name}`,
        type: 'achievement',
        emoji: '🎉',
        title: `Giảm chi "${cat.name}"`,
        description: `Bạn đã giảm ${Math.round(Math.abs(changePercent))}% chi tiêu ${cat.name} (${fmtShort(prev)} → ${fmtShort(cat.value)}). Tuyệt vời!`,
        priority: 5,
        category: cat.name,
      });
    }
  }

  // ──────────────────────────────────────────
  // 3. Budget limit warnings
  // ──────────────────────────────────────────
  if (monthlyLimit > 0) {
    const limitUsage = (currentMonth.limitExpense / monthlyLimit) * 100;

    if (limitUsage > 100) {
      insights.push({
        id: 'budget-over',
        type: 'warning',
        emoji: '🚫',
        title: 'Vượt ngân sách tháng!',
        description: `Chi tiêu đã đạt ${Math.round(limitUsage)}% ngân sách (${fmt(currentMonth.limitExpense)} / ${fmt(monthlyLimit)}).`,
        priority: 10,
      });
    } else if (limitUsage > 80) {
      insights.push({
        id: 'budget-warning',
        type: 'warning',
        emoji: '⚡',
        title: 'Sắp chạm ngân sách',
        description: `Đã dùng ${Math.round(limitUsage)}% ngân sách tháng. Còn lại ${fmt(monthlyLimit - currentMonth.limitExpense)} cho ${daysInMonth - currentDay} ngày.`,
        priority: 9,
      });
    }
  }

  // ──────────────────────────────────────────
  // 4. Projected monthly spending
  // ──────────────────────────────────────────
  if (currentDay > 5 && currentMonth.totalExpense > 0) {
    const dailyAvg = currentMonth.totalExpense / currentDay;
    const projected = dailyAvg * daysInMonth;

    if (monthlyLimit > 0 && projected > monthlyLimit && currentMonth.limitExpense <= monthlyLimit) {
      insights.push({
        id: 'projected-over',
        type: 'trend',
        emoji: '📊',
        title: 'Dự kiến vượt ngân sách',
        description: `Với tốc độ chi tiêu hiện tại (~${fmtShort(dailyAvg)}/ngày), dự kiến chi ${fmtShort(projected)} cuối tháng, vượt ngân sách ${fmtShort(monthlyLimit)}.`,
        priority: 8,
      });
    }

    // Potential savings suggestion
    if (currentMonth.categories.length > 0) {
      const topCat = currentMonth.categories[0];
      const topPercent = (topCat.value / currentMonth.totalExpense) * 100;
      if (topPercent > 30) {
        const potentialSaving = topCat.value * 0.15;
        insights.push({
          id: 'saving-suggestion',
          type: 'tip',
          emoji: '💡',
          title: `Tiết kiệm từ "${topCat.name}"`,
          description: `"${topCat.name}" chiếm ${Math.round(topPercent)}% chi tiêu. Giảm 15% mục này sẽ tiết kiệm thêm ~${fmtShort(potentialSaving)}/tháng.`,
          priority: 6,
          category: topCat.name,
        });
      }
    }
  }

  // ──────────────────────────────────────────
  // 5. 3-month spending trend
  // ──────────────────────────────────────────
  if (trend6m.length >= 3) {
    const recent3 = trend6m.slice(-3);
    const allIncreasing =
      recent3[1].expenses > recent3[0].expenses &&
      recent3[2].expenses > recent3[1].expenses &&
      recent3[0].expenses > 0;

    if (allIncreasing) {
      const totalIncrease =
        ((recent3[2].expenses - recent3[0].expenses) / recent3[0].expenses) * 100;
      insights.push({
        id: 'trend-3m-up',
        type: 'trend',
        emoji: '📉',
        title: 'Chi tiêu tăng 3 tháng liên tiếp',
        description: `Chi tiêu tăng ${Math.round(totalIncrease)}% trong 3 tháng qua (${fmtShort(recent3[0].expenses)} → ${fmtShort(recent3[2].expenses)}). Cần xem xét lại thói quen chi tiêu.`,
        priority: 7,
      });
    }

    const allDecreasing =
      recent3[1].expenses < recent3[0].expenses &&
      recent3[2].expenses < recent3[1].expenses &&
      recent3[0].expenses > 0;

    if (allDecreasing) {
      insights.push({
        id: 'trend-3m-down',
        type: 'achievement',
        emoji: '🌟',
        title: 'Xu hướng chi tiêu tốt!',
        description: `Chi tiêu giảm dần trong 3 tháng qua. Bạn đang kiểm soát tài chính rất tốt!`,
        priority: 6,
      });
    }
  }

  // ──────────────────────────────────────────
  // 6. Balance health
  // ──────────────────────────────────────────
  if (balance < 0) {
    insights.push({
      id: 'balance-negative',
      type: 'warning',
      emoji: '💸',
      title: 'Số dư âm',
      description: `Tổng số dư hiện tại là ${fmt(balance)}. Hãy ưu tiên tăng thu nhập hoặc cắt giảm chi tiêu.`,
      priority: 9,
    });
  }

  // Sort by priority (highest first) and return top 5
  return insights.sort((a, b) => b.priority - a.priority).slice(0, 5);
}

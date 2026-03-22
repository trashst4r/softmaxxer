/**
 * Dashboard: Chart Data Calculation
 * Generates adherence data for consistency chart
 */

import { loadAdherenceHistory, getTodayKey, calculateDayCompletion } from "./adherence-state";

export interface ChartDataPoint {
  date: string; // YYYY-MM-DD
  dateLabel: string; // "Mon", "Tue", etc.
  percentage: number; // 0-100
  isToday: boolean;
}

/**
 * Get day label (Mon, Tue, etc.)
 */
function getDayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

/**
 * Get date N days ago
 */
function getDaysAgo(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Generate chart data for last N days
 */
export function generateChartData(
  days: 7 | 14,
  amTotal: number,
  pmTotal: number
): ChartDataPoint[] {
  const today = getTodayKey();
  const data: ChartDataPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = getDaysAgo(i);
    const dateKey = formatDateKey(date);
    const percentage = calculateDayCompletion(dateKey, amTotal, pmTotal);

    data.push({
      date: dateKey,
      dateLabel: getDayLabel(date),
      percentage,
      isToday: dateKey === today,
    });
  }

  return data;
}

/**
 * Calculate overall completion percentage for period
 */
export function calculatePeriodCompletion(data: ChartDataPoint[]): number {
  if (data.length === 0) return 0;

  const sum = data.reduce((acc, day) => acc + day.percentage, 0);
  return Math.round(sum / data.length);
}

/**
 * Calculate trend vs previous period
 */
export function calculateTrend(
  currentData: ChartDataPoint[],
  amTotal: number,
  pmTotal: number
): { direction: "up" | "down" | "steady"; change: number } {
  const currentAvg = calculatePeriodCompletion(currentData);
  const days = currentData.length as 7 | 14;

  // Get previous period data
  const previousData: ChartDataPoint[] = [];
  for (let i = days * 2 - 1; i >= days; i--) {
    const date = getDaysAgo(i);
    const dateKey = formatDateKey(date);
    const percentage = calculateDayCompletion(dateKey, amTotal, pmTotal);

    previousData.push({
      date: dateKey,
      dateLabel: getDayLabel(date),
      percentage,
      isToday: false,
    });
  }

  const previousAvg = calculatePeriodCompletion(previousData);
  const change = currentAvg - previousAvg;

  let direction: "up" | "down" | "steady" = "steady";
  if (change > 2) direction = "up";
  else if (change < -2) direction = "down";

  return { direction, change: Math.abs(change) };
}

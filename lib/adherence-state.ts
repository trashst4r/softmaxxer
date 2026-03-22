/**
 * Dashboard: Adherence State Management
 * Tracks daily routine completion in localStorage
 */

const STORAGE_KEY = "daily_adherence_v1";

export interface DailyChecks {
  date: string; // YYYY-MM-DD
  am: string[]; // Array of completed step IDs
  pm: string[]; // Array of completed step IDs
}

export interface AdherenceHistory {
  [date: string]: {
    am: string[];
    pm: string[];
  };
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Load adherence history from localStorage
 */
export function loadAdherenceHistory(): AdherenceHistory {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to load adherence history:", error);
    return {};
  }
}

/**
 * Save adherence history to localStorage
 */
export function saveAdherenceHistory(history: AdherenceHistory): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save adherence history:", error);
  }
}

/**
 * Get completed steps for today
 */
export function getTodayChecks(): DailyChecks {
  const today = getTodayKey();
  const history = loadAdherenceHistory();
  const todayData = history[today] || { am: [], pm: [] };

  return {
    date: today,
    am: todayData.am,
    pm: todayData.pm,
  };
}

/**
 * Toggle step completion for today
 */
export function toggleStepCompletion(
  stepId: string,
  routine: "am" | "pm"
): DailyChecks {
  const today = getTodayKey();
  const history = loadAdherenceHistory();
  const todayData = history[today] || { am: [], pm: [] };

  // Toggle the step
  const steps = todayData[routine];
  const index = steps.indexOf(stepId);

  if (index === -1) {
    // Add step
    todayData[routine] = [...steps, stepId];
  } else {
    // Remove step
    todayData[routine] = steps.filter((id) => id !== stepId);
  }

  // Save back to history
  history[today] = todayData;
  saveAdherenceHistory(history);

  return {
    date: today,
    am: todayData.am,
    pm: todayData.pm,
  };
}

/**
 * Check if a step is completed today
 */
export function isStepCompleted(stepId: string, routine: "am" | "pm"): boolean {
  const today = getTodayChecks();
  return today[routine].includes(stepId);
}

/**
 * Calculate completion percentage for a date
 */
export function calculateDayCompletion(
  date: string,
  amTotal: number,
  pmTotal: number
): number {
  const history = loadAdherenceHistory();
  const dayData = history[date];

  if (!dayData) return 0;

  const completed = dayData.am.length + dayData.pm.length;
  const total = amTotal + pmTotal;

  return total > 0 ? Math.round((completed / total) * 100) : 0;
}

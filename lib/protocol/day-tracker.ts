/**
 * Sprint 24.8: Day Tracker
 * Manages current day in weekly protocol cycle
 */

const STORAGE_KEY = "protocol_current_day";
const STORAGE_KEY_START = "protocol_start_date";

/**
 * Get current day in protocol (1-7)
 * Auto-cycles based on start date
 */
export function getCurrentDay(): number {
  if (typeof window === "undefined") return 1;

  try {
    const startDate = localStorage.getItem(STORAGE_KEY_START);

    if (!startDate) {
      // First time - start at day 1
      return 1;
    }

    // Calculate days since start
    const start = new Date(startDate);
    const now = new Date();
    const daysSinceStart = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    // Cycle through 1-7
    return (daysSinceStart % 7) + 1;
  } catch (error) {
    console.error("Failed to get current day:", error);
    return 1;
  }
}

/**
 * Set current day manually (1-7)
 */
export function setCurrentDay(day: number): void {
  if (typeof window === "undefined") return;
  if (day < 1 || day > 7) return;

  try {
    // Calculate what start date would result in this day
    const now = new Date();
    const daysToSubtract = day - 1;
    const calculatedStart = new Date(now.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));

    localStorage.setItem(STORAGE_KEY_START, calculatedStart.toISOString());
    localStorage.setItem(STORAGE_KEY, day.toString());
  } catch (error) {
    console.error("Failed to set current day:", error);
  }
}

/**
 * Initialize protocol start (call when protocol first generated)
 */
export function initializeProtocolStart(): void {
  if (typeof window === "undefined") return;

  try {
    const existing = localStorage.getItem(STORAGE_KEY_START);
    if (!existing) {
      // Start today
      localStorage.setItem(STORAGE_KEY_START, new Date().toISOString());
      localStorage.setItem(STORAGE_KEY, "1");
    }
  } catch (error) {
    console.error("Failed to initialize protocol start:", error);
  }
}

/**
 * Reset protocol to day 1 (for retake)
 */
export function resetProtocolDay(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY_START, new Date().toISOString());
    localStorage.setItem(STORAGE_KEY, "1");
  } catch (error) {
    console.error("Failed to reset protocol day:", error);
  }
}

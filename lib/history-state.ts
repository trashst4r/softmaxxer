/**
 * Sprint D11: History State
 * Check-in timeline and historical trend tracking
 */

import type { AnalysisResult } from "@/types/analysis";
import type { SkinProfile } from "./scoring/types";

const STORAGE_KEY = "app_checkin_history_v1";
const MAX_HISTORY_ENTRIES = 50; // Limit storage size

export interface CheckInEntry {
  id: string;
  timestamp: number;
  date: string; // YYYY-MM-DD for grouping
  profile: SkinProfile;
  regimen: AnalysisResult;
}

export interface CheckInHistory {
  entries: CheckInEntry[];
}

/**
 * Load check-in history
 */
export function loadHistory(): CheckInHistory {
  if (typeof window === "undefined") return { entries: [] };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { entries: [] };
  } catch (error) {
    console.error("Failed to load check-in history:", error);
    return { entries: [] };
  }
}

/**
 * Save check-in history
 */
function saveHistory(history: CheckInHistory): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save check-in history:", error);
  }
}

/**
 * Add new check-in entry to history
 */
export function addHistoryEntry(profile: SkinProfile, regimen: AnalysisResult): CheckInEntry {
  const history = loadHistory();

  const entry: CheckInEntry = {
    id: `checkin_${Date.now()}`,
    timestamp: Date.now(),
    date: new Date().toISOString().split("T")[0],
    profile,
    regimen,
  };

  // Add to beginning (most recent first)
  history.entries.unshift(entry);

  // Limit size
  if (history.entries.length > MAX_HISTORY_ENTRIES) {
    history.entries = history.entries.slice(0, MAX_HISTORY_ENTRIES);
  }

  saveHistory(history);
  return entry;
}

/**
 * Get latest check-in entry
 */
export function getLatestEntry(): CheckInEntry | null {
  const history = loadHistory();
  return history.entries[0] || null;
}

/**
 * Get entries for trend analysis (last N days)
 */
export function getRecentEntries(days: number = 30): CheckInEntry[] {
  const history = loadHistory();
  const cutoffDate = Date.now() - days * 24 * 60 * 60 * 1000;

  return history.entries.filter((entry) => entry.timestamp >= cutoffDate);
}

/**
 * Get entries grouped by date (for timeline view)
 */
export function getEntriesByDate(): Map<string, CheckInEntry[]> {
  const history = loadHistory();
  const grouped = new Map<string, CheckInEntry[]>();

  history.entries.forEach((entry) => {
    const existing = grouped.get(entry.date) || [];
    existing.push(entry);
    grouped.set(entry.date, existing);
  });

  return grouped;
}

/**
 * Calculate trend between two entries
 */
export function calculateTrend(
  current: CheckInEntry,
  previous: CheckInEntry
): {
  acneChange: number;
  barrierChange: number;
  improving: boolean;
} {
  // Compare acne (lower is better)
  const currentAcne = current.profile.acne || 0;
  const previousAcne = previous.profile.acne || 0;
  const acneChange = previousAcne - currentAcne; // Negative means more acne

  // Compare barrier (higher is better)
  const currentBarrier = current.profile.barrier || 0;
  const previousBarrier = previous.profile.barrier || 0;
  const barrierChange = currentBarrier - previousBarrier;

  // Improving if acne decreased OR barrier increased
  const improving = acneChange > 0 || barrierChange > 0;

  return {
    acneChange,
    barrierChange,
    improving,
  };
}

/**
 * Clear all history (for testing/reset)
 */
export function clearHistory(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear history:", error);
  }
}

/**
 * Console state management for persistent member experience.
 * Stores latest analysis, daily check-ins, scan history, adherence tracking, and console metadata.
 * All data persists in localStorage (no backend yet).
 *
 * Sprint D11: Updated to use app-state and history-state for analysis/regimen
 */

import type { AnalysisResult, SkinScores } from "@/types/analysis";
import { setActiveRegimen, getActiveRegimen } from "./app-state";
import { addHistoryEntry } from "./history-state";

const CONSOLE_ANALYSIS_KEY = "console_latest_analysis";
const CONSOLE_CHECKINS_KEY = "console_daily_checkins";
const CONSOLE_METADATA_KEY = "console_metadata";
const CONSOLE_SCAN_HISTORY_KEY = "console_scan_history";
const CONSOLE_ADHERENCE_KEY = "console_daily_adherence";

export interface DailyCheckIn {
  date: string; // ISO date string
  skin_feel: "better" | "same" | "worse";
  breakouts: number;
  notes?: string;
}

export interface ScanHistoryEntry {
  id: string;
  created_at: string;
  profile_label: string;
  barrier_risk: "Low" | "Moderate" | "Elevated";
  confidence_score: number;
  scores: SkinScores;
  top_concern_labels: string[]; // Top 3 concern labels for display
}

export interface RoutineStepAdherence {
  step_key: string;
  step_label: string;
  status: "completed" | "skipped" | "missed";
}

export interface DailyAdherenceEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  am: RoutineStepAdherence[];
  pm: RoutineStepAdherence[];
  notes?: string;
}

export interface ConsoleMetadata {
  first_analysis_date: string;
  last_console_visit: string;
  total_checkins: number;
}

/**
 * Save latest analysis result to console storage.
 * Called from /results page after analysis completes.
 *
 * Sprint D11: Delegates to app-state and history-state
 */
export function saveLatestAnalysis(result: AnalysisResult): void {
  if (typeof window === "undefined") return;

  try {
    // Save to app-state (active regimen)
    setActiveRegimen(result);

    // Add to history-state
    // Note: We need the SkinProfile for history, so we'll compute it or get from session
    const skinProfile = getSessionSkinProfile();
    if (skinProfile) {
      addHistoryEntry(skinProfile, result);
    }

    // Legacy: Keep old storage for backwards compatibility during transition
    localStorage.setItem(CONSOLE_ANALYSIS_KEY, JSON.stringify(result));

    // Initialize metadata if first save
    const metadata = getConsoleMetadata();
    if (!metadata.first_analysis_date) {
      const now = new Date().toISOString();
      saveConsoleMetadata({
        first_analysis_date: now,
        last_console_visit: now,
        total_checkins: 0,
      });
    }
  } catch (error) {
    console.error("Failed to save analysis to console:", error);
  }
}

/**
 * Get latest analysis result from console storage.
 *
 * Sprint D11: Delegates to app-state
 */
export function getLatestAnalysis(): AnalysisResult | null {
  if (typeof window === "undefined") return null;

  try {
    // Primary: Load from app-state
    const result = getActiveRegimen();
    if (result) return result;

    // Fallback: Load from legacy storage
    const stored = localStorage.getItem(CONSOLE_ANALYSIS_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load analysis from console:", error);
    return null;
  }
}

/**
 * Helper: Get skin profile from sessionStorage
 */
function getSessionSkinProfile() {
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem("skin_profile");
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    return null;
  }
}

/**
 * Get all daily check-ins.
 */
export function getDailyCheckIns(): DailyCheckIn[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CONSOLE_CHECKINS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load check-ins:", error);
    return [];
  }
}

/**
 * Add a new daily check-in.
 */
export function addDailyCheckIn(checkIn: DailyCheckIn): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getDailyCheckIns();
    const today = new Date().toISOString().split("T")[0];

    // Replace if already checked in today
    const filtered = existing.filter((c) => c.date !== today);
    const updated = [...filtered, checkIn];

    // Keep last 30 days only
    const sorted = updated.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30);

    localStorage.setItem(CONSOLE_CHECKINS_KEY, JSON.stringify(sorted));

    // Update metadata
    const metadata = getConsoleMetadata();
    saveConsoleMetadata({
      ...metadata,
      total_checkins: metadata.total_checkins + 1,
    });
  } catch (error) {
    console.error("Failed to save check-in:", error);
  }
}

/**
 * Get console metadata.
 */
export function getConsoleMetadata(): ConsoleMetadata {
  if (typeof window === "undefined") {
    return {
      first_analysis_date: "",
      last_console_visit: "",
      total_checkins: 0,
    };
  }

  try {
    const stored = localStorage.getItem(CONSOLE_METADATA_KEY);
    if (!stored) {
      return {
        first_analysis_date: "",
        last_console_visit: "",
        total_checkins: 0,
      };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load console metadata:", error);
    return {
      first_analysis_date: "",
      last_console_visit: "",
      total_checkins: 0,
    };
  }
}

/**
 * Save console metadata.
 */
export function saveConsoleMetadata(metadata: ConsoleMetadata): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CONSOLE_METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error("Failed to save console metadata:", error);
  }
}

/**
 * Update last console visit timestamp.
 */
export function recordConsoleVisit(): void {
  const metadata = getConsoleMetadata();
  saveConsoleMetadata({
    ...metadata,
    last_console_visit: new Date().toISOString(),
  });
}

/**
 * Get scan history entries.
 */
export function getScanHistory(): ScanHistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CONSOLE_SCAN_HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load scan history:", error);
    return [];
  }
}

/**
 * Save a scan history entry.
 * Uses result ID to prevent duplicates from repeated results page visits.
 */
export function saveScanSnapshot(result: AnalysisResult): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getScanHistory();

    // Create stable ID from timestamp + profile label
    const scanId = `${Date.now()}_${result.profile_label.replace(/\s+/g, "_")}`;

    // Check if this exact result was already saved (within last 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const recentDuplicate = existing.find((entry) => {
      const entryTime = new Date(entry.created_at).getTime();
      return (
        entryTime > fiveMinutesAgo &&
        entry.profile_label === result.profile_label &&
        entry.scores.acne_severity === result.scores.acne_severity &&
        entry.scores.overall_condition === result.scores.overall_condition
      );
    });

    if (recentDuplicate) {
      // Skip duplicate scan from same results page session
      return;
    }

    const newEntry: ScanHistoryEntry = {
      id: scanId,
      created_at: new Date().toISOString(),
      profile_label: result.profile_label,
      barrier_risk: result.barrier_risk,
      confidence_score: result.confidence_score,
      scores: result.scores,
      top_concern_labels: result.ranked_concerns.slice(0, 3).map((c) => c.concern),
    };

    const updated = [newEntry, ...existing];

    // Keep last 50 scans
    const trimmed = updated.slice(0, 50);

    localStorage.setItem(CONSOLE_SCAN_HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error("Failed to save scan snapshot:", error);
  }
}

/**
 * Get daily adherence entries.
 */
export function getDailyAdherence(): DailyAdherenceEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CONSOLE_ADHERENCE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load adherence data:", error);
    return [];
  }
}

/**
 * Get adherence entry for specific date.
 */
export function getAdherenceForDate(date: string): DailyAdherenceEntry | null {
  const entries = getDailyAdherence();
  return entries.find((e) => e.date === date) || null;
}

/**
 * Save daily adherence entry for a specific date.
 */
export function saveDailyAdherence(entry: DailyAdherenceEntry): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getDailyAdherence();

    // Replace if entry for this date exists
    const filtered = existing.filter((e) => e.date !== entry.date);
    const updated = [entry, ...filtered];

    // Keep last 60 days
    const sorted = updated.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 60);

    localStorage.setItem(CONSOLE_ADHERENCE_KEY, JSON.stringify(sorted));
  } catch (error) {
    console.error("Failed to save adherence data:", error);
  }
}

/**
 * Calculate adherence completion rate for a date range.
 * Returns percentage of completed steps vs total steps.
 */
export function calculateAdherenceRate(startDate: string, endDate: string): number {
  const entries = getDailyAdherence().filter(
    (e) => e.date >= startDate && e.date <= endDate
  );

  if (entries.length === 0) return 0;

  let totalSteps = 0;
  let completedSteps = 0;

  entries.forEach((entry) => {
    const allSteps = [...entry.am, ...entry.pm];
    totalSteps += allSteps.length;
    completedSteps += allSteps.filter((s) => s.status === "completed").length;
  });

  if (totalSteps === 0) return 0;
  return Math.round((completedSteps / totalSteps) * 100);
}

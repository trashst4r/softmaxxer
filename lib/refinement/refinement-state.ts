/**
 * Sprint D13: Refinement State Management
 *
 * Manages refinement answers storage, keyed by regimenId
 * to invalidate when user completes new check-in.
 */

import type { RefinementAnswers, SaveRoutineData } from "./types";

const STORAGE_KEY = "refinement_answers";
const SAVE_DATA_KEY = "routine_save_data";
const PROMPT_DISMISSED_KEY = "refinement_prompt_dismissed";

/**
 * Save refinement answers for a specific regimen
 * Keyed by regimenId to invalidate when regimen changes
 */
export function saveRefinementAnswers(
  regimenId: string,
  answers: RefinementAnswers
): void {
  const data = {
    regimenId,
    answers: {
      ...answers,
      completed_at: Date.now(),
    },
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

/**
 * Get refinement answers if they match current regimenId
 * Returns null if no answers or regimenId mismatch
 */
export function getRefinementAnswers(
  currentRegimenId: string
): RefinementAnswers | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const data = JSON.parse(stored);

    // Invalidate if regimenId doesn't match
    if (data.regimenId !== currentRegimenId) return null;

    return data.answers;
  } catch {
    return null;
  }
}

/**
 * Check if refinement has been completed for current regimen
 */
export function hasCompletedRefinement(currentRegimenId: string): boolean {
  const answers = getRefinementAnswers(currentRegimenId);
  return answers !== null && answers.completed_at !== undefined;
}

/**
 * Clear refinement answers (e.g., when starting new refinement)
 */
export function clearRefinementAnswers(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Save routine contact data (separate from refinement)
 */
export function saveRoutineData(data: SaveRoutineData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(SAVE_DATA_KEY, JSON.stringify(data));
  }
}

/**
 * Get saved routine contact data
 */
export function getRoutineData(): SaveRoutineData | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(SAVE_DATA_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Mark refinement prompt as dismissed for current regimen
 * Prevents prompt from showing again for this specific regimenId
 */
export function dismissRefinementPrompt(regimenId: string): void {
  if (typeof window !== "undefined") {
    const data = { regimenId, dismissedAt: Date.now() };
    localStorage.setItem(PROMPT_DISMISSED_KEY, JSON.stringify(data));
  }
}

/**
 * Check if refinement prompt has been dismissed for current regimen
 */
export function isPromptDismissed(currentRegimenId: string): boolean {
  if (typeof window === "undefined") return false;

  const stored = localStorage.getItem(PROMPT_DISMISSED_KEY);
  if (!stored) return false;

  try {
    const data = JSON.parse(stored);
    // Only return true if regimenId matches
    return data.regimenId === currentRegimenId;
  } catch {
    return false;
  }
}

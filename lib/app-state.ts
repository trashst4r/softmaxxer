/**
 * Sprint D11: Application State
 * Single source of truth for active profile, regimen, and tier
 * Sprint 19: Added refinement preferences storage
 */

import type { AnalysisResult } from "@/types/analysis";
import type { SkinProfile } from "@/types/skin-profile";
import type { RefinementPreferences } from "@/types/refinement";

const STORAGE_KEYS = {
  activeProfile: "app_active_profile_v1",
  activeRegimen: "app_active_regimen_v1",
  activeRegimenId: "app_active_regimen_id_v1",
  refinementPrefs: "app_refinement_prefs_v1",
} as const;

/**
 * Get active skin profile (latest from check-in)
 */
export function getActiveProfile(): SkinProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.activeProfile);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to load active profile:", error);
    return null;
  }
}

/**
 * Set active skin profile
 */
export function setActiveProfile(profile: SkinProfile): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.activeProfile, JSON.stringify(profile));
  } catch (error) {
    console.error("Failed to save active profile:", error);
  }
}

/**
 * Get active regimen (latest generated routine)
 */
export function getActiveRegimen(): AnalysisResult | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.activeRegimen);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to load active regimen:", error);
    return null;
  }
}

/**
 * Set active regimen
 * Returns regimen ID for tracking compatibility
 */
export function setActiveRegimen(regimen: AnalysisResult): string {
  if (typeof window === "undefined") return "";

  try {
    // Generate stable regimen ID from timestamp + step count
    const regimenId = `regimen_${Date.now()}_${regimen.am_routine.length + regimen.pm_routine.length}`;

    localStorage.setItem(STORAGE_KEYS.activeRegimen, JSON.stringify(regimen));
    localStorage.setItem(STORAGE_KEYS.activeRegimenId, regimenId);

    return regimenId;
  } catch (error) {
    console.error("Failed to save active regimen:", error);
    return "";
  }
}

/**
 * Get current regimen ID
 */
export function getActiveRegimenId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(STORAGE_KEYS.activeRegimenId);
  } catch (error) {
    console.error("Failed to load regimen ID:", error);
    return null;
  }
}

/**
 * Check if regimen has changed (for invalidating protocol selections)
 */
export function hasRegimenChanged(currentRegimenId: string): boolean {
  const activeId = getActiveRegimenId();
  return activeId !== currentRegimenId;
}

/**
 * Get refinement preferences
 */
export function getRefinementPreferences(): RefinementPreferences | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.refinementPrefs);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to load refinement preferences:", error);
    return null;
  }
}

/**
 * Set refinement preferences
 */
export function setRefinementPreferences(prefs: RefinementPreferences): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.refinementPrefs, JSON.stringify(prefs));
  } catch (error) {
    console.error("Failed to save refinement preferences:", error);
  }
}

/**
 * Clear all active state (for testing/reset)
 */
export function clearActiveState(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.activeProfile);
    localStorage.removeItem(STORAGE_KEYS.activeRegimen);
    localStorage.removeItem(STORAGE_KEYS.activeRegimenId);
    localStorage.removeItem(STORAGE_KEYS.refinementPrefs);
  } catch (error) {
    console.error("Failed to clear active state:", error);
  }
}

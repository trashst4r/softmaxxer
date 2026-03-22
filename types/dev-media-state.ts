/**
 * Dev Tools Media Sandbox v1
 * Type definitions for fabricated media state
 */

import type { SkinProfile } from "./skin-profile";

/**
 * Controllable dimensions for media staging
 * Separate from real check-in data to allow precise fabrication
 */
export interface DevMediaState {
  // Core skin dimensions (align with SkinProfile)
  oiliness: "dry" | "balanced" | "oily_tzone" | "oily_all";
  sensitivity: "resilient" | "moderate" | "reactive";
  breakoutProneness: "rare" | "occasional" | "frequent" | "persistent";
  hydrationNeed: "low" | "high";
  priorityGoal: "breakout_control" | "hydration_restore" | "redness_calm" | "barrier_strengthen" | "texture_smooth";

  // Context flags
  hasActiveExperience: boolean;
  needsSpfEducation: boolean;
  prefersMinimalRoutine: boolean;

  // Dashboard-specific staging
  adherencePercentage: number; // 0-100
  currentStreak: number; // Days
  totalCheckIns: number;
  lastCheckInDays: number; // Days since last check-in
}

/**
 * Named preset for quick screenshot scenarios
 */
export interface MediaPreset {
  id: string;
  name: string;
  description: string;
  state: DevMediaState;
}

/**
 * Convert DevMediaState to SkinProfile for engine compatibility
 */
export function devMediaStateToSkinProfile(state: DevMediaState): SkinProfile {
  return {
    oiliness: state.oiliness,
    sensitivity: state.sensitivity,
    breakoutProneness: state.breakoutProneness,
    hydrationNeed: state.hydrationNeed,
    priorityGoal: state.priorityGoal,
    hasActiveExperience: state.hasActiveExperience,
    needsSpfEducation: state.needsSpfEducation,
    prefersMinimalRoutine: state.prefersMinimalRoutine,
  };
}

/**
 * Deterministic Skin Profile to Routine Engine v1
 * Strict skin profile dimensions inferred from check-in data
 */

export type OilinessLevel = "dry" | "balanced" | "oily_tzone" | "oily_all";
export type SensitivityLevel = "resilient" | "moderate" | "reactive";
export type BreakoutProneness = "rare" | "occasional" | "frequent" | "persistent";
export type HydrationNeed = "low" | "high"; // Sprint 18: Simplified to match catalog-v1 schema
export type PriorityGoal =
  | "breakout_control"
  | "hydration_restore"
  | "redness_calm"
  | "barrier_strengthen"
  | "texture_smooth";

export interface SkinProfile {
  oiliness: OilinessLevel;
  sensitivity: SensitivityLevel;
  breakoutProneness: BreakoutProneness;
  hydrationNeed: HydrationNeed;
  priorityGoal: PriorityGoal;

  // Context flags
  hasActiveExperience: boolean;
  needsSpfEducation: boolean;
  prefersMinimalRoutine: boolean;
}

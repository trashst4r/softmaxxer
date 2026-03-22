/**
 * Dev Tools User Simulation v1
 * Types for simulated user profiles with multi-day check-in history
 */

// Same structure as used in check-in-shell-v2
export type PrimaryConcern = "breakouts" | "dryness" | "redness" | "oiliness" | "texture";
export type SkinBehavior = "tight" | "balanced" | "shiny_areas" | "shiny_all";
export type Frequency = "rarely" | "sometimes" | "often" | "constant";
export type Sensitivity = "rarely" | "sometimes" | "very_easily";
export type ActiveIngredient = "retinoid" | "aha_bha" | "vitamin_c" | "benzoyl_peroxide" | "azelaic_acid";
export type SpfUsage = "daily" | "sometimes" | "rarely";
export type RoutineRealism = "easy" | "manageable" | "too_much";

export interface CheckInAnswers {
  concerns: PrimaryConcern[];
  skin_behavior?: SkinBehavior;
  frequency?: Frequency;
  sensitivity?: Sensitivity;
  has_actives?: boolean;
  actives?: ActiveIngredient[];
  spf_usage?: SpfUsage;
  routine_realism?: RoutineRealism;
}

export interface CheckInEntry {
  day: number;
  date: string; // e.g., "2026-03-15"
  answers: CheckInAnswers;
  notes?: string; // Optional description of state on this day
}

export interface DevUser {
  id: string;
  name: string;
  description: string;
  checkInHistory: CheckInEntry[];
}

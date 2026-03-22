export type SkinFeelAfterCleansing = "tight" | "normal" | "oily";
export type MiddayOiliness = "low" | "moderate" | "high";
export type BreakoutFrequency = "rare" | "occasional" | "frequent";
export type VisibleRedness = "low" | "moderate" | "high";
export type FlakingOrDryPatches = "none" | "mild" | "clear";
export type CurrentActiveUse = string; // Free-text input for actives
export type SensitivityLevel = "low" | "moderate" | "high";
export type PrimaryGoal = "acne" | "redness" | "texture" | "maintenance" | "oil_control";
export type SpfUsage = "never" | "sometimes" | "daily";

export interface AnalysisAnswers {
  skin_feel_after_cleansing: SkinFeelAfterCleansing;
  midday_oiliness: MiddayOiliness;
  breakout_frequency: BreakoutFrequency;
  breakout_zones: string[];
  visible_redness: VisibleRedness;
  flaking_or_dry_patches: FlakingOrDryPatches;
  current_active_use: CurrentActiveUse;
  sensitivity_level: SensitivityLevel;
  primary_goal: PrimaryGoal;
  spf_usage: SpfUsage;
}

export type BarrierRisk = "Low" | "Moderate" | "Elevated";

// Scoring system
export interface SkinScores {
  acne_severity: number; // 0-100
  oil_production: number; // 0-100
  dryness_dehydration: number; // 0-100
  sensitivity_reactivity: number; // 0-100
  barrier_health: number; // 0-100 (inverse - higher is better)
  overall_condition: number; // 0-100 (inverse - higher is better)
}

// Product mapping
export interface ProductSuggestion {
  ingredient: string;
  category: string;
  examples: string[];
  rationale?: string;
  products?: import("@/lib/product-map").Product[];
}

export interface RoutineStep {
  id: string; // Stable semantic identifier (e.g., "am_cleanse", "pm_active")
  step: string;
  products?: ProductSuggestion[];
  affects?: string[]; // Concern keys this step addresses
}

// Concern system
export interface RankedConcern {
  concern: string;
  score: number;
  priority: "high" | "medium" | "low";
}

// Enhanced analysis result
export interface AnalysisResult {
  // Core profile
  profile_label: string;
  profile_maturity: "Initial Profile";
  summary: string;

  // Scoring
  scores: SkinScores;
  confidence_score: number;

  // Concerns
  ranked_concerns: RankedConcern[];
  concern_clusters: string[]; // Kept for backwards compatibility
  barrier_risk: BarrierRisk;

  // Routines
  am_routine: RoutineStep[];
  pm_routine: RoutineStep[];

  // Guidance
  next_tests: string[];
}

/**
 * Weekly Protocol Engine - Type Definitions
 * Sprint 20: Transform static AM/PM into deterministic weekly protocol
 */

/**
 * Ingredient families for protocol scheduling
 */
export type IngredientFamily =
  | "gentle-cleanser"
  | "salicylic-acid"
  | "benzoyl-peroxide"
  | "adapalene-retinoid"
  | "azelaic-acid"
  | "vitamin-c"
  | "niacinamide"
  | "copper-peptides"
  | "exfoliating-acid"
  | "hydrating-serum"
  | "barrier-support"
  | "moisturizer"
  | "sunscreen";

/**
 * Day types for weekly protocol structure
 */
export type DayType = "maintenance" | "active" | "recovery" | "barrier-repair";

/**
 * User tolerance tiers based on experience and barrier health
 */
export type ToleranceTier = "beginner" | "cautious" | "moderate" | "advanced";

/**
 * Primary skin concerns for protocol targeting
 */
export type ProtocolConcern =
  | "acne"
  | "pigmentation"
  | "redness"
  | "dehydration"
  | "texture"
  | "early-aging"
  | "barrier-repair";

/**
 * Barrier health states
 */
export type BarrierState = "compromised" | "sensitive" | "stable" | "robust";

/**
 * Protocol step for a single time (AM or PM)
 */
export interface ProtocolStep {
  order: number;
  category: "cleanse" | "treat" | "moisturize" | "protect" | "support";
  ingredientFamily: IngredientFamily;
  purpose: string; // Why this step is here
  intensity: "gentle" | "moderate" | "strong";
  cautionNote?: string; // Optional safety note
}

/**
 * Single day in weekly protocol
 */
export interface ProtocolDay {
  dayNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  dayType: DayType;
  label: string; // e.g., "Active Treatment", "Recovery", "Barrier Support"
  am: ProtocolStep[];
  pm: ProtocolStep[];
  rationale: string; // Why this day is structured this way
  // Sprint 21: Translation layer fields
  purpose: string; // Short directive: "Exfoliate and renew", "Repair barrier", etc.
  whyThisDay: string; // User-facing explanation of day logic
  caution?: string; // Warnings for active days
  expectedOutcome: string; // What user should notice
}

/**
 * Complete 7-day weekly protocol
 */
export interface WeeklyProtocol {
  protocolId: string; // Unique identifier for caching/versioning
  primaryConcern: ProtocolConcern;
  secondaryConcern?: ProtocolConcern;
  toleranceTier: ToleranceTier;
  barrierState: BarrierState;
  heroActive: IngredientFamily; // Primary treatment ingredient
  supportActive?: IngredientFamily; // Optional secondary active
  days: ProtocolDay[];
  summary: {
    totalActiveDays: number;
    totalRecoveryDays: number;
    heroActiveFrequency: number; // Times per week
    supportActiveFrequency?: number;
    keyPrinciples: string[]; // Core protocol logic explanations
  };
  safetyNotes: string[]; // Critical safety warnings
  expectedTimeline: string; // When to expect results
}

/**
 * Protocol targets derived from skin profile
 */
export interface ProtocolTargets {
  primaryConcern: ProtocolConcern;
  secondaryConcern?: ProtocolConcern;
  barrierState: BarrierState;
  toleranceTier: ToleranceTier;
  oilProfile: "dry" | "balanced" | "oily";
  breakoutIntensity: "none" | "mild" | "moderate" | "severe";
  rednessLevel: "none" | "mild" | "moderate" | "severe";
  activesExperience: boolean; // Has used actives before
  spfReliability: "poor" | "inconsistent" | "reliable";
  sensitiveSkin: boolean;
}

/**
 * Weekly frequency caps by tolerance tier and ingredient
 */
export interface FrequencyCap {
  ingredientFamily: IngredientFamily;
  maxPerWeek: number;
  minRecoveryDays: number; // Days to wait between uses
}

/**
 * Active conflict rules for safety
 */
export interface ConflictRule {
  ingredient1: IngredientFamily;
  ingredient2: IngredientFamily;
  severity: "forbidden" | "cautious" | "separate-am-pm";
  reason: string;
}

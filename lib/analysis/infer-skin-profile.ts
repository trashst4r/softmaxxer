/**
 * Deterministic Skin Profile to Routine Engine v1
 * Converts check-in answers into strict skin profile through explicit rules
 */

import type { SkinProfile, OilinessLevel, SensitivityLevel, BreakoutProneness, HydrationNeed, PriorityGoal } from "@/types/skin-profile";

// Import check-in types from existing check-in shell
type PrimaryConcern = "breakouts" | "dryness" | "redness" | "oiliness" | "texture";
type SkinBehavior = "tight" | "balanced" | "shiny_areas" | "shiny_all";
type Frequency = "rarely" | "sometimes" | "often" | "constant";
type Sensitivity = "rarely" | "sometimes" | "very_easily";
type ActiveIngredient = "retinoid" | "aha_bha" | "vitamin_c" | "benzoyl_peroxide" | "azelaic_acid";
type SpfUsage = "daily" | "sometimes" | "rarely";
type RoutineRealism = "easy" | "manageable" | "too_much";

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

/**
 * Infer oiliness level from skin behavior
 */
function inferOiliness(behavior?: SkinBehavior): OilinessLevel {
  if (!behavior) return "balanced";

  switch (behavior) {
    case "tight":
      return "dry";
    case "balanced":
      return "balanced";
    case "shiny_areas":
      return "oily_tzone";
    case "shiny_all":
      return "oily_all";
    default:
      return "balanced";
  }
}

/**
 * Infer sensitivity level from reported reactivity
 */
function inferSensitivity(sensitivity?: Sensitivity): SensitivityLevel {
  if (!sensitivity) return "moderate";

  switch (sensitivity) {
    case "rarely":
      return "resilient";
    case "sometimes":
      return "moderate";
    case "very_easily":
      return "reactive";
    default:
      return "moderate";
  }
}

/**
 * Infer breakout proneness from frequency
 */
function inferBreakoutProneness(frequency?: Frequency): BreakoutProneness {
  if (!frequency) return "rare";

  switch (frequency) {
    case "rarely":
      return "rare";
    case "sometimes":
      return "occasional";
    case "often":
      return "frequent";
    case "constant":
      return "persistent";
    default:
      return "rare";
  }
}

/**
 * Infer hydration need from oiliness and concerns
 * Sprint 18: Simplified to binary low/high to match catalog-v1 schema
 */
function inferHydrationNeed(
  oiliness: OilinessLevel,
  concerns: PrimaryConcern[]
): HydrationNeed {
  // Dry skin always needs high hydration
  if (oiliness === "dry") return "high";

  // Dryness as a concern indicates hydration need
  if (concerns.includes("dryness")) return "high";

  // Oily skin typically needs less hydration
  if (oiliness === "oily_all" || oiliness === "oily_tzone") return "low";

  // Balanced skin: default to low (can be augmented with hydrating serums if needed)
  return "low";
}

/**
 * Infer priority goal from primary concerns
 */
function inferPriorityGoal(concerns: PrimaryConcern[]): PriorityGoal {
  // First concern takes priority
  if (concerns.length === 0) return "barrier_strengthen";

  const primary = concerns[0];

  switch (primary) {
    case "breakouts":
      return "breakout_control";
    case "dryness":
      return "hydration_restore";
    case "redness":
      return "redness_calm";
    case "oiliness":
      return "breakout_control"; // Oiliness often leads to breakouts
    case "texture":
      return "texture_smooth";
    default:
      return "barrier_strengthen";
  }
}

/**
 * Main inference function: converts check-in answers to skin profile
 */
export function inferSkinProfile(answers: CheckInAnswers): SkinProfile {
  const oiliness = inferOiliness(answers.skin_behavior);
  const sensitivity = inferSensitivity(answers.sensitivity);
  const breakoutProneness = inferBreakoutProneness(answers.frequency);
  const hydrationNeed = inferHydrationNeed(oiliness, answers.concerns);
  const priorityGoal = inferPriorityGoal(answers.concerns);

  return {
    oiliness,
    sensitivity,
    breakoutProneness,
    hydrationNeed,
    priorityGoal,

    // Context flags
    hasActiveExperience: answers.has_actives === true && (answers.actives?.length ?? 0) > 0,
    needsSpfEducation: answers.spf_usage !== "daily",
    prefersMinimalRoutine: answers.routine_realism === "easy",
  };
}

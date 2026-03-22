/**
 * Sprint D5: Scoring Unification
 *
 * Bridge between new SkinProfile (D3) and legacy SkinScores.
 * SkinProfile is the source of truth, SkinScores is derived for regimen generation.
 */

import type { SkinProfile } from "./types";
import type { SkinScores } from "@/types/analysis";

/**
 * Convert SkinProfile to SkinScores for regimen generation
 * This allows existing regimen logic to work with new scoring system
 */
export function profileToScores(profile: SkinProfile): SkinScores {
  return {
    // Direct mappings
    acne_severity: profile.acne,
    oil_production: profile.oil,
    sensitivity_reactivity: profile.sensitivity,
    barrier_health: profile.barrier,

    // Derived: dryness from low oil + low barrier
    dryness_dehydration: calculateDryness(profile),

    // Derived: overall condition from barrier and tolerance
    overall_condition: calculateOverallCondition(profile),
  };
}

/**
 * Calculate dryness score from profile
 * Low oil + compromised barrier = high dryness
 */
function calculateDryness(profile: SkinProfile): number {
  const { oil, barrier } = profile;

  // Start with inverse of oil (low oil = high dryness potential)
  let dryness = Math.max(0, 100 - oil);

  // If barrier is compromised, amplify dryness
  if (barrier < 50) {
    dryness = Math.min(100, dryness * 1.3);
  }

  // If oil is very low, ensure minimum dryness score
  if (oil < 20) {
    dryness = Math.max(dryness, 60);
  }

  return Math.round(dryness);
}

/**
 * Calculate overall condition from profile
 * Higher is better (inverse scale like barrier_health)
 */
function calculateOverallCondition(profile: SkinProfile): number {
  const { acne, oil, barrier, sensitivity, tolerance } = profile;

  // Start with barrier health as foundation
  let condition = barrier;

  // Factor in tolerance (high tolerance = better condition)
  condition = (condition + tolerance) / 2;

  // Penalize for high problem scores
  if (acne > 70) condition -= 15;
  else if (acne > 50) condition -= 8;

  if (sensitivity > 70) condition -= 12;
  else if (sensitivity > 50) condition -= 6;

  // Extreme oil (either direction) reduces overall condition
  if (oil > 85 || oil < 15) condition -= 8;

  return Math.max(0, Math.min(100, Math.round(condition)));
}

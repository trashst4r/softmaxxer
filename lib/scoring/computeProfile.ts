/**
 * Sprint D3: Scoring Engine
 *
 * Converts check-in answers into deterministic numeric skin profile.
 * Pure function - no side effects, consistent output for same inputs.
 */

import type {
  SkinProfile,
  PrimaryConcern,
  SkinBehavior,
  Frequency,
  Sensitivity,
  SpfUsage,
  ActiveIngredient,
} from "./types";

interface CheckInAnswersForScoring {
  concerns: PrimaryConcern[];
  skin_behavior?: SkinBehavior;
  concern_severity?: Frequency;
  has_actives?: boolean;
  actives?: ActiveIngredient[];
  sensitivity?: Sensitivity;
  spf_daily?: SpfUsage;
}

/**
 * Main scoring function
 * Converts check-in answers to numeric skin profile
 */
export function computeProfile(answers: CheckInAnswersForScoring): SkinProfile {
  const profile: SkinProfile = {
    acne: computeAcne(answers),
    oil: computeOil(answers),
    barrier: computeBarrier(answers),
    sensitivity: computeSensitivity(answers),
    tolerance: computeTolerance(answers),
    uvRisk: computeUvRisk(answers),
  };

  return profile;
}

/**
 * ACNE SCORING
 * Base score from concerns, amplified by severity if primary concern
 */
function computeAcne(answers: CheckInAnswersForScoring): number {
  const hasBreakouts = answers.concerns.includes("breakouts");
  const isPrimaryConcern = answers.concerns[0] === "breakouts";

  if (!hasBreakouts) return 0;

  // Base severity mapping
  const severityMap: Record<Frequency, number> = {
    rarely: 20,
    sometimes: 40,
    often: 65,
    constant: 85,
  };

  const baseSeverity = answers.concern_severity
    ? severityMap[answers.concern_severity]
    : 40; // Default to "sometimes" if not specified

  // Apply multiplier ONLY if primary concern
  return isPrimaryConcern ? Math.min(100, baseSeverity * 1.2) : baseSeverity;
}

/**
 * OIL SCORING
 * Based on skin behavior selection
 */
function computeOil(answers: CheckInAnswersForScoring): number {
  const behavior = answers.skin_behavior;

  // Amplification from oiliness concern
  const hasOilinessConcern = answers.concerns.includes("oiliness");
  const isPrimaryOiliness = answers.concerns[0] === "oiliness";

  let score = 0;

  if (behavior === "oily_all") score = 85;
  else if (behavior === "oily_tzone") score = 55;
  else if (behavior === "balanced") score = 30;
  else if (behavior === "tight_dry") score = 10;

  // Boost if oiliness is a concern
  if (hasOilinessConcern) {
    score = isPrimaryOiliness ? Math.min(100, score * 1.3) : Math.min(100, score * 1.15);
  }

  return score;
}

/**
 * BARRIER SCORING
 * Inverse scale: 100 = strong barrier, 0 = compromised
 * Based on sensitivity, dryness, and actives usage
 */
function computeBarrier(answers: CheckInAnswersForScoring): number {
  let score = 70; // Start at healthy baseline

  // Dryness/tightness signals barrier compromise
  const hasDryness = answers.concerns.includes("dryness");
  const hasTightDry = answers.skin_behavior === "tight_dry";

  if (hasDryness && hasTightDry) {
    score -= 30; // Significant barrier compromise
  } else if (hasDryness || hasTightDry) {
    score -= 15;
  }

  // Redness signals barrier reactivity
  const hasRedness = answers.concerns.includes("redness");
  const isPrimaryRedness = answers.concerns[0] === "redness";

  if (hasRedness) {
    score -= isPrimaryRedness ? 25 : 15;
  }

  // High sensitivity indicates weaker barrier
  if (answers.sensitivity === "very_easily") {
    score -= 20;
  } else if (answers.sensitivity === "sometimes") {
    score -= 10;
  }

  // Heavy active use without sensitivity suggests strong barrier
  const activeCount = answers.actives?.length || 0;
  if (answers.has_actives && activeCount >= 2 && answers.sensitivity === "rarely") {
    score += 10; // Tolerating actives = stronger barrier
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * SENSITIVITY SCORING
 * Direct mapping from sensitivity answer
 */
function computeSensitivity(answers: CheckInAnswersForScoring): number {
  const sensitivityMap: Record<Sensitivity, number> = {
    rarely: 15,
    sometimes: 50,
    very_easily: 85,
  };

  const baseSensitivity = answers.sensitivity
    ? sensitivityMap[answers.sensitivity]
    : 50;

  // Redness as primary concern amplifies sensitivity
  const isPrimaryRedness = answers.concerns[0] === "redness";
  if (isPrimaryRedness) {
    return Math.min(100, baseSensitivity * 1.2);
  }

  return baseSensitivity;
}

/**
 * TOLERANCE SCORING
 * Inverse of sensitivity + actives usage context
 * 100 = high tolerance for actives, 0 = low tolerance
 */
function computeTolerance(answers: CheckInAnswersForScoring): number {
  // Start from inverse of sensitivity
  let score = 100 - computeSensitivity(answers);

  // Adjust based on current actives usage
  const activeCount = answers.actives?.length || 0;

  if (answers.has_actives && activeCount >= 3) {
    score = Math.min(100, score + 15); // Using many actives successfully
  } else if (answers.has_actives && activeCount === 0) {
    // Said yes but selected no actives - confusing signal, slight penalty
    score = Math.max(0, score - 5);
  }

  // Barrier health correlates with tolerance
  const barrierScore = computeBarrier(answers);
  if (barrierScore > 70) {
    score = Math.min(100, score + 10);
  } else if (barrierScore < 40) {
    score = Math.max(0, score - 10);
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * UV RISK SCORING
 * Direct mapping from SPF usage
 * 100 = high risk (never uses SPF), 0 = protected
 */
function computeUvRisk(answers: CheckInAnswersForScoring): number {
  const spfMap: Record<SpfUsage, number> = {
    yes: 10,       // Low risk - daily user
    sometimes: 55, // Moderate risk - inconsistent
    no: 90,        // High risk - no protection
  };

  return answers.spf_daily ? spfMap[answers.spf_daily] : 55;
}

/**
 * Helper: Get human-readable profile summary
 */
export function getProfileSummary(profile: SkinProfile): string {
  const concerns: string[] = [];

  if (profile.acne > 60) concerns.push("active acne");
  if (profile.oil > 70) concerns.push("excess oil");
  if (profile.barrier < 40) concerns.push("compromised barrier");
  if (profile.sensitivity > 70) concerns.push("high sensitivity");

  if (concerns.length === 0) {
    return "Balanced skin with no major concerns";
  }

  return `Profile: ${concerns.join(", ")}`;
}

import type { SkinScores, RankedConcern, BarrierRisk } from "@/types/analysis";

/**
 * Rank skin concerns by severity scores.
 * Only include concerns above threshold.
 * Return ordered list with priority levels.
 */
export function rankConcerns(scores: SkinScores): RankedConcern[] {
  const concerns: RankedConcern[] = [];

  // Define thresholds
  const HIGH_THRESHOLD = 60;
  const MODERATE_THRESHOLD = 35;
  const MENTION_THRESHOLD = 20;

  // Acne Severity
  if (scores.acne_severity >= MENTION_THRESHOLD) {
    concerns.push({
      concern: "Breakouts",
      score: scores.acne_severity,
      priority: scores.acne_severity >= HIGH_THRESHOLD ? "high" : scores.acne_severity >= MODERATE_THRESHOLD ? "medium" : "low",
    });
  }

  // Oil Production
  if (scores.oil_production >= MENTION_THRESHOLD) {
    concerns.push({
      concern: "Oiliness",
      score: scores.oil_production,
      priority: scores.oil_production >= HIGH_THRESHOLD ? "high" : scores.oil_production >= MODERATE_THRESHOLD ? "medium" : "low",
    });
  }

  // Dryness/Dehydration
  if (scores.dryness_dehydration >= MENTION_THRESHOLD) {
    concerns.push({
      concern: "Dryness",
      score: scores.dryness_dehydration,
      priority:
        scores.dryness_dehydration >= HIGH_THRESHOLD ? "high" : scores.dryness_dehydration >= MODERATE_THRESHOLD ? "medium" : "low",
    });
  }

  // Sensitivity/Reactivity
  if (scores.sensitivity_reactivity >= MENTION_THRESHOLD) {
    concerns.push({
      concern: "Redness & Sensitivity",
      score: scores.sensitivity_reactivity,
      priority:
        scores.sensitivity_reactivity >= HIGH_THRESHOLD
          ? "high"
          : scores.sensitivity_reactivity >= MODERATE_THRESHOLD
            ? "medium"
            : "low",
    });
  }

  // Barrier Health (inverse - low score is bad)
  if (scores.barrier_health < 60) {
    concerns.push({
      concern: "Barrier Stress",
      score: 100 - scores.barrier_health, // Invert for sorting
      priority: scores.barrier_health < 40 ? "high" : scores.barrier_health < 60 ? "medium" : "low",
    });
  }

  // Sort by score descending
  concerns.sort((a, b) => b.score - a.score);

  return concerns;
}

/**
 * Determine barrier risk level from scores
 */
export function determineBarrierRisk(scores: SkinScores): BarrierRisk {
  const { barrier_health, sensitivity_reactivity, dryness_dehydration } = scores;

  // Barrier health is inverse (lower is worse)
  if (barrier_health < 40 || (sensitivity_reactivity > 70 && dryness_dehydration > 60)) {
    return "Elevated";
  }

  if (barrier_health < 60 || sensitivity_reactivity > 50) {
    return "Moderate";
  }

  return "Low";
}

/**
 * Generate simple concern clusters for backwards compatibility
 */
export function generateConcernClusters(ranked: RankedConcern[]): string[] {
  return ranked.filter((c) => c.priority === "high" || c.priority === "medium").map((c) => c.concern);
}

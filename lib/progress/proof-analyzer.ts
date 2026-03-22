/**
 * Sprint A: Proof Layer
 * Deterministic comparison logic that answers "Am I improving?"
 *
 * Core logic:
 * - Compare previous vs current analysis snapshots
 * - Show directional change (improved/worsened/unchanged) for acne, barrier, overall
 * - Generate concise interpretation
 * - Provide action guidance aligned with console intelligence
 */

import type { SkinScores } from "@/types/analysis";
import { getScanHistory } from "@/lib/console-state";

export type ChangeDirection = "improved" | "worsened" | "unchanged";
export type ProofState = "first_time" | "clear_improvement" | "plateau" | "regression";

export interface DimensionChange {
  dimension: "acne" | "barrier" | "overall";
  previous: number;
  current: number;
  delta: number;
  direction: ChangeDirection;
}

export interface ProofAnalysis {
  state: ProofState;
  hasProof: boolean; // false if no previous data
  changes: DimensionChange[];
  interpretation: string; // "What this means"
  actionGuidance: string; // "Continue or adjust"
  rawComparison: {
    previous: SkinScores | null;
    current: SkinScores;
  };
}

/**
 * Analyze proof of progress by comparing current scores to previous scan.
 * Returns null if no previous scan exists (first-time state).
 */
export function analyzeProof(currentScores: SkinScores): ProofAnalysis {
  const history = getScanHistory();

  // First-time state: no previous data
  if (history.length < 2) {
    return {
      state: "first_time",
      hasProof: false,
      changes: [],
      interpretation: "No previous analysis to compare. Complete another analysis in 3-5 days to start tracking progress.",
      actionGuidance: "Follow your protocol consistently and return for your next scan.",
      rawComparison: {
        previous: null,
        current: currentScores,
      },
    };
  }

  // Get previous scan (second in history, first is current)
  const previousScores = history[1].scores;

  // Calculate changes for each dimension
  const changes: DimensionChange[] = [
    calculateDimensionChange("acne", previousScores.acne_severity, currentScores.acne_severity, "lower"),
    calculateDimensionChange("barrier", previousScores.barrier_health, currentScores.barrier_health, "higher"),
    calculateDimensionChange("overall", previousScores.overall_condition, currentScores.overall_condition, "higher"),
  ];

  // Determine overall proof state
  const state = determineProofState(changes);

  // Generate interpretation based on state
  const interpretation = generateInterpretation(changes, state);

  // Generate action guidance aligned with state
  const actionGuidance = generateActionGuidance(changes, state);

  return {
    state,
    hasProof: true,
    changes,
    interpretation,
    actionGuidance,
    rawComparison: {
      previous: previousScores,
      current: currentScores,
    },
  };
}

/**
 * Calculate change for a single dimension.
 * @param betterDirection - "lower" means lower values are better (acne), "higher" means higher is better (barrier, overall)
 */
function calculateDimensionChange(
  dimension: "acne" | "barrier" | "overall",
  previous: number,
  current: number,
  betterDirection: "lower" | "higher"
): DimensionChange {
  const delta = current - previous;
  const absDelta = Math.abs(delta);

  // Threshold: ±5 points = unchanged
  let direction: ChangeDirection = "unchanged";

  if (absDelta > 5) {
    if (betterDirection === "lower") {
      // For acne: lower is better
      direction = delta < 0 ? "improved" : "worsened";
    } else {
      // For barrier and overall: higher is better
      direction = delta > 0 ? "improved" : "worsened";
    }
  }

  return {
    dimension,
    previous,
    current,
    delta,
    direction,
  };
}

/**
 * Determine overall proof state from dimension changes.
 */
function determineProofState(changes: DimensionChange[]): ProofState {
  const improvements = changes.filter((c) => c.direction === "improved").length;
  const declines = changes.filter((c) => c.direction === "worsened").length;

  // Clear improvement: 2+ improved, 0 worsened
  if (improvements >= 2 && declines === 0) {
    return "clear_improvement";
  }

  // Regression: 2+ worsened
  if (declines >= 2) {
    return "regression";
  }

  // Plateau: all unchanged OR mixed signals (1 improved, 1 worsened)
  return "plateau";
}

/**
 * Generate "What this means" interpretation.
 */
function generateInterpretation(changes: DimensionChange[], state: ProofState): string {
  switch (state) {
    case "clear_improvement":
      return "Your protocol is working. Multiple dimensions are moving in the right direction with consistent adherence.";

    case "regression":
      const worsenedDimensions = changes
        .filter((c) => c.direction === "worsened")
        .map((c) => c.dimension)
        .join(" and ");
      return `${capitalize(worsenedDimensions)} declined since your last scan. This may indicate inconsistent adherence, barrier stress, or need for protocol adjustment.`;

    case "plateau":
      const hasAnyChange = changes.some((c) => c.direction !== "unchanged");
      if (!hasAnyChange) {
        return "Your skin condition is stable with no significant changes. This may indicate maintenance phase or need for protocol adjustment.";
      }
      return "Mixed progress across dimensions. Some metrics improved while others remained stable or declined. Continue monitoring.";

    default:
      return "Insufficient comparison data.";
  }
}

/**
 * Generate "Continue or Adjust" action guidance.
 */
function generateActionGuidance(changes: DimensionChange[], state: ProofState): string {
  switch (state) {
    case "clear_improvement":
      return "Continue your current protocol. Maintain consistency to compound these results.";

    case "regression":
      const hasBarrierDecline = changes.find((c) => c.dimension === "barrier" && c.direction === "worsened");
      if (hasBarrierDecline) {
        return "Consider reducing active frequency and prioritizing barrier repair for 1-2 weeks before retaking analysis.";
      }
      return "Review adherence patterns and consider retaking analysis after 7 days of consistent protocol completion.";

    case "plateau":
      return "If consistent for 3+ weeks, consider retaking analysis to adjust protocol. Otherwise, maintain current routine and monitor response.";

    default:
      return "Follow your protocol consistently and return for your next scan.";
  }
}

/**
 * Helper: capitalize first letter.
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get formatted direction label for UI display.
 */
export function getDirectionLabel(direction: ChangeDirection): string {
  switch (direction) {
    case "improved":
      return "Improved";
    case "worsened":
      return "Worsened";
    case "unchanged":
      return "Unchanged";
  }
}

/**
 * Get direction color for UI display.
 */
export function getDirectionColor(direction: ChangeDirection): string {
  switch (direction) {
    case "improved":
      return "text-green-600 dark:text-green-400";
    case "worsened":
      return "text-red-600 dark:text-red-400";
    case "unchanged":
      return "text-yellow-600 dark:text-yellow-400";
  }
}

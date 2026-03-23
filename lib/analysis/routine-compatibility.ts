/**
 * Routine Compatibility Bridge
 * Converts between new Routine structure and legacy AnalysisResult structure
 * Enables dashboard to work with data from check-in-shell-v2
 */

import type { SkinProfile } from "@/types/skin-profile";
import type { Routine, RegimenStep } from "@/types/regimen";
import type { AnalysisResult, RoutineStep, SkinScores, RankedConcern } from "@/types/analysis";

/**
 * Convert RegimenStep to RoutineStep
 */
function convertRegimenStep(step: RegimenStep, index: number, timeOfDay: "am" | "pm"): RoutineStep {
  return {
    id: `${timeOfDay}_${step.role}`,
    step: step.label,
    products: undefined, // Dashboard doesn't use this for display
    affects: undefined,  // Dashboard doesn't use this for display
  };
}

/**
 * Generate ranked concerns from profile
 */
function generateRankedConcerns(profile: SkinProfile): RankedConcern[] {
  const concerns: RankedConcern[] = [];

  // Map priority goal to primary concern
  const goalToConcern: Record<string, string> = {
    breakout_control: "Active breakouts",
    texture_smooth: "Rough texture",
    redness_calm: "Redness and sensitivity",
    barrier_strengthen: "Compromised barrier",
    hydration_boost: "Dehydration",
  };

  if (profile.priorityGoal) {
    concerns.push({
      concern: goalToConcern[profile.priorityGoal] || "Skin health maintenance",
      score: 80,
      priority: "high" as const,
    });
  }

  return concerns;
}

/**
 * Generate minimal scores from profile
 */
function generateScoresFromProfile(profile: SkinProfile): SkinScores {
  // Create minimal valid scores for dashboard compatibility
  return {
    acne_severity: profile.breakoutProneness === "persistent" ? 75 : profile.breakoutProneness === "frequent" ? 50 : 20,
    oil_production: profile.oiliness === "oily_all" ? 70 : profile.oiliness === "oily_tzone" ? 45 : 25,
    dryness_dehydration: profile.hydrationNeed === "high" ? 60 : 30,
    sensitivity_reactivity: profile.sensitivity === "reactive" ? 75 : profile.sensitivity === "moderate" ? 45 : 20,
    barrier_health: 70, // Default reasonable barrier health
    overall_condition: 65, // Default
  };
}

/**
 * Convert new Routine + SkinProfile to legacy AnalysisResult
 * Enables dashboard to consume data from check-in-shell-v2
 */
export function convertToAnalysisResult(routine: Routine, profile: SkinProfile): AnalysisResult {
  const scores = generateScoresFromProfile(profile);
  const ranked_concerns = generateRankedConcerns(profile);

  // Convert routine steps
  const am_routine: RoutineStep[] = routine.am.map((step, idx) =>
    convertRegimenStep(step, idx, "am")
  );
  const pm_routine: RoutineStep[] = routine.pm.map((step, idx) =>
    convertRegimenStep(step, idx, "pm")
  );

  // Generate profile label from goal
  const goalToLabel: Record<string, string> = {
    breakout_control: "Acne-Prone + Active",
    texture_smooth: "Texture Refinement",
    redness_calm: "Sensitive + Reactive",
    barrier_strengthen: "Barrier Compromised",
    hydration_boost: "Dehydrated",
  };

  return {
    // Core profile
    profile_label: goalToLabel[profile.priorityGoal] || "Balanced Maintenance",
    profile_maturity: "Initial Profile",
    summary: `Personalized routine for ${profile.priorityGoal?.replace(/_/g, " ") || "skin health"}`,

    // Scoring
    scores,
    confidence_score: 85,
    confidence_label: "High confidence profile",

    // Concerns
    ranked_concerns,
    concern_clusters: ranked_concerns.map(c => c.concern),
    barrier_risk: profile.sensitivity === "reactive" ? "Elevated" : "Low",

    // Routines
    am_routine,
    pm_routine,

    // Guidance
    next_tests: [],
  };
}

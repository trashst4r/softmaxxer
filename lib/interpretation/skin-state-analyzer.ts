/**
 * Sprint 14: Pro Interpretation Layer
 * Causal skin state analysis - explains WHY skin behaves this way.
 * Deterministic, data-driven, no pseudoscience.
 */

import type { AnalysisResult } from "@/types/analysis";

export interface SkinStateInterpretation {
  primaryDriver: string;
  secondaryFactors: string[];
  causalExplanation: string;
  underlyingPattern: string;
}

/**
 * Analyze skin state and generate causal interpretation.
 * Based on score patterns, concerns, and barrier health.
 */
export function interpretSkinState(result: AnalysisResult): SkinStateInterpretation {
  const { scores, ranked_concerns, barrier_risk } = result;

  // Identify primary driver based on highest problem score
  let primaryDriver = "";
  let primaryScore = 0;

  const problemScores = [
    { name: "barrier dysfunction", score: 100 - scores.barrier_health },
    { name: "sebum overproduction", score: scores.oil_production },
    { name: "dehydration", score: scores.dryness_dehydration },
    { name: "inflammatory reactivity", score: scores.sensitivity_reactivity },
    { name: "comedogenic activity", score: scores.acne_severity },
  ];

  for (const problem of problemScores) {
    if (problem.score > primaryScore) {
      primaryScore = problem.score;
      primaryDriver = problem.name;
    }
  }

  // Identify secondary factors (scores > 40)
  const secondaryFactors = problemScores
    .filter((p) => p.score > 40 && p.name !== primaryDriver)
    .map((p) => p.name);

  // Generate causal explanation based on pattern
  let causalExplanation = "";
  let underlyingPattern = "";

  if (scores.barrier_health < 60) {
    underlyingPattern = "Barrier-compromised state";
    causalExplanation =
      "Your barrier dysfunction is likely the root cause driving multiple symptoms. " +
      "When the moisture barrier is compromised, skin loses water faster (dehydration), becomes more reactive to external irritants (sensitivity), " +
      "and may overproduce sebum as a compensation mechanism. This creates a cascade where treating symptoms without addressing " +
      "barrier integrity will yield limited progress.";
  } else if (scores.oil_production > 70 && scores.acne_severity > 60) {
    underlyingPattern = "Sebaceous hyperactivity with follicular obstruction";
    causalExplanation =
      "Your skin shows high sebum production combined with pore-clogging activity. Excess sebum doesn't directly cause acne, but when " +
      "paired with abnormal keratinization (dead skin cells not shedding properly inside pores), it creates an environment where " +
      "C. acnes bacteria thrive. This explains why both oil control and exfoliation are protocol priorities.";
  } else if (scores.sensitivity_reactivity > 65) {
    underlyingPattern = "Heightened inflammatory response";
    causalExplanation =
      "Your skin shows increased sensitivity, meaning your inflammatory pathways activate more readily in response to triggers. " +
      "This can be genetic, but is often exacerbated by barrier weakness or histamine response. The protocol must introduce actives " +
      "slowly and prioritize anti-inflammatory support to avoid triggering further reactivity.";
  } else if (scores.dryness_dehydration > 60 && scores.barrier_health > 60) {
    underlyingPattern = "Hydration deficit without barrier compromise";
    causalExplanation =
      "Your skin shows dehydration despite decent barrier function, suggesting either environmental factors (dry climate, indoor heating) " +
      "or insufficient humectant use in your current routine. This is distinct from barrier damage - your skin can hold moisture, " +
      "it just needs more water content delivered and maintained.";
  } else {
    underlyingPattern = "Multifactorial imbalance";
    causalExplanation =
      "Your skin shows moderate issues across multiple dimensions without one dominant driver. This suggests a systemic approach is needed " +
      "rather than targeting a single concern. The protocol balances hydration, exfoliation, and barrier support simultaneously.";
  }

  return {
    primaryDriver,
    secondaryFactors,
    causalExplanation,
    underlyingPattern,
  };
}

/**
 * Generate priority framework - what to focus on first.
 */
export function generatePriorityFramework(result: AnalysisResult): {
  immediate: string;
  secondary: string;
  maintenance: string;
  reasoning: string;
} {
  const { scores, barrier_risk } = result;

  if (barrier_risk === "Elevated" || scores.barrier_health < 55) {
    return {
      immediate: "Barrier repair",
      secondary: "Hydration support",
      maintenance: "Pause actives temporarily",
      reasoning:
        "Barrier function must stabilize before introducing exfoliating actives. Attempting to treat acne or texture " +
        "while barrier is compromised will likely increase irritation and slow overall progress. Expect 2-4 weeks of barrier-focused " +
        "work before reintroducing actives at low frequency.",
    };
  }

  if (scores.acne_severity > 70) {
    return {
      immediate: "Follicular exfoliation (BHA/retinoid)",
      secondary: "Sebum regulation",
      maintenance: "Barrier protection during active use",
      reasoning:
        "Acne is your highest-scoring concern and requires keratolytic actives to address pore obstruction. However, these actives " +
        "are irritating, so barrier support must remain in the routine even while treating acne. SPF becomes non-negotiable.",
    };
  }

  if (scores.sensitivity_reactivity > 65) {
    return {
      immediate: "Anti-inflammatory support + barrier repair",
      secondary: "Slow active introduction",
      maintenance: "Avoid known irritants",
      reasoning:
        "Sensitivity is your limiting factor. Any protocol must be introduced gradually with careful monitoring for reactivity. " +
        "Even beneficial actives can trigger flares if introduced too quickly. Start 2x/week maximum, increase only if tolerated.",
    };
  }

  return {
    immediate: "Balanced multi-target approach",
    secondary: "Monitor for early wins",
    maintenance: "Consistency over intensity",
    reasoning:
      "No single concern dominates, so the protocol addresses hydration, exfoliation, and protection simultaneously. " +
      "Progress will be gradual across all dimensions rather than dramatic in one area.",
  };
}

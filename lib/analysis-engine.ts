import type { AnalysisAnswers, AnalysisResult, SkinScores } from "@/types/analysis";
import type { SkinProfile } from "./scoring/types";
import { calculateScores } from "./scoring";
import { deriveProfile, generateProfileSummary } from "./profile";
import { rankConcerns, determineBarrierRisk, generateConcernClusters } from "./concerns";
import { generateRegimen } from "./regimen";
import { profileToScores } from "./scoring/profileToScores";
import { generateWeeklyProtocol } from "./protocol/weekly-protocol";

/**
 * Sprint D5: Unified analysis using SkinProfile as single source of truth
 *
 * Takes SkinProfile directly and generates complete analysis.
 * SkinProfile → SkinScores → Regimen
 * This ensures displayed insights match generated recommendations.
 */
export function runAnalysisFromProfile(
  profile: SkinProfile,
  answers: AnalysisAnswers
): AnalysisResult {
  // Convert SkinProfile to SkinScores for regimen generation
  const scores = profileToScores(profile);

  // Derive profile label from scores
  const profile_label = deriveProfile(scores);
  const summary = generateProfileSummary(profile_label);

  // Rank concerns by severity
  const ranked_concerns = rankConcerns(scores);
  const concern_clusters = generateConcernClusters(ranked_concerns);
  const barrier_risk = determineBarrierRisk(scores);

  // Generate dynamic routines from scores
  const { am_routine, pm_routine } = generateRegimen(scores);

  // Generate weekly protocol (Sprint 20)
  const weekly_protocol = generateWeeklyProtocol(profile);

  // Generate next steps and observations
  const next_tests = generateNextTests(scores, profile_label, answers);

  // Calculate confidence score
  const confidence_score = calculateConfidence(answers, scores);

  return {
    // Core profile
    profile_label,
    profile_maturity: "Initial Profile",
    summary,

    // Scoring
    scores,
    confidence_score,

    // Concerns
    ranked_concerns,
    concern_clusters,
    barrier_risk,

    // Routines
    am_routine,
    pm_routine,

    // Weekly Protocol (Sprint 20)
    weekly_protocol,

    // Guidance
    next_tests,
  };
}

/**
 * Legacy analysis function (backwards compatibility)
 *
 * Core intelligence engine for Softmaxxer.
 * Orchestrates: answers → scores → profile → concerns → regimen
 *
 * Deterministic: same input always produces same output.
 * No external APIs, no randomness, no ML complexity.
 */
export function runAnalysis(answers: AnalysisAnswers): AnalysisResult {
  // Step 1: Calculate numeric scores from answers
  const scores = calculateScores(answers);

  // Step 2: Derive profile from score patterns
  const profile_label = deriveProfile(scores);
  const summary = generateProfileSummary(profile_label);

  // Step 3: Rank concerns by severity
  const ranked_concerns = rankConcerns(scores);
  const concern_clusters = generateConcernClusters(ranked_concerns);
  const barrier_risk = determineBarrierRisk(scores);

  // Step 4: Generate dynamic routines from scores
  const { am_routine, pm_routine } = generateRegimen(scores);

  // Step 5: Generate next steps and observations
  const next_tests = generateNextTests(scores, profile_label, answers);

  // Step 6: Calculate confidence score
  const confidence_score = calculateConfidence(answers, scores);

  return {
    // Core profile
    profile_label,
    profile_maturity: "Initial Profile",
    summary,

    // Scoring
    scores,
    confidence_score,

    // Concerns
    ranked_concerns,
    concern_clusters,
    barrier_risk,

    // Routines
    am_routine,
    pm_routine,

    // Guidance
    next_tests,
  };
}

/**
 * Generate personalized next tests and observations
 */
function generateNextTests(scores: SkinScores, profile: string, answers: AnalysisAnswers): string[] {
  const tests: string[] = [];

  // SPF usage
  if (answers.spf_usage !== "daily") {
    tests.push("Build a daily SPF 30+ habit — essential for any routine");
  }

  // Barrier health
  if (scores.barrier_health < 40) {
    tests.push("Pause actives temporarily and focus on hydration and barrier support");
    tests.push("Watch for reduced tightness and redness as your skin recovers");
  } else if (scores.barrier_health < 60) {
    tests.push("Scale back actives to 2-3x per week and see how your skin responds");
  }

  // Acne tracking
  if (scores.acne_severity > 50) {
    tests.push("Track what might be triggering breakouts over the next 2 weeks");
    tests.push("Consider spot-treating new breakouts with benzoyl peroxide 2.5%");
  }

  // Sensitivity
  if (scores.sensitivity_reactivity > 60) {
    tests.push("Patch-test new products on your jawline for 48 hours first");
    tests.push("Notice what environmental factors make redness worse");
  }

  // Retinoid introduction
  if (scores.barrier_health > 60 && scores.sensitivity_reactivity < 50 && scores.acne_severity < 60) {
    tests.push("Your skin might be ready for a gentle retinoid 2x per week");
  }

  // Oil control
  if (scores.oil_production > 70) {
    tests.push("Try niacinamide 10% serum to help with oil regulation");
  }

  // Hydration
  if (scores.dryness_dehydration > 60) {
    tests.push("Layer hyaluronic acid on damp skin before your moisturizer");
  }

  // Professional consultation
  if (scores.acne_severity > 75 || scores.barrier_health < 30) {
    tests.push("Consider seeing a dermatologist for prescription options");
  }

  // Limit to most relevant tests
  return tests.slice(0, 6);
}

/**
 * Calculate confidence score based on answer clarity and score variance
 */
function calculateConfidence(answers: AnalysisAnswers, scores: SkinScores): number {
  let confidence = 60; // Base confidence

  // Strong answer clarity boosts confidence
  const hasStrongOilSignal = answers.midday_oiliness === "low" || answers.midday_oiliness === "high";
  const hasStrongAcneSignal = answers.breakout_frequency === "rare" || answers.breakout_frequency === "frequent";
  const hasStrongSensitivitySignal = answers.sensitivity_level === "low" || answers.sensitivity_level === "high";

  if (hasStrongOilSignal) confidence += 10;
  if (hasStrongAcneSignal) confidence += 10;
  if (hasStrongSensitivitySignal) confidence += 10;

  // Clear dominant concern boosts confidence
  const scoreValues = [
    scores.acne_severity,
    scores.oil_production,
    scores.dryness_dehydration,
    scores.sensitivity_reactivity,
  ];
  const maxScore = Math.max(...scoreValues);
  const secondMaxScore = scoreValues.sort((a, b) => b - a)[1];

  if (maxScore > 70) {
    confidence += 10; // Clear dominant issue
  } else if (maxScore - secondMaxScore > 30) {
    confidence += 5; // One issue clearly above others
  }

  return Math.min(95, Math.max(60, Math.round(confidence)));
}

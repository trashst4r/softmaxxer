import type { AnalysisAnswers, SkinScores } from "@/types/analysis";

/**
 * Calculate deterministic skin scores from questionnaire answers.
 * All scores range from 0-100.
 * Higher scores indicate more severe condition (except barrier_health and overall_condition which are inverse).
 */
export function calculateScores(answers: AnalysisAnswers): SkinScores {
  const acne_severity = calculateAcneSeverity(answers);
  const oil_production = calculateOilProduction(answers);
  const dryness_dehydration = calculateDryness(answers);
  const sensitivity_reactivity = calculateSensitivity(answers);
  const barrier_health = calculateBarrierHealth(answers);
  const overall_condition = calculateOverallCondition({
    acne_severity,
    oil_production,
    dryness_dehydration,
    sensitivity_reactivity,
    barrier_health,
  });

  return {
    acne_severity,
    oil_production,
    dryness_dehydration,
    sensitivity_reactivity,
    barrier_health,
    overall_condition,
  };
}

function calculateAcneSeverity(answers: AnalysisAnswers): number {
  let score = 0;

  // Breakout frequency (0-50 base)
  switch (answers.breakout_frequency) {
    case "frequent":
      score += 50;
      break;
    case "occasional":
      score += 30;
      break;
    case "rare":
      score += 10;
      break;
  }

  // Breakout zones - more zones = more severe (0-30)
  const zoneCount = answers.breakout_zones.length;
  score += Math.min(zoneCount * 6, 30);

  // Primary goal acne (0-20 boost)
  if (answers.primary_goal === "acne") {
    score += 20;
  }

  return clamp(score, 0, 100);
}

function calculateOilProduction(answers: AnalysisAnswers): number {
  let score = 0;

  // Midday oiliness (0-50)
  switch (answers.midday_oiliness) {
    case "high":
      score += 50;
      break;
    case "moderate":
      score += 30;
      break;
    case "low":
      score += 10;
      break;
  }

  // Skin feel after cleansing (0-30)
  switch (answers.skin_feel_after_cleansing) {
    case "oily":
      score += 30;
      break;
    case "normal":
      score += 15;
      break;
    case "tight":
      score += 5;
      break;
  }

  // Primary goal oil control (0-20 boost)
  if (answers.primary_goal === "oil_control") {
    score += 20;
  }

  return clamp(score, 0, 100);
}

function calculateDryness(answers: AnalysisAnswers): number {
  let score = 0;

  // Flaking and dry patches (0-40)
  switch (answers.flaking_or_dry_patches) {
    case "clear":
      score += 40;
      break;
    case "mild":
      score += 25;
      break;
    case "none":
      score += 5;
      break;
  }

  // Skin feel after cleansing (0-35)
  switch (answers.skin_feel_after_cleansing) {
    case "tight":
      score += 35;
      break;
    case "normal":
      score += 15;
      break;
    case "oily":
      score += 0;
      break;
  }

  // Midday oiliness (inverse relationship) (0-25)
  switch (answers.midday_oiliness) {
    case "low":
      score += 25;
      break;
    case "moderate":
      score += 10;
      break;
    case "high":
      score += 0;
      break;
  }

  return clamp(score, 0, 100);
}

function calculateSensitivity(answers: AnalysisAnswers): number {
  let score = 0;

  // Sensitivity level (0-45)
  switch (answers.sensitivity_level) {
    case "high":
      score += 45;
      break;
    case "moderate":
      score += 30;
      break;
    case "low":
      score += 10;
      break;
  }

  // Visible redness (0-35)
  switch (answers.visible_redness) {
    case "high":
      score += 35;
      break;
    case "moderate":
      score += 20;
      break;
    case "low":
      score += 5;
      break;
  }

  // Primary goal redness (0-20 boost)
  if (answers.primary_goal === "redness") {
    score += 20;
  }

  return clamp(score, 0, 100);
}

function calculateBarrierHealth(answers: AnalysisAnswers): number {
  let score = 100; // Start at perfect, deduct for issues (inverse score)

  // Current active use - mixed actives stress barrier
  switch (answers.current_active_use) {
    case "mixed":
      score -= 50;
      break;
    case "retinoid":
    case "benzoyl_peroxide":
      score -= 30;
      break;
    case "salicylic":
      score -= 20;
      break;
    case "none":
      score -= 0;
      break;
  }

  // Flaking indicates barrier damage
  switch (answers.flaking_or_dry_patches) {
    case "clear":
      score -= 30;
      break;
    case "mild":
      score -= 15;
      break;
    case "none":
      score -= 0;
      break;
  }

  // High sensitivity indicates barrier weakness
  switch (answers.sensitivity_level) {
    case "high":
      score -= 20;
      break;
    case "moderate":
      score -= 10;
      break;
    case "low":
      score -= 0;
      break;
  }

  // SPF usage protects barrier
  switch (answers.spf_usage) {
    case "never":
      score -= 15;
      break;
    case "sometimes":
      score -= 8;
      break;
    case "daily":
      score += 5; // Slight boost for good habits
      break;
  }

  return clamp(score, 0, 100);
}

function calculateOverallCondition(scores: Omit<SkinScores, "overall_condition">): number {
  // Overall condition is inverse - higher is better
  // Start at 100 and deduct for issues

  let score = 100;

  // Deduct for severity issues (weighted)
  score -= scores.acne_severity * 0.25; // Max deduction 25
  score -= scores.oil_production * 0.15; // Max deduction 15
  score -= scores.dryness_dehydration * 0.20; // Max deduction 20
  score -= scores.sensitivity_reactivity * 0.20; // Max deduction 20

  // Barrier health influences overall (already inverse, so add it back weighted)
  score += (scores.barrier_health - 50) * 0.40; // Can range -20 to +20

  return clamp(score, 0, 100);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

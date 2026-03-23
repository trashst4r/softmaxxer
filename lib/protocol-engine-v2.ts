/**
 * Sprint 24.4: Protocol Engine V2
 * Processes 12-question diagnostic input into weekly protocol
 */

import type {
  DiagnosticInput,
  CheckInAnswers,
  PrimaryConcern,
  BarrierState,
  SPFCompliance,
  BreakoutPattern,
  SunSensitivity,
} from "@/types/diagnostic-input";
import type { SkinProfile } from "@/types/skin-profile";
import type { Routine } from "@/types/regimen";
import type { IngredientFamily, ToleranceTier, WeeklyProtocol } from "@/lib/protocol/protocol-types";
import { generateWeeklyProtocol } from "@/lib/protocol/weekly-protocol";
import { convertToAnalysisResult } from "@/lib/analysis/routine-compatibility";
import { buildRoutineFromProfile } from "@/lib/analysis/build-routine-from-profile";

/**
 * Transform raw check-in answers to DiagnosticInput
 */
function transformAnswers(answers: CheckInAnswers): DiagnosticInput {
  return {
    primaryConcern: answers.primary_concern as any,
    secondaryConcern: answers.secondary_concern as any,
    oilProfile: answers.oil_profile as any,
    dehydrationLevel: answers.dehydration as any,
    barrierState: answers.barrier_state as any,
    sensitivity: answers.sensitivity as any,
    breakoutPattern: answers.breakout_pattern as any,
    activesExperience: answers.actives_experience as any,
    currentActives: answers.current_actives as any,
    spfCompliance: answers.spf_compliance as any,
    ageGroup: answers.age_group as any,
    sunSensitivity: answers.sun_sensitivity as any,
  };
}

/**
 * Calculate tolerance tier from multiple inputs
 */
function calculateToleranceTier(input: DiagnosticInput): ToleranceTier {
  const { barrierState, sensitivity, activesExperience } = input;

  // Safety override: compromised or damaged barrier = beginner
  if (barrierState === "irritated" || barrierState === "damaged") {
    return "beginner";
  }

  // Advanced: low sensitivity + advanced experience + calm barrier
  if (
    sensitivity === "rarely_reacts" &&
    activesExperience === "advanced" &&
    barrierState === "calm"
  ) {
    return "advanced";
  }

  // Moderate: moderate sensitivity + regular experience
  if (
    sensitivity === "sometimes_irritated" &&
    (activesExperience === "regular" || activesExperience === "occasional")
  ) {
    return "moderate";
  }

  // Cautious: high sensitivity OR sensitive barrier OR occasional experience
  if (
    sensitivity === "often_reactive" ||
    barrierState === "slightly_sensitive" ||
    activesExperience === "occasional"
  ) {
    return "cautious";
  }

  // Default: beginner
  return "beginner";
}

/**
 * Calculate pigmentation risk from sun sensitivity
 */
function calculatePigmentRisk(sunSensitivity: SunSensitivity): "low" | "moderate" | "high" | "very_high" {
  switch (sunSensitivity) {
    case "burns_easily":
      return "high"; // Fitzpatrick I-II
    case "sometimes_burns":
      return "moderate"; // Fitzpatrick III
    case "rarely_burns":
      return "moderate"; // Fitzpatrick IV
    case "never_burns":
      return "very_high"; // Fitzpatrick V-VI (high PIH risk)
    default:
      return "moderate";
  }
}

/**
 * Select hero active based on concern and constraints
 */
function selectHeroActive(input: DiagnosticInput, toleranceTier: ToleranceTier): IngredientFamily {
  const { primaryConcern, barrierState, spfCompliance, breakoutPattern, sunSensitivity } = input;
  const pigmentRisk = calculatePigmentRisk(sunSensitivity);

  // Safety override: barrier compromised or damaged
  if (barrierState === "irritated" || barrierState === "damaged") {
    return "barrier-support";
  }

  switch (primaryConcern) {
    case "acne":
      return selectAcneActive(breakoutPattern, barrierState, pigmentRisk, toleranceTier);

    case "pigmentation":
      // SPF gate
      if (spfCompliance === "never") {
        return "niacinamide"; // SPF-independent
      }
      // High PIH risk → azelaic (gentle, anti-inflammatory)
      if (pigmentRisk === "high" || pigmentRisk === "very_high") {
        return "azelaic-acid";
      }
      // Advanced + daily SPF → vitamin C
      if (toleranceTier === "advanced" && spfCompliance === "daily") {
        return "vitamin-c";
      }
      return "azelaic-acid";

    case "texture":
      // SPF gate
      if (spfCompliance === "never") {
        return "niacinamide";
      }
      // Tier-based exfoliant selection
      if (toleranceTier === "beginner" || toleranceTier === "cautious") {
        return "lactic-acid"; // Gentle AHA
      }
      if (toleranceTier === "moderate") {
        return "glycolic-acid";
      }
      // Advanced + daily SPF → retinoid
      if (spfCompliance === "daily") {
        return "retinoid";
      }
      return "glycolic-acid";

    case "aging":
      // SPF gate
      if (spfCompliance === "never") {
        return "peptides";
      }
      // Sensitive barrier or beginner → peptides
      if (barrierState === "slightly_sensitive" || toleranceTier === "beginner") {
        return "peptides";
      }
      return "retinoid";

    case "redness":
      return "azelaic-acid"; // Anti-inflammatory

    case "dehydration":
      return "hydrating-serum";

    default:
      return "niacinamide";
  }
}

/**
 * Select acne-specific active
 */
function selectAcneActive(
  breakoutPattern: BreakoutPattern,
  barrierState: BarrierState,
  pigmentRisk: "low" | "moderate" | "high" | "very_high",
  toleranceTier: ToleranceTier
): IngredientFamily {
  // High PIH risk → avoid BP (can cause dark marks)
  if (pigmentRisk === "high" || pigmentRisk === "very_high") {
    return "azelaic-acid";
  }

  switch (breakoutPattern) {
    case "comedonal":
      return "salicylic-acid"; // BHA for clogged pores

    case "inflamed":
      if (barrierState === "slightly_sensitive" || toleranceTier === "beginner") {
        return "azelaic-acid"; // Gentler than BP
      }
      return "benzoyl-peroxide";

    case "cystic":
      if (toleranceTier === "beginner" || toleranceTier === "cautious") {
        return "azelaic-acid";
      }
      return "adapalene-retinoid"; // Most effective for cystic

    case "occasional":
      return "niacinamide"; // Gentle support

    case "none":
    default:
      return "niacinamide";
  }
}

/**
 * Convert DiagnosticInput to legacy SkinProfile format for compatibility
 */
function convertToLegacySkinProfile(input: DiagnosticInput): SkinProfile {
  // Map oil profile
  let oiliness: "dry" | "balanced" | "oily_tzone" | "oily_all" = "balanced";
  if (input.oilProfile === "dry") oiliness = "dry";
  else if (input.oilProfile === "oily") oiliness = "oily_all";
  else if (input.oilProfile === "combination") oiliness = "oily_tzone";

  // Map sensitivity
  let sensitivity: "resilient" | "moderate" | "reactive" = "moderate";
  if (input.sensitivity === "rarely_reacts") sensitivity = "resilient";
  else if (input.sensitivity === "often_reactive") sensitivity = "reactive";

  // Map breakout proneness
  let breakoutProneness: "rare" | "occasional" | "frequent" | "persistent" = "rare";
  if (input.breakoutPattern === "occasional") breakoutProneness = "occasional";
  else if (input.breakoutPattern === "comedonal" || input.breakoutPattern === "inflamed") {
    breakoutProneness = "frequent";
  } else if (input.breakoutPattern === "cystic") breakoutProneness = "persistent";

  // Map hydration need
  let hydrationNeed: "low" | "high" = "low";
  if (input.oilProfile === "dry" || input.dehydrationLevel === "often") {
    hydrationNeed = "high";
  }

  // Map priority goal
  let priorityGoal: "breakout_control" | "hydration_restore" | "redness_calm" | "barrier_strengthen" | "texture_smooth" =
    "barrier_strengthen";
  if (input.primaryConcern === "acne") priorityGoal = "breakout_control";
  else if (input.primaryConcern === "dehydration") priorityGoal = "hydration_restore";
  else if (input.primaryConcern === "redness") priorityGoal = "redness_calm";
  else if (input.primaryConcern === "texture") priorityGoal = "texture_smooth";

  return {
    oiliness,
    sensitivity,
    breakoutProneness,
    hydrationNeed,
    priorityGoal,
    hasActiveExperience: input.activesExperience !== "never",
    needsSpfEducation: input.spfCompliance !== "daily",
    prefersMinimalRoutine: false,
  };
}

/**
 * Convert DiagnosticInput to numeric scores for weekly protocol engine
 */
function convertToNumericProfile(input: DiagnosticInput) {
  // Acne score from breakout pattern
  let acne = 0;
  if (input.breakoutPattern === "occasional") acne = 30;
  else if (input.breakoutPattern === "comedonal") acne = 50;
  else if (input.breakoutPattern === "inflamed") acne = 70;
  else if (input.breakoutPattern === "cystic") acne = 85;

  // Oil score from oil profile
  let oil = 50;
  if (input.oilProfile === "dry") oil = 15;
  else if (input.oilProfile === "balanced") oil = 50;
  else if (input.oilProfile === "combination") oil = 65;
  else if (input.oilProfile === "oily") oil = 85;

  // Barrier score from barrier state
  let barrier = 70;
  if (input.barrierState === "calm") barrier = 85;
  else if (input.barrierState === "slightly_sensitive") barrier = 60;
  else if (input.barrierState === "irritated") barrier = 35;
  else if (input.barrierState === "damaged") barrier = 15;

  // Sensitivity score
  let sensitivity = 40;
  if (input.sensitivity === "rarely_reacts") sensitivity = 20;
  else if (input.sensitivity === "sometimes_irritated") sensitivity = 50;
  else if (input.sensitivity === "often_reactive") sensitivity = 80;

  // Tolerance score from actives experience
  let tolerance = 30;
  if (input.activesExperience === "never") tolerance = 10;
  else if (input.activesExperience === "occasional") tolerance = 35;
  else if (input.activesExperience === "regular") tolerance = 65;
  else if (input.activesExperience === "advanced") tolerance = 90;

  // UV risk score from SPF compliance (inverted)
  let uvRisk = 50;
  if (input.spfCompliance === "daily") uvRisk = 10;
  else if (input.spfCompliance === "sometimes") uvRisk = 45;
  else if (input.spfCompliance === "never") uvRisk = 85;

  return {
    acne,
    oil,
    barrier,
    sensitivity,
    tolerance,
    uvRisk,
  };
}

/**
 * Main entry point: generate protocol from diagnostic
 */
export function generateProtocolFromDiagnostic(answers: CheckInAnswers) {
  const input = transformAnswers(answers);
  const toleranceTier = calculateToleranceTier(input);
  const heroActive = selectHeroActive(input, toleranceTier);

  // Convert to numeric profile for weekly protocol engine
  const numericProfile = convertToNumericProfile(input);

  // Generate weekly protocol
  const weeklyProtocol = generateWeeklyProtocol(numericProfile);

  // Convert to legacy formats for compatibility
  const legacyProfile = convertToLegacySkinProfile(input);
  const legacyRoutine = buildRoutineFromProfile(legacyProfile);
  const analysisResult = convertToAnalysisResult(legacyRoutine, legacyProfile);

  // Add weekly protocol to analysis result
  analysisResult.weekly_protocol = weeklyProtocol;

  return {
    profile: legacyProfile,
    routine: legacyRoutine,
    analysisResult,
    diagnosticInput: input,
  };
}

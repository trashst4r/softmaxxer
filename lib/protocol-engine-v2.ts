/**
 * Sprint 24.4: Protocol Engine V2
 * Processes 12-question diagnostic input into weekly protocol
 */

import type {
  DiagnosticInput,
  CheckInAnswers,
} from "@/types/diagnostic-input";
import type { SkinProfile } from "@/types/skin-profile";
import type { Routine } from "@/types/regimen";
import { generateWeeklyProtocolFromDiagnostic } from "@/lib/protocol/weekly-protocol-v2";
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
 * Main entry point: generate protocol from diagnostic
 * Sprint 24.5: Canonical path - DiagnosticInput directly to WeeklyProtocol
 */
export function generateProtocolFromDiagnostic(answers: CheckInAnswers) {
  // Transform raw answers to normalized DiagnosticInput
  const input = transformAnswers(answers);

  // CANONICAL PATH: Generate weekly protocol directly from diagnostic input
  const weeklyProtocol = generateWeeklyProtocolFromDiagnostic(input);

  // LEGACY UI COMPATIBILITY: Generate SkinProfile and Routine for results page
  const legacyProfile = convertToLegacySkinProfile(input);
  const legacyRoutine = buildRoutineFromProfile(legacyProfile);
  const analysisResult = convertToAnalysisResult(legacyRoutine, legacyProfile);

  // Attach weekly protocol to analysis result for protocol page
  analysisResult.weekly_protocol = weeklyProtocol;

  return {
    profile: legacyProfile,
    routine: legacyRoutine,
    analysisResult,
    diagnosticInput: input,
  };
}

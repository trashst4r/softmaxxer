/**
 * Profile Encoder v1
 * Serializes SkinProfile to compact URL-safe string
 */

import type {
  SkinProfile,
  OilinessLevel,
  SensitivityLevel,
  BreakoutProneness,
  HydrationNeed,
  PriorityGoal,
} from "@/types/skin-profile";

// Compact encoding maps
const OILINESS_MAP: Record<OilinessLevel, string> = {
  dry: "d",
  balanced: "b",
  oily_tzone: "t",
  oily_all: "a",
};

const SENSITIVITY_MAP: Record<SensitivityLevel, string> = {
  resilient: "r",
  moderate: "m",
  reactive: "x",
};

const BREAKOUT_MAP: Record<BreakoutProneness, string> = {
  rare: "r",
  occasional: "o",
  frequent: "f",
  persistent: "p",
};

const HYDRATION_MAP: Record<HydrationNeed, string> = {
  low: "l",
  high: "h",
};

const GOAL_MAP: Record<PriorityGoal, string> = {
  breakout_control: "b",
  hydration_restore: "h",
  redness_calm: "r",
  barrier_strengthen: "s",
  texture_smooth: "t",
};

// Reverse maps for decoding
const OILINESS_REVERSE = Object.fromEntries(
  Object.entries(OILINESS_MAP).map(([k, v]) => [v, k])
) as Record<string, OilinessLevel>;

const SENSITIVITY_REVERSE = Object.fromEntries(
  Object.entries(SENSITIVITY_MAP).map(([k, v]) => [v, k])
) as Record<string, SensitivityLevel>;

const BREAKOUT_REVERSE = Object.fromEntries(
  Object.entries(BREAKOUT_MAP).map(([k, v]) => [v, k])
) as Record<string, BreakoutProneness>;

const HYDRATION_REVERSE = Object.fromEntries(
  Object.entries(HYDRATION_MAP).map(([k, v]) => [v, k])
) as Record<string, HydrationNeed>;

const GOAL_REVERSE = Object.fromEntries(
  Object.entries(GOAL_MAP).map(([k, v]) => [v, k])
) as Record<string, PriorityGoal>;

/**
 * Encode SkinProfile to compact URL-safe string
 * Format: oiliness|sensitivity|breakout|hydration|goal|flags
 * Example: "b|m|o|h|b|101" = balanced, moderate, occasional, high hydration, breakout control, active exp, no spf edu, minimal routine
 */
export function encodeProfile(profile: SkinProfile): string {
  const parts = [
    OILINESS_MAP[profile.oiliness],
    SENSITIVITY_MAP[profile.sensitivity],
    BREAKOUT_MAP[profile.breakoutProneness],
    HYDRATION_MAP[profile.hydrationNeed],
    GOAL_MAP[profile.priorityGoal],
    `${profile.hasActiveExperience ? "1" : "0"}${profile.needsSpfEducation ? "1" : "0"}${profile.prefersMinimalRoutine ? "1" : "0"}`,
  ];

  // Join with pipe and base64 encode for URL safety
  const raw = parts.join("|");
  return btoa(raw);
}

/**
 * Decode URL-safe string back to SkinProfile
 */
export function decodeProfile(encoded: string): SkinProfile | null {
  try {
    const raw = atob(encoded);
    const parts = raw.split("|");

    if (parts.length !== 6) {
      console.error("Invalid profile encoding: wrong number of parts");
      return null;
    }

    const [oiliness, sensitivity, breakout, hydration, goal, flags] = parts;

    if (flags.length !== 3) {
      console.error("Invalid profile encoding: flags must be 3 characters");
      return null;
    }

    return {
      oiliness: OILINESS_REVERSE[oiliness],
      sensitivity: SENSITIVITY_REVERSE[sensitivity],
      breakoutProneness: BREAKOUT_REVERSE[breakout],
      hydrationNeed: HYDRATION_REVERSE[hydration],
      priorityGoal: GOAL_REVERSE[goal],
      hasActiveExperience: flags[0] === "1",
      needsSpfEducation: flags[1] === "1",
      prefersMinimalRoutine: flags[2] === "1",
    };
  } catch (error) {
    console.error("Failed to decode profile:", error);
    return null;
  }
}

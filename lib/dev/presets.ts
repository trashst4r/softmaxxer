/**
 * Deterministic Preset Profiles for Media/Demo Rendering
 *
 * These presets provide stable, screenshot-ready states for dashboard and results
 * without requiring live check-in flow or localStorage setup.
 *
 * Each preset is a complete categorical SkinProfile object representing a distinct
 * clinical state: balanced, texture-focus, or barrier-risk.
 *
 * NOT a substitute for future auth/database state. Used for:
 * - Media capture (screenshots, videos)
 * - Stakeholder review
 * - UI validation
 * - Demo environments
 */

import type { SkinProfile } from "@/types/skin-profile";

/**
 * Preset identifiers
 */
export type PresetName = "balanced" | "texture" | "barrier";

/**
 * Canonical Preset Profiles
 * Each preset is a complete, valid SkinProfile with all required fields
 */
const PRESETS: Record<PresetName, SkinProfile> = {
  /**
   * BALANCED PRESET
   * Represents healthy, stable skin with minimal concerns
   * Protocol: Balanced Maintenance
   * Badge: BALANCED
   */
  balanced: {
    oiliness: "balanced",
    sensitivity: "resilient",
    breakoutProneness: "rare",
    hydrationNeed: "low",
    priorityGoal: "hydration_restore", // Maintenance hydration

    // Context flags
    hasActiveExperience: true,
    needsSpfEducation: false,
    prefersMinimalRoutine: true,
  },

  /**
   * TEXTURE PRESET
   * Represents texture concerns with active breakout management
   * Protocol: Texture Refinement / Acne-Prone + Active
   * Badge: TEXTURE FOCUS
   */
  texture: {
    oiliness: "oily_all",
    sensitivity: "moderate",
    breakoutProneness: "persistent",
    hydrationNeed: "low",
    priorityGoal: "texture_smooth",

    // Context flags
    hasActiveExperience: true,
    needsSpfEducation: false,
    prefersMinimalRoutine: false,
  },

  /**
   * BARRIER PRESET
   * Represents compromised barrier with reactive sensitivity
   * Protocol: Barrier Compromised + Dehydrated
   * Badge: BARRIER RISK
   */
  barrier: {
    oiliness: "dry",
    sensitivity: "reactive",
    breakoutProneness: "rare",
    hydrationNeed: "high",
    priorityGoal: "barrier_strengthen",

    // Context flags
    hasActiveExperience: true,
    needsSpfEducation: false,
    prefersMinimalRoutine: false,
  },
};

/**
 * Get preset profile by name
 * Returns a complete SkinProfile object for the requested preset
 */
export function getPresetProfile(presetName: PresetName): SkinProfile {
  return PRESETS[presetName];
}

/**
 * Get all available preset names
 */
export function getPresetNames(): PresetName[] {
  return Object.keys(PRESETS) as PresetName[];
}

/**
 * Check if a string is a valid preset name
 */
export function isValidPresetName(name: string): name is PresetName {
  return name in PRESETS;
}

/**
 * Get preset profile with validation
 * Returns preset if valid, undefined if invalid
 */
export function getValidatedPreset(name: string | null): SkinProfile | undefined {
  if (!name || !isValidPresetName(name)) {
    return undefined;
  }
  return getPresetProfile(name);
}

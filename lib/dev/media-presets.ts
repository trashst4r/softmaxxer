/**
 * Dev Tools Media Sandbox v1
 * Named presets for common screenshot and media scenarios
 */

import type { MediaPreset } from "@/types/dev-media-state";

/**
 * Preset 1: Oily Acne Active User (High Adherence)
 * Good for showcasing breakout control routines and active ingredient usage
 */
const oilyAcneActive: MediaPreset = {
  id: "oily-acne-active",
  name: "Oily/Acne - Active User",
  description: "Frequent breakouts, experienced with actives, high adherence",
  state: {
    oiliness: "oily_all",
    sensitivity: "resilient",
    breakoutProneness: "frequent",
    hydrationNeed: "low",
    priorityGoal: "breakout_control",
    hasActiveExperience: true,
    needsSpfEducation: false,
    prefersMinimalRoutine: false,
    adherencePercentage: 92,
    currentStreak: 14,
    totalCheckIns: 28,
    lastCheckInDays: 1,
  },
};

/**
 * Preset 2: Dry Barrier Recovery (Moderate Adherence)
 * Good for showcasing gentle hydration and barrier support
 */
const dryBarrierRecovery: MediaPreset = {
  id: "dry-barrier-recovery",
  name: "Dry/Sensitive - Barrier Focus",
  description: "Reactive skin recovering, gentle routine, moderate adherence",
  state: {
    oiliness: "dry",
    sensitivity: "reactive",
    breakoutProneness: "rare",
    hydrationNeed: "high",
    priorityGoal: "barrier_strengthen",
    hasActiveExperience: false,
    needsSpfEducation: true,
    prefersMinimalRoutine: true,
    adherencePercentage: 68,
    currentStreak: 3,
    totalCheckIns: 12,
    lastCheckInDays: 2,
  },
};

/**
 * Preset 3: Balanced Maintenance (Optimal State)
 * Good for showcasing stable, well-maintained routines
 */
const balancedMaintenance: MediaPreset = {
  id: "balanced-maintenance",
  name: "Balanced - Maintenance Mode",
  description: "Stable skin, experienced user, consistent adherence",
  state: {
    oiliness: "balanced",
    sensitivity: "resilient",
    breakoutProneness: "rare",
    hydrationNeed: "low",
    priorityGoal: "texture_smooth",
    hasActiveExperience: true,
    needsSpfEducation: false,
    prefersMinimalRoutine: false,
    adherencePercentage: 88,
    currentStreak: 21,
    totalCheckIns: 45,
    lastCheckInDays: 0,
  },
};

/**
 * Preset 4: Combination Texture Focus (New User)
 * Good for showcasing texture improvement and active introduction
 */
const combinationTextureNew: MediaPreset = {
  id: "combination-texture-new",
  name: "Combination - Texture Beginner",
  description: "T-zone oily, new to actives, texture concerns",
  state: {
    oiliness: "oily_tzone",
    sensitivity: "moderate",
    breakoutProneness: "occasional",
    hydrationNeed: "low",
    priorityGoal: "texture_smooth",
    hasActiveExperience: false,
    needsSpfEducation: true,
    prefersMinimalRoutine: false,
    adherencePercentage: 52,
    currentStreak: 2,
    totalCheckIns: 5,
    lastCheckInDays: 1,
  },
};

/**
 * Preset 5: Redness Calm (High Need)
 * Good for showcasing calming treatments and sensitivity management
 */
const rednessCalmHighNeed: MediaPreset = {
  id: "redness-calm-high-need",
  name: "Sensitive - Redness Focus",
  description: "Reactive skin, redness concern, gentle approach",
  state: {
    oiliness: "balanced",
    sensitivity: "reactive",
    breakoutProneness: "rare",
    hydrationNeed: "high",
    priorityGoal: "redness_calm",
    hasActiveExperience: false,
    needsSpfEducation: false,
    prefersMinimalRoutine: true,
    adherencePercentage: 76,
    currentStreak: 7,
    totalCheckIns: 18,
    lastCheckInDays: 1,
  },
};

/**
 * Preset 6: Hydration Restore (Recovery Mode)
 * Good for showcasing hydration-focused routines
 */
const hydrationRestore: MediaPreset = {
  id: "hydration-restore",
  name: "Dry - Hydration Recovery",
  description: "Very dry skin, hydration priority, building consistency",
  state: {
    oiliness: "dry",
    sensitivity: "moderate",
    breakoutProneness: "rare",
    hydrationNeed: "high",
    priorityGoal: "hydration_restore",
    hasActiveExperience: false,
    needsSpfEducation: false,
    prefersMinimalRoutine: false,
    adherencePercentage: 64,
    currentStreak: 5,
    totalCheckIns: 15,
    lastCheckInDays: 1,
  },
};

/**
 * Preset 7: High Performer (Aspirational)
 * Good for showcasing optimal adherence and results
 */
const highPerformer: MediaPreset = {
  id: "high-performer",
  name: "Power User - Peak Performance",
  description: "Experienced, resilient, excellent adherence, optimal state",
  state: {
    oiliness: "balanced",
    sensitivity: "resilient",
    breakoutProneness: "rare",
    hydrationNeed: "low",
    priorityGoal: "texture_smooth",
    hasActiveExperience: true,
    needsSpfEducation: false,
    prefersMinimalRoutine: false,
    adherencePercentage: 96,
    currentStreak: 42,
    totalCheckIns: 84,
    lastCheckInDays: 0,
  },
};

/**
 * Preset 8: Recovery Journey (Aspirational Progression)
 * Good for before/after narrative or case study materials
 */
const recoveryJourney: MediaPreset = {
  id: "recovery-journey",
  name: "Recovery Journey - Improving",
  description: "Persistent breakouts improving, building confidence",
  state: {
    oiliness: "oily_tzone",
    sensitivity: "moderate",
    breakoutProneness: "occasional", // Was persistent, now occasional
    hydrationNeed: "low",
    priorityGoal: "breakout_control",
    hasActiveExperience: true,
    needsSpfEducation: false,
    prefersMinimalRoutine: false,
    adherencePercentage: 84,
    currentStreak: 12,
    totalCheckIns: 32,
    lastCheckInDays: 0,
  },
};

/**
 * All available media presets
 */
export const mediaPresets: MediaPreset[] = [
  oilyAcneActive,
  dryBarrierRecovery,
  balancedMaintenance,
  combinationTextureNew,
  rednessCalmHighNeed,
  hydrationRestore,
  highPerformer,
  recoveryJourney,
];

/**
 * Default state for custom fabrication
 */
export const defaultMediaState = balancedMaintenance.state;

/**
 * Sprint 24.4: Unified Diagnostic Input Schema
 * 12-question normalized input for weekly protocol engine
 */

export type PrimaryConcern = "acne" | "pigmentation" | "redness" | "texture" | "aging" | "dehydration";
export type SecondaryConcern = "none" | "acne" | "pigmentation" | "redness" | "texture" | "aging" | "dehydration";
export type OilProfile = "dry" | "balanced" | "combination" | "oily";
export type DehydrationLevel = "none" | "sometimes" | "often";
export type BarrierState = "calm" | "slightly_sensitive" | "irritated" | "damaged";
export type SensitivityLevel = "rarely_reacts" | "sometimes_irritated" | "often_reactive";
export type BreakoutPattern = "none" | "occasional" | "comedonal" | "inflamed" | "cystic";
export type ActivesExperience = "never" | "occasional" | "regular" | "advanced";
export type CurrentActives = "none" | "mild" | "moderate" | "strong";
export type SPFCompliance = "never" | "sometimes" | "daily";
export type AgeGroup = "under25" | "25to34" | "35to44" | "45plus";
export type SunSensitivity = "burns_easily" | "sometimes_burns" | "rarely_burns" | "never_burns";

/**
 * Complete diagnostic input from 12-question check-in
 */
export interface DiagnosticInput {
  // Q1-Q2: Concerns
  primaryConcern: PrimaryConcern;
  secondaryConcern: SecondaryConcern;

  // Q3-Q4: Skin behavior
  oilProfile: OilProfile;
  dehydrationLevel: DehydrationLevel;

  // Q5-Q6: Barrier & tolerance
  barrierState: BarrierState;
  sensitivity: SensitivityLevel;

  // Q7: Acne specifics
  breakoutPattern: BreakoutPattern;

  // Q8-Q9: Actives history
  activesExperience: ActivesExperience;
  currentActives: CurrentActives;

  // Q10: Safety gate
  spfCompliance: SPFCompliance;

  // Q11-Q12: Context
  ageGroup: AgeGroup;
  sunSensitivity: SunSensitivity;
}

/**
 * Raw check-in answers (pre-transformation)
 */
export interface CheckInAnswers {
  primary_concern: string;
  secondary_concern: string;
  oil_profile: string;
  dehydration: string;
  barrier_state: string;
  sensitivity: string;
  breakout_pattern: string;
  actives_experience: string;
  current_actives: string;
  spf_compliance: string;
  age_group: string;
  sun_sensitivity: string;
}

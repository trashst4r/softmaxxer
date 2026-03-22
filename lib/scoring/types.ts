/**
 * Sprint D3: Scoring Engine Types
 *
 * Numeric skin profile representation for deterministic regimen generation
 */

export interface SkinProfile {
  // Core axes (0-100 scale)
  acne: number;          // 0 = clear, 100 = severe/constant breakouts
  oil: number;           // 0 = dry/tight, 100 = very oily all over
  barrier: number;       // 0 = compromised/sensitive, 100 = strong/resilient
  sensitivity: number;   // 0 = tolerant, 100 = highly reactive
  tolerance: number;     // 0 = can't handle actives, 100 = high tolerance
  uvRisk: number;        // 0 = daily SPF user, 100 = never uses SPF
}

export interface ScanSignals {
  // Mock face scan signals (0-100 scale)
  shine: number;         // Oil/shine detected
  redness: number;       // Redness/inflammation detected
  blemish: number;       // Blemish/acne detected
  texture: number;       // Texture irregularity detected
}

export type PrimaryConcern = "breakouts" | "dryness" | "redness" | "oiliness" | "texture";
export type SkinBehavior = "tight_dry" | "balanced" | "oily_tzone" | "oily_all";
export type Frequency = "rarely" | "sometimes" | "often" | "constant";
export type Sensitivity = "rarely" | "sometimes" | "very_easily";
export type SpfUsage = "yes" | "sometimes" | "no";
export type ActiveIngredient = "retinol" | "acids" | "vitamin_c" | "benzoyl_peroxide" | "other";

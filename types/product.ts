/**
 * Catalog Schema v1
 * Real product types for catalog-v1 integration
 * Sprint 18: Replaced legacy Pack1 types with canonical schema
 */

export type SkinSensitivity = "resilient" | "moderate" | "reactive";
export type BreakoutLevel = "rare" | "occasional" | "frequent" | "persistent";
export type OilinessLevel = "dry" | "balanced" | "oily_tzone" | "oily_all";
export type HydrationNeed = "low" | "high";
export type RoutineTime = "easy" | "manageable" | "too_much";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type Intensity = "low" | "moderate" | "high";
export type TextureWeight = "weightless" | "light" | "medium" | "rich" | "occlusive";
export type Finish = "natural" | "matte" | "dewy" | "glossy";
export type ProductRole =
  | "cleanser"
  | "moisturizer"
  | "sunscreen"
  | "serum"
  | "treatment"
  | "support"
  | "balm";

export type ProductCategory =
  | "cleanser_gentle"
  | "cleanser_gel"
  | "cleanser_active"
  | "moisturizer_gel"
  | "moisturizer_lotion"
  | "moisturizer_cream"
  | "repair_balm"
  | "sunscreen_chemical"
  | "sunscreen_mineral"
  | "sunscreen_tinted"
  | "vitamin_c"
  | "copper_peptide"
  | "bha"
  | "azelaic"
  | "niacinamide"
  | "benzoyl_peroxide"
  | "aha"
  | "retinoid"
  | "hydration_support"
  | "barrier_support"
  | "calming_support"
  | "face_oil";

export type ConcernTag =
  | "breakouts"
  | "dryness"
  | "redness"
  | "oiliness"
  | "texture"
  | "barrier"
  | "dullness"
  | "pigmentation"
  | "dehydration";

export interface SuitabilityMap<T extends string> {
  good: T[];
  okay?: T[];
  avoid?: T[];
}

export interface ProductSpec {
  id: string;
  brand: string;
  productName: string;
  fullName: string;

  role: ProductRole;
  category: ProductCategory;

  priceAUD: number | null;
  size: string | null;

  purchaseUrl: string | null;
  affiliateUrl: string | null;
  imageUrl: string | null;

  keyActives: string[];
  ingredientNotes: string[];
  freeFrom: string[];

  sensitivity: SuitabilityMap<SkinSensitivity>;
  breakout: SuitabilityMap<BreakoutLevel>;
  oiliness: SuitabilityMap<OilinessLevel>;
  hydration: SuitabilityMap<HydrationNeed>;
  routineTime: SuitabilityMap<RoutineTime>;

  concernTargets: ConcernTag[];
  barrierFriendly: boolean;
  pregnancyCaution: boolean;

  fragranceFree: boolean;
  essentialOilFree: boolean;
  alcoholFree: boolean;

  textureWeight: TextureWeight;
  finish: Finish;

  intensity: Intensity;
  experienceLevel: ExperienceLevel;

  dayPreferred: boolean;
  nightPreferred: boolean;
  amAllowed: boolean;
  pmAllowed: boolean;
  requiresSpf: boolean;

  incompatibleWith: string[];
  cautionNotes: string[];

  tags: string[];
}

// Legacy compatibility type alias
export type Product = ProductSpec;
export type ProductType = ProductRole;

/**
 * Sprint D10: Product Types (Simplified)
 * Clean product data model for catalog and matching
 */

export type PriceTier = "budget" | "core" | "premium";

export type StepType =
  | "cleanse"
  | "niacinamide"
  | "moisturize"
  | "spf"
  | "salicylic"
  | "retinoid"
  | "azelaic"
  | "benzoyl"
  | "hydrate"
  | "barrier_repair"
  | "oil_cleanse"
  | "occlusive";

export type SkinTarget =
  | "oil"
  | "acne"
  | "dry"
  | "sensitivity"
  | "barrier"
  | "redness"
  | "texture"
  | "aging"
  | "normal"
  | "all";

export type TextureType = "gel" | "cream" | "balm" | "oil" | "lotion" | "serum" | "foam";
export type FinishType = "matte" | "dewy" | "natural" | "satin";
export type AgeOptimization = "youth" | "prevention" | "mature" | "universal";

export interface CatalogProduct {
  id: string;
  brand: string;
  name: string;
  stepType: StepType;
  price: number;
  tier: PriceTier;
  roleLabel: string;
  skinTargets: SkinTarget[];

  // Sprint D13: Refinement layer metadata
  texture?: TextureType;
  finish?: FinishType;
  ageOptimized?: AgeOptimization;
  keyIngredients: string[]; // lowercase normalized (e.g., ["niacinamide", "hyaluronic_acid"])
  avoidanceFlags: string[]; // lowercase flags (e.g., ["fragrance", "essential_oils", "alcohol"])
}

// Type alias for convenience
export type Product = CatalogProduct;

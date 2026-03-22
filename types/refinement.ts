/**
 * Refinement Preferences Schema
 * User-controlled modifiers for post-profile product selection
 * Sprint 19: Refinement Integration v1
 */

import type { TextureWeight, Finish } from "./product";

/**
 * Budget tier preference
 * Affects ranking to prefer products within price range
 */
export type BudgetTier = "budget" | "mid" | "premium";

/**
 * Fragrance tolerance preference
 * Affects eligibility for fragrance-containing products
 */
export type FragranceTolerance = "avoid" | "tolerate" | "prefer";

/**
 * Routine complexity preference
 * Affects selection of support products and layering
 */
export type RoutineComplexity = "minimal" | "standard" | "flexible";

/**
 * Complete refinement preferences
 * All fields are optional - if not specified, no refinement is applied
 */
export interface RefinementPreferences {
  /**
   * Budget tier preference
   * - budget: Boost lower-priced products, suppress premium ties
   * - mid: Neutral scoring
   * - premium: Allow full range without price bias
   */
  budgetTier?: BudgetTier;

  /**
   * Preferred texture weight
   * Adds ranking bonus when product texture matches preference
   */
  texturePreference?: TextureWeight;

  /**
   * Preferred finish
   * Adds ranking bonus when product finish matches preference
   */
  finishPreference?: Finish;

  /**
   * Fragrance tolerance
   * - avoid: Exclude fragranced products when alternatives exist
   * - tolerate: No preference
   * - prefer: Slight bonus for fragranced products (cosmetic elegance)
   */
  fragranceTolerance?: FragranceTolerance;

  /**
   * Ingredients to avoid (hard exclusion)
   * Products containing these ingredients will be excluded
   * Case-insensitive substring matching
   */
  avoidIngredients?: string[];

  /**
   * Routine complexity preference
   * - minimal: Prefer simpler products, avoid unnecessary layering
   * - standard: Neutral
   * - flexible: Allow wider support/treatment layering
   */
  routineComplexity?: RoutineComplexity;
}

/**
 * Helper to check if refinements are specified
 */
export function hasRefinements(prefs?: RefinementPreferences): boolean {
  if (!prefs) return false;
  return (
    prefs.budgetTier !== undefined ||
    prefs.texturePreference !== undefined ||
    prefs.finishPreference !== undefined ||
    prefs.fragranceTolerance !== undefined ||
    (prefs.avoidIngredients !== undefined && prefs.avoidIngredients.length > 0) ||
    prefs.routineComplexity !== undefined
  );
}

/**
 * Helper to create default refinement preferences
 */
export function getDefaultRefinements(): RefinementPreferences {
  return {
    budgetTier: "mid",
    fragranceTolerance: "tolerate",
    routineComplexity: "standard",
  };
}

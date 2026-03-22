/**
 * Sprint D13: Refinement Layer Types
 *
 * Post-result optional layer that improves product matching
 * through user preferences without overriding D12 core logic.
 */

import type { Product } from "@/lib/products/types";

export type AgeRange = "under_25" | "25_34" | "35_44" | "45_54" | "55_plus";
export type SelfDescribedType = "dry" | "oily" | "combination" | "normal" | "unsure";
export type TexturePreference = "foaming" | "creamy" | "balm" | "lightweight" | "rich" | "none";
export type FinishPreference = "matte" | "dewy" | "none";
export type BudgetPreference = "essential" | "balanced" | "premium";

/**
 * Refinement answers collected after initial result
 * All fields optional - user can skip any question
 */
export interface RefinementAnswers {
  // Question 1: Age range (lightweight ranking modifier)
  age_range?: AgeRange;

  // Question 2: Self-described skin type (tiebreaker only)
  self_described_type?: SelfDescribedType;

  // Question 3: Cleanser preference
  cleanser_texture?: TexturePreference;

  // Question 4: Moisturizer preference
  moisturizer_texture?: TexturePreference;
  moisturizer_finish?: FinishPreference;

  // Question 5: Budget preference
  budget?: BudgetPreference;

  // Question 6: Ingredient preferences
  ingredient_wants?: string[]; // lowercase normalized ingredient names
  ingredient_avoids?: string[]; // lowercase flags or ingredient names

  // Metadata
  completed_at?: number; // timestamp
}

/**
 * Separate from refinement - save routine contact data
 */
export interface SaveRoutineData {
  name?: string;
  email?: string;
}

/**
 * Enhanced product match with refinement scoring exposed
 */
export interface ProductMatch {
  product: Product;
  coreScore: number; // Base match score from D12 quiz
  refinementBonus: number; // Points added from refinement preferences
  totalScore: number; // coreScore + refinementBonus
  matchReasons: string[]; // Human-readable reasons for selection
  conflictWarnings?: string[]; // If preferences couldn't all be met
}

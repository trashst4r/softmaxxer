/**
 * Sprint D13: Refinement Scoring Engine
 *
 * Calculates bonus points from user preferences.
 * Bonus is additive only - never overrides core match safety logic.
 */

import type { Product } from "@/lib/products/types";
import type { RefinementAnswers } from "./types";

/**
 * Calculate refinement bonus points for a product
 * Returns 0 if no refinement answers provided
 *
 * Max possible bonus: ~50 points
 * - Age: +5 max
 * - Texture: +10 max
 * - Finish: +5 max
 * - Budget: +10 max
 * - Ingredients: +15 max
 */
export function calculateRefinementBonus(
  product: Product,
  refinement: RefinementAnswers | null,
  stepRole: string // "cleanser" | "moisturizer" | "treatment" | etc
): { bonus: number; reasons: string[] } {
  if (!refinement) return { bonus: 0, reasons: [] };

  let bonus = 0;
  const reasons: string[] = [];

  // Age optimization (lightweight, +5 max)
  if (refinement.age_range && product.ageOptimized) {
    const ageMatch = matchAgeToProduct(refinement.age_range, product.ageOptimized);
    if (ageMatch > 0) {
      bonus += ageMatch;
      if (ageMatch >= 3) {
        reasons.push("Optimized for your age range");
      }
    }
  }

  // Texture preference (step-specific, +10 max)
  if (
    stepRole === "cleanser" &&
    refinement.cleanser_texture &&
    refinement.cleanser_texture !== "none"
  ) {
    if (matchTexture(product.texture, refinement.cleanser_texture)) {
      bonus += 10;
      reasons.push(`${capitalizeTexture(refinement.cleanser_texture)} texture (your preference)`);
    }
  }

  if (
    stepRole === "moisturizer" &&
    refinement.moisturizer_texture &&
    refinement.moisturizer_texture !== "none"
  ) {
    if (matchTexture(product.texture, refinement.moisturizer_texture)) {
      bonus += 10;
      reasons.push(`${capitalizeTexture(refinement.moisturizer_texture)} texture (your preference)`);
    }
  }

  // Finish preference (moisturizer only, +5 max)
  if (
    stepRole === "moisturizer" &&
    refinement.moisturizer_finish &&
    refinement.moisturizer_finish !== "none"
  ) {
    if (product.finish === refinement.moisturizer_finish) {
      bonus += 5;
      reasons.push(`${refinement.moisturizer_finish} finish (your preference)`);
    }
  }

  // Budget preference (+10 max)
  if (refinement.budget) {
    const budgetMatch = matchBudget(product, refinement.budget);
    if (budgetMatch > 0) {
      bonus += budgetMatch;
      // Don't add explicit reason (implicit in tier display)
    }
  }

  // Ingredient wants (+3 per match, max +15)
  if (refinement.ingredient_wants && refinement.ingredient_wants.length > 0) {
    const matches = refinement.ingredient_wants.filter((want) =>
      product.keyIngredients.includes(want.toLowerCase())
    );
    if (matches.length > 0) {
      const ingredientBonus = Math.min(matches.length * 3, 15);
      bonus += ingredientBonus;
      matches.forEach((ingredient) => {
        reasons.push(`Contains ${ingredient} (you wanted this)`);
      });
    }
  }

  return { bonus, reasons };
}

/**
 * Check if product passes hard avoidance filters
 * Returns null if passes, conflict warning string if fails
 */
export function checkAvoidanceFilters(
  product: Product,
  refinement: RefinementAnswers | null
): string | null {
  if (!refinement || !refinement.ingredient_avoids || refinement.ingredient_avoids.length === 0) {
    return null;
  }

  const conflicts = refinement.ingredient_avoids.filter((avoid) => {
    const normalized = avoid.toLowerCase();
    return (
      product.avoidanceFlags.includes(normalized) || product.keyIngredients.includes(normalized)
    );
  });

  if (conflicts.length > 0) {
    return `Contains ${conflicts.join(", ")} (you avoid this)`;
  }

  return null;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Match age range to product age optimization
 * Returns bonus points (0-5)
 */
function matchAgeToProduct(age: string, productAge: string): number {
  if (productAge === "universal") return 0; // Neutral

  const ageScore: Record<string, Record<string, number>> = {
    under_25: { youth: 5, prevention: 2, mature: 0, universal: 0 },
    "25_34": { youth: 2, prevention: 5, mature: 1, universal: 0 },
    "35_44": { youth: 0, prevention: 3, mature: 5, universal: 0 },
    "45_54": { youth: 0, prevention: 1, mature: 5, universal: 0 },
    "55_plus": { youth: 0, prevention: 0, mature: 5, universal: 0 },
  };

  return ageScore[age]?.[productAge] || 0;
}

/**
 * Match texture preference to product texture
 */
function matchTexture(productTexture: string | undefined, pref: string): boolean {
  if (!productTexture || pref === "none") return false;

  // Mapping preferences to product textures
  const textureMap: Record<string, string[]> = {
    foaming: ["foam", "gel"],
    creamy: ["cream", "lotion"],
    balm: ["balm", "oil"],
    lightweight: ["gel", "serum", "lotion"],
    rich: ["cream", "balm", "oil"],
  };

  return textureMap[pref]?.includes(productTexture) || false;
}

/**
 * Match budget preference to product tier
 * Returns bonus points (0-10)
 */
function matchBudget(product: Product, budget: string): number {
  const tierScore: Record<string, Record<string, number>> = {
    essential: { budget: 10, core: 5, premium: 0 },
    balanced: { budget: 3, core: 10, premium: 3 },
    premium: { budget: 0, core: 5, premium: 10 },
  };

  return tierScore[budget]?.[product.tier] || 0;
}

/**
 * Capitalize texture preference for display
 */
function capitalizeTexture(texture: string): string {
  return texture.charAt(0).toUpperCase() + texture.slice(1);
}

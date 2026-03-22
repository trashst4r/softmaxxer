/**
 * Product Ranking Layer
 * Weighted suitability scoring for deterministic product recommendations
 * Sprint 18: Maps SuitabilityMap structure to numeric scores with priority weighting
 * Sprint 19: Added refinement preference bonuses for budget, texture, finish, fragrance, complexity
 */

import type { ProductSpec, SuitabilityMap } from "@/types/product";
import type { SkinProfile } from "@/types/skin-profile";
import type { RefinementPreferences } from "@/types/refinement";

export interface ProductScore {
  product: ProductSpec;
  totalScore: number;
  breakdown: {
    sensitivity: number;
    breakout: number;
    oiliness: number;
    hydration: number;
    routineTime: number;
    concernMatch: number;
    barrierBonus: number;
    textureFinishBonus: number;
    // Sprint 19: Refinement bonuses
    budgetBonus: number;
    texturePreferenceBonus: number;
    finishPreferenceBonus: number;
    fragranceBonus: number;
    complexityBonus: number;
  };
}

/**
 * Convert SuitabilityMap to numeric score
 * Mapping: good=2, okay=1, avoid=exclude (should never reach ranking if eligible)
 */
function getSuitabilityScore<T extends string>(
  map: SuitabilityMap<T>,
  value: T
): number {
  if (map.good.includes(value)) return 2;
  if (map.okay?.includes(value)) return 1;
  if (map.avoid?.includes(value)) return 0; // Should be filtered by eligibility
  return 0; // Neutral/not specified
}

/**
 * Calculate weighted suitability score for a product
 * Weights: sensitivity×3, breakout×2, oiliness×2, hydration×2, routineTime×1
 */
export function calculateProductScore(
  product: ProductSpec,
  profile: SkinProfile,
  refinement?: RefinementPreferences
): ProductScore {
  const breakdown = {
    sensitivity: getSuitabilityScore(product.sensitivity, profile.sensitivity) * 3,
    breakout: getSuitabilityScore(product.breakout, profile.breakoutProneness) * 2,
    oiliness: getSuitabilityScore(product.oiliness, profile.oiliness) * 2,
    hydration: getSuitabilityScore(product.hydration, profile.hydrationNeed) * 2,
    routineTime: 0, // Future: getSuitabilityScore(product.routineTime, profile.routineComplexity) * 1
    concernMatch: 0,
    barrierBonus: 0,
    textureFinishBonus: 0,
    // Sprint 19: Refinement bonuses
    budgetBonus: 0,
    texturePreferenceBonus: 0,
    finishPreferenceBonus: 0,
    fragranceBonus: 0,
    complexityBonus: 0,
  };

  // Concern match bonus: +1 for each matching concern target
  const profileConcerns = getConcernsFromProfile(profile);
  const matchingConcerns = product.concernTargets.filter((concern) =>
    profileConcerns.includes(concern)
  );
  breakdown.concernMatch = matchingConcerns.length * 1;

  // Barrier bonus: conditional on profile needs
  if (
    (profile.priorityGoal === "barrier_strengthen" || profile.sensitivity === "reactive") &&
    product.barrierFriendly
  ) {
    breakdown.barrierBonus = 2;
  }

  // Texture/finish match: tie-breaker points
  // Dry skin prefers richer textures, oily skin prefers lighter
  if (profile.oiliness === "dry" || profile.hydrationNeed === "high") {
    if (product.textureWeight === "rich" || product.textureWeight === "occlusive") {
      breakdown.textureFinishBonus = 0.5;
    }
  }
  if (profile.oiliness === "oily_all" || profile.oiliness === "oily_tzone") {
    if (
      product.textureWeight === "weightless" ||
      product.textureWeight === "light" ||
      product.finish === "matte"
    ) {
      breakdown.textureFinishBonus = 0.5;
    }
  }

  // Sprint 19: Refinement preference bonuses
  if (refinement) {
    // Budget tier bonus/penalty
    if (refinement.budgetTier && product.priceAUD !== null) {
      if (refinement.budgetTier === "budget" && product.priceAUD < 30) {
        breakdown.budgetBonus = 1;
      } else if (refinement.budgetTier === "mid" && product.priceAUD >= 30 && product.priceAUD <= 80) {
        breakdown.budgetBonus = 0.5;
      }
      // Premium: no penalty, allows full range
    }

    // Texture preference bonus
    if (refinement.texturePreference && product.textureWeight === refinement.texturePreference) {
      breakdown.texturePreferenceBonus = 1;
    }

    // Finish preference bonus
    if (refinement.finishPreference && product.finish === refinement.finishPreference) {
      breakdown.finishPreferenceBonus = 1;
    }

    // Fragrance preference bonus
    if (refinement.fragranceTolerance === "prefer" && !product.fragranceFree) {
      breakdown.fragranceBonus = 0.5;
    }

    // Routine complexity bonus
    // Note: Future enhancement - could penalize complex layering for "minimal" preference
    // For now, no bonus applied (placeholder for future complexity metadata)
  }

  const totalScore =
    breakdown.sensitivity +
    breakdown.breakout +
    breakdown.oiliness +
    breakdown.hydration +
    breakdown.routineTime +
    breakdown.concernMatch +
    breakdown.barrierBonus +
    breakdown.textureFinishBonus +
    breakdown.budgetBonus +
    breakdown.texturePreferenceBonus +
    breakdown.finishPreferenceBonus +
    breakdown.fragranceBonus +
    breakdown.complexityBonus;

  return {
    product,
    totalScore,
    breakdown,
  };
}

/**
 * Rank products by suitability score (descending)
 * Returns sorted array of ProductScore objects
 */
export function rankProducts(
  products: ProductSpec[],
  profile: SkinProfile,
  refinement?: RefinementPreferences
): ProductScore[] {
  const scores = products.map((product) => calculateProductScore(product, profile, refinement));

  // Sort by total score descending
  scores.sort((a, b) => b.totalScore - a.totalScore);

  return scores;
}

/**
 * Get the best product from a list based on suitability
 * Returns null if no products available
 */
export function selectBestProduct(
  products: ProductSpec[],
  profile: SkinProfile,
  refinement?: RefinementPreferences
): ProductSpec | null {
  if (products.length === 0) return null;

  const ranked = rankProducts(products, profile, refinement);
  return ranked[0].product;
}

/**
 * Get top N products from a list based on suitability
 */
export function selectTopNProducts(
  products: ProductSpec[],
  profile: SkinProfile,
  n: number,
  refinement?: RefinementPreferences
): ProductSpec[] {
  const ranked = rankProducts(products, profile, refinement);
  return ranked.slice(0, n).map((score) => score.product);
}

/**
 * Infer concern tags from skin profile
 * Maps profile attributes to concern tags
 */
function getConcernsFromProfile(profile: SkinProfile): string[] {
  const concerns: string[] = [];

  // Breakout proneness
  if (
    profile.breakoutProneness === "frequent" ||
    profile.breakoutProneness === "persistent"
  ) {
    concerns.push("breakouts");
  }

  // Oiliness
  if (profile.oiliness === "oily_all" || profile.oiliness === "oily_tzone") {
    concerns.push("oiliness");
  }

  // Dryness / Dehydration
  if (profile.oiliness === "dry" || profile.hydrationNeed === "high") {
    concerns.push("dryness");
    concerns.push("dehydration");
  }

  // Sensitivity / Redness
  if (profile.sensitivity === "reactive" || profile.sensitivity === "moderate") {
    concerns.push("redness");
    concerns.push("barrier");
  }

  // Priority goal mapping
  switch (profile.priorityGoal) {
    case "breakout_control":
      concerns.push("breakouts");
      concerns.push("texture");
      break;
    case "redness_calm":
      concerns.push("redness");
      concerns.push("barrier");
      break;
    case "hydration_restore":
      concerns.push("dehydration");
      concerns.push("dryness");
      break;
    case "texture_smooth":
      concerns.push("texture");
      break;
    case "barrier_strengthen":
      concerns.push("barrier");
      concerns.push("redness");
      break;
  }

  // Deduplicate
  return Array.from(new Set(concerns));
}

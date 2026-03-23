/**
 * Sprint D10: Product Matching Logic (Simplified)
 * Sprint 25: Refinement layer fully removed
 *
 * Deterministic matching from routine step to product options
 */

import type { SkinScores } from "@/types/analysis";
import type { CatalogProduct, StepType } from "./types";
import { getProductsByStepType } from "./catalog";

// Sprint 25: Refinement system fully removed
export interface ProductMatch {
  product: CatalogProduct;
  matchReasons: string[];
}

/**
 * Map routine step IDs to product step types
 */
const STEP_ID_TO_TYPE_MAP: Record<string, StepType> = {
  // AM Routine
  am_cleanse: "cleanse",
  am_treatment: "niacinamide", // Default AM treatment
  am_moisturize: "moisturize",
  am_spf: "spf",

  // PM Routine
  pm_first_cleanse: "oil_cleanse",
  pm_cleanse: "cleanse",
  pm_active: "retinoid", // Default PM active (will be overridden by scoring)
  pm_hydrate: "hydrate",
  pm_moisturize: "moisturize",
  pm_occlusive: "occlusive",
};

/**
 * Match products for a routine step based on step ID and skin scores
 * Sprint 25: Simplified - no refinement layer
 *
 * Returns max 3 products, deterministically ordered by skin match
 */
export function matchProductsForStep(
  stepId: string,
  stepLabel: string,
  scores: SkinScores
): ProductMatch[] {
  // Determine product step type from routine step ID
  let stepType = STEP_ID_TO_TYPE_MAP[stepId];

  // Override step type based on skin scores for treatment steps
  if (stepId === "am_treatment") {
    stepType = selectAMTreatmentType(scores);
  }

  if (stepId === "pm_active") {
    stepType = selectPMActiveType(scores);
  }

  // Get all products for this step type
  let products = getProductsByStepType(stepType);

  if (products.length === 0) {
    return [];
  }

  // Rank products based on skin targets match
  const coreRanked = rankProductsBySkinMatch(products, scores);

  // Return top 3 products with match reasons
  return coreRanked.slice(0, 3).map((product, index) => ({
    product,
    matchReasons: generateCoreMatchReasons(product, scores, index),
  }));
}

/**
 * Calculate core match score for a product
 * Higher score = better match to skin profile
 */
function calculateCoreScore(product: CatalogProduct, scores: SkinScores, rankIndex: number): number {
  // Base score from rankProductsBySkinMatch position
  let score = 100 - rankIndex * 10; // First product: 100, second: 90, third: 80, etc.

  // Add skin target match bonus
  const userConcerns: string[] = [];
  if (scores.oil_production > 50) userConcerns.push("oil");
  if (scores.acne_severity > 40) userConcerns.push("acne");
  if (scores.dryness_dehydration > 50) userConcerns.push("dry");
  if (scores.sensitivity_reactivity > 50) userConcerns.push("sensitivity");
  if (scores.barrier_health < 50) userConcerns.push("barrier");

  product.skinTargets.forEach((target) => {
    if (userConcerns.includes(target)) {
      score += 10;
    }
    if (target === "all") {
      score += 5;
    }
  });

  return score;
}

/**
 * Generate match reasons based on skin profile
 */
function generateCoreMatchReasons(product: CatalogProduct, scores: SkinScores, rankIndex: number): string[] {
  const reasons: string[] = [];

  // Determine user's primary skin concerns
  const userConcerns: string[] = [];
  if (scores.oil_production > 50) userConcerns.push("oil");
  if (scores.acne_severity > 40) userConcerns.push("acne");
  if (scores.dryness_dehydration > 50) userConcerns.push("dry");
  if (scores.sensitivity_reactivity > 50) userConcerns.push("sensitivity");
  if (scores.barrier_health < 50) userConcerns.push("barrier");

  // Map skin targets to user-friendly reasons
  const targetLabels: Record<string, string> = {
    oil: "Helps control oil",
    acne: "Targets breakouts",
    dry: "Provides hydration",
    sensitivity: "Gentle formula",
    barrier: "Supports barrier health",
    redness: "Calms redness",
    texture: "Smooths texture",
    aging: "Anti-aging benefits",
  };

  // Add reasons for matching skin targets (limit to 2)
  let matchCount = 0;
  for (const target of product.skinTargets) {
    if (userConcerns.includes(target) && matchCount < 2) {
      reasons.push(targetLabels[target] || `Targets ${target}`);
      matchCount++;
    }
  }

  // Add tier/value reason for top match only
  if (rankIndex === 0 && product.tier === "budget") {
    reasons.push("Great value");
  }

  // Limit to max 3 reasons
  return reasons.slice(0, 3);
}

/**
 * Select AM treatment type based on skin scores
 */
function selectAMTreatmentType(scores: SkinScores): StepType {
  // Azelaic acid for redness/sensitivity
  if (scores.sensitivity_reactivity > 50 || scores.acne_severity > 40) {
    return "azelaic";
  }

  // Niacinamide for oil/acne
  return "niacinamide";
}

/**
 * Select PM active type based on skin scores
 */
function selectPMActiveType(scores: SkinScores): StepType {
  // Barrier repair if compromised
  if (scores.barrier_health < 40) {
    return "barrier_repair";
  }

  // Salicylic acid for acne/oil
  if (scores.acne_severity > 60 || scores.oil_production > 70) {
    return "salicylic";
  }

  // Benzoyl peroxide for severe acne
  if (scores.acne_severity > 75) {
    return "benzoyl";
  }

  // Retinoid for maintenance/anti-aging
  if (scores.barrier_health > 60 && scores.sensitivity_reactivity < 50) {
    return "retinoid";
  }

  // Azelaic acid as gentle default
  return "azelaic";
}

/**
 * Rank products by how well their skin targets match the user's profile
 */
function rankProductsBySkinMatch(
  products: CatalogProduct[],
  scores: SkinScores
): CatalogProduct[] {
  // Determine user's primary skin concerns
  const userConcerns: string[] = [];

  if (scores.oil_production > 50) userConcerns.push("oil");
  if (scores.acne_severity > 40) userConcerns.push("acne");
  if (scores.dryness_dehydration > 50) userConcerns.push("dry");
  if (scores.sensitivity_reactivity > 50) userConcerns.push("sensitivity");
  if (scores.barrier_health < 50) userConcerns.push("barrier");

  // Score each product based on skin target overlap
  const scored = products.map((product) => {
    let matchScore = 0;

    // Award points for each matching skin target
    product.skinTargets.forEach((target) => {
      if (userConcerns.includes(target)) {
        matchScore += 10;
      }
      // "all" targets match everyone
      if (target === "all") {
        matchScore += 5;
      }
    });

    // Prioritize budget tier by default
    if (product.tier === "budget") matchScore += 3;
    if (product.tier === "core") matchScore += 2;

    return { product, matchScore };
  });

  // Sort by match score descending, then by price ascending
  scored.sort((a, b) => {
    if (a.matchScore !== b.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.product.price - b.product.price;
  });

  return scored.map((s) => s.product);
}

/**
 * Get default product for a step (first ranked)
 * Sprint 25: Simplified signature
 */
export function getDefaultProductForStep(
  stepId: string,
  stepLabel: string,
  scores: SkinScores
): CatalogProduct | null {
  const matches = matchProductsForStep(stepId, stepLabel, scores);
  return matches.length > 0 ? matches[0].product : null;
}

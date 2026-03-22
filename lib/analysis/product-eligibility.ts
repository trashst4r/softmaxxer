/**
 * Product Eligibility Layer
 * Hard exclusion rules for deterministic product recommendations
 * Sprint 18: Replaces legacy suitability filtering with explicit constraint checks
 * Sprint 19: Added refinement preferences for fragrance and ingredient avoidance
 */

import type { ProductSpec } from "@/types/product";
import type { SkinProfile } from "@/types/skin-profile";
import type { RefinementPreferences } from "@/types/refinement";

export interface EligibilityResult {
  eligible: boolean;
  exclusionReason?: string;
}

/**
 * Determine if a product is eligible for a given skin profile
 * Returns eligibility status and exclusion reason if not eligible
 */
export function checkProductEligibility(
  product: ProductSpec,
  profile: SkinProfile,
  existingRoutine?: ProductSpec[],
  refinement?: RefinementPreferences
): EligibilityResult {
  // HARD EXCLUSION 1: Sensitivity in avoid list
  if (product.sensitivity.avoid?.includes(profile.sensitivity)) {
    return {
      eligible: false,
      exclusionReason: `Product not suitable for ${profile.sensitivity} skin (sensitivity avoid list)`,
    };
  }

  // HARD EXCLUSION 2: Reactive skin + high intensity
  if (profile.sensitivity === "reactive" && product.intensity === "high") {
    return {
      eligible: false,
      exclusionReason: "Reactive skin cannot use high intensity products",
    };
  }

  // HARD EXCLUSION 3: Beginner + advanced products
  if (!profile.hasActiveExperience && product.experienceLevel === "advanced") {
    return {
      eligible: false,
      exclusionReason: "Beginner users cannot use advanced experience-level products",
    };
  }

  // HARD EXCLUSION 4: Breakout level in avoid list
  if (product.breakout.avoid?.includes(profile.breakoutProneness)) {
    return {
      eligible: false,
      exclusionReason: `Product not suitable for ${profile.breakoutProneness} breakout level (breakout avoid list)`,
    };
  }

  // HARD EXCLUSION 5: Oiliness level in avoid list
  if (product.oiliness.avoid?.includes(profile.oiliness)) {
    return {
      eligible: false,
      exclusionReason: `Product not suitable for ${profile.oiliness} skin (oiliness avoid list)`,
    };
  }

  // HARD EXCLUSION 6: Hydration need in avoid list
  if (product.hydration.avoid?.includes(profile.hydrationNeed)) {
    return {
      eligible: false,
      exclusionReason: `Product not suitable for ${profile.hydrationNeed} hydration need (hydration avoid list)`,
    };
  }

  // HARD EXCLUSION 7: Incompatible with existing routine products
  if (existingRoutine && existingRoutine.length > 0) {
    const conflictingProduct = existingRoutine.find((existing) =>
      product.incompatibleWith.includes(existing.id)
    );
    if (conflictingProduct) {
      return {
        eligible: false,
        exclusionReason: `Incompatible with ${conflictingProduct.brand} ${conflictingProduct.productName} already in routine`,
      };
    }
  }

  // FUTURE-SAFE: Pregnancy caution (currently no pregnancy flag in profile, but structure is ready)
  // if (profile.isPregnant && product.pregnancyCaution) {
  //   return {
  //     eligible: false,
  //     exclusionReason: "Product has pregnancy caution flag",
  //   };
  // }

  // Sprint 19: HARD EXCLUSION 8: Fragrance avoidance
  if (refinement?.fragranceTolerance === "avoid" && !product.fragranceFree) {
    return {
      eligible: false,
      exclusionReason: "Product contains fragrance (user preference: avoid)",
    };
  }

  // Sprint 19: HARD EXCLUSION 9: Ingredient avoidance
  if (refinement?.avoidIngredients && refinement.avoidIngredients.length > 0) {
    const productIngredients = product.ingredientNotes.join(" ").toLowerCase();
    const avoidedIngredient = refinement.avoidIngredients.find((avoidIngredient) =>
      productIngredients.includes(avoidIngredient.toLowerCase())
    );
    if (avoidedIngredient) {
      return {
        eligible: false,
        exclusionReason: `Product contains avoided ingredient: ${avoidedIngredient}`,
      };
    }
  }

  return { eligible: true };
}

/**
 * Filter products to only eligible ones for a given profile
 * Returns array of eligible products with exclusion reasons for debugging
 */
export function filterEligibleProducts(
  products: ProductSpec[],
  profile: SkinProfile,
  existingRoutine?: ProductSpec[],
  refinement?: RefinementPreferences
): { eligible: ProductSpec[]; excluded: { product: ProductSpec; reason: string }[] } {
  const eligible: ProductSpec[] = [];
  const excluded: { product: ProductSpec; reason: string }[] = [];

  for (const product of products) {
    const result = checkProductEligibility(product, profile, existingRoutine, refinement);
    if (result.eligible) {
      eligible.push(product);
    } else {
      excluded.push({
        product,
        reason: result.exclusionReason || "Unknown exclusion",
      });
    }
  }

  return { eligible, excluded };
}

/**
 * Check if a product is suitable for AM routine
 */
export function isAmSuitable(product: ProductSpec): boolean {
  return product.amAllowed;
}

/**
 * Check if a product is suitable for PM routine
 */
export function isPmSuitable(product: ProductSpec): boolean {
  return product.pmAllowed;
}

/**
 * Sprint D13: Pregnancy Safety Checks
 *
 * Conditional check - only shown when recommended routine
 * includes pregnancy-sensitive actives.
 */

import type { AnalysisResult } from "@/types/analysis";
import type { Product } from "@/lib/products/types";

/**
 * Check if routine contains pregnancy-sensitive actives
 * Returns true if should ask pregnancy status
 */
export function shouldAskPregnancyStatus(regimen: AnalysisResult): boolean {
  const allSteps = regimen.am_routine.concat(regimen.pm_routine);

  // Check for pregnancy-sensitive step types or ingredients
  const hasSensitiveActives = allSteps.some((step) => {
    const lower = step.step.toLowerCase();
    return (
      lower.includes("retinoid") ||
      lower.includes("retinol") ||
      lower.includes("benzoyl") ||
      lower.includes("salicylic")
    );
  });

  return hasSensitiveActives;
}

/**
 * Filter out pregnancy-unsafe products
 * Only applies if user confirms they are pregnant
 */
export function filterPregnancySafeProducts(
  products: Product[],
  isPregnant: boolean
): Product[] {
  if (!isPregnant) return products;

  // Pregnancy-restricted ingredients
  const unsafeIngredients = [
    "retinol",
    "retinoid",
    "retinaldehyde",
    "benzoyl_peroxide",
    "salicylic_acid",
  ];

  return products.filter((product) => {
    // Check if product contains any unsafe ingredients
    const hasUnsafe = product.keyIngredients.some((ingredient) =>
      unsafeIngredients.some((unsafe) => ingredient.toLowerCase().includes(unsafe))
    );

    return !hasUnsafe;
  });
}

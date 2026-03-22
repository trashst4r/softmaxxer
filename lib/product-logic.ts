/**
 * Sprint 9: Product Intelligence + Conversion Layer
 * Smart product classification and selection based on skin profile and concerns.
 */

import type { Product, ProductRole } from "./product-map";
import type { SkinScores } from "@/types/analysis";

/**
 * Classify and rank products with roles and reasoning.
 * Returns 2-3 structured product options per ingredient.
 */
export function classifyProducts(
  products: Product[],
  scores: SkinScores,
  ingredient: string
): Product[] {
  if (products.length === 0) return [];

  const classified: Product[] = [];

  // Always try to include: best, budget
  // Conditionally include: sensitive (if sensitive), strongest (if severe concern)

  const { sensitivity_reactivity, barrier_health } = scores;
  const isSensitive = sensitivity_reactivity > 60 || barrier_health < 50;
  const needsStrong = scores.acne_severity > 70;

  // 1. Best Overall (mid-tier, balanced)
  const best = products.find((p) => p.price_tier === "mid");
  if (best) {
    classified.push({
      ...best,
      role: "best",
      why: `Balanced formulation with proven efficacy for ${ingredient.toLowerCase()}`,
      who: "Most users, especially those starting treatment",
    });
  }

  // 2. Budget Option
  const budget = products.find((p) => p.price_tier === "budget");
  if (budget && budget.id !== best?.id) {
    classified.push({
      ...budget,
      role: "budget",
      why: `Effective ${ingredient.toLowerCase()} at accessible price point`,
      who: "Cost-conscious users seeking proven ingredients",
    });
  }

  // 3. Sensitive-Safe (if user is sensitive)
  if (isSensitive) {
    const sensitive = products.find(
      (p) => p.strength_tier === "gentle" && p.id !== best?.id && p.id !== budget?.id
    );
    if (sensitive) {
      classified.push({
        ...sensitive,
        role: "sensitive",
        why: `Gentler formulation suitable for reactive skin`,
        who: "Sensitive or barrier-compromised skin",
        caution: "Start slowly and monitor for any irritation",
      });
    }
  }

  // 4. Maximum Strength (if severe acne)
  if (needsStrong) {
    const strongest = products.find(
      (p) =>
        (p.strength_tier === "strong" || p.price_tier === "premium") &&
        p.id !== best?.id &&
        p.id !== budget?.id
    );
    if (strongest) {
      classified.push({
        ...strongest,
        role: "strongest",
        why: `Higher concentration for severe or resistant concerns`,
        who: "Experienced users with stubborn concerns",
        caution: "May cause dryness or irritation. Start 2-3x per week.",
      });
    }
  }

  // Fallback: if we only have 1 product, mark it as "best"
  if (classified.length === 0 && products.length > 0) {
    classified.push({
      ...products[0],
      role: "best",
      why: `Recommended ${ingredient.toLowerCase()} for your profile`,
      who: "Your skin profile",
    });
  }

  return classified.slice(0, 3); // Max 3 products per ingredient
}

/**
 * Get role display label.
 */
export function getRoleLabel(role: ProductRole): string {
  const labels: Record<ProductRole, string> = {
    best: "Best Overall",
    budget: "Budget Option",
    sensitive: "Sensitive-Safe",
    strongest: "Maximum Strength",
  };
  return labels[role];
}

/**
 * Get role color class.
 */
export function getRoleColor(role: ProductRole): string {
  const colors: Record<ProductRole, string> = {
    best: "text-primary",
    budget: "text-green-600 dark:text-green-400",
    sensitive: "text-blue-600 dark:text-blue-400",
    strongest: "text-red-600 dark:text-red-400",
  };
  return colors[role];
}

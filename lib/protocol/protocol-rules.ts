/**
 * Weekly Protocol Engine - Safety Rules and Frequency Caps
 * Sprint 20: Hard constraints for ingredient scheduling
 */

import type {
  ConflictRule,
  FrequencyCap,
  ToleranceTier,
  IngredientFamily,
  BarrierState,
} from "./protocol-types";

/**
 * Hard safety rules: ingredient conflicts that cannot occur on same day
 */
export const CONFLICT_RULES: ConflictRule[] = [
  // Retinoid conflicts
  {
    ingredient1: "adapalene-retinoid",
    ingredient2: "exfoliating-acid",
    severity: "forbidden",
    reason: "Retinoid + exfoliating acid same night causes severe irritation",
  },
  {
    ingredient1: "adapalene-retinoid",
    ingredient2: "benzoyl-peroxide",
    severity: "forbidden",
    reason: "Retinoid + benzoyl peroxide same night degrades retinoid efficacy",
  },
  {
    ingredient1: "adapalene-retinoid",
    ingredient2: "vitamin-c",
    severity: "separate-am-pm",
    reason: "Retinoid PM, Vitamin C AM for stability",
  },

  // Exfoliating acid conflicts
  {
    ingredient1: "exfoliating-acid",
    ingredient2: "copper-peptides",
    severity: "forbidden",
    reason: "Strong acids denature copper peptides",
  },
  {
    ingredient1: "exfoliating-acid",
    ingredient2: "vitamin-c",
    severity: "cautious",
    reason: "Layering acids requires established tolerance",
  },

  // Benzoyl peroxide conflicts
  {
    ingredient1: "benzoyl-peroxide",
    ingredient2: "copper-peptides",
    severity: "cautious",
    reason: "Oxidizing agents can degrade peptides",
  },
  {
    ingredient1: "benzoyl-peroxide",
    ingredient2: "vitamin-c",
    severity: "separate-am-pm",
    reason: "Both strong actives, separate for tolerance",
  },

  // Salicylic acid conflicts
  {
    ingredient1: "salicylic-acid",
    ingredient2: "adapalene-retinoid",
    severity: "cautious",
    reason: "Both keratolytics, monitor for over-exfoliation",
  },
];

/**
 * Weekly frequency caps by tolerance tier
 */
export const FREQUENCY_CAPS: Record<ToleranceTier, FrequencyCap[]> = {
  beginner: [
    { ingredientFamily: "adapalene-retinoid", maxPerWeek: 2, minRecoveryDays: 2 },
    { ingredientFamily: "exfoliating-acid", maxPerWeek: 1, minRecoveryDays: 3 },
    { ingredientFamily: "azelaic-acid", maxPerWeek: 2, minRecoveryDays: 1 },
    { ingredientFamily: "benzoyl-peroxide", maxPerWeek: 2, minRecoveryDays: 1 },
    { ingredientFamily: "salicylic-acid", maxPerWeek: 2, minRecoveryDays: 1 },
    { ingredientFamily: "vitamin-c", maxPerWeek: 7, minRecoveryDays: 0 }, // Daily AM OK
    { ingredientFamily: "copper-peptides", maxPerWeek: 3, minRecoveryDays: 1 },
  ],
  cautious: [
    { ingredientFamily: "adapalene-retinoid", maxPerWeek: 3, minRecoveryDays: 1 },
    { ingredientFamily: "exfoliating-acid", maxPerWeek: 2, minRecoveryDays: 2 },
    { ingredientFamily: "azelaic-acid", maxPerWeek: 4, minRecoveryDays: 0 },
    { ingredientFamily: "benzoyl-peroxide", maxPerWeek: 3, minRecoveryDays: 1 },
    { ingredientFamily: "salicylic-acid", maxPerWeek: 3, minRecoveryDays: 1 },
    { ingredientFamily: "vitamin-c", maxPerWeek: 7, minRecoveryDays: 0 },
    { ingredientFamily: "copper-peptides", maxPerWeek: 4, minRecoveryDays: 0 },
  ],
  moderate: [
    { ingredientFamily: "adapalene-retinoid", maxPerWeek: 4, minRecoveryDays: 0 },
    { ingredientFamily: "exfoliating-acid", maxPerWeek: 3, minRecoveryDays: 1 },
    { ingredientFamily: "azelaic-acid", maxPerWeek: 7, minRecoveryDays: 0 },
    { ingredientFamily: "benzoyl-peroxide", maxPerWeek: 5, minRecoveryDays: 0 },
    { ingredientFamily: "salicylic-acid", maxPerWeek: 5, minRecoveryDays: 0 },
    { ingredientFamily: "vitamin-c", maxPerWeek: 7, minRecoveryDays: 0 },
    { ingredientFamily: "copper-peptides", maxPerWeek: 5, minRecoveryDays: 0 },
  ],
  advanced: [
    { ingredientFamily: "adapalene-retinoid", maxPerWeek: 5, minRecoveryDays: 0 },
    { ingredientFamily: "exfoliating-acid", maxPerWeek: 4, minRecoveryDays: 0 },
    { ingredientFamily: "azelaic-acid", maxPerWeek: 7, minRecoveryDays: 0 },
    { ingredientFamily: "benzoyl-peroxide", maxPerWeek: 7, minRecoveryDays: 0 },
    { ingredientFamily: "salicylic-acid", maxPerWeek: 7, minRecoveryDays: 0 },
    { ingredientFamily: "vitamin-c", maxPerWeek: 7, minRecoveryDays: 0 },
    { ingredientFamily: "copper-peptides", maxPerWeek: 7, minRecoveryDays: 0 },
  ],
};

/**
 * Check if two ingredients have a same-day conflict
 */
export function hasConflict(
  ing1: IngredientFamily,
  ing2: IngredientFamily,
  time: "am" | "pm"
): boolean {
  const rule = CONFLICT_RULES.find(
    (r) =>
      (r.ingredient1 === ing1 && r.ingredient2 === ing2) ||
      (r.ingredient1 === ing2 && r.ingredient2 === ing1)
  );

  if (!rule) return false;

  // Forbidden = cannot be same day at all
  if (rule.severity === "forbidden") return true;

  // Separate AM/PM = OK if different times
  if (rule.severity === "separate-am-pm") return false; // Will handle in scheduler

  // Cautious = allowed but flagged
  return false;
}

/**
 * Get frequency cap for ingredient at given tolerance tier
 */
export function getFrequencyCap(
  ingredient: IngredientFamily,
  tier: ToleranceTier
): FrequencyCap | null {
  const caps = FREQUENCY_CAPS[tier];
  return caps.find((c) => c.ingredientFamily === ingredient) || null;
}

/**
 * Check if barrier state allows given ingredient
 */
export function isAllowedForBarrier(
  ingredient: IngredientFamily,
  barrierState: BarrierState
): boolean {
  // Compromised barrier: only gentle/barrier-support allowed
  if (barrierState === "compromised") {
    const allowed: IngredientFamily[] = [
      "gentle-cleanser",
      "hydrating-serum",
      "barrier-support",
      "moisturizer",
      "sunscreen",
      "niacinamide", // Gentle and barrier-supportive
    ];
    return allowed.includes(ingredient);
  }

  // Sensitive barrier: no strong irritants
  if (barrierState === "sensitive") {
    const forbidden: IngredientFamily[] = [
      "benzoyl-peroxide",
      "exfoliating-acid",
    ];
    return !forbidden.includes(ingredient);
  }

  // Stable/robust: all allowed
  return true;
}

/**
 * Check if user's SPF reliability allows aggressive brightening/exfoliation
 */
export function requiresSpfForIngredient(ingredient: IngredientFamily): boolean {
  const spfDependent: IngredientFamily[] = [
    "adapalene-retinoid",
    "exfoliating-acid",
    "vitamin-c",
    "azelaic-acid",
  ];
  return spfDependent.includes(ingredient);
}

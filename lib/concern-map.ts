/**
 * Sprint 8: Concern Resolution System
 * Deterministic mapping of ingredients/categories to skin concerns.
 * All mappings are explicit and static.
 */

export type ConcernKey =
  | "acne_severity"
  | "oil_production"
  | "dryness_dehydration"
  | "sensitivity_reactivity"
  | "barrier_health";

/**
 * Static mapping: ingredient/category → concern keys
 * Used to determine which concerns each routine step addresses.
 */
export const INGREDIENT_CONCERN_MAP: Record<string, ConcernKey[]> = {
  // Acne actives
  "salicylic acid": ["acne_severity", "oil_production"],
  "benzoyl peroxide": ["acne_severity"],
  adapalene: ["acne_severity"],
  retinol: ["acne_severity"],
  tretinoin: ["acne_severity"],
  retinoid: ["acne_severity"],

  // Oil control
  niacinamide: ["oil_production", "barrier_health"],
  "zinc oxide": ["oil_production"],
  zinc: ["oil_production"],

  // Hydration
  "hyaluronic acid": ["dryness_dehydration"],
  glycerin: ["dryness_dehydration", "barrier_health"],
  squalane: ["dryness_dehydration"],

  // Barrier repair
  ceramides: ["barrier_health", "dryness_dehydration"],
  "fatty acids": ["barrier_health"],
  cholesterol: ["barrier_health"],
  petrolatum: ["barrier_health", "dryness_dehydration"],

  // Soothing/sensitivity
  "centella asiatica": ["sensitivity_reactivity", "barrier_health"],
  centella: ["sensitivity_reactivity", "barrier_health"],
  panthenol: ["sensitivity_reactivity", "barrier_health"],
  "shea butter": ["sensitivity_reactivity", "dryness_dehydration"],
  "licorice extract": ["sensitivity_reactivity"],

  // Gentle actives
  "azelaic acid": ["acne_severity", "sensitivity_reactivity"],

  // SPF (barrier protection)
  "titanium dioxide": ["barrier_health"],
  "chemical uv filters": ["barrier_health"],
  "chemical filters": ["barrier_health"],

  // Cleansers by type
  "foaming agent": ["oil_production"],
  "gentle foaming agent": ["oil_production"],
  "cleansing oil": ["oil_production"],
  "non-foaming cream": ["sensitivity_reactivity", "barrier_health"],
  "balanced surfactant": [],

  // General categories
  "gel moisturizer": ["dryness_dehydration"],
  "oil-free lotion": ["dryness_dehydration"],
  "emollient-rich cream": ["dryness_dehydration", "barrier_health"],
  occlusive: ["barrier_health", "dryness_dehydration"],
};

/**
 * Determine which concerns an ingredient/category addresses.
 */
export function getConcernsForIngredient(ingredient: string): ConcernKey[] {
  const normalized = ingredient.toLowerCase().trim();

  // Direct match
  if (INGREDIENT_CONCERN_MAP[normalized]) {
    return INGREDIENT_CONCERN_MAP[normalized];
  }

  // Partial match (for composite ingredients)
  const concerns: Set<ConcernKey> = new Set();
  for (const [key, concernList] of Object.entries(INGREDIENT_CONCERN_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      concernList.forEach((c) => concerns.add(c));
    }
  }

  return Array.from(concerns);
}

/**
 * Get concern display label.
 */
export function getConcernLabel(concernKey: ConcernKey): string {
  const labels: Record<ConcernKey, string> = {
    acne_severity: "Acne",
    oil_production: "Oil Control",
    dryness_dehydration: "Hydration",
    sensitivity_reactivity: "Sensitivity",
    barrier_health: "Barrier Health",
  };
  return labels[concernKey];
}

/**
 * Get concern direction (what "better" means).
 * true = higher is better, false = lower is better
 */
export function getConcernDirection(concernKey: ConcernKey): "increase" | "decrease" {
  // barrier_health and overall_condition: higher is better
  if (concernKey === "barrier_health") {
    return "increase";
  }
  // All others: lower is better
  return "decrease";
}

/**
 * Sprint D9/D11: Protocol Deck Builder
 * Product selection state management with localStorage persistence
 * Updated to validate against active regimen
 */

import type { RoutineStep } from "@/types/analysis";

const STORAGE_KEY = "protocol_selections_v1";
const REGIMEN_ID_KEY = "protocol_regimen_id_v1";

export interface SelectedProduct {
  stepId: string;           // "am_cleanse"
  stepLabel: string;        // "Cleanser"
  stepNumber: number;       // 1
  routine: "am" | "pm";     // "am"

  productId: string;        // "cerave-foaming-cleanser"
  brand: string;            // "CeraVe"
  name: string;             // "Foaming Facial Cleanser"
  price: number;            // 15
  tier: "budget" | "core" | "premium"; // "budget"
  roleLabel: string;        // "Oil control"
  affiliateUrl: string;     // "https://..."
}

export interface ProductSelections {
  [stepId: string]: SelectedProduct | null;
}

export interface PriceSummary {
  selectedCount: number;    // 3
  totalSteps: number;       // 7
  selectedPrice: number;    // 47
  estimatedTotal: number;   // 120 (if all steps filled at avg price)
  completionPercent: number; // 43
  isComplete: boolean;      // false
}

/**
 * Load selections from localStorage
 */
export function loadSelections(): ProductSelections | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to load protocol selections:", error);
    return null;
  }
}

/**
 * Save selections to localStorage
 */
export function saveSelections(selections: ProductSelections): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
  } catch (error) {
    console.error("Failed to save protocol selections:", error);
  }
}

/**
 * Initialize empty selections for a routine
 */
export function initializeSelections(
  amRoutine: RoutineStep[],
  pmRoutine: RoutineStep[]
): ProductSelections {
  const selections: ProductSelections = {};

  amRoutine.forEach((step, index) => {
    selections[step.id] = null;
  });

  pmRoutine.forEach((step, index) => {
    selections[step.id] = null;
  });

  return selections;
}

/**
 * Save a single product selection
 */
export function saveSelection(
  selections: ProductSelections,
  selection: SelectedProduct
): ProductSelections {
  const updated = {
    ...selections,
    [selection.stepId]: selection,
  };

  saveSelections(updated);
  return updated;
}

/**
 * Clear a single product selection
 */
export function clearSelection(
  selections: ProductSelections,
  stepId: string
): ProductSelections {
  const updated = {
    ...selections,
    [stepId]: null,
  };

  saveSelections(updated);
  return updated;
}

/**
 * Clear all selections
 */
export function clearAllSelections(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Calculate price summary from selections
 */
export function calculatePriceSummary(
  selections: ProductSelections,
  totalSteps: number
): PriceSummary {
  const selectedProducts = Object.values(selections).filter(
    (s): s is SelectedProduct => s !== null
  );

  const selectedCount = selectedProducts.length;
  const selectedPrice = selectedProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );

  // Estimate total if all steps filled
  // Use average price of selected products
  const avgPrice = selectedCount > 0
    ? selectedPrice / selectedCount
    : 17; // Default estimate if nothing selected

  const estimatedTotal = Math.round(avgPrice * totalSteps);

  const completionPercent = Math.round(
    (selectedCount / totalSteps) * 100
  );

  const isComplete = selectedCount === totalSteps;

  return {
    selectedCount,
    totalSteps,
    selectedPrice: Math.round(selectedPrice),
    estimatedTotal,
    completionPercent,
    isComplete,
  };
}

/**
 * Get selected products as array (for deck display)
 */
export function getSelectedProductsArray(
  selections: ProductSelections
): SelectedProduct[] {
  return Object.values(selections).filter(
    (s): s is SelectedProduct => s !== null
  );
}

/**
 * Check if a specific product is selected for a step
 */
export function isProductSelected(
  selections: ProductSelections,
  stepId: string,
  productId: string
): boolean {
  const selection = selections[stepId];
  return selection !== null && selection.productId === productId;
}

/**
 * Sprint D11: Regimen compatibility
 */

/**
 * Get stored regimen ID for selections
 */
export function getSelectionsRegimenId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(REGIMEN_ID_KEY);
  } catch (error) {
    return null;
  }
}

/**
 * Set regimen ID for selections
 */
export function setSelectionsRegimenId(regimenId: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(REGIMEN_ID_KEY, regimenId);
  } catch (error) {
    console.error("Failed to save regimen ID:", error);
  }
}

/**
 * Validate selections against current routine
 * Removes selections for step IDs that no longer exist
 */
export function validateSelections(
  selections: ProductSelections,
  amRoutine: RoutineStep[],
  pmRoutine: RoutineStep[]
): ProductSelections {
  const validStepIds = new Set<string>();

  amRoutine.forEach((step) => validStepIds.add(step.id));
  pmRoutine.forEach((step) => validStepIds.add(step.id));

  const validated: ProductSelections = {};

  Object.entries(selections).forEach(([stepId, selection]) => {
    if (validStepIds.has(stepId)) {
      validated[stepId] = selection;
    }
    // Invalid step IDs are dropped
  });

  return validated;
}

/**
 * Load and validate selections against active regimen
 * Returns null if regimen has changed and selections are incompatible
 */
export function loadValidatedSelections(
  amRoutine: RoutineStep[],
  pmRoutine: RoutineStep[],
  currentRegimenId: string
): ProductSelections | null {
  const selections = loadSelections();
  if (!selections) return null;

  const storedRegimenId = getSelectionsRegimenId();

  // If regimen changed, validate and clean selections
  if (storedRegimenId !== currentRegimenId) {
    const validated = validateSelections(selections, amRoutine, pmRoutine);
    setSelectionsRegimenId(currentRegimenId);
    saveSelections(validated);
    return validated;
  }

  return selections;
}

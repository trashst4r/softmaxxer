/**
 * Engine Decision Debug Layer v1
 * Types for exposing deterministic selection reasoning
 */

import type { ProductType } from "./product";

/**
 * Individual scoring contribution from a rule
 */
export interface ScoreContribution {
  rule: string;
  score: number;
  reason: string;
}

/**
 * Complete scoring breakdown for a product
 */
export interface ProductScoreDebug {
  productId: string;
  productType: ProductType;
  productSubtype: string;
  totalScore: number;
  excluded: boolean;
  exclusionReason?: string;
  contributions: ScoreContribution[];
}

/**
 * Selection decision for a routine step
 */
export interface SelectionDebug {
  role: ProductType;
  step: "am" | "pm";
  stepLabel: string;
  candidates: ProductScoreDebug[];
  selectedProductId: string;
  selectionReason: string;
}

/**
 * Complete routine debug output
 */
export interface RoutineDebug {
  amSteps: SelectionDebug[];
  pmSteps: SelectionDebug[];
}

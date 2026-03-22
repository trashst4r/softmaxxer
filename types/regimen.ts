/**
 * Pack1 Regimen Mapping v1
 * Strict types for regimen step roles and routine sequences
 */

export type RegimenStepRole = "cleanse" | "treat" | "moisturize" | "protect";

export interface RegimenStep {
  role: RegimenStepRole;
  label: string;
  productId: string;
}

export interface Routine {
  am: RegimenStep[];
  pm: RegimenStep[];
}

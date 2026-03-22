/**
 * Region resolver for affiliate product selection.
 * Sprint 6A: Simple deterministic resolver with safe GLOBAL fallback.
 * No IP detection, no browser locale inference yet.
 */

import type { Region } from "./product-map";

const REGION_STORAGE_KEY = "user_region";

/**
 * Get user's region for product recommendations.
 * Defaults to GLOBAL. Can be overridden in dev mode or user settings.
 */
export function getRegion(): Region {
  if (typeof window === "undefined") return "GLOBAL";

  try {
    const stored = localStorage.getItem(REGION_STORAGE_KEY);
    if (stored === "US" || stored === "UK" || stored === "AU" || stored === "GLOBAL") {
      return stored;
    }
  } catch (error) {
    console.error("Failed to load region:", error);
  }

  return "GLOBAL";
}

/**
 * Set user's region preference.
 * Used by dev panel or future region selector UI.
 */
export function setRegion(region: Region): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(REGION_STORAGE_KEY, region);
  } catch (error) {
    console.error("Failed to save region:", error);
  }
}

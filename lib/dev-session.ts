/**
 * Dev Session Management
 * Deterministic tier preview system for auditing guest, member, and pro states.
 * Local-only, no auth abstraction.
 */

import type { AccessState } from "./access-state";

const DEV_TIER_KEY = "dev_tier_override";

/**
 * Set deterministic dev tier for preview pages.
 * This overrides the normal access state for testing.
 */
export function setDevTierOverride(tier: AccessState | null): void {
  if (typeof window === "undefined") return;

  if (tier === null) {
    localStorage.removeItem(DEV_TIER_KEY);
  } else {
    localStorage.setItem(DEV_TIER_KEY, tier);
  }
}

/**
 * Get dev tier override if set.
 * Returns null if no override is active.
 */
export function getDevTierOverride(): AccessState | null {
  if (typeof window === "undefined") return null;

  const override = localStorage.getItem(DEV_TIER_KEY);
  if (override === "guest" || override === "member" || override === "pro") {
    return override;
  }
  return null;
}

/**
 * Check if dev mode is active.
 */
export function isDevModeActive(): boolean {
  return getDevTierOverride() !== null;
}

/**
 * Clear dev tier override and return to normal access state.
 */
export function clearDevMode(): void {
  setDevTierOverride(null);
}

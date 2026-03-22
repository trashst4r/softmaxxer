/**
 * Access state management for monetization tiers.
 * Guest → limited product visibility
 * Member → full product stack
 * Pro → Deep Analysis + all features
 */

import { getDevTierOverride } from "./dev-session";

export type AccessState = "guest" | "member" | "pro";

const ACCESS_STATE_KEY = "access_state";

/**
 * Get current access state from localStorage.
 * Always returns "guest" on server or if not set.
 * Dev tier overrides take precedence when set.
 */
export function getAccessState(): AccessState {
  if (typeof window === "undefined") return "guest";

  // Check for dev tier override first
  const devOverride = getDevTierOverride();
  if (devOverride) return devOverride;

  const stored = localStorage.getItem(ACCESS_STATE_KEY);
  if (stored === "member" || stored === "pro") {
    return stored;
  }
  return "guest";
}

/**
 * Set access state in localStorage.
 * Used by dev panel for testing different tiers.
 */
export function setAccessState(state: AccessState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_STATE_KEY, state);
}

/**
 * Access permissions check functions
 */
export const AccessPermissions = {
  canSeeFullProducts: (state: AccessState): boolean => {
    return state === "member" || state === "pro";
  },

  canSeeDeepAnalysis: (state: AccessState): boolean => {
    return state === "pro";
  },

  canSeeGuides: (state: AccessState): boolean => {
    return state === "member" || state === "pro";
  },
};

/**
 * Hydration-safe React hook for access state.
 * Always initializes to "guest" on first render to match SSR.
 * Loads actual state from localStorage after mount.
 */
import { useState, useEffect } from "react";

export function useAccessState(): [AccessState, (state: AccessState) => void] {
  const [accessState, setAccessStateInternal] = useState<AccessState>("guest");

  useEffect(() => {
    // Load from localStorage after mount (hydration-safe pattern)
    const stored = getAccessState();
    if (stored !== "guest") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAccessStateInternal(stored);
    }
  }, []);

  const setAccessStateWrapper = (state: AccessState) => {
    setAccessState(state);
    setAccessStateInternal(state);
  };

  return [accessState, setAccessStateWrapper];
}

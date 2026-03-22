/**
 * Sprint D11: Tier System
 * Mock tier state and gating logic
 */

const STORAGE_KEY = "app_tier_v1";

export type TierLevel = "guest" | "member" | "pro";

export interface TierState {
  level: TierLevel;
  mockMode: boolean; // Always true for now (no real auth)
}

/**
 * Get current tier
 */
export function getCurrentTier(): TierLevel {
  if (typeof window === "undefined") return "guest";

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state: TierState = JSON.parse(stored);
      return state.level;
    }
    return "guest";
  } catch (error) {
    console.error("Failed to load tier:", error);
    return "guest";
  }
}

/**
 * Set mock tier (for testing/demo)
 */
export function setMockTier(tier: TierLevel): void {
  if (typeof window === "undefined") return;

  try {
    const state: TierState = {
      level: tier,
      mockMode: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save tier:", error);
  }
}

/**
 * Tier permissions
 */
export const TierPermissions = {
  // Results page
  canSeeFullAnalysis: (tier: TierLevel): boolean => {
    return tier === "member" || tier === "pro";
  },

  canSeeDeepInsights: (tier: TierLevel): boolean => {
    return tier === "pro";
  },

  // Protocol page
  canBuildProtocol: (tier: TierLevel): boolean => {
    return true; // All tiers can build protocol
  },

  canSeeAllProductOptions: (tier: TierLevel): boolean => {
    return tier === "member" || tier === "pro";
  },

  // Dashboard page
  canSeeAdherenceChart: (tier: TierLevel): boolean => {
    return tier === "member" || tier === "pro";
  },

  canSee14DayView: (tier: TierLevel): boolean => {
    return tier === "pro";
  },

  // Check-in
  canDoUnlimitedCheckIns: (tier: TierLevel): boolean => {
    return tier === "member" || tier === "pro";
  },

  // History
  canSeeCheckInHistory: (tier: TierLevel): boolean => {
    return tier === "member" || tier === "pro";
  },

  maxHistoryEntries: (tier: TierLevel): number => {
    switch (tier) {
      case "guest":
        return 1; // Latest only
      case "member":
        return 10;
      case "pro":
        return 50;
    }
  },
} as const;

/**
 * Get tier display name
 */
export function getTierDisplayName(tier: TierLevel): string {
  switch (tier) {
    case "guest":
      return "Guest";
    case "member":
      return "Member";
    case "pro":
      return "Pro";
  }
}

/**
 * Get tier description
 */
export function getTierDescription(tier: TierLevel): string {
  switch (tier) {
    case "guest":
      return "Try Softmaxxer with basic features";
    case "member":
      return "Full routine tracking and history";
    case "pro":
      return "Advanced insights and analytics";
  }
}

"use client";

import type { SkinProfile } from "@/lib/scoring/types";

interface ResultScoreCardProps {
  profile: SkinProfile;
  showDetails?: boolean;
}

/**
 * Sprint D4: Clean score readout module
 * Premium feel, not gamified or overly technical
 */
export function ResultScoreCard({ profile, showDetails = false }: ResultScoreCardProps) {
  // Derive overall skin state from profile
  const overallState = deriveOverallState(profile);

  return (
    <div className="bg-surface-container-low rounded-xl p-6 space-y-6">
      <div className="space-y-2">
        <p className="clinical-label">Skin readout</p>
        <h3 className="text-2xl font-light text-on-surface">{overallState.label}</h3>
        <p className="text-sm text-on-surface-variant">{overallState.description}</p>
      </div>

      {showDetails && (
        <div className="pt-4 border-t border-outline-variant/30 grid grid-cols-2 gap-4">
          <ScoreIndicator
            label="Barrier strength"
            value={profile.barrier}
            isInverse
          />
          <ScoreIndicator
            label="Active tolerance"
            value={profile.tolerance}
            isInverse
          />
          <ScoreIndicator
            label="Breakout tendency"
            value={profile.acne}
          />
          <ScoreIndicator
            label="Reactivity"
            value={profile.sensitivity}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Derive overall skin state from profile
 */
function deriveOverallState(profile: SkinProfile): { label: string; description: string } {
  const { acne, barrier, sensitivity, oil } = profile;

  // Compromised barrier - highest priority
  if (barrier < 40) {
    return {
      label: "Compromised barrier",
      description: "Focus on gentle repair before introducing actives",
    };
  }

  // High reactivity
  if (sensitivity > 70) {
    return {
      label: "Highly reactive",
      description: "Minimal routine with proven gentle ingredients",
    };
  }

  // Active breakouts
  if (acne > 70) {
    return {
      label: "Active breakouts",
      description: "Consistent treatment targeting acne and prevention",
    };
  }

  // Moderate acne
  if (acne > 50) {
    return {
      label: "Breakout-prone",
      description: "Prevention-focused routine with gentle actives",
    };
  }

  // Very oily
  if (oil > 75) {
    return {
      label: "Excess oil production",
      description: "Oil control and pore refinement focus",
    };
  }

  // Combination with moderate issues
  if (barrier < 60 || sensitivity > 50 || acne > 30) {
    return {
      label: "Combination with care needs",
      description: "Balanced approach addressing multiple factors",
    };
  }

  // Strong barrier, good tolerance
  if (barrier > 75 && profile.tolerance > 70) {
    return {
      label: "Resilient, active-ready",
      description: "Strong foundation for targeted treatment",
    };
  }

  // Default: balanced
  return {
    label: "Relatively balanced",
    description: "Maintenance routine with targeted support",
  };
}

interface ScoreIndicatorProps {
  label: string;
  value: number;
  isInverse?: boolean;
}

function ScoreIndicator({ label, value, isInverse = false }: ScoreIndicatorProps) {
  const getStatus = (val: number, inverse: boolean) => {
    if (inverse) {
      if (val >= 70) return { label: "Strong", color: "text-green-700 dark:text-green-400" };
      if (val >= 50) return { label: "Moderate", color: "text-yellow-700 dark:text-yellow-400" };
      return { label: "Weak", color: "text-red-700 dark:text-red-400" };
    } else {
      if (val >= 70) return { label: "High", color: "text-red-700 dark:text-red-400" };
      if (val >= 40) return { label: "Moderate", color: "text-yellow-700 dark:text-yellow-400" };
      return { label: "Low", color: "text-green-700 dark:text-green-400" };
    }
  };

  const status = getStatus(value, isInverse);

  return (
    <div className="space-y-1">
      <div className="text-xs text-on-surface-variant">{label}</div>
      <div className={`text-sm font-medium ${status.color}`}>
        {status.label}
      </div>
    </div>
  );
}

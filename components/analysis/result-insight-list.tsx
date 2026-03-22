"use client";

import type { SkinProfile } from "@/lib/scoring/types";

interface ResultInsightListProps {
  profile: SkinProfile;
  primaryConcern?: string;
}

/**
 * Sprint D4: Plain-language skin insights
 * Converts numeric profile to readable traits
 */
export function ResultInsightList({ profile, primaryConcern }: ResultInsightListProps) {
  const insights = deriveInsights(profile, primaryConcern);

  return (
    <div className="space-y-3">
      <p className="clinical-label">Your skin right now</p>
      <div className="space-y-2">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="flex items-start gap-3 text-sm text-on-surface/90"
          >
            <span className="text-primary mt-0.5">•</span>
            <span>{insight}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Convert numeric profile to plain language
 * Returns 3-4 key insights in consumer-friendly language
 */
function deriveInsights(profile: SkinProfile, primaryConcern?: string): string[] {
  const insights: string[] = [];

  // Acne/breakout status
  if (profile.acne > 60) {
    insights.push(
      profile.acne > 80
        ? "Active breakouts that need consistent treatment"
        : "Breakout-prone with occasional flare-ups"
    );
  } else if (profile.acne > 30) {
    insights.push("Mild breakout tendency, manageable with prevention");
  }

  // Oil/hydration balance
  if (profile.oil > 70) {
    insights.push("Excess oil production, especially in T-zone");
  } else if (profile.oil < 30) {
    insights.push("Dry with potential for tightness after cleansing");
  } else if (profile.oil >= 45 && profile.oil <= 70) {
    insights.push("Combination skin with oily zones");
  }

  // Barrier health (inverse scale)
  if (profile.barrier < 40) {
    insights.push("Compromised barrier — needs gentle repair-focused care");
  } else if (profile.barrier < 60) {
    insights.push("Barrier function recovering, proceed with care");
  } else if (profile.barrier > 80) {
    insights.push("Strong, resilient barrier that tolerates actives well");
  }

  // Sensitivity
  if (profile.sensitivity > 70) {
    insights.push("Highly reactive — requires minimal, gentle ingredients");
  } else if (profile.sensitivity > 45) {
    insights.push("Some sensitivity, best to avoid harsh actives initially");
  }

  // Tolerance (for actives)
  if (profile.tolerance > 70 && profile.barrier > 60) {
    insights.push("Ready for active ingredients with proper introduction");
  } else if (profile.tolerance < 40) {
    insights.push("Low tolerance for actives right now — barrier repair first");
  }

  // UV risk
  if (profile.uvRisk > 75) {
    insights.push("Daily SPF is critical — current sun protection is inadequate");
  }

  // If we have fewer than 3 insights, add a confidence statement
  if (insights.length < 3 && primaryConcern) {
    insights.push(`Primary focus: addressing ${primaryConcern.toLowerCase()}`);
  }

  // Cap at 4 insights for clean presentation
  return insights.slice(0, 4);
}

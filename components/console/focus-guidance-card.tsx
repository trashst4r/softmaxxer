"use client";

import type { AnalysisResult } from "@/types/analysis";

interface FocusGuidanceCardProps {
  result: AnalysisResult;
}

export function FocusGuidanceCard({ result }: FocusGuidanceCardProps) {
  // Get top concern
  const topConcern = result.ranked_concerns[0];

  if (!topConcern) {
    return (
      <div className="clinical-card space-y-4">
        <h2 className="clinical-label">Focus Today</h2>
        <div className="text-sm text-muted">No specific guidance available</div>
      </div>
    );
  }

  // Convert concern label to key format for matching
  const concernKey = topConcern.concern.toLowerCase().replace(/\s+/g, "_");

  // Find all steps that affect the top concern
  const allSteps = [...result.am_routine, ...result.pm_routine];
  const relevantSteps = allSteps.filter(
    (step) => step.affects && step.affects.includes(concernKey)
  );

  // Generate priority actions
  const actions: string[] = [];

  if (relevantSteps.length > 0) {
    // Take first 2-3 relevant steps
    relevantSteps.slice(0, 3).forEach((step) => {
      // Determine if it's AM or PM
      const isAM = result.am_routine.includes(step);
      const timeLabel = isAM ? "AM" : "PM";

      // Extract key action from step label
      const stepLabel = step.step;
      actions.push(`Complete ${timeLabel} ${stepLabel.toLowerCase()}`);
    });
  }

  // Add barrier-specific guidance
  if (concernKey.includes("barrier") && result.scores.barrier_health < 50) {
    actions.push("Avoid over-cleansing or harsh actives");
  }

  // Add acne-specific guidance
  if (concernKey.includes("acne") && result.scores.acne_severity > 60) {
    actions.push("Focus on consistent PM active application");
  }

  // Fallback if no actions found
  if (actions.length === 0) {
    actions.push(`Address ${topConcern.concern.toLowerCase()} with current protocol`);
  }

  return (
    <div className="clinical-card space-y-6">
      <div className="space-y-1">
        <h2 className="clinical-label">Focus Today</h2>
        <p className="text-xs text-muted">Priority actions for {topConcern.concern.toLowerCase()}</p>
      </div>

      <ol className="space-y-3">
        {actions.map((action, index) => (
          <li key={index} className="flex gap-3 text-sm">
            <span className="text-primary font-mono text-xs flex-shrink-0 mt-0.5">
              {String(index + 1).padStart(2, "0")}.
            </span>
            <span className="text-foreground">{action}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

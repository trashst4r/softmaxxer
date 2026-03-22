"use client";

import type { AnalysisResult } from "@/types/analysis";
import { getConcernDirection, type ConcernKey } from "@/lib/concern-map";

interface ActiveTargetsCardProps {
  result: AnalysisResult;
}

export function ActiveTargetsCard({ result }: ActiveTargetsCardProps) {
  // Get top 2 concerns
  const topConcerns = result.ranked_concerns.slice(0, 2);

  return (
    <div className="clinical-card space-y-6">
      <div className="space-y-1">
        <h2 className="clinical-label">Active Targets</h2>
        <p className="text-xs text-muted">Primary concerns being addressed by your regimen</p>
      </div>

      <div className="space-y-4">
        {topConcerns.map((concern, index) => {
          // Determine if we want to increase or decrease this concern
          // For most concerns (acne, oil, sensitivity, dryness), lower is better
          // For barrier_health and overall_condition, higher is better
          const concernKey = concern.concern.toLowerCase().replace(/\s+/g, "_");
          const direction = getConcernDirection(concernKey as ConcernKey);

          return (
            <div
              key={index}
              className="border border-border rounded-sm p-4 space-y-2"
            >
              <div className="flex items-baseline justify-between gap-4">
                <div className="text-sm font-medium text-foreground">
                  {concern.concern}
                </div>
                <div className="text-xs text-muted uppercase tracking-wider">
                  {concern.priority}
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-light text-foreground font-mono">
                  {concern.score}
                </div>
                <div className="text-xs text-muted">
                  {direction === "decrease" ? "→ Decrease" : "→ Increase"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {topConcerns.length === 0 && (
        <div className="text-sm text-muted">No active concerns detected</div>
      )}
    </div>
  );
}

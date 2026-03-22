"use client";

import { useEffect, useState } from "react";
import type { AnalysisResult } from "@/types/analysis";
import { getScanHistory, type ScanHistoryEntry } from "@/lib/console-state";

interface TrendSnapshotCardProps {
  result: AnalysisResult;
}

export function TrendSnapshotCard({ result }: TrendSnapshotCardProps) {
  const [previousScan, setPreviousScan] = useState<ScanHistoryEntry | null>(null);

  useEffect(() => {
    const history = getScanHistory();
    // Get second-most recent scan (most recent is current result)
    if (history.length >= 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviousScan(history[1]);
    }
  }, []);

  const getBarrierRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-700 dark:text-green-400";
      case "Moderate":
        return "text-yellow-700 dark:text-yellow-400";
      case "Elevated":
        return "text-red-700 dark:text-red-400";
      default:
        return "text-muted";
    }
  };

  /**
   * Format concern change: "82 → 70 ↓"
   * Shows direction arrow based on whether change is improvement.
   */
  const formatConcernChange = (
    current: number,
    previous: number,
    higherIsBetter: boolean = false
  ): string => {
    if (current === previous) return "No change";

    const delta = current - previous;
    const arrow = delta > 0 ? "↑" : "↓";

    // Determine if this is an improvement
    const isImprovement = higherIsBetter ? delta > 0 : delta < 0;
    const arrowColor = isImprovement ? "text-green-400" : "text-muted";

    return `${previous} → ${current} <span class="${arrowColor}">${arrow}</span>`;
  };

  return (
    <div className="clinical-card space-y-4">
      <h2 className="clinical-label">Latest Profile Snapshot</h2>

      <div className="space-y-4">
        {/* Profile Label */}
        <div>
          <div className="text-xs text-muted uppercase tracking-wider mb-1">Profile</div>
          <div className="text-lg font-light text-foreground">{result.profile_label}</div>
        </div>

        {/* Top Concerns */}
        <div>
          <div className="text-xs text-muted uppercase tracking-wider mb-2">Top Concerns</div>
          <div className="space-y-1">
            {result.ranked_concerns.slice(0, 3).map((concern, index) => (
              <div key={index} className="text-xs text-foreground flex items-center gap-2">
                <span className="text-primary">•</span>
                <span>{concern.concern}</span>
                <span className="text-muted font-mono">{concern.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Barrier Risk */}
        <div>
          <div className="text-xs text-muted uppercase tracking-wider mb-1">Barrier Risk</div>
          <div className={`text-sm font-medium ${getBarrierRiskColor(result.barrier_risk)}`}>
            {result.barrier_risk}
          </div>
        </div>

        {/* Overall Condition Score */}
        <div>
          <div className="text-xs text-muted uppercase tracking-wider mb-1">Overall Condition</div>
          <div className="text-sm text-foreground font-mono">
            {result.scores.overall_condition}/100
          </div>
        </div>

        {/* Change from previous scan */}
        {previousScan && (
          <div className="pt-3 border-t border-border">
            <div className="text-xs text-muted uppercase tracking-wider mb-2">Change Since Last Scan</div>
            <div className="space-y-2 text-xs">
              <div className="flex items-baseline justify-between">
                <div className="text-muted">Acne Severity</div>
                <div
                  className="text-foreground font-mono"
                  dangerouslySetInnerHTML={{
                    __html: formatConcernChange(
                      result.scores.acne_severity,
                      previousScan.scores.acne_severity,
                      false
                    ),
                  }}
                />
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-muted">Barrier Health</div>
                <div
                  className="text-foreground font-mono"
                  dangerouslySetInnerHTML={{
                    __html: formatConcernChange(
                      result.scores.barrier_health,
                      previousScan.scores.barrier_health,
                      true
                    ),
                  }}
                />
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-muted">Oil Production</div>
                <div
                  className="text-foreground font-mono"
                  dangerouslySetInnerHTML={{
                    __html: formatConcernChange(
                      result.scores.oil_production,
                      previousScan.scores.oil_production,
                      false
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border">
        <button className="text-xs text-primary hover:text-primary/80 uppercase tracking-wider font-medium">
          Retake Analysis →
        </button>
      </div>
    </div>
  );
}

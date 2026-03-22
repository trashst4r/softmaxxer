/**
 * Sprint A: Results Proof Block
 * Appears on /results page after analysis when previous data exists.
 * Shows comparison immediately after seeing new analysis.
 */

"use client";

import { useEffect, useState } from "react";
import {
  analyzeProof,
  getDirectionLabel,
  getDirectionColor,
  type ProofAnalysis,
} from "@/lib/progress/proof-analyzer";
import type { SkinScores } from "@/types/analysis";

interface ResultsProofBlockProps {
  currentScores: SkinScores;
  tier: "guest" | "member" | "pro";
}

export function ResultsProofBlock({ currentScores, tier }: ResultsProofBlockProps) {
  const [proof, setProof] = useState<ProofAnalysis | null>(null);

  useEffect(() => {
    const analysis = analyzeProof(currentScores);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProof(analysis);
  }, [currentScores]);

  // Don't render if no proof (first-time user)
  if (!proof || !proof.hasProof) {
    return null;
  }

  // Guest tier: simplified comparison with upgrade CTA
  if (tier === "guest") {
    return (
      <div className="clinical-card bg-primary/5 border-primary/30 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-light text-foreground">Comparison to Previous Analysis</h3>
          <div className="h-px bg-primary/20" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {proof.changes.map((change) => (
            <div key={change.dimension} className="space-y-1">
              <div className="text-xs text-muted">{getDimensionLabel(change.dimension)}</div>
              <div className={`text-sm font-medium ${getDirectionColor(change.direction)}`}>
                {getDirectionLabel(change.direction)}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-primary/20">
          <p className="text-xs text-muted">
            Create an account to unlock full progress tracking with detailed interpretations and action guidance.
          </p>
        </div>
      </div>
    );
  }

  // Member/Pro: full comparison block
  const stateConfig = getStateConfig(proof.state);

  return (
    <div className={`clinical-card ${stateConfig.bgColor} space-y-5`}>
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-light text-foreground">Progress Since Last Analysis</h3>
          <div className={`text-xs uppercase tracking-wider font-medium ${stateConfig.labelColor}`}>
            {stateConfig.label}
          </div>
        </div>
        <div className="h-px bg-primary/20" />
      </div>

      {/* Direction grid */}
      <div className="grid grid-cols-3 gap-4">
        {proof.changes.map((change) => (
          <div key={change.dimension} className="space-y-2">
            <div className="text-xs text-muted uppercase tracking-wider">
              {getDimensionLabel(change.dimension)}
            </div>
            <div className="space-y-1">
              <div className={`text-base font-medium ${getDirectionColor(change.direction)}`}>
                {getDirectionLabel(change.direction)}
              </div>
              {tier === "pro" && change.direction !== "unchanged" && (
                <div className="text-xs text-muted">
                  {change.previous} → {change.current}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Interpretation */}
      <div className="space-y-2 pt-3 border-t border-primary/20">
        <p className="text-sm text-foreground leading-relaxed">{proof.interpretation}</p>
        {tier === "pro" && (
          <p className="text-sm text-muted leading-relaxed">{proof.actionGuidance}</p>
        )}
      </div>

      {/* Member upgrade hint */}
      {tier === "member" && (
        <div className="pt-3 border-t border-primary/20">
          <p className="text-xs text-muted">
            Upgrade to Pro for raw score deltas and action guidance integrated with your comparison.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Get dimension display label.
 */
function getDimensionLabel(dimension: "acne" | "barrier" | "overall"): string {
  switch (dimension) {
    case "acne":
      return "Acne";
    case "barrier":
      return "Barrier";
    case "overall":
      return "Overall";
  }
}

/**
 * Get state-based visual config.
 */
function getStateConfig(state: ProofAnalysis["state"]): {
  label: string;
  bgColor: string;
  labelColor: string;
} {
  switch (state) {
    case "clear_improvement":
      return {
        label: "Improving",
        bgColor: "bg-green-600/5 border-green-600/30",
        labelColor: "text-green-600 dark:text-green-400",
      };
    case "regression":
      return {
        label: "Declining",
        bgColor: "bg-red-600/5 border-red-600/30",
        labelColor: "text-red-600 dark:text-red-400",
      };
    case "plateau":
      return {
        label: "Stable",
        bgColor: "bg-yellow-600/5 border-yellow-600/30",
        labelColor: "text-yellow-600 dark:text-yellow-400",
      };
    default:
      return {
        label: "First Analysis",
        bgColor: "bg-muted/5 border-muted/20",
        labelColor: "text-muted",
      };
  }
}

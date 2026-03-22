/**
 * Sprint A: Proof Layer Card for Console
 * Answers "Am I improving?" by showing directional changes since last analysis.
 * Appears above or integrated with console intelligence card.
 */

"use client";

import { useEffect, useState } from "react";
import {
  analyzeProof,
  getDirectionLabel,
  getDirectionColor,
  type ProofAnalysis,
  type DimensionChange,
} from "@/lib/progress/proof-analyzer";
import type { SkinScores } from "@/types/analysis";

interface ProofLayerCardProps {
  currentScores: SkinScores;
  tier: "guest" | "member" | "pro";
}

export function ProofLayerCard({ currentScores, tier }: ProofLayerCardProps) {
  const [proof, setProof] = useState<ProofAnalysis | null>(null);

  useEffect(() => {
    const analysis = analyzeProof(currentScores);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProof(analysis);
  }, [currentScores]);

  if (!proof) return null;

  // First-time state: no previous data
  if (!proof.hasProof) {
    return (
      <div className="clinical-card bg-muted/5 border-muted/20 space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-light text-foreground">Progress Tracking</h2>
          <div className="h-px bg-muted/20" />
        </div>
        <div className="space-y-3">
          <p className="text-sm text-muted leading-relaxed">
            No previous analysis to compare. Complete another analysis in 3-5 days to start tracking your progress.
          </p>
          <p className="text-sm text-muted leading-relaxed">
            This system will show you whether acne, barrier health, and overall condition are improving, stable, or declining.
          </p>
        </div>
      </div>
    );
  }

  // Guest tier: limited proof surface
  if (tier === "guest") {
    return (
      <div className="clinical-card bg-muted/5 border-muted/20 space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-light text-foreground">Progress Update</h2>
          <div className="h-px bg-muted/20" />
        </div>
        <div className="space-y-3">
          <p className="text-sm text-foreground leading-relaxed">
            {getGuestSummary(proof.changes)}
          </p>
        </div>
        <div className="pt-3 border-t border-muted/20">
          <p className="text-xs text-muted">
            Create an account to unlock full proof layer with detailed change analysis and action guidance.
          </p>
        </div>
      </div>
    );
  }

  // Member/Pro: full proof surface
  const stateConfig = getStateConfig(proof.state);

  return (
    <div className={`clinical-card ${stateConfig.bgColor} space-y-6`}>
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-light text-foreground">Progress Update</h2>
          <div className={`text-xs uppercase tracking-wider font-medium ${stateConfig.labelColor}`}>
            {stateConfig.label}
          </div>
        </div>
        <div className="h-px bg-primary/20" />
      </div>

      {/* What Changed: Direction indicators */}
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-wider text-muted">What Changed</div>
        <div className="grid grid-cols-3 gap-3">
          {proof.changes.map((change) => (
            <DimensionChangeIndicator key={change.dimension} change={change} showDelta={tier === "pro"} />
          ))}
        </div>
      </div>

      {/* What This Means */}
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-wider text-muted">What This Means</div>
        <p className="text-sm text-foreground leading-relaxed">{proof.interpretation}</p>
      </div>

      {/* Continue or Adjust */}
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-wider text-muted">Continue or Adjust</div>
        <p className="text-sm text-foreground leading-relaxed">{proof.actionGuidance}</p>
      </div>

      {/* Member upgrade hint */}
      {tier === "member" && (
        <div className="pt-3 border-t border-primary/20">
          <p className="text-xs text-muted">
            Upgrade to Pro to see raw score deltas and deeper causal interpretation.
          </p>
        </div>
      )}
    </div>
  );
}

interface DimensionChangeIndicatorProps {
  change: DimensionChange;
  showDelta: boolean;
}

function DimensionChangeIndicator({ change, showDelta }: DimensionChangeIndicatorProps) {
  const directionColor = getDirectionColor(change.direction);
  const directionLabel = getDirectionLabel(change.direction);
  const dimensionLabel = getDimensionLabel(change.dimension);

  return (
    <div className="space-y-2">
      <div className="text-sm font-light text-muted">{dimensionLabel}</div>
      <div className="space-y-1">
        <div className={`text-sm font-medium ${directionColor}`}>{directionLabel}</div>
        {showDelta && change.direction !== "unchanged" && (
          <div className="text-xs text-muted">
            {change.previous} → {change.current}
          </div>
        )}
      </div>
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

/**
 * Generate guest-tier summary (simplified).
 */
function getGuestSummary(changes: DimensionChange[]): string {
  const improvements = changes.filter((c) => c.direction === "improved");
  const declines = changes.filter((c) => c.direction === "worsened");

  if (improvements.length >= 2) {
    return "Your skin is showing improvement across multiple areas.";
  }

  if (declines.length >= 2) {
    return "Some areas have declined since your last analysis.";
  }

  return "Your skin condition is relatively stable with minor changes.";
}

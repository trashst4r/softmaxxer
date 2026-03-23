/**
 * Sprint 15: Console Intelligence Card
 * Displays active guidance that tells user exactly what to do next.
 * This is the FIRST thing they see - answers "what should I do next?"
 */

"use client";

import { useEffect, useState } from "react";
import type { AnalysisResult } from "@/types/analysis";
import {
  generateConsoleIntelligence,
  type ConsoleIntelligence,
  type AdherenceSignal,
  type TrendDirection,
  type ConcernProgression,
} from "@/lib/console-intelligence";

interface ConsoleIntelligenceCardProps {
  result: AnalysisResult;
}

export function ConsoleIntelligenceCard({ result }: ConsoleIntelligenceCardProps) {
  const [intelligence, setIntelligence] = useState<ConsoleIntelligence | null>(null);

  useEffect(() => {
    const intel = generateConsoleIntelligence(result);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIntelligence(intel);
  }, [result]);

  if (!intelligence) {
    return null;
  }

  // Full intelligence display
  const priorityColor = {
    critical: "border-red-600/50 bg-red-600/5",
    high: "border-yellow-600/50 bg-yellow-600/5",
    medium: "border-primary/30 bg-primary/5",
  }[intelligence.nextActionPriority];

  const priorityLabel = {
    critical: "Critical",
    high: "High Priority",
    medium: "Recommended",
  }[intelligence.nextActionPriority];

  const priorityLabelColor = {
    critical: "text-red-600 dark:text-red-400",
    high: "text-yellow-600 dark:text-yellow-400",
    medium: "text-primary",
  }[intelligence.nextActionPriority];

  return (
    <div className={`clinical-card ${priorityColor} space-y-6`}>
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-foreground">What to do next</h2>
          <div className={`text-xs uppercase tracking-wider font-medium ${priorityLabelColor}`}>
            {priorityLabel}
          </div>
        </div>
        <div className="h-px bg-primary/20" />
      </div>

      {/* Next Action */}
      <div className="space-y-3">
        <p className="text-lg text-foreground leading-relaxed font-light">
          {intelligence.nextAction}
        </p>
        <p className="text-sm text-muted leading-relaxed">{intelligence.context}</p>
      </div>

      {/* Signals Grid */}
      <div className="pt-4 border-t border-primary/20 grid grid-cols-3 gap-4">
        <SignalIndicator
          label="Adherence"
          signal={intelligence.adherenceSignal}
          reason={intelligence.adherenceReason}
        />
        <SignalIndicator
          label="Trend"
          signal={intelligence.trendDirection}
          reason={intelligence.trendReason}
        />
        <SignalIndicator
          label="Concern"
          signal={intelligence.concernProgression}
          reason={intelligence.concernReason}
        />
      </div>
    </div>
  );
}

interface SignalIndicatorProps {
  label: string;
  signal: AdherenceSignal | TrendDirection | ConcernProgression;
  reason: string;
}

function SignalIndicator({ label, signal, reason }: SignalIndicatorProps) {
  const signalConfig = getSignalConfig(signal);

  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-wider text-muted">{label}</div>
      <div className="space-y-1">
        <div className={`text-sm font-medium ${signalConfig.color}`}>{signalConfig.label}</div>
        <div className="text-xs text-muted leading-relaxed">{reason}</div>
      </div>
    </div>
  );
}

function getSignalConfig(signal: string): { label: string; color: string } {
  switch (signal) {
    // Adherence signals
    case "consistent":
      return { label: "Consistent", color: "text-green-600 dark:text-green-400" };
    case "inconsistent":
      return { label: "Inconsistent", color: "text-yellow-600 dark:text-yellow-400" };
    case "declining":
      return { label: "Declining", color: "text-red-600 dark:text-red-400" };

    // Trend signals
    case "improving":
      return { label: "Improving", color: "text-green-600 dark:text-green-400" };
    case "plateau":
      return { label: "Plateau", color: "text-yellow-600 dark:text-yellow-400" };
    case "unstable":
      return { label: "Unstable", color: "text-red-600 dark:text-red-400" };

    // Concern signals
    case "resolving":
      return { label: "Resolving", color: "text-green-600 dark:text-green-400" };
    case "unchanged":
      return { label: "Unchanged", color: "text-yellow-600 dark:text-yellow-400" };
    case "worsening":
      return { label: "Worsening", color: "text-red-600 dark:text-red-400" };

    // Unknown
    default:
      return { label: "Unknown", color: "text-muted" };
  }
}

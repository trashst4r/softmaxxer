/**
 * Dev Tools User Simulation v1
 * Routine viewer for selected check-in day
 */

"use client";

import { useMemo } from "react";
import type { CheckInEntry } from "@/types/dev-user";
import { ProfileSummaryCard } from "@/components/results/ProfileSummaryCard";
import { RoutineResultsSection } from "@/components/results/RoutineResultsSection";

interface DayRoutineViewerProps {
  entry: CheckInEntry | null;
}

export function DayRoutineViewer({ entry }: DayRoutineViewerProps) {
  const result = useMemo(() => {
    if (!entry) return null;

    // Dynamically import and run the engine
    const { inferSkinProfile } = require("@/lib/analysis/infer-skin-profile");
    const { buildRoutineFromProfile } = require("@/lib/analysis/build-routine-from-profile");

    const profile = inferSkinProfile(entry.answers);
    const routine = buildRoutineFromProfile(profile);

    return { profile, routine };
  }, [entry]);

  if (!entry || !result) {
    return (
      <div className="flex items-center justify-center h-full text-center py-12">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted">No day selected</div>
          <div className="text-xs text-on-surface-variant">
            Select a check-in from the timeline to view the routine
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-outline-variant">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Day {entry.day} Routine
          </h2>
          <span className="text-xs text-muted uppercase tracking-wider">
            {entry.date}
          </span>
        </div>
        {entry.notes && (
          <p className="text-sm text-on-surface-variant">{entry.notes}</p>
        )}
      </div>

      {/* Profile Summary */}
      <div>
        <h3 className="text-xs uppercase tracking-wider font-medium text-muted mb-3">
          Inferred Profile
        </h3>
        <ProfileSummaryCard profile={result.profile} />
      </div>

      {/* Routine Output */}
      <div>
        <h3 className="text-xs uppercase tracking-wider font-medium text-muted mb-3">
          Generated Routine
        </h3>
        <RoutineResultsSection routine={result.routine} />
      </div>
    </div>
  );
}

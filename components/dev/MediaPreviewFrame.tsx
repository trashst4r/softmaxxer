/**
 * Dev Tools Media Sandbox v1
 * Live preview frame for screenshot-ready renders
 */

"use client";

import { useMemo } from "react";
import type { DevMediaState } from "@/types/dev-media-state";
import { devMediaStateToSkinProfile } from "@/types/dev-media-state";
import { ProfileSummaryCard } from "@/components/results/ProfileSummaryCard";
import { RoutineResultsSection } from "@/components/results/RoutineResultsSection";

interface MediaPreviewFrameProps {
  state: DevMediaState;
  mode: "profile" | "routine" | "both";
}

export function MediaPreviewFrame({ state, mode }: MediaPreviewFrameProps) {
  // Convert dev state to profile and generate routine
  const { profile, routine } = useMemo(() => {
    const { buildRoutineFromProfile } = require("@/lib/analysis/build-routine-from-profile");
    const skinProfile = devMediaStateToSkinProfile(state);
    const generatedRoutine = buildRoutineFromProfile(skinProfile);

    return {
      profile: skinProfile,
      routine: generatedRoutine,
    };
  }, [state]);

  return (
    <div className="bg-background p-8 rounded-xl border-2 border-outline-variant">
      {/* Screenshot-ready preview area */}
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Profile Preview */}
        {(mode === "profile" || mode === "both") && (
          <div>
            <div className="mb-4">
              <span className="text-[10px] uppercase tracking-wider text-muted">
                Profile Summary
              </span>
            </div>
            <ProfileSummaryCard profile={profile} />
          </div>
        )}

        {/* Routine Preview */}
        {(mode === "routine" || mode === "both") && (
          <div>
            <div className="mb-4">
              <span className="text-[10px] uppercase tracking-wider text-muted">
                Recommended Routine
              </span>
            </div>
            <RoutineResultsSection routine={routine} />
          </div>
        )}

        {/* Dashboard Metrics Preview (if needed for screenshots) */}
        {mode === "both" && (
          <div className="pt-6 border-t border-outline-variant">
            <div className="mb-4">
              <span className="text-[10px] uppercase tracking-wider text-muted">
                Progress Metrics
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-outline-variant rounded-xl p-6">
                <div className="text-xs text-muted uppercase tracking-wider mb-2">
                  Adherence Rate
                </div>
                <div className="text-3xl font-bold text-on-surface">
                  {state.adherencePercentage}%
                </div>
              </div>
              <div className="bg-white border border-outline-variant rounded-xl p-6">
                <div className="text-xs text-muted uppercase tracking-wider mb-2">
                  Current Streak
                </div>
                <div className="text-3xl font-bold text-on-surface">
                  {state.currentStreak}
                  <span className="text-base text-muted ml-1">days</span>
                </div>
              </div>
              <div className="bg-white border border-outline-variant rounded-xl p-6">
                <div className="text-xs text-muted uppercase tracking-wider mb-2">
                  Total Check-Ins
                </div>
                <div className="text-3xl font-bold text-on-surface">
                  {state.totalCheckIns}
                </div>
              </div>
              <div className="bg-white border border-outline-variant rounded-xl p-6">
                <div className="text-xs text-muted uppercase tracking-wider mb-2">
                  Last Check-In
                </div>
                <div className="text-3xl font-bold text-on-surface">
                  {state.lastCheckInDays}
                  <span className="text-base text-muted ml-1">days ago</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { recordConsoleVisit, getLatestAnalysis } from "@/lib/console-state";
import type { AnalysisResult } from "@/types/analysis";
import { generateConsoleIntelligence } from "@/lib/console-intelligence";
import { analyzeProof } from "@/lib/progress/proof-analyzer";

export function DashboardPremium() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResult(getLatestAnalysis());
    recordConsoleVisit();
  }, []);

  if (!result) {
    return (
      <div className="screen-container">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center space-y-6 max-w-md px-6">
            <h1 className="text-2xl font-medium text-foreground">
              Complete your first check-in
            </h1>
            <p className="text-sm text-muted leading-relaxed">
              Answer a few questions to get your personalized routine.
            </p>
            <Link href="/analysis" className="clinical-button inline-block">
              Start Check-In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const intelligence = generateConsoleIntelligence(result);
  const proof = analyzeProof(result.scores);

  return (
    <div className="screen-container">
      <div className="screen-content px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header with Quick Action */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-medium text-foreground">Dashboard</h1>
              <p className="text-sm text-muted mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Link href="/analysis" className="clinical-button-secondary text-sm">
              Reassess
            </Link>
          </div>

          {/* Main Grid - One Screen Target */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column: Command + Routine */}
            <div className="space-y-6">
              {/* Next Action */}
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wider text-muted font-medium">
                  What to do now
                </div>
                <div className="bg-surface rounded-lg p-6 space-y-3 smooth-transition hover:shadow-sm">
                  <p className="text-base text-foreground leading-relaxed">
                    {intelligence.nextAction}
                  </p>
                  <p className="text-sm text-muted">{intelligence.context}</p>
                </div>
              </div>

              {/* Today's Routine */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-wider text-muted font-medium">
                    Today&apos;s Routine
                  </div>
                  <Link
                    href="/protocol"
                    className="text-xs text-foreground hover:text-primary smooth-transition"
                  >
                    View Full Protocol →
                  </Link>
                </div>
                <div className="space-y-4">
                  {/* AM Routine Preview */}
                  <div className="bg-surface rounded-lg p-5 space-y-3">
                    <div className="text-sm font-medium text-foreground">Morning</div>
                    <div className="space-y-2">
                      {result.am_routine.slice(0, 4).map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-xs text-muted mt-0.5 font-mono">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm text-foreground flex-1">{step.step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PM Routine Preview */}
                  <div className="bg-surface rounded-lg p-5 space-y-3">
                    <div className="text-sm font-medium text-foreground">Evening</div>
                    <div className="space-y-2">
                      {result.pm_routine.slice(0, 4).map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-xs text-muted mt-0.5 font-mono">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm text-foreground flex-1">{step.step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: State + Progress + Focus */}
            <div className="space-y-6">
              {/* Current State */}
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wider text-muted font-medium">
                  Current State
                </div>
                <div className="bg-surface rounded-lg p-6 space-y-4">
                  <div>
                    <div className="text-lg font-medium text-foreground">
                      {result.profile_label}
                    </div>
                    <p className="text-sm text-muted mt-2 leading-relaxed">
                      {result.summary}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                    <div>
                      <div className="text-xs text-muted mb-1">Barrier</div>
                      <div
                        className={`text-sm font-medium ${
                          result.barrier_risk === "Low"
                            ? "text-green-600"
                            : result.barrier_risk === "Moderate"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {result.barrier_risk}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted mb-1">Confidence</div>
                      <div className="text-sm font-medium text-foreground">
                        {result.confidence_score}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Since Last Check */}
              {proof.hasProof && (
                <div className="space-y-3">
                  <div className="text-xs uppercase tracking-wider text-muted font-medium">
                    Progress
                  </div>
                  <div className="bg-surface rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {proof.changes.map((change) => (
                        <div key={change.dimension} className="text-center">
                          <div className="text-xs text-muted mb-1 capitalize">
                            {change.dimension}
                          </div>
                          <div
                            className={`text-sm font-medium ${
                              change.direction === "improved"
                                ? "text-green-600"
                                : change.direction === "worsened"
                                  ? "text-red-600"
                                  : "text-muted"
                            }`}
                          >
                            {change.direction === "improved"
                              ? "↑"
                              : change.direction === "worsened"
                                ? "↓"
                                : "→"}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted leading-relaxed pt-3 border-t border-border">
                      {proof.interpretation}
                    </p>
                  </div>
                </div>
              )}

              {/* Primary Focus */}
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wider text-muted font-medium">
                  Focus Areas
                </div>
                <div className="bg-surface rounded-lg p-6 space-y-2">
                  {result.ranked_concerns.slice(0, 3).map((concern, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-xs text-muted mt-0.5 font-mono">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-foreground flex-1">{concern.concern}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Link
              href="/protocol"
              className="text-sm text-muted hover:text-foreground smooth-transition"
            >
              View Protocol
            </Link>
            <span className="text-muted">·</span>
            <Link
              href="/analysis"
              className="text-sm text-muted hover:text-foreground smooth-transition"
            >
              Reassess
            </Link>
            <span className="text-muted">·</span>
            <Link
              href="/results"
              className="text-sm text-muted hover:text-foreground smooth-transition"
            >
              Last Analysis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

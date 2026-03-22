"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { recordConsoleVisit, getLatestAnalysis } from "@/lib/console-state";
import type { AnalysisResult } from "@/types/analysis";
import { generateConsoleIntelligence } from "@/lib/console-intelligence";
import { analyzeProof } from "@/lib/progress/proof-analyzer";

export function DashboardEditorial() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResult(getLatestAnalysis());
    recordConsoleVisit();
  }, []);

  if (!result) {
    return (
      <div className="screen-container">
        <div className="flex items-center justify-center flex-1 px-6">
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-headline text-2xl font-normal text-on-surface">
              Complete your first check-in
            </h1>
            <p className="text-body text-sm text-muted leading-relaxed">
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
    <div className="screen-container bg-surface">
      <div className="screen-content px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-headline text-2xl font-normal text-on-surface">Dashboard</h1>
              <p className="text-body text-sm text-muted">
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

          {/* Tonal Separator */}
          <div className="py-8 bg-surface-low rounded-lg">
            {/* What to Do Now - Hero Zone */}
            <div className="max-w-2xl mx-auto text-center space-y-3 px-8">
              <div className="text-body text-xs uppercase tracking-wider text-muted font-medium">
                What to do now
              </div>
              <p className="text-headline text-xl font-normal text-on-surface leading-relaxed">
                {intelligence.nextAction}
              </p>
              <p className="text-body text-sm text-muted font-light">
                {intelligence.context}
              </p>
            </div>
          </div>

          {/* Today's Routine - DOMINANT SECTION */}
          <div className="space-y-6">
            <div className="text-body text-xs uppercase tracking-wider text-muted font-medium">
              Today&apos;s Routine
            </div>

            <div className="space-y-6">
              {/* Morning */}
              <div className="space-y-3">
                <h2 className="text-headline text-base font-medium text-on-surface">Morning</h2>
                <div className="space-y-3">
                  {result.am_routine.slice(0, 4).map((step, i) => (
                    <div
                      key={`am-${step.step}-${i}`}
                      className="flex items-start gap-4 py-2 px-3 rounded-md hover:bg-surface-lowest smooth-transition cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        aria-label={`Mark ${step.step} as complete`}
                      />
                      <span className="text-body text-xs text-muted font-mono">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-body text-sm text-on-surface flex-1">{step.step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evening */}
              <div className="space-y-3">
                <h2 className="text-headline text-base font-medium text-on-surface">Evening</h2>
                <div className="space-y-3">
                  {result.pm_routine.slice(0, 3).map((step, i) => (
                    <div
                      key={`pm-${step.step}-${i}`}
                      className="flex items-start gap-4 py-2 px-3 rounded-md hover:bg-surface-lowest smooth-transition cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        aria-label={`Mark ${step.step} as complete`}
                      />
                      <span className="text-body text-xs text-muted font-mono">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-body text-sm text-on-surface flex-1">{step.step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Focus Product - Subtle Product Exposure */}
              {result.pm_routine.length > 0 && result.pm_routine[1] && (
                <div className="bg-surface-low rounded-lg p-5 space-y-3">
                  <div className="text-body text-xs text-muted">Today&apos;s focus product</div>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-surface-lowest rounded-md flex items-center justify-center flex-shrink-0">
                      {/* Placeholder for product image */}
                      <div className="w-16 h-16 bg-surface-highest rounded" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-headline text-base font-medium text-on-surface">
                        {result.pm_routine[1].step}
                      </div>
                      <p className="text-body text-sm text-muted">
                        {result.pm_routine[1].products?.[0]?.rationale || "Essential for your routine."}
                      </p>
                    </div>
                    <Link
                      href="/protocol"
                      className="text-body text-sm text-primary hover:underline whitespace-nowrap"
                    >
                      View Product →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Secondary Row - Tonal Zone */}
          <div className="bg-surface-low rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Current State */}
              <div className="space-y-4">
                <div className="text-body text-xs uppercase tracking-wider text-muted font-medium">
                  Current State
                </div>
                <div className="space-y-3">
                  <h3 className="text-headline text-xl font-medium text-on-surface">
                    {result.profile_label}
                  </h3>
                  <p className="text-body text-sm text-muted leading-relaxed">
                    {result.summary}
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-3">
                    <div className="space-y-1">
                      <div className="text-body text-xs text-muted">Barrier</div>
                      <div
                        className={`text-body text-sm font-medium ${
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
                    <div className="space-y-1">
                      <div className="text-body text-xs text-muted">Confidence</div>
                      <div className="text-body text-sm font-medium text-on-surface">
                        {result.confidence_score}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress + Focus */}
              <div className="space-y-6">
                {/* Progress */}
                {proof.hasProof && (
                  <div className="space-y-3">
                    <div className="text-body text-xs uppercase tracking-wider text-muted font-medium">
                      Progress
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {proof.changes.map((change) => (
                        <div key={change.dimension} className="space-y-1">
                          <div className="text-body text-xs text-muted capitalize">
                            {change.dimension}
                          </div>
                          <div
                            className={`text-2xl ${
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
                    <p className="text-body text-sm text-muted leading-relaxed">
                      {proof.interpretation}
                    </p>
                  </div>
                )}

                {/* Focus */}
                <div className="space-y-3">
                  <div className="text-body text-xs uppercase tracking-wider text-muted font-medium">
                    Focus
                  </div>
                  <div className="space-y-2">
                    {result.ranked_concerns.slice(0, 3).map((concern, i) => (
                      <div key={`concern-${concern.concern}`} className="flex items-start gap-3">
                        <span className="text-body text-xs text-muted font-mono">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-body text-sm text-on-surface">{concern.concern}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex items-center justify-center gap-3 text-body text-sm text-muted">
            <Link href="/protocol" className="hover:text-on-surface smooth-transition">
              View Protocol
            </Link>
            <span>·</span>
            <Link href="/analysis" className="hover:text-on-surface smooth-transition">
              Reassess
            </Link>
            <span>·</span>
            <Link href="/results" className="hover:text-on-surface smooth-transition">
              Last Analysis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

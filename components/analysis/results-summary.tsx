"use client";

import type { AnalysisResult } from "@/types/analysis";
import type { SkinProfile } from "@/lib/scoring/types";
import { ResultInsightList } from "./result-insight-list";
import { ResultScoreCard } from "./result-score-card";
import { ResultRoutinePreview } from "./result-routine-preview";
import Link from "next/link";

interface ResultsSummaryProps {
  result: AnalysisResult;
}

export function ResultsSummary({ result }: ResultsSummaryProps) {

  // Load SkinProfile from sessionStorage (computed during check-in)
  const getSkinProfile = (): SkinProfile | null => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("skin_profile");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const skinProfile = getSkinProfile();
  const primaryConcern = result.ranked_concerns[0]?.concern;
  // Derive concise summary from primary concern and profile
  const getSkinSummary = (): string => {
    const concerns = result.ranked_concerns.slice(0, 2).map(c => c.concern.toLowerCase());
    if (concerns.length === 0) return "Your skin is looking balanced overall";
    if (concerns.length === 1) return `Focused on ${concerns[0]}`;
    return `Addressing ${concerns[0]} and ${concerns[1]}`;
  };

  return (
    <div className="space-y-12">
      {/* Hero Summary - Immediate confidence and clarity */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-on-surface">
            Your routine is ready
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            {getSkinSummary()}
          </p>
        </div>

        <Link
          href="/protocol"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          View full protocol
          <span>→</span>
        </Link>
      </div>

      {/* Skin Snapshot + Score Card Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Plain-language insights */}
        <div className="bg-surface-container-low rounded-xl p-6">
          {skinProfile ? (
            <ResultInsightList profile={skinProfile} primaryConcern={primaryConcern} />
          ) : (
            <div className="space-y-3">
              <p className="clinical-label">Your skin right now</p>
              <p className="text-sm text-on-surface-variant">
                {result.summary}
              </p>
            </div>
          )}
        </div>

        {/* Score readout */}
        {skinProfile && (
          <ResultScoreCard
            profile={skinProfile}
            showDetails={true}
          />
        )}
      </div>

      {/* Routine Preview - Editorial AM/PM blocks */}
      <ResultRoutinePreview
        amRoutine={result.am_routine}
        pmRoutine={result.pm_routine}
      />

      {/* Product Direction - Top concerns and next steps */}
      {result.ranked_concerns.length > 0 && (
        <div className="bg-surface-container-low rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-light text-on-surface">What we&apos;re targeting</h3>
            <p className="text-sm text-on-surface-variant">
              Your routine addresses these concerns in priority order
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="clinical-label">Primary concerns</p>
              <ul className="space-y-2">
                {result.ranked_concerns
                  .slice(0, 4)
                  .map((concern, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="flex-1">{concern.concern}</span>
                    </li>
                  ))}
              </ul>

            <div className="space-y-3">
              <p className="clinical-label">Key focus areas</p>
              <ul className="space-y-2">
                {result.next_tests
                  .slice(0, 3)
                  .map((test, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-on-surface-variant">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="flex-1">{test}</span>
                    </li>
                  ))}
              </ul>
          </div>
        </div>
      )}

      {/* Pro Intelligence - Condensed for premium feel */}
        <div className="bg-surface-container-low rounded-xl p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-light text-on-surface">Why this works</h3>
              <span className="text-xs text-on-surface-variant uppercase tracking-wider">Pro</span>
            </div>
            <p className="text-sm text-on-surface-variant max-w-2xl">
              Your {result.profile_label} profile requires a specific approach. Here&apos;s the strategy.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-on-surface">Protocol logic</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                The regimen addresses your primary concerns while maintaining barrier integrity.
                Each active is timed to your barrier health and sensitivity level to prevent irritation.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-on-surface">What to expect</h4>
              <ul className="text-sm text-on-surface-variant space-y-1">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Barrier stabilization: 2-3 weeks</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Active introduction: After barrier recovery</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Visible changes: 6-8 weeks with consistent use</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Conversion CTAs - Restrained */}
      )}

      )}
    </div>
  );
}

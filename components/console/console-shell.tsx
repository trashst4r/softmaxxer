"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccessState } from "@/lib/access-state";
import { recordConsoleVisit, getLatestAnalysis } from "@/lib/console-state";
import { TierContextBanner } from "@/components/shared/tier-context-banner";
import type { AnalysisResult } from "@/types/analysis";
import { CurrentProtocolCard } from "./current-protocol-card";
import { DailyCheckInCard } from "./daily-checkin-card";
import { ProductStackCard } from "./product-stack-card";
import { TrendSnapshotCard } from "./trend-snapshot-card";
import { ProgressChartCard } from "./progress-chart-card";
import { AdherenceSummaryCard } from "./adherence-summary-card";
import { ActiveTargetsCard } from "./active-targets-card";
import { FocusGuidanceCard } from "./focus-guidance-card";
import { ProScanCard } from "@/components/pro/pro-scan-card";
import { ConsoleIntelligenceCard } from "./console-intelligence-card";
import { ProofLayerCard } from "./proof-layer-card";

export function ConsoleShell() {
  const [accessState] = useAccessState();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Load analysis from localStorage after mount (hydration-safe pattern)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResult(getLatestAnalysis());

    // Record console visit for analytics
    recordConsoleVisit();
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-3">
            <h1 className="text-3xl font-light text-foreground">Console</h1>
            <div className="h-px w-12 bg-primary/40 mx-auto" />
          </div>
          <p className="text-sm text-muted leading-relaxed">
            No analysis found. Complete your first skin analysis to access the console.
          </p>
          <Link href="/analysis" className="clinical-button inline-block">
            Begin Analysis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Console Header */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-light text-foreground">Console</h1>
            <div className="h-px w-12 bg-primary/40" />
          </div>
          <p className="text-sm text-muted max-w-2xl">
            Active protocol guidance. Know exactly what to do next based on your adherence, progress trends, and skin response.
          </p>
        </div>

        {/* Tier Context Banner */}
        <TierContextBanner tier={accessState} context="console" />

        {/* Main Console Grid - Tier-Aware Structure */}
        <div className="space-y-8">
          {/* Guest: Minimal Console */}
          {accessState === "guest" && (
            <>
              {/* Sprint 15: Intelligence Layer - TOP PRIORITY */}
              <ConsoleIntelligenceCard result={result} tier={accessState} />

              {/* Sprint A: Proof Layer */}
              <ProofLayerCard currentScores={result.scores} tier={accessState} />

              <div className="grid md:grid-cols-2 gap-8">
                <ActiveTargetsCard result={result} />
                <CurrentProtocolCard result={result} />
              </div>
              <div>
                <ProductStackCard result={result} accessState={accessState} />
              </div>
              {/* Guest Upgrade CTA */}
              <div className="clinical-card bg-primary/5 border-primary/30">
                <div className="text-center space-y-4 py-8">
                  <h3 className="text-xl font-light text-foreground">
                    Unlock Full Console
                  </h3>
                  <p className="text-sm text-muted max-w-2xl mx-auto leading-relaxed">
                    Get adherence tracking, progress charts, daily check-ins, trend analysis, and complete product intelligence.
                    Create a free account to access your full regimen management system.
                  </p>
                  <button className="clinical-button">
                    Create Account →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Member: Complete Console */}
          {accessState === "member" && (
            <>
              {/* Sprint 15: Intelligence Layer - TOP PRIORITY */}
              <ConsoleIntelligenceCard result={result} tier={accessState} />

              {/* Sprint A: Proof Layer */}
              <ProofLayerCard currentScores={result.scores} tier={accessState} />

              <div className="grid md:grid-cols-2 gap-8">
                <ActiveTargetsCard result={result} />
                <FocusGuidanceCard result={result} />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <CurrentProtocolCard result={result} />
                <AdherenceSummaryCard />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <ProgressChartCard />
                <TrendSnapshotCard result={result} />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <DailyCheckInCard />
                <ProductStackCard result={result} accessState={accessState} />
              </div>
              {/* Member Pro Upgrade CTA */}
              <div className="clinical-card bg-primary/5 border-primary/30">
                <div className="text-center space-y-4 py-6">
                  <h3 className="text-lg font-light text-foreground">
                    Upgrade to Pro Intelligence
                  </h3>
                  <p className="text-sm text-muted max-w-2xl mx-auto leading-relaxed">
                    Add face scan analysis, deep protocol explanations, optimization strategies, and advanced geometric intelligence.
                  </p>
                  <button className="clinical-button">
                    Upgrade to Pro →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Pro: Deepened Console */}
          {accessState === "pro" && (
            <>
              {/* Sprint 15: Intelligence Layer - TOP PRIORITY with Pro signals */}
              <ConsoleIntelligenceCard result={result} tier={accessState} />

              {/* Sprint A: Proof Layer */}
              <ProofLayerCard currentScores={result.scores} tier={accessState} />

              <div className="grid md:grid-cols-2 gap-8">
                <ActiveTargetsCard result={result} />
                <FocusGuidanceCard result={result} />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <CurrentProtocolCard result={result} />
                <AdherenceSummaryCard />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <ProgressChartCard />
                <TrendSnapshotCard result={result} />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <DailyCheckInCard />
                <ProductStackCard result={result} accessState={accessState} />
              </div>
              {/* Pro Face Scan + Intelligence */}
              <div className="grid md:grid-cols-2 gap-8">
                <ProScanCard />
                <div className="clinical-card space-y-4 bg-primary/5 border-primary/30">
                  <h2 className="clinical-label">Pro Intelligence Layer</h2>
                  <div className="text-sm text-muted space-y-3">
                    <p>
                      Advanced protocol intelligence combining facial geometry, regimen adherence, and progress metrics.
                    </p>
                    <div className="space-y-2 pt-2">
                      <div className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Scan-to-protocol optimization</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Geometric ratio analysis</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Progress prediction modeling</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Ingredient interaction insights</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="pt-8 border-t border-border flex gap-4">
          <Link href="/" className="clinical-button-secondary">
            Home
          </Link>
          <Link href="/analysis" className="clinical-button-secondary">
            Retake Analysis
          </Link>
          <Link href="/results" className="clinical-button-secondary">
            View Full Results
          </Link>
        </div>
      </div>
    </div>
  );
}

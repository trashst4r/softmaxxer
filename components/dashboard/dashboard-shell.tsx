"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { recordConsoleVisit, getLatestAnalysis } from "@/lib/console-state";
import type { AnalysisResult } from "@/types/analysis";
import { CurrentProtocolCard } from "../console/current-protocol-card";
import { DailyCheckInCard } from "../console/daily-checkin-card";
import { ProductStackCard } from "../console/product-stack-card";
import { TrendSnapshotCard } from "../console/trend-snapshot-card";
import { ProgressChartCard } from "../console/progress-chart-card";
import { AdherenceSummaryCard } from "../console/adherence-summary-card";
import { ActiveTargetsCard } from "../console/active-targets-card";
import { FocusGuidanceCard } from "../console/focus-guidance-card";
import { ConsoleIntelligenceCard } from "../console/console-intelligence-card";
import { ProofLayerCard } from "../console/proof-layer-card";

export function DashboardShell() {
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
            <h1 className="text-3xl font-light text-foreground">Dashboard</h1>
            <div className="h-px w-12 bg-primary/40 mx-auto" />
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Complete your first check-in to access your dashboard.
          </p>
          <Link href="/analysis" className="clinical-button inline-block">
            Begin Check-In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Header */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-light text-foreground">Dashboard</h1>
              <p className="text-xs text-muted">
                Protocol command center. Today&apos;s routine, progress, and product stack.
              </p>
            </div>
            <Link href="/analysis" className="clinical-button-secondary text-sm">
              Reassess
            </Link>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="space-y-6">
          {/* Intelligence Layer */}
          <ConsoleIntelligenceCard result={result} />

          {/* Proof Layer */}
          <ProofLayerCard currentScores={result.scores} />

          <div className="grid md:grid-cols-2 gap-6">
            <ActiveTargetsCard result={result} />
            <FocusGuidanceCard result={result} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <CurrentProtocolCard result={result} />
            <AdherenceSummaryCard />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <ProgressChartCard />
            <TrendSnapshotCard result={result} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <DailyCheckInCard />
            <ProductStackCard result={result} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-6 border-t border-border flex gap-3">
          <Link href="/analysis" className="clinical-button-secondary text-sm">
            Reassess
          </Link>
          <Link href="/protocol" className="clinical-button-secondary text-sm">
            View Protocol
          </Link>
          <Link href="/protocol" className="clinical-button-secondary text-sm">
            Last Analysis
          </Link>
        </div>
      </div>
    </div>
  );
}

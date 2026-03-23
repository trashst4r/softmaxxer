"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { recordConsoleVisit, getLatestAnalysis } from "@/lib/console-state";
import type { AnalysisResult } from "@/types/analysis";
import { CurrentProtocolCard } from "./current-protocol-card";
import { DailyCheckInCard } from "./daily-checkin-card";
import { ProductStackCard } from "./product-stack-card";
import { TrendSnapshotCard } from "./trend-snapshot-card";
import { ProgressChartCard } from "./progress-chart-card";
import { AdherenceSummaryCard } from "./adherence-summary-card";
import { ActiveTargetsCard } from "./active-targets-card";
import { FocusGuidanceCard } from "./focus-guidance-card";
import { ConsoleIntelligenceCard } from "./console-intelligence-card";
import { ProofLayerCard } from "./proof-layer-card";

export function ConsoleShell() {
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

        {/* Main Console Grid */}
        <div className="space-y-8">
          {/* Intelligence Layer */}
          <ConsoleIntelligenceCard result={result} />

          {/* Proof Layer */}
          <ProofLayerCard currentScores={result.scores} />

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
            <ProductStackCard result={result} />
          </div>
        </div>

        {/* Navigation */}
        <div className="pt-8 border-t border-border flex gap-4">
          <Link href="/" className="clinical-button-secondary">
            Home
          </Link>
          <Link href="/analysis" className="clinical-button-secondary">
            Retake Analysis
          </Link>
          <Link href="/protocol" className="clinical-button-secondary">
            View Full Results
          </Link>
        </div>
      </div>
    </div>
  );
}

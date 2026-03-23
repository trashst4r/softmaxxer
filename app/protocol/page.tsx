"use client";

import { useEffect, useState } from "react";
import { WeeklyProtocolView } from "@/components/protocol/weekly-protocol-view";
import { TodayRoutineCard } from "@/components/protocol/today-routine-card";
import { IngredientProductSuggestions } from "@/components/protocol/ingredient-product-suggestions";
import { getActiveRegimen } from "@/lib/app-state";
import { getCurrentDay, setCurrentDay, initializeProtocolStart } from "@/lib/protocol/day-tracker";
import type { AnalysisResult } from "@/types/analysis";
import Link from "next/link";

export default function ProtocolPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDayState] = useState(1);

  useEffect(() => {
    const analysis = getActiveRegimen();
    setResult(analysis);

    if (analysis?.weekly_protocol) {
      initializeProtocolStart();
      setCurrentDayState(getCurrentDay());
    }

    setLoading(false);
  }, []);

  const handleDayChange = (day: number) => {
    setCurrentDay(day);
    setCurrentDayState(day);
  };

  if (loading) {
    return (
      <div className="screen-container">
        <div className="flex items-center justify-center flex-1 px-6">
          <div className="text-center">
            <p className="text-on-surface-variant">Loading protocol...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="screen-container">
        <div className="flex items-center justify-center flex-1 px-6">
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-headline text-2xl font-normal text-on-surface">
              Your Protocol
            </h1>
            <p className="text-body text-sm text-muted leading-relaxed">
              Complete your first check-in to generate your protocol.
            </p>
            <Link href="/analysis" className="clinical-button inline-block">
              Start Check-In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Sprint 24: Always show protocol system (no manual builder)
  if (!result.weekly_protocol) {
    return (
      <div className="screen-container">
        <div className="flex items-center justify-center flex-1 px-6">
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-headline text-2xl font-normal text-on-surface">
              Protocol Generation In Progress
            </h1>
            <p className="text-body text-sm text-muted leading-relaxed">
              Your protocol is being generated. Please retake check-in to generate weekly protocol.
            </p>
            <Link href="/analysis" className="clinical-button inline-block">
              Retake Check-In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container bg-surface">
      <div className="screen-content px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <header className="max-w-4xl">
            <span className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold mb-2 block">
              Analysis Complete
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline mb-3">
              Your Clinical Protocol
            </h1>
            <p className="text-sm text-on-surface-variant">
              Targeting <span className="text-on-surface font-medium capitalize">{result.weekly_protocol.primaryConcern}</span>
              {result.weekly_protocol.secondaryConcern && (
                <> and <span className="text-on-surface font-medium capitalize">{result.weekly_protocol.secondaryConcern}</span></>
              )} · {result.weekly_protocol.toleranceTier} tolerance · {result.confidence_score}% confidence
            </p>
          </header>

          {/* Today's Routine - Hero */}
          <TodayRoutineCard
            protocol={result.weekly_protocol}
            currentDay={currentDay}
            onDayChange={handleDayChange}
          />

          {/* Product Recommendations */}
          <IngredientProductSuggestions protocol={result.weekly_protocol} />

          {/* Full Weekly Protocol */}
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight text-on-surface font-headline mb-4">
              Full Weekly Protocol
            </h2>
            <WeeklyProtocolView protocol={result.weekly_protocol} result={result} />
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-center gap-3 text-sm text-on-surface-variant pt-8 border-t border-outline-variant">
            <Link href="/dashboard" className="hover:text-on-surface transition-colors">
              Dashboard
            </Link>
            <span>·</span>
            <Link href="/analysis" className="hover:text-on-surface transition-colors">
              Retake Check-In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

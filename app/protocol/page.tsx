"use client";

import { useEffect, useState } from "react";
import { ProtocolEditorial } from "@/components/protocol/protocol-editorial";
import { WeeklyProtocolView } from "@/components/protocol/weekly-protocol-view";
import { getActiveRegimen } from "@/lib/app-state";
import type { AnalysisResult } from "@/types/analysis";
import Link from "next/link";

export default function ProtocolPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analysis = getActiveRegimen();
    setResult(analysis);
    setLoading(false);
  }, []);

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

  // Sprint 21: If weekly protocol exists, show new view
  if (result.weekly_protocol) {
    return (
      <div className="screen-container bg-surface">
        <div className="screen-content px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <WeeklyProtocolView protocol={result.weekly_protocol} />

            {/* Footer Navigation */}
            <div className="flex items-center justify-center gap-3 text-body text-sm text-muted pt-12 mt-12 border-t border-outline-variant">
              <Link href="/dashboard" className="hover:text-on-surface transition-colors">
                Back to Dashboard
              </Link>
              <span>·</span>
              <Link href="/analysis" className="hover:text-on-surface transition-colors">
                Retake Check-In
              </Link>
              <span>·</span>
              <Link href="/results" className="hover:text-on-surface transition-colors">
                View Analysis
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to legacy product selector
  return <ProtocolEditorial />;
}

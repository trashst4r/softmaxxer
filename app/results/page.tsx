"use client";

/**
 * Check-In Results Screen Wiring v1
 * Results page displaying inferred profile and recommended routines
 */

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { ResultPayload } from "@/types/results";
import { ProfileSummaryCard } from "@/components/results/ProfileSummaryCard";
import { RoutineResultsSection } from "@/components/results/RoutineResultsSection";
import { EmailCaptureModal } from "@/components/email/EmailCaptureModal";
import { getRequestedPreset, isMediaMode } from "@/lib/dev/media-mode";
import { getPresetProfile } from "@/lib/dev/presets";
import { generateMockRegimen } from "@/lib/mock-routine";

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ResultPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Check for preset mode
  const presetName = getRequestedPreset(searchParams);
  const mediaMode = isMediaMode(searchParams);

  useEffect(() => {
    // PRESET MODE: Load deterministic preset profile
    if (presetName) {
      const presetProfile = getPresetProfile(presetName);
      const mockRoutine = generateMockRegimen(presetProfile);

      setResult({
        profile: presetProfile,
        routine: mockRoutine,
        timestamp: Date.now(),
      });
      setIsLoading(false);
      return;
    }

    // STANDARD MODE: Read result payload from sessionStorage
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("check_in_result");

      if (stored) {
        try {
          const parsed = JSON.parse(stored) as ResultPayload;
          setResult(parsed);
        } catch (error) {
          console.error("Failed to parse results:", error);
        }
      }

      setIsLoading(false);
    }
  }, [presetName]);

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <div className="text-sm text-muted">Loading results...</div>
        </div>
      </main>
    );
  }

  // Empty state - no result found
  if (!result) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <div>
            <h1 className="font-headline text-2xl font-bold text-on-surface mb-2">
              No Results Found
            </h1>
            <p className="text-sm text-muted">
              Complete a skin check-in to see your personalized routine recommendations.
            </p>
          </div>
          <Link
            href="/analysis"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Check-In
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </main>
    );
  }

  // Results display
  return (
    <main className="pt-24 pb-32 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">
          Analysis Complete
        </span>
        <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface mb-3">
          Your Clinical Protocol
        </h1>
        <p className="text-base text-on-surface-variant max-w-2xl">
          Recommended routine optimized for your skin state. All product selections
          target your primary concerns while maintaining barrier integrity.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary - Left Column */}
        <div className="lg:col-span-1">
          <ProfileSummaryCard profile={result.profile} />
        </div>

        {/* Routine Display - Right Column */}
        <div className="lg:col-span-2">
          <RoutineResultsSection routine={result.routine} />
        </div>
      </div>

      {/* Footer Actions - Hidden in media mode */}
      {!mediaMode && (
        <footer className="mt-16 pt-8 border-t border-outline-variant flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/analysis"
            className="text-sm text-muted hover:text-on-surface transition-colors"
          >
            ← Retake Check-In
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEmailModal(true)}
              className="px-6 py-2.5 text-sm font-medium text-on-surface bg-surface-container-low hover:bg-surface-container-highest rounded-lg transition-colors"
            >
              Save via Email
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 text-sm font-medium text-on-surface bg-surface-container-low hover:bg-surface-container-highest rounded-lg transition-colors"
            >
              View Dashboard
            </Link>
            <Link
              href="/protocol"
              className="px-6 py-2.5 text-sm font-semibold bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity"
            >
              View Weekly Protocol
            </Link>
          </div>
        </footer>
      )}

      {/* Email Capture Modal */}
      {showEmailModal && (
        <EmailCaptureModal
          profile={result.profile}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <div className="text-sm text-muted">Loading results...</div>
        </div>
      </main>
    }>
      <ResultsContent />
    </Suspense>
  );
}

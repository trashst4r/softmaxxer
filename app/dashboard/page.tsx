"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getActiveRegimen, getActiveProfile } from "@/lib/app-state";
import type { AnalysisResult } from "@/types/analysis";
import type { SkinProfile } from "@/types/skin-profile";
import { RoutineToggle } from "@/components/dashboard/routine-toggle";
import { RoutineChecklist } from "@/components/dashboard/routine-checklist";
import { ConsistencyChart } from "@/components/dashboard/consistency-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RawTextureImage } from "@/components/analysis/TextureSurface";
import { getProtocolTitle, getStateBadge, getSummaryBullets, getPrimaryConcern } from "@/lib/texture-map";
import { getRequestedPreset, isMediaMode } from "@/lib/dev/media-mode";
import { getPresetProfile } from "@/lib/dev/presets";
import { generateMockRoutine } from "@/lib/mock-routine";
import { decodeProfile } from "@/lib/encoding/profile-encoder";
import { ShareLinkButton } from "@/components/export/ShareLinkButton";
import { ExportButton } from "@/components/export/ExportButton";
import Link from "next/link";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [profile, setProfile] = useState<SkinProfile | null>(null);
  const [activeRoutine, setActiveRoutine] = useState<"am" | "pm">("am");
  const [chartKey, setChartKey] = useState(0); // Force chart refresh

  // Check for preset mode
  const presetName = getRequestedPreset(searchParams);
  const mediaMode = isMediaMode(searchParams);

  useEffect(() => {
    // PRESET MODE: Load deterministic preset profile
    if (presetName) {
      const presetProfile = getPresetProfile(presetName);
      setProfile(presetProfile);
      // Generate mock routine for preset
      const mockResult = generateMockRoutine(presetProfile);
      setResult(mockResult);
      return;
    }

    // SHARED LINK MODE: Decode profile from URL
    const profileParam = searchParams.get("profile");
    if (profileParam) {
      const decodedProfile = decodeProfile(profileParam);
      if (decodedProfile) {
        setProfile(decodedProfile);
        const mockResult = generateMockRoutine(decodedProfile);
        setResult(mockResult);
        return;
      } else {
        console.error("Failed to decode profile from URL");
      }
    }

    // STANDARD MODE: Load from app state
    const analysis = getActiveRegimen();
    const skinProfile = getActiveProfile();

    if (!analysis) {
      router.push("/analysis");
    } else {
      setResult(analysis);
      setProfile(skinProfile);
    }
  }, [router, presetName, searchParams]);

  const handleCheckChange = () => {
    // Force chart to re-render with new data
    setChartKey((prev) => prev + 1);
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <div className="text-sm text-muted">Loading...</div>
        </div>
      </div>
    );
  }

  const currentSteps = activeRoutine === "am" ? result.am_routine : result.pm_routine;

  return (
    <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-2 block">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric"
              })}
            </span>
            <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface">
              Today's Routine
            </h1>
          </div>
          <RoutineToggle active={activeRoutine} onChange={setActiveRoutine} />
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Checklist Section */}
        <section className="lg:col-span-7">
          <RoutineChecklist
            steps={currentSteps}
            routine={activeRoutine}
            onCheckChange={handleCheckChange}
          />
        </section>

        {/* Stats Sidebar */}
        <aside className="lg:col-span-5 space-y-8">
          {/* Consistency Chart */}
          <ConsistencyChart
            refreshKey={chartKey}
            amTotal={result.am_routine.length}
            pmTotal={result.pm_routine.length}
          />

          {/* Quick Actions */}
          <QuickActions />

          {/* Protocol Summary Card */}
          {profile && (
            <section className="bg-surface-container-low rounded-2xl p-8 space-y-6">
              {/* Header with Badge */}
              <div className="flex justify-between items-start">
                <h3 className="font-headline font-extrabold text-xl tracking-tight text-on-surface">
                  Your Protocol
                </h3>
                <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold tracking-widest uppercase rounded-full">
                  {getStateBadge(profile)}
                </span>
              </div>

              {/* Thumbnail + Status */}
              <div className="flex items-start space-x-6">
                {/* Small Raw Texture Thumbnail - LEFT */}
                <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-surface-container-high">
                  <RawTextureImage profile={profile} />
                </div>

                {/* Status Info */}
                <div className="flex-1 space-y-1">
                  <p className="text-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Status
                  </p>
                  <h4 className="font-headline font-bold text-lg text-on-surface">
                    {getProtocolTitle(profile)}
                  </h4>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs font-medium text-on-surface-variant">Primary Concern:</span>
                    <span className="text-xs font-bold text-primary">
                      {getPrimaryConcern(profile)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clinical Summary Bullets */}
              <div className="space-y-4 pt-4">
                {getSummaryBullets(profile).map((bullet, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">
                      check_circle
                    </span>
                    <p className="text-sm leading-relaxed text-on-surface-variant font-medium">
                      {bullet}
                    </p>
                  </div>
                ))}
              </div>

              {/* Analysis Timeline */}
              <div className="pt-6 border-t border-outline-variant/10">
                <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                  <span>Analysis Date</span>
                  <span>Next Review</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-on-surface mt-1">
                  <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  <span>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>
            </section>
          )}
        </aside>
      </div>

      {/* Footer - Hidden in media mode */}
      {!mediaMode && profile && result && (
        <footer className="mt-16 pt-8 border-t border-outline-variant space-y-6">
          {/* Export and Share Actions */}
          <div className="flex items-center justify-center gap-3">
            <ExportButton profile={profile} routine={result} />
            <ShareLinkButton profile={profile} />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center justify-center gap-3 text-sm text-muted">
            <Link href="/results" className="hover:text-on-surface transition-colors">
              View Analysis
            </Link>
            <span>·</span>
            <Link href="/protocol" className="hover:text-on-surface transition-colors">
              Build Protocol
            </Link>
            <span>·</span>
            <Link href="/analysis" className="hover:text-on-surface transition-colors">
              New Check-In
            </Link>
          </div>
        </footer>
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-3">
          <div className="text-sm text-muted">Loading...</div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

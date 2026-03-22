"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  recordConsoleVisit,
  getLatestAnalysis,
  getAdherenceForDate,
  saveDailyAdherence,
  type DailyAdherenceEntry,
} from "@/lib/console-state";
import type { AnalysisResult } from "@/types/analysis";
import { generateConsoleIntelligence } from "@/lib/console-intelligence";
import { analyzeProof } from "@/lib/progress/proof-analyzer";

interface CuratedProduct {
  name: string;
  stepNumber: number;
  period: "Morning" | "Evening";
  priority: number;
}

function calculatePriority(stepName: string): number {
  const name = stepName.toLowerCase();
  if (name.includes("spf") || name.includes("sunscreen")) return 100;
  if (name.includes("retinol") || name.includes("tretinoin")) return 90;
  if (name.includes("niacinamide")) return 85;
  if (name.includes("vitamin c") || name.includes("ascorbic")) return 80;
  if (name.includes("hyaluronic") || name.includes("serum")) return 70;
  if (name.includes("cleanser")) return 60;
  if (name.includes("moistur")) return 50;
  return 40;
}

export function DashboardEditorialGrid() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [openSection, setOpenSection] = useState<"am" | "pm" | null>(null);
  const today = new Date().toISOString().split("T")[0];
  const [adherence, setAdherence] = useState<DailyAdherenceEntry | null>(null);

  useEffect(() => {
    const analysis = getLatestAnalysis();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResult(analysis);
    recordConsoleVisit();

    if (analysis) {
      const existing = getAdherenceForDate(today);
      if (existing) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAdherence(existing);
      } else {
        // Initialize empty adherence for today
        const initial: DailyAdherenceEntry = {
          date: today,
          am: analysis.am_routine.map((step) => ({
            step_key: step.id,
            step_label: step.step,
            status: "missed" as const,
          })),
          pm: analysis.pm_routine.map((step) => ({
            step_key: step.id,
            step_label: step.step,
            status: "missed" as const,
          })),
        };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAdherence(initial);
      }
    }
  }, [today]);

  const toggleStepStatus = (routine: "am" | "pm", stepKey: string) => {
    if (!adherence) return;

    const updated: DailyAdherenceEntry = {
      ...adherence,
      [routine]: adherence[routine].map((step) =>
        step.step_key === stepKey
          ? { ...step, status: step.status === "completed" ? "missed" : "completed" }
          : step
      ),
    };

    setAdherence(updated);
    saveDailyAdherence(updated);
  };

  const isStepCompleted = (routine: "am" | "pm", stepKey: string): boolean => {
    if (!adherence) return false;
    const step = adherence[routine].find((s) => s.step_key === stepKey);
    return step?.status === "completed";
  };

  const toggleSection = (section: "am" | "pm") => {
    setOpenSection(openSection === section ? null : section);
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="font-headline text-2xl font-normal text-on-surface">
            Complete your first check-in
          </h1>
          <p className="font-body text-sm text-muted leading-relaxed">
            Answer a few questions to get your personalized routine.
          </p>
          <Link href="/analysis" className="clinical-button inline-block">
            Start Check-In
          </Link>
        </div>
      </div>
    );
  }

  const intelligence = generateConsoleIntelligence(result);
  const proof = analyzeProof(result.scores);

  // Curate exactly 3 products by priority
  const allProducts: CuratedProduct[] = [
    ...result.am_routine.flatMap((step, i) =>
      step.products?.[0]
        ? [
            {
              name: step.step,
              stepNumber: i + 1,
              period: "Morning" as const,
              priority: calculatePriority(step.step),
            },
          ]
        : []
    ),
    ...result.pm_routine.flatMap((step, i) =>
      step.products?.[0]
        ? [
            {
              name: step.step,
              stepNumber: i + 1,
              period: "Evening" as const,
              priority: calculatePriority(step.step),
            },
          ]
        : []
    ),
  ];

  const curatedProducts = allProducts
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);

  // One sentence state summary
  const stateSummary =
    result.barrier_risk === "Elevated"
      ? "Focus on barrier repair and gentle care."
      : result.barrier_risk === "Moderate"
        ? "Your barrier needs support. Stay consistent."
        : "No major changes yet. Keep going.";

  // Two focus tags max
  const focusTags = result.ranked_concerns.slice(0, 2);

  return (
    <div className="bg-surface min-h-screen">
      {/* Top Navigation */}
      <header className="bg-surface-container-low py-6 px-12">
        <nav className="flex justify-between items-center max-w-[1440px] mx-auto">
          <div className="flex items-center gap-12">
            <span className="text-2xl font-light tracking-[0.2em] uppercase text-on-surface">
              SOFTMAXXER
            </span>
            <div className="hidden md:flex gap-8">
              <Link
                href="/dashboard"
                className="font-headline tracking-tight text-on-surface transition-opacity duration-300 hover:opacity-70"
              >
                Dashboard
              </Link>
              <Link
                href="/analysis"
                className="font-headline tracking-tight text-on-surface-variant hover:text-on-surface transition-opacity duration-300"
              >
                Check-In
              </Link>
              <Link
                href="/protocol"
                className="font-headline tracking-tight text-on-surface-variant hover:text-on-surface transition-opacity duration-300"
              >
                Protocol
              </Link>
            </div>
          </div>
          <Link
            href="/analysis"
            className="bg-primary text-on-primary px-6 py-2 rounded-md font-label text-sm uppercase tracking-wider font-medium hover:opacity-90 transition-all active:scale-95 shadow-sm"
          >
            Check-In
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-32 px-12 pb-12 max-w-[1440px] mx-auto">
        {/* Page Header */}
        <div className="mb-16">
          <p className="font-label text-[0.6875rem] uppercase tracking-[0.05em] text-on-surface-variant opacity-70 mb-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
          <h1 className="font-headline text-[3.5rem] font-light tracking-tight leading-none text-on-surface mb-2">
            {intelligence.nextAction || "Do this today"}
          </h1>
          <p className="font-body text-lg text-on-surface-variant font-light">
            {intelligence.context || "Complete your morning and evening routine."}
          </p>
        </div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-16">
          {/* Left Rail — Metadata */}
          <div className="space-y-12">
            {/* State Summary */}
            <section>
              <h3 className="font-label text-[0.6875rem] uppercase tracking-[0.05em] font-medium text-on-surface-variant opacity-70 mb-4">
                How your skin is doing
              </h3>
              <div className="bg-surface-container-low p-6 rounded-xl">
                <p className="font-body text-sm leading-relaxed text-on-surface">
                  {stateSummary}
                </p>
              </div>
            </section>

            {/* Focus Tags */}
            {focusTags.length > 0 && (
              <section>
                <h3 className="font-label text-[0.6875rem] uppercase tracking-[0.05em] font-medium text-on-surface-variant opacity-70 mb-4">
                  Focus
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {focusTags.map((concern) => (
                    <span
                      key={`focus-${concern.concern}`}
                      className="bg-surface-container-high px-4 py-1.5 rounded-full text-[0.6875rem] font-medium text-on-surface tracking-wide uppercase"
                    >
                      {concern.concern}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Optional Progress */}
            {proof.hasProof && proof.changes.some((c) => c.direction !== "unchanged") && (
              <section>
                <h3 className="font-label text-[0.6875rem] uppercase tracking-[0.05em] font-medium text-on-surface-variant opacity-70 mb-4">
                  Progress
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {proof.changes.map((change) => (
                    <div key={change.dimension} className="space-y-1">
                      <div className="font-body text-xs text-on-surface-variant capitalize">
                        {change.dimension}
                      </div>
                      <div
                        className={`text-2xl ${
                          change.direction === "improved"
                            ? "text-green-600"
                            : change.direction === "worsened"
                              ? "text-red-600"
                              : "text-on-surface-variant"
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
              </section>
            )}
          </div>

          {/* Center — Routine Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Morning */}
            <div className="space-y-8">
              <button
                onClick={() => toggleSection("am")}
                className="flex items-center gap-3 w-full text-left group"
              >
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="5" strokeWidth="2" />
                  <line x1="12" y1="1" x2="12" y2="3" strokeWidth="2" />
                  <line x1="12" y1="21" x2="12" y2="23" strokeWidth="2" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth="2" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth="2" />
                  <line x1="1" y1="12" x2="3" y2="12" strokeWidth="2" />
                  <line x1="21" y1="12" x2="23" y2="12" strokeWidth="2" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeWidth="2" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeWidth="2" />
                </svg>
                <h2 className="font-headline text-xl font-medium tracking-tight text-on-surface flex-1">
                  Morning
                </h2>
                <span className="text-on-surface-variant text-xs group-hover:text-on-surface transition-colors">
                  {openSection === "am" ? "↑" : "↓"}
                </span>
              </button>
              <div className="space-y-6">
                {(openSection === "am" ? result.am_routine : result.am_routine.slice(0, 2)).map((step, i) => (
                  <div
                    key={step.id}
                    onClick={() => toggleStepStatus("am", step.id)}
                    className="flex items-start gap-4 py-2 px-3 rounded-md hover:bg-surface-container-lowest transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isStepCompleted("am", step.id)}
                      onChange={() => {}}
                      className="mt-0.5 pointer-events-none"
                      aria-label={`Mark ${step.step} as complete`}
                    />
                    <div className="flex-1">
                      <p className="font-label text-[0.65rem] uppercase tracking-widest text-on-surface-variant opacity-60 mb-0.5">
                        Step {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="font-body text-sm font-medium text-on-surface">
                        {step.step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evening */}
            <div className="space-y-8">
              <button
                onClick={() => toggleSection("pm")}
                className="flex items-center gap-3 w-full text-left group"
              >
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2 className="font-headline text-xl font-medium tracking-tight text-on-surface flex-1">
                  Evening
                </h2>
                <span className="text-on-surface-variant text-xs group-hover:text-on-surface transition-colors">
                  {openSection === "pm" ? "↑" : "↓"}
                </span>
              </button>
              <div className="space-y-6">
                {(openSection === "pm" ? result.pm_routine : result.pm_routine.slice(0, 2)).map((step, i) => (
                  <div
                    key={step.id}
                    onClick={() => toggleStepStatus("pm", step.id)}
                    className="flex items-start gap-4 py-2 px-3 rounded-md hover:bg-surface-container-lowest transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isStepCompleted("pm", step.id)}
                      onChange={() => {}}
                      className="mt-0.5 pointer-events-none"
                      aria-label={`Mark ${step.step} as complete`}
                    />
                    <div className="flex-1">
                      <p className="font-label text-[0.65rem] uppercase tracking-widest text-on-surface-variant opacity-60 mb-0.5">
                        Step {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="font-body text-sm font-medium text-on-surface">
                        {step.step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Rail — Product Previews */}
          <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex justify-between items-baseline">
              <h3 className="font-label text-[0.6875rem] uppercase tracking-[0.05em] font-medium text-on-surface-variant opacity-70">
                Your products
              </h3>
              <Link
                href="/protocol"
                className="font-label text-[0.6rem] uppercase tracking-widest underline underline-offset-4 decoration-outline-variant hover:text-primary transition-colors"
              >
                Full Protocol
              </Link>
            </div>

            {/* Product Cards (Exactly 3) */}
            <div className="space-y-4">
              {curatedProducts.map((product) => (
                <Link
                  key={`product-${product.name}-${product.period}`}
                  href="/protocol"
                  className="group flex items-center gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors"
                >
                  <div className="w-16 h-16 bg-surface-container-high rounded-md flex items-center justify-center flex-shrink-0">
                    <div className="w-12 h-12 bg-surface-highest rounded flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-on-surface-variant opacity-40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-body text-xs font-semibold leading-tight text-on-surface">
                      {product.name}
                    </p>
                    <p className="font-body text-[0.65rem] text-on-surface-variant">
                      Step {String(product.stepNumber).padStart(2, "0")} — {product.period}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* View Full Protocol Link */}
            <Link
              href="/protocol"
              className="font-body text-sm text-primary hover:underline text-center transition-colors"
            >
              View full protocol →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

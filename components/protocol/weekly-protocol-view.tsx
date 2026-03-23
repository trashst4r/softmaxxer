"use client";

import { useState } from "react";
import type { WeeklyProtocol } from "@/lib/protocol/protocol-types";
import type { AnalysisResult } from "@/types/analysis";
import { motion, AnimatePresence } from "framer-motion";
import { getIngredientAction, getSearchUrl, getActionCTA } from "@/lib/ingredients/ingredient-actions";

interface WeeklyProtocolViewProps {
  protocol: WeeklyProtocol;
  result: AnalysisResult;
}

export function WeeklyProtocolView({ protocol, result }: WeeklyProtocolViewProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  // Sprint 24.6: Extract dominant action for each day
  const getDominantAction = (day: WeeklyProtocol["days"][0]) => {
    if (day.dayType === "recovery") {
      return "Recovery night";
    }
    if (day.dayType === "barrier-repair") {
      return "Barrier support";
    }
    // For active/maintenance: find the key active in PM
    const heroStep = day.pm.find(step =>
      step.ingredientFamily.includes("retinoid") ||
      step.ingredientFamily.includes("vitamin-c") ||
      step.ingredientFamily.includes("azelaic-acid") ||
      step.ingredientFamily.includes("aha") ||
      step.ingredientFamily.includes("bha")
    );
    if (heroStep) {
      return `Apply ${heroStep.ingredientFamily.replace(/-/g, " ")}`;
    }
    return day.purpose;
  };

  const getDayTypeColor = (dayType: string) => {
    switch (dayType) {
      case "active":
        return "border-primary/40 bg-primary/5";
      case "recovery":
        return "border-green-500/40 bg-green-500/5";
      case "maintenance":
        return "border-blue-500/40 bg-blue-500/5";
      case "barrier-repair":
        return "border-yellow-500/40 bg-yellow-500/5";
      default:
        return "border-outline-variant bg-surface-container-low";
    }
  };

  const getDayTypeBadgeColor = (dayType: string) => {
    switch (dayType) {
      case "active":
        return "bg-primary/20 text-primary";
      case "recovery":
        return "bg-green-500/20 text-green-700 dark:text-green-400";
      case "maintenance":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
      case "barrier-repair":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-surface-container text-on-surface-variant";
    }
  };

  // Sprint 23: Risk level styling
  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-500/20 text-green-700 dark:text-green-400";
      case "moderate":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
      case "elevated":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
      case "high":
        return "bg-error/20 text-error";
      default:
        return "bg-surface-container text-on-surface-variant";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high":
        return "⚠";
      case "elevated":
        return "⚡";
      case "moderate":
        return "○";
      case "low":
      default:
        return "✓";
    }
  };

  return (
    <div className="space-y-8">
      {/* Protocol Header */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-light tracking-tight text-on-surface mb-3">
            Your Weekly Protocol
          </h1>
          <p className="text-base text-on-surface-variant max-w-2xl">
            Targeting: <span className="text-on-surface font-medium capitalize">{protocol.primaryConcern}</span>
            {protocol.secondaryConcern && (
              <> and <span className="text-on-surface font-medium capitalize">{protocol.secondaryConcern}</span></>
            )}
          </p>
        </div>

        {/* Protocol Summary */}
        <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-light text-on-surface">Protocol Overview</h2>
            <div className="text-xs uppercase tracking-wider text-on-surface-variant">
              {protocol.toleranceTier} Level
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="clinical-label">Hero Active</p>
              <p className="text-sm text-on-surface font-medium capitalize">
                {protocol.heroActive.replace(/-/g, " ")}
              </p>
              <p className="text-xs text-on-surface-variant">
                {protocol.summary.heroActiveFrequency}x per week
              </p>
            </div>

            <div className="space-y-3">
              <p className="clinical-label">Weekly Structure</p>
              <p className="text-sm text-on-surface">
                {protocol.summary.totalActiveDays} active days · {protocol.summary.totalRecoveryDays} recovery days
              </p>
            </div>
          </div>

          {/* Key Principles */}
          <div className="pt-4 border-t border-outline-variant space-y-2">
            <p className="clinical-label">How This Works</p>
            <ul className="space-y-1.5">
              {protocol.summary.keyPrinciples.map((principle, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Safety Notes */}
        {protocol.safetyNotes.length > 0 && (
          <div className="bg-error/5 border border-error/20 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-error text-lg">⚠</span>
              <h3 className="text-sm font-medium text-error uppercase tracking-wider">
                Critical Safety Information
              </h3>
            </div>
            <ul className="space-y-2">
              {protocol.safetyNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-on-surface leading-relaxed">
                  <span className="text-error mt-0.5">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sprint 24: Profile → Protocol Mapping */}
        <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-light text-on-surface">Why This Protocol</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            This protocol is generated directly from your skin profile analysis. Here's how your inputs shaped these recommendations:
          </p>

          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-on-surface-variant">Primary Concern</p>
                <p className="text-sm text-on-surface font-medium capitalize">
                  {protocol.primaryConcern}
                </p>
                <p className="text-xs text-on-surface-variant">
                  → Selected {protocol.heroActive.replace(/-/g, " ")} as primary treatment
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-on-surface-variant">Tolerance Level</p>
                <p className="text-sm text-on-surface font-medium capitalize">
                  {protocol.toleranceTier}
                </p>
                <p className="text-xs text-on-surface-variant">
                  → {protocol.summary.heroActiveFrequency}x per week frequency with {protocol.summary.keyPrinciples[1]?.toLowerCase() || "recovery spacing"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-on-surface-variant">Barrier State</p>
                <p className="text-sm text-on-surface font-medium capitalize">
                  {protocol.barrierState}
                </p>
                <p className="text-xs text-on-surface-variant">
                  → {protocol.barrierState === "compromised"
                      ? "Gentle actives only until barrier recovers"
                      : protocol.barrierState === "sensitive"
                      ? "Reduced frequency to prevent irritation"
                      : "Standard active frequency approved"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-on-surface-variant">Confidence</p>
                <p className="text-sm text-on-surface font-medium">
                  {result.confidence_label}
                </p>
                <p className="text-xs text-on-surface-variant">
                  → Protocol specificity: {result.confidence_score >= 85 ? "Very precise" : result.confidence_score >= 75 ? "Precise" : "General guidance"}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant">
            <p className="text-xs text-on-surface-variant italic">
              This protocol is generated algorithmically from your skin profile. It is not customizable to ensure safety and efficacy. To change your protocol, retake the check-in with updated answers.
            </p>
          </div>
        </div>
      </div>

      {/* Day-by-Day Protocol */}
      <div className="space-y-4">
        <h2 className="text-2xl font-light text-on-surface">Your 7-Day Schedule</h2>

        <div className="space-y-2.5">
          {protocol.days.map((day) => {
            const isExpanded = expandedDay === day.dayNumber;
            const dayColor = getDayTypeColor(day.dayType);
            const badgeColor = getDayTypeBadgeColor(day.dayType);
            const dominantAction = getDominantAction(day);

            return (
              <div key={day.dayNumber} className={`border rounded-lg ${dayColor}`}>
                {/* Sprint 24.6: Compressed day header - Action > Purpose > Detail */}
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="text-2xl font-light text-on-surface/60 w-6">
                      {day.dayNumber}
                    </div>
                    <div className="space-y-0.5">
                      {/* Dominant action line */}
                      <h3 className="text-base font-medium text-on-surface leading-tight">
                        {dominantAction}
                      </h3>
                      {/* Secondary info: purpose + badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs text-on-surface-variant">
                          {day.purpose}
                        </p>
                        <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${badgeColor}`}>
                          {day.dayType}
                        </span>
                        {day.riskLevel !== "low" && (
                          <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1 ${getRiskBadgeColor(day.riskLevel)}`}>
                            <span>{getRiskIcon(day.riskLevel)}</span>
                            {day.riskLevel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-on-surface-variant text-xl"
                  >
                    ↓
                  </motion.span>
                </button>

                {/* Sprint 24.6: Compressed day details - Action > Purpose > Detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 space-y-4 border-t border-outline-variant/50">
                        {/* Caution - only if critical */}
                        {day.caution && (
                          <div className="bg-error/5 border border-error/20 rounded p-3 flex items-start gap-2">
                            <span className="text-error text-sm">⚠</span>
                            <p className="text-xs text-on-surface leading-snug">
                              {day.caution}
                            </p>
                          </div>
                        )}

                        {/* Morning Routine - compressed */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="4" strokeWidth="2" />
                              <line x1="12" y1="1" x2="12" y2="3" strokeWidth="2" />
                              <line x1="12" y1="21" x2="12" y2="23" strokeWidth="2" />
                            </svg>
                            <p className="text-xs uppercase tracking-wider text-on-surface-variant">AM</p>
                          </div>
                          <ol className="space-y-1.5">
                            {day.am.map((step) => {
                              const action = getIngredientAction(step.ingredientFamily);
                              return (
                                <li key={step.order} className="flex items-start gap-2 text-xs">
                                  <span className="font-mono text-[10px] text-on-surface-variant/60 mt-0.5 w-3">
                                    {step.order}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-on-surface font-medium capitalize leading-tight">
                                      {step.ingredientFamily.replace(/-/g, " ")}
                                    </p>
                                    <p className="text-[11px] text-on-surface-variant leading-snug mt-0.5">
                                      {step.purpose}
                                    </p>
                                    {action && (
                                      <a
                                        href={getSearchUrl(action.searchQuery)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-1"
                                      >
                                        {getActionCTA(step.ingredientFamily)}
                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                      </a>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                          </ol>
                        </div>

                        {/* Evening Routine - compressed */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeWidth="2" />
                            </svg>
                            <p className="text-xs uppercase tracking-wider text-on-surface-variant">PM</p>
                          </div>
                          <ol className="space-y-1.5">
                            {day.pm.map((step) => {
                              const action = getIngredientAction(step.ingredientFamily);
                              return (
                                <li key={step.order} className="flex items-start gap-2 text-xs">
                                  <span className="font-mono text-[10px] text-on-surface-variant/60 mt-0.5 w-3">
                                    {step.order}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-on-surface font-medium capitalize leading-tight">
                                      {step.ingredientFamily.replace(/-/g, " ")}
                                    </p>
                                    <p className="text-[11px] text-on-surface-variant leading-snug mt-0.5">
                                      {step.purpose}
                                    </p>
                                    {step.cautionNote && (
                                      <p className="text-[10px] text-error mt-0.5 leading-tight">
                                        ⚠ {step.cautionNote}
                                      </p>
                                    )}
                                    {action && (
                                      <a
                                        href={getSearchUrl(action.searchQuery)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-1"
                                      >
                                        {getActionCTA(step.ingredientFamily)}
                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                      </a>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                          </ol>
                        </div>

                        {/* Reasoning - collapsed/demoted to end */}
                        <details className="group">
                          <summary className="text-[10px] uppercase tracking-wider text-on-surface-variant/60 cursor-pointer hover:text-on-surface-variant flex items-center gap-1">
                            <span className="group-open:rotate-90 transition-transform">▸</span>
                            Why this structure
                          </summary>
                          <div className="mt-2 space-y-2 pl-3 border-l-2 border-outline-variant/30">
                            <p className="text-[11px] text-on-surface-variant leading-snug">
                              {day.whyThisDay}
                            </p>
                            {day.riskReason && day.riskLevel !== "low" && (
                              <p className="text-[11px] text-on-surface-variant leading-snug">
                                <span className={day.riskLevel === "high" ? "text-error" : "text-on-surface"}>
                                  {getRiskIcon(day.riskLevel)} {day.riskLevel.toUpperCase()}:
                                </span> {day.riskReason}
                              </p>
                            )}
                            <p className="text-[11px] text-on-surface-variant leading-snug italic">
                              {day.expectedOutcome}
                            </p>
                          </div>
                        </details>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-surface-container-low rounded-xl p-6 space-y-3">
        <h3 className="text-lg font-light text-on-surface">Expected Timeline</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {protocol.expectedTimeline}
        </p>
      </div>
    </div>
  );
}

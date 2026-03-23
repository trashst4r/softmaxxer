"use client";

import { useState } from "react";
import type { WeeklyProtocol } from "@/lib/protocol/protocol-types";
import { motion, AnimatePresence } from "framer-motion";
import { getIngredientAction, getSearchUrl, getActionCTA } from "@/lib/ingredients/ingredient-actions";

interface WeeklyProtocolViewProps {
  protocol: WeeklyProtocol;
}

export function WeeklyProtocolView({ protocol }: WeeklyProtocolViewProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

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
      </div>

      {/* Day-by-Day Protocol */}
      <div className="space-y-4">
        <h2 className="text-2xl font-light text-on-surface">Your 7-Day Schedule</h2>

        <div className="space-y-3">
          {protocol.days.map((day) => {
            const isExpanded = expandedDay === day.dayNumber;
            const dayColor = getDayTypeColor(day.dayType);
            const badgeColor = getDayTypeBadgeColor(day.dayType);

            return (
              <div key={day.dayNumber} className={`border rounded-xl ${dayColor}`}>
                {/* Day Header */}
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                  className="w-full p-6 text-left flex items-center justify-between hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-light text-on-surface">
                      {day.dayNumber}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-medium text-on-surface">
                          {day.purpose}
                        </h3>
                        <span className={`text-xs uppercase tracking-wider px-2 py-1 rounded-full ${badgeColor}`}>
                          {day.dayType}
                        </span>
                        {/* Sprint 23: Risk indicator */}
                        {day.riskLevel !== "low" && (
                          <span className={`text-xs uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1 ${getRiskBadgeColor(day.riskLevel)}`}>
                            <span>{getRiskIcon(day.riskLevel)}</span>
                            {day.riskLevel} risk
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-on-surface-variant">
                        {day.label}
                      </p>
                    </div>
                  </div>
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-on-surface-variant text-2xl"
                  >
                    ↓
                  </motion.span>
                </button>

                {/* Day Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-6">
                        {/* Why This Day */}
                        <div className="space-y-2">
                          <p className="clinical-label">Why This Day</p>
                          <p className="text-sm text-on-surface leading-relaxed">
                            {day.whyThisDay}
                          </p>
                        </div>

                        {/* Sprint 23: Risk reason */}
                        {day.riskReason && day.riskLevel !== "low" && (
                          <div className={`border rounded-lg p-4 space-y-2 ${
                            day.riskLevel === "high"
                              ? "bg-error/10 border-error/20"
                              : day.riskLevel === "elevated"
                              ? "bg-yellow-500/10 border-yellow-500/20"
                              : "bg-blue-500/10 border-blue-500/20"
                          }`}>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getRiskIcon(day.riskLevel)}</span>
                              <p className={`clinical-label ${
                                day.riskLevel === "high" ? "text-error" : "text-on-surface"
                              }`}>
                                Risk Assessment
                              </p>
                            </div>
                            <p className="text-sm text-on-surface leading-relaxed">
                              {day.riskReason}
                            </p>
                          </div>
                        )}

                        {/* Caution */}
                        {day.caution && (
                          <div className="bg-error/10 border border-error/20 rounded-lg p-4 space-y-2">
                            <p className="clinical-label text-error">⚠ Caution</p>
                            <p className="text-sm text-on-surface leading-relaxed">
                              {day.caution}
                            </p>
                          </div>
                        )}

                        {/* Morning Routine */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="4" strokeWidth="2" />
                              <line x1="12" y1="1" x2="12" y2="3" strokeWidth="2" />
                              <line x1="12" y1="21" x2="12" y2="23" strokeWidth="2" />
                            </svg>
                            <p className="clinical-label">Morning</p>
                          </div>
                          <ol className="space-y-3">
                            {day.am.map((step) => {
                              const action = getIngredientAction(step.ingredientFamily);

                              return (
                                <li key={step.order} className="flex items-start gap-3 text-sm">
                                  <span className="font-mono text-xs text-on-surface-variant mt-0.5">
                                    {step.order}
                                  </span>
                                  <div className="flex-1 space-y-2">
                                    <div>
                                      <p className="text-on-surface font-medium capitalize">
                                        {step.ingredientFamily.replace(/-/g, " ")}
                                      </p>
                                      <p className="text-xs text-on-surface-variant mt-0.5">
                                        {step.purpose}
                                      </p>
                                    </div>

                                    {/* Sprint 22: Ingredient action bridge */}
                                    {action && (
                                      <div className="space-y-1.5">
                                        {action.guidance && (
                                          <p className="text-xs text-on-surface-variant leading-relaxed">
                                            {action.guidance}
                                          </p>
                                        )}
                                        <a
                                          href={getSearchUrl(action.searchQuery)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                                        >
                                          {getActionCTA(step.ingredientFamily)}
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                          </svg>
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                          </ol>
                        </div>

                        {/* Evening Routine */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeWidth="2" />
                            </svg>
                            <p className="clinical-label">Evening</p>
                          </div>
                          <ol className="space-y-3">
                            {day.pm.map((step) => {
                              const action = getIngredientAction(step.ingredientFamily);

                              return (
                                <li key={step.order} className="flex items-start gap-3 text-sm">
                                  <span className="font-mono text-xs text-on-surface-variant mt-0.5">
                                    {step.order}
                                  </span>
                                  <div className="flex-1 space-y-2">
                                    <div>
                                      <p className="text-on-surface font-medium capitalize">
                                        {step.ingredientFamily.replace(/-/g, " ")}
                                      </p>
                                      <p className="text-xs text-on-surface-variant mt-0.5">
                                        {step.purpose}
                                      </p>
                                      {step.cautionNote && (
                                        <p className="text-xs text-error mt-1">
                                          ⚠ {step.cautionNote}
                                        </p>
                                      )}
                                    </div>

                                    {/* Sprint 22: Ingredient action bridge */}
                                    {action && (
                                      <div className="space-y-1.5">
                                        {action.guidance && (
                                          <p className="text-xs text-on-surface-variant leading-relaxed">
                                            {action.guidance}
                                          </p>
                                        )}
                                        <a
                                          href={getSearchUrl(action.searchQuery)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                                        >
                                          {getActionCTA(step.ingredientFamily)}
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                          </svg>
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                          </ol>
                        </div>

                        {/* Expected Outcome */}
                        <div className="pt-4 border-t border-outline-variant space-y-2">
                          <p className="clinical-label">What to Expect</p>
                          <p className="text-sm text-on-surface-variant leading-relaxed">
                            {day.expectedOutcome}
                          </p>
                        </div>
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

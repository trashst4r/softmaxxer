"use client";

import { useState } from "react";
import type { WeeklyProtocol } from "@/lib/protocol/protocol-types";
import { getIngredientAction, getSearchUrl, getActionCTA } from "@/lib/ingredients/ingredient-actions";

interface TodayRoutineCardProps {
  protocol: WeeklyProtocol;
  currentDay: number;
  onDayChange: (day: number) => void;
}

export function TodayRoutineCard({ protocol, currentDay, onDayChange }: TodayRoutineCardProps) {
  const day = protocol.days.find(d => d.dayNumber === currentDay) || protocol.days[0];

  const getDayTypeColor = (dayType: string) => {
    switch (dayType) {
      case "active":
        return "bg-primary/10 text-primary";
      case "recovery":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "maintenance":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "barrier-repair":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-surface-container text-on-surface-variant";
    }
  };

  const getDominantAction = () => {
    if (day.dayType === "recovery") return "Recovery night";
    if (day.dayType === "barrier-repair") return "Barrier support";

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

  return (
    <div className="bg-surface-container-low rounded-2xl p-8 shadow-sm border border-outline-variant/20">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold">
              Today's Protocol
            </span>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-bold ${getDayTypeColor(day.dayType)}`}>
              Day {currentDay}
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface font-headline">
            {getDominantAction()}
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            {day.purpose}
          </p>
        </div>

        {/* Day Selector */}
        <select
          value={currentDay}
          onChange={(e) => onDayChange(Number(e.target.value))}
          className="text-sm px-3 py-2 rounded-lg bg-surface-container border border-outline-variant text-on-surface cursor-pointer hover:bg-surface-container-highest transition-colors"
        >
          {protocol.days.map((d) => (
            <option key={d.dayNumber} value={d.dayNumber}>
              Day {d.dayNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Caution - if present */}
      {day.caution && (
        <div className="bg-error/5 border border-error/20 rounded-lg p-3 flex items-start gap-2 mb-6">
          <span className="text-error text-sm">⚠</span>
          <p className="text-xs text-on-surface leading-snug">
            {day.caution}
          </p>
        </div>
      )}

      {/* AM/PM Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Morning */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" strokeWidth="2" />
              <line x1="12" y1="1" x2="12" y2="3" strokeWidth="2" />
              <line x1="12" y1="21" x2="12" y2="23" strokeWidth="2" />
            </svg>
            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface">Morning</h3>
          </div>
          <ol className="space-y-2.5">
            {day.am.map((step) => {
              const action = getIngredientAction(step.ingredientFamily);
              return (
                <li key={step.order} className="flex items-start gap-2.5 text-sm">
                  <span className="font-mono text-xs text-on-surface-variant/60 mt-0.5 w-4">
                    {step.order}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-on-surface font-medium capitalize leading-tight">
                      {step.ingredientFamily.replace(/-/g, " ")}
                    </p>
                    <p className="text-xs text-on-surface-variant leading-snug mt-0.5">
                      {step.purpose}
                    </p>
                    {action && (
                      <a
                        href={getSearchUrl(action.searchQuery)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-1"
                      >
                        {getActionCTA(step.ingredientFamily)}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Evening */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeWidth="2" />
            </svg>
            <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface">Evening</h3>
          </div>
          <ol className="space-y-2.5">
            {day.pm.map((step) => {
              const action = getIngredientAction(step.ingredientFamily);
              return (
                <li key={step.order} className="flex items-start gap-2.5 text-sm">
                  <span className="font-mono text-xs text-on-surface-variant/60 mt-0.5 w-4">
                    {step.order}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-on-surface font-medium capitalize leading-tight">
                      {step.ingredientFamily.replace(/-/g, " ")}
                    </p>
                    <p className="text-xs text-on-surface-variant leading-snug mt-0.5">
                      {step.purpose}
                    </p>
                    {step.cautionNote && (
                      <p className="text-[11px] text-error mt-0.5 leading-tight">
                        ⚠ {step.cautionNote}
                      </p>
                    )}
                    {action && (
                      <a
                        href={getSearchUrl(action.searchQuery)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-1"
                      >
                        {getActionCTA(step.ingredientFamily)}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>

      {/* Expected Outcome */}
      {day.expectedOutcome && (
        <div className="mt-6 pt-6 border-t border-outline-variant/30">
          <p className="text-xs text-on-surface-variant leading-relaxed italic">
            {day.expectedOutcome}
          </p>
        </div>
      )}
    </div>
  );
}

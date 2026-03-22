"use client";

import { useEffect, useState } from "react";
import type { AnalysisResult } from "@/types/analysis";
import {
  getAdherenceForDate,
  saveDailyAdherence,
  type DailyAdherenceEntry,
} from "@/lib/console-state";
import { getConcernLabel, type ConcernKey } from "@/lib/concern-map";

interface CurrentProtocolCardProps {
  result: AnalysisResult;
}

export function CurrentProtocolCard({ result }: CurrentProtocolCardProps) {
  const today = new Date().toISOString().split("T")[0];
  const [adherence, setAdherence] = useState<DailyAdherenceEntry | null>(null);

  // Load today's adherence on mount
  useEffect(() => {
    const existing = getAdherenceForDate(today);
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAdherence(existing);
    } else {
      // Initialize empty adherence for today
      const initial: DailyAdherenceEntry = {
        date: today,
        am: result.am_routine.map((step) => ({
          step_key: step.id,
          step_label: step.step,
          status: "missed" as const,
        })),
        pm: result.pm_routine.map((step) => ({
          step_key: step.id,
          step_label: step.step,
          status: "missed" as const,
        })),
      };
      setAdherence(initial);
    }
  }, [today, result]);

  const updateStepStatus = (
    routine: "am" | "pm",
    stepKey: string,
    status: "completed" | "skipped" | "missed"
  ) => {
    if (!adherence) return;

    const updated: DailyAdherenceEntry = {
      ...adherence,
      [routine]: adherence[routine].map((step) =>
        step.step_key === stepKey ? { ...step, status } : step
      ),
    };

    setAdherence(updated);
    saveDailyAdherence(updated);
  };

  const getStepStatus = (routine: "am" | "pm", stepKey: string): string => {
    if (!adherence) return "missed";
    const step = adherence[routine].find((s) => s.step_key === stepKey);
    return step?.status || "missed";
  };

  if (!adherence) {
    return (
      <div className="clinical-card space-y-6">
        <h2 className="clinical-label">Current Protocol</h2>
        <div className="text-sm text-muted">Loading adherence data...</div>
      </div>
    );
  }

  return (
    <div className="clinical-card space-y-6">
      <div className="space-y-1">
        <h2 className="clinical-label">Current Protocol</h2>
        <p className="text-xs text-muted">Mark each step as you complete today&rsquo;s routine</p>
      </div>

      <div className="space-y-6">
        {/* AM Routine */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-widest font-semibold text-primary">
            AM Routine
          </div>
          <ol className="space-y-3">
            {result.am_routine.map((step) => {
              const stepKey = step.id;
              const status = getStepStatus("am", stepKey);
              const index = result.am_routine.indexOf(step);
              return (
                <li key={step.id} className="space-y-2">
                  <div className="text-sm flex gap-3 items-start">
                    <span className="text-primary font-mono text-xs flex-shrink-0 mt-0.5">
                      {String(index + 1).padStart(2, "0")}.
                    </span>
                    <div className="flex-1 space-y-1">
                      <div className="text-foreground">{step.step}</div>
                      {step.affects && step.affects.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap">
                          {step.affects.slice(0, 3).map((concern, cIndex) => (
                            <span
                              key={cIndex}
                              className="text-xs px-1.5 py-0.5 rounded-sm bg-primary/5 text-primary/80 border border-primary/20"
                            >
                              {getConcernLabel(concern as ConcernKey)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-7 flex gap-2">
                    <button
                      onClick={() => updateStepStatus("am", stepKey, "completed")}
                      className={`text-xs px-2 py-1 rounded-sm border transition-colors ${
                        status === "completed"
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border text-muted hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      Done
                    </button>
                    <button
                      onClick={() => updateStepStatus("am", stepKey, "skipped")}
                      className={`text-xs px-2 py-1 rounded-sm border transition-colors ${
                        status === "skipped"
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border text-muted hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      Skipped
                    </button>
                    <button
                      onClick={() => updateStepStatus("am", stepKey, "missed")}
                      className={`text-xs px-2 py-1 rounded-sm border transition-colors ${
                        status === "missed"
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border text-muted hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      Missed
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* PM Routine */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="text-xs uppercase tracking-widest font-semibold text-primary">
            PM Routine
          </div>
          <ol className="space-y-3">
            {result.pm_routine.map((step) => {
              const stepKey = step.id;
              const status = getStepStatus("pm", stepKey);
              const index = result.pm_routine.indexOf(step);
              return (
                <li key={step.id} className="space-y-2">
                  <div className="text-sm flex gap-3 items-start">
                    <span className="text-primary font-mono text-xs flex-shrink-0 mt-0.5">
                      {String(index + 1).padStart(2, "0")}.
                    </span>
                    <div className="flex-1 space-y-1">
                      <div className="text-foreground">{step.step}</div>
                      {step.affects && step.affects.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap">
                          {step.affects.slice(0, 3).map((concern, cIndex) => (
                            <span
                              key={cIndex}
                              className="text-xs px-1.5 py-0.5 rounded-sm bg-primary/5 text-primary/80 border border-primary/20"
                            >
                              {getConcernLabel(concern as ConcernKey)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-7 flex gap-2">
                    <button
                      onClick={() => updateStepStatus("pm", stepKey, "completed")}
                      className={`text-xs px-2 py-1 rounded-sm border transition-colors ${
                        status === "completed"
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border text-muted hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      Done
                    </button>
                    <button
                      onClick={() => updateStepStatus("pm", stepKey, "skipped")}
                      className={`text-xs px-2 py-1 rounded-sm border transition-colors ${
                        status === "skipped"
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border text-muted hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      Skipped
                    </button>
                    <button
                      onClick={() => updateStepStatus("pm", stepKey, "missed")}
                      className={`text-xs px-2 py-1 rounded-sm border transition-colors ${
                        status === "missed"
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-border text-muted hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      Missed
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

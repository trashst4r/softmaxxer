"use client";

import type { RoutineStep } from "@/types/analysis";
import Link from "next/link";

interface ResultRoutinePreviewProps {
  amRoutine: RoutineStep[];
  pmRoutine: RoutineStep[];
}

/**
 * Sprint D4: Clean AM/PM routine preview
 * Editorial feel, product-led, strong hierarchy
 */
export function ResultRoutinePreview({ amRoutine, pmRoutine }: ResultRoutinePreviewProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-light text-on-surface">Your routine</h2>
          <Link
            href="/protocol"
            className="text-xs text-on-surface-variant hover:text-on-surface transition-colors"
          >
            View full protocol →
          </Link>
        </div>
        <p className="text-sm text-on-surface-variant">
          Personalized to your skin profile and concerns
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* AM Routine */}
        <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
          <div className="space-y-1">
            <div className="clinical-label">Morning</div>
            <p className="text-xs text-on-surface-variant">
              {amRoutine.length} steps
            </p>
          </div>

          <ol className="space-y-3">
            {amRoutine.slice(0, 5).map((step, i) => (
              <li key={step.id} className="flex gap-3 text-sm">
                <span className="text-on-surface-variant font-mono text-xs mt-0.5 flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 space-y-0.5">
                  <div className="text-on-surface font-medium">{step.step}</div>
                  {step.products && step.products.length > 0 && (
                    <div className="text-xs text-on-surface-variant">
                      {step.products[0].ingredient}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {amRoutine.length > 5 && (
            <p className="text-xs text-on-surface-variant pt-2">
              + {amRoutine.length - 5} more steps
            </p>
          )}
        </div>

        {/* PM Routine */}
        <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
          <div className="space-y-1">
            <div className="clinical-label">Evening</div>
            <p className="text-xs text-on-surface-variant">
              {pmRoutine.length} steps
            </p>
          </div>

          <ol className="space-y-3">
            {pmRoutine.slice(0, 5).map((step, i) => (
              <li key={step.id} className="flex gap-3 text-sm">
                <span className="text-on-surface-variant font-mono text-xs mt-0.5 flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 space-y-0.5">
                  <div className="text-on-surface font-medium">{step.step}</div>
                  {step.products && step.products.length > 0 && (
                    <div className="text-xs text-on-surface-variant">
                      {step.products[0].ingredient}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {pmRoutine.length > 5 && (
            <p className="text-xs text-on-surface-variant pt-2">
              + {pmRoutine.length - 5} more steps
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

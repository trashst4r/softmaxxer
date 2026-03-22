/**
 * Results Visual Layer — Pack1 Image Injection
 * Enhanced routine section with clear AM/PM separation
 * Sprint 7: Local state handling for product swaps
 */

"use client";

import { useState } from "react";
import type { Routine, RegimenStep } from "@/types/regimen";
import { RoutineProductRow } from "@/components/routine/RoutineProductRow";

interface RoutineResultsSectionProps {
  routine: Routine;
}

export function RoutineResultsSection({ routine }: RoutineResultsSectionProps) {
  // Local state for swapped products (does not mutate original engine output)
  const [amRoutine, setAmRoutine] = useState<RegimenStep[]>(routine.am);
  const [pmRoutine, setPmRoutine] = useState<RegimenStep[]>(routine.pm);

  // Handle AM product swap
  const handleAmSwap = (stepIndex: number, newProductId: string) => {
    setAmRoutine((prev) =>
      prev.map((step, i) =>
        i === stepIndex ? { ...step, productId: newProductId } : step
      )
    );
  };

  // Handle PM product swap
  const handlePmSwap = (stepIndex: number, newProductId: string) => {
    setPmRoutine((prev) =>
      prev.map((step, i) =>
        i === stepIndex ? { ...step, productId: newProductId } : step
      )
    );
  };
  return (
    <div className="space-y-8">
      {/* Morning Routine */}
      <section className="bg-surface-container-low rounded-2xl p-8">
        <div className="mb-6">
          <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant/70 mb-4">
            Morning Protocol
          </h3>
          <p className="text-xs text-on-surface-variant font-medium">
            {routine.am.length} targeted steps
          </p>
        </div>
        <div className="space-y-3">
          {amRoutine.map((step, index) => (
            <RoutineProductRow
              key={`am-${index}`}
              step={step}
              stepNumber={index + 1}
              onSwap={(newProductId) => handleAmSwap(index, newProductId)}
            />
          ))}
        </div>
      </section>

      {/* Evening Routine */}
      <section className="bg-surface-container-low rounded-2xl p-8">
        <div className="mb-6">
          <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant/70 mb-4">
            Evening Protocol
          </h3>
          <p className="text-xs text-on-surface-variant font-medium">
            {routine.pm.length} targeted steps
          </p>
        </div>
        <div className="space-y-3">
          {pmRoutine.map((step, index) => (
            <RoutineProductRow
              key={`pm-${index}`}
              step={step}
              stepNumber={index + 1}
              onSwap={(newProductId) => handlePmSwap(index, newProductId)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

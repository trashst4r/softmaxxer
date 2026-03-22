/**
 * Protocol: Deck Bar
 * Sticky bottom bar with controlled entrance animation
 * Appears once on first selection, persistent after
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { RoutineStep } from "@/types/analysis";
import type { ProductSelections, SelectedProduct } from "@/lib/protocol-state";
import { calculatePriceSummary } from "@/lib/protocol-state";
import { motion as motionConfig } from "@/lib/motion-config";

interface DeckBarProps {
  amRoutine: RoutineStep[];
  pmRoutine: RoutineStep[];
  selections: ProductSelections;
  onReview: () => void;
  isVisible: boolean;
}

export function DeckBar({ amRoutine, pmRoutine, selections, onReview, isVisible }: DeckBarProps) {
  const totalSteps = amRoutine.length + pmRoutine.length;
  const summary = calculatePriceSummary(selections, totalSteps);

  // Create ordered array of slots
  const allSteps = [
    ...amRoutine.map((step, i) => ({ ...step, routine: "am" as const, number: i + 1 })),
    ...pmRoutine.map((step, i) => ({ ...step, routine: "pm" as const, number: i + 1 })),
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            duration: motionConfig.duration.modal / 1000,
            ease: motionConfig.easing.entrance,
          }}
          className="fixed bottom-0 left-0 right-0 bg-surface-container-low border-t border-outline-variant shadow-lg z-50"
        >
          {/* Backdrop blur overlay */}
          <div className="absolute inset-0 -z-10 backdrop-blur-sm bg-surface/80" />

          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              {/* Deck Slots */}
              <div className="flex-1 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  {allSteps.map((step, index) => {
                    const selection = selections[step.id];
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: motionConfig.duration.base / 1000,
                          delay: (motionConfig.stagger.slots / 1000) * index,
                          ease: motionConfig.easing.standard,
                        }}
                      >
                        <DeckSlot step={step} selection={selection} />
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Section */}
              <div className="flex items-center gap-6 lg:border-l lg:border-outline-variant lg:pl-6">
                {/* Completion */}
                <div className="text-center">
                  <motion.div
                    key={summary.selectedCount}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: motionConfig.duration.base / 1000,
                      ease: motionConfig.easing.standard,
                    }}
                    className="text-2xl font-light text-on-surface"
                  >
                    {summary.selectedCount}/{summary.totalSteps}
                  </motion.div>
                  <div className="text-xs text-muted">steps</div>
                </div>

                {/* Progress Bar */}
                <div className="hidden md:block w-32">
                  <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: `${summary.completionPercent}%` }}
                      transition={{
                        duration: motionConfig.duration.slow / 1000,
                        ease: motionConfig.easing.standard,
                      }}
                    />
                  </div>
                  <motion.div
                    key={summary.completionPercent}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: motionConfig.duration.base / 1000,
                      delay: 0.1,
                    }}
                    className="text-xs text-muted mt-1 text-center"
                  >
                    {summary.completionPercent}%
                  </motion.div>
                </div>

                {/* Price */}
                <div className="text-center">
                  <motion.div
                    key={summary.selectedPrice}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: motionConfig.duration.base / 1000,
                      ease: motionConfig.easing.standard,
                    }}
                    className="text-2xl font-light text-on-surface"
                  >
                    ${summary.selectedPrice}
                  </motion.div>
                  <div className="text-xs text-muted">
                    of ~${summary.estimatedTotal}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={onReview}
                  disabled={!summary.isComplete}
                  className={`
                    px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap
                    ${
                      summary.isComplete
                        ? "bg-primary text-on-primary hover:opacity-90 cursor-pointer"
                        : "bg-surface-container-highest text-muted cursor-not-allowed opacity-50"
                    }
                  `}
                >
                  {summary.isComplete
                    ? "Review & Buy All"
                    : `Complete Deck (${summary.totalSteps - summary.selectedCount} left)`
                  }
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * DeckSlot Component
 */
interface DeckSlotProps {
  step: RoutineStep & { routine: "am" | "pm"; number: number };
  selection: SelectedProduct | null;
}

function DeckSlot({ step, selection }: DeckSlotProps) {
  if (selection) {
    return (
      <div className="border border-primary bg-primary/5 rounded-lg p-2 min-w-[100px]">
        <div className="space-y-1">
          <div className="text-xs text-muted uppercase tracking-wider">
            {step.routine.toUpperCase()}-{step.number}
          </div>
          <div className="text-xs font-semibold text-on-surface line-clamp-1">
            {selection.brand}
          </div>
          <div className="text-xs text-primary font-semibold">
            ${selection.price}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-outline-variant border-dashed bg-surface-container-lowest rounded-lg p-2 min-w-[100px]">
      <div className="space-y-1">
        <div className="text-xs text-muted uppercase tracking-wider">
          {step.routine.toUpperCase()}-{step.number}
        </div>
        <div className="text-xs text-error font-semibold">
          Not selected
        </div>
        <div className="text-xs text-muted">
          —
        </div>
      </div>
    </div>
  );
}

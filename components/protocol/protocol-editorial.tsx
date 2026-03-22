"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getActiveRegimen, getActiveRegimenId } from "@/lib/app-state";
import type { AnalysisResult } from "@/types/analysis";
import type { ProductSelections, SelectedProduct } from "@/lib/protocol-state";
import {
  loadValidatedSelections,
  initializeSelections,
  saveSelection,
  calculatePriceSummary,
  setSelectionsRegimenId,
} from "@/lib/protocol-state";
import { matchProductsForStep } from "@/lib/products/match-products";
import { ProductSelector } from "./product-selector";
import { DeckBar } from "./deck-bar";
import { DeckReview } from "./deck-review";
import { motion as motionConfig } from "@/lib/motion-config";
import type { RefinementAnswers } from "@/lib/refinement/types";
import {
  getRefinementAnswers,
  hasCompletedRefinement,
  saveRefinementAnswers,
  dismissRefinementPrompt,
  isPromptDismissed,
} from "@/lib/refinement/refinement-state";
import { RefinementModal } from "@/components/refinement/refinement-modal";
import { SaveRoutineModal } from "@/components/refinement/save-routine-modal";

export function ProtocolEditorial() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selections, setSelections] = useState<ProductSelections>({});
  const [openSection, setOpenSection] = useState<"am" | "pm" | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [deckBarVisible, setDeckBarVisible] = useState(false);

  // Sprint D13: Refinement layer
  const [refinement, setRefinement] = useState<RefinementAnswers | null>(null);
  const [showRefinementPrompt, setShowRefinementPrompt] = useState(false);
  const [showRefinementModal, setShowRefinementModal] = useState(false);
  const [showSaveRoutineModal, setShowSaveRoutineModal] = useState(false);

  useEffect(() => {
    // Sprint D11: Load from app-state
    const analysis = getActiveRegimen();
    setResult(analysis);

    if (analysis) {
      const currentRegimenId = getActiveRegimenId() || "";

      // Load and validate selections against current regimen
      const existing = loadValidatedSelections(
        analysis.am_routine,
        analysis.pm_routine,
        currentRegimenId
      );

      if (existing) {
        setSelections(existing);
        const hasSelections = Object.values(existing).some((s) => s !== null);
        setDeckBarVisible(hasSelections);
      } else {
        const initialized = initializeSelections(
          analysis.am_routine,
          analysis.pm_routine
        );
        setSelections(initialized);
        setSelectionsRegimenId(currentRegimenId);
      }

      // Sprint D13: Load refinement answers
      const existingRefinement = getRefinementAnswers(currentRegimenId);
      if (existingRefinement) {
        setRefinement(existingRefinement);
      } else {
        // Show refinement prompt if not completed AND not dismissed
        if (
          !hasCompletedRefinement(currentRegimenId) &&
          !isPromptDismissed(currentRegimenId)
        ) {
          setShowRefinementPrompt(true);
        }
      }
    }
  }, []);

  const handleProductSelect = (selection: SelectedProduct) => {
    const updated = saveSelection(selections, selection);
    setSelections(updated);

    // Show deck bar on first selection
    if (!deckBarVisible) {
      setDeckBarVisible(true);
    }
  };

  const toggleSection = (section: "am" | "pm") => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleReviewClick = () => {
    setShowReview(true);
  };

  const handleCloseReview = () => {
    setShowReview(false);
  };

  // Sprint D13: Refinement handlers
  const handleRefinementComplete = (answers: RefinementAnswers) => {
    const currentRegimenId = getActiveRegimenId() || "";
    saveRefinementAnswers(currentRegimenId, answers);
    setRefinement(answers);
    setShowRefinementPrompt(false);
  };

  if (!result) {
    return (
      <div className="screen-container">
        <div className="flex items-center justify-center flex-1 px-6">
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-headline text-2xl font-normal text-on-surface">
              Your Protocol
            </h1>
            <p className="text-body text-sm text-muted leading-relaxed">
              Complete your first check-in to generate your protocol.
            </p>
            <Link href="/analysis" className="clinical-button inline-block">
              Start Check-In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalSteps = result.am_routine.length + result.pm_routine.length;
  const summary = calculatePriceSummary(selections, totalSteps);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: motionConfig.duration.base / 1000,
          ease: motionConfig.easing.standard,
        }}
        className="screen-container bg-surface pb-32"
      >
        <div className="screen-content px-6 py-12">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <h1 className="text-headline text-4xl font-bold text-on-surface">
                  Build Your Deck
                </h1>
                <Link
                  href="/dashboard"
                  className="text-body text-sm text-muted hover:text-on-surface transition-colors"
                >
                  ← Back to Dashboard
                </Link>
              </div>
              <div className="space-y-2">
                <p className="text-body text-base text-muted">
                  Built for: <span className="text-on-surface font-semibold">{result.profile_label}</span>
                </p>
                <p className="text-body text-sm text-muted leading-relaxed max-w-2xl">
                  Select one product for each step. Your selections are saved automatically.
                </p>
              </div>

              {/* Sprint D13: Refinement Prompt */}
              {showRefinementPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/5 border border-primary/20 rounded-lg p-6 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-on-surface mb-1">
                      Want to fine-tune your product recommendations?
                    </h3>
                    <p className="text-sm text-muted">
                      Tell us about your preferences for texture, budget, and ingredients.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const currentRegimenId = getActiveRegimenId() || "";
                        dismissRefinementPrompt(currentRegimenId);
                        setShowRefinementPrompt(false);
                      }}
                      className="px-4 py-2 text-sm text-muted hover:text-on-surface transition-colors"
                    >
                      No, use defaults
                    </button>
                    <button
                      onClick={() => setShowRefinementModal(true)}
                      className="px-6 py-2.5 text-sm font-semibold bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Yes, refine
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Completion Status */}
              <div className="flex items-center gap-4 pt-4">
                <div className="text-sm text-muted">
                  {summary.selectedCount} of {summary.totalSteps} steps complete
                </div>
                <div className="flex-1 max-w-xs">
                  <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
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
                </div>
                <motion.div
                  key={summary.completionPercent}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: motionConfig.duration.base / 1000,
                    delay: 0.1,
                  }}
                  className="text-sm text-muted"
                >
                  {summary.completionPercent}%
                </motion.div>
              </div>
            </div>

            {/* Morning Routine */}
            <div className="space-y-6">
              <button
                onClick={() => toggleSection("am")}
                className="w-full flex items-center justify-between text-left group bg-surface-container-low rounded-lg p-6 hover:bg-surface-container-highest transition-colors"
              >
                <div className="flex items-center gap-4">
                  <svg
                    className="w-8 h-8 text-primary"
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
                  <div>
                    <h2 className="text-headline text-2xl font-semibold text-on-surface">
                      Morning Routine
                    </h2>
                    <p className="text-sm text-muted">
                      {result.am_routine.length} steps ·{" "}
                      {result.am_routine.filter((step) => selections[step.id]).length} selected
                    </p>
                  </div>
                </div>
                <motion.span
                  animate={{ rotate: openSection === "am" ? 180 : 0 }}
                  transition={{
                    duration: motionConfig.duration.slow / 1000,
                    ease: motionConfig.easing.standard,
                  }}
                  className="text-muted text-sm group-hover:text-on-surface transition-colors"
                >
                  ↓
                </motion.span>
              </button>

              <AnimatePresence>
                {openSection === "am" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: {
                        duration: motionConfig.duration.slow / 1000,
                        ease: motionConfig.easing.standard,
                      },
                      opacity: {
                        duration: motionConfig.duration.base / 1000,
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-8 pt-4">
                      {result.am_routine.map((step, index) => {
                        const selection = selections[step.id];
                        const productMatches = matchProductsForStep(step.id, step.step, result.scores, refinement);
                        const products = productMatches.map(m => m.product);
                        const matchReasons = productMatches.find(m => m.product.id === selection?.productId)?.matchReasons || [];

                        return (
                          <div key={step.id} className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-xs text-muted">
                                    {String(index + 1).padStart(2, "0")}
                                  </span>
                                  <h3 className="font-headline text-lg font-semibold text-on-surface">
                                    {step.step}
                                  </h3>
                                </div>
                                {step.products?.[0]?.rationale && (
                                  <p className="text-sm text-muted mt-2 ml-8">
                                    {step.products[0].rationale}
                                  </p>
                                )}
                              </div>
                              {selection ? (
                                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Selected
                                </div>
                              ) : (
                                <div className="text-error text-sm font-semibold">
                                  ⚠ Required
                                </div>
                              )}
                            </div>

                            <ProductSelector
                              step={step}
                              stepNumber={index + 1}
                              routine="am"
                              products={products}
                              selectedProductId={selection?.productId || null}
                              onSelect={handleProductSelect}
                            />

                            {/* Sprint D13: Match Reasons */}
                            {selection && matchReasons.length > 0 && (
                              <div className="mt-3 space-y-1.5">
                                {matchReasons.map((reason, i) => (
                                  <div key={i} className="flex items-start gap-2 text-sm text-muted">
                                    <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    <span>{reason}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Evening Routine */}
            <div className="space-y-6">
              <button
                onClick={() => toggleSection("pm")}
                className="w-full flex items-center justify-between text-left group bg-surface-container-low rounded-lg p-6 hover:bg-surface-container-highest transition-colors"
              >
                <div className="flex items-center gap-4">
                  <svg
                    className="w-8 h-8 text-primary"
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
                  <div>
                    <h2 className="text-headline text-2xl font-semibold text-on-surface">
                      Evening Routine
                    </h2>
                    <p className="text-sm text-muted">
                      {result.pm_routine.length} steps ·{" "}
                      {result.pm_routine.filter((step) => selections[step.id]).length} selected
                    </p>
                  </div>
                </div>
                <motion.span
                  animate={{ rotate: openSection === "pm" ? 180 : 0 }}
                  transition={{
                    duration: motionConfig.duration.slow / 1000,
                    ease: motionConfig.easing.standard,
                  }}
                  className="text-muted text-sm group-hover:text-on-surface transition-colors"
                >
                  ↓
                </motion.span>
              </button>

              <AnimatePresence>
                {openSection === "pm" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: {
                        duration: motionConfig.duration.slow / 1000,
                        ease: motionConfig.easing.standard,
                      },
                      opacity: {
                        duration: motionConfig.duration.base / 1000,
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-8 pt-4">
                      {result.pm_routine.map((step, index) => {
                        const selection = selections[step.id];
                        const productMatches = matchProductsForStep(step.id, step.step, result.scores, refinement);
                        const products = productMatches.map(m => m.product);
                        const matchReasons = productMatches.find(m => m.product.id === selection?.productId)?.matchReasons || [];

                        return (
                          <div key={step.id} className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-xs text-muted">
                                    {String(index + 1).padStart(2, "0")}
                                  </span>
                                  <h3 className="font-headline text-lg font-semibold text-on-surface">
                                    {step.step}
                                  </h3>
                                </div>
                                {step.products?.[0]?.rationale && (
                                  <p className="text-sm text-muted mt-2 ml-8">
                                    {step.products[0].rationale}
                                  </p>
                                )}
                              </div>
                              {selection ? (
                                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Selected
                                </div>
                              ) : (
                                <div className="text-error text-sm font-semibold">
                                  ⚠ Required
                                </div>
                              )}
                            </div>

                            <ProductSelector
                              step={step}
                              stepNumber={index + 1}
                              routine="pm"
                              products={products}
                              selectedProductId={selection?.productId || null}
                              onSelect={handleProductSelect}
                            />

                            {/* Sprint D13: Match Reasons */}
                            {selection && matchReasons.length > 0 && (
                              <div className="mt-3 space-y-1.5">
                                {matchReasons.map((reason, i) => (
                                  <div key={i} className="flex items-start gap-2 text-sm text-muted">
                                    <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    <span>{reason}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Links */}
            <div className="flex items-center justify-center gap-3 text-body text-sm text-muted pt-12">
              <Link href="/dashboard" className="hover:text-on-surface transition-colors">
                Back to Dashboard
              </Link>
              <span>·</span>
              <Link href="/analysis" className="hover:text-on-surface transition-colors">
                Retake Check-In
              </Link>
              <span>·</span>
              <Link href="/results" className="hover:text-on-surface transition-colors">
                View Analysis
              </Link>
              <span>·</span>
              <button
                onClick={() => setShowSaveRoutineModal(true)}
                className="hover:text-on-surface transition-colors"
              >
                Save Routine
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Deck Bar (Sticky Bottom) */}
      <DeckBar
        amRoutine={result.am_routine}
        pmRoutine={result.pm_routine}
        selections={selections}
        onReview={handleReviewClick}
        isVisible={deckBarVisible}
      />

      {/* Deck Review Modal */}
      <DeckReview
        selections={selections}
        totalSteps={totalSteps}
        onClose={handleCloseReview}
        isOpen={showReview}
      />

      {/* Sprint D13: Refinement Modal */}
      <RefinementModal
        isOpen={showRefinementModal}
        onClose={() => setShowRefinementModal(false)}
        onComplete={handleRefinementComplete}
        regimen={result}
      />

      {/* Sprint D13: Save Routine Modal */}
      <SaveRoutineModal
        isOpen={showSaveRoutineModal}
        onClose={() => setShowSaveRoutineModal(false)}
      />
    </>
  );
}

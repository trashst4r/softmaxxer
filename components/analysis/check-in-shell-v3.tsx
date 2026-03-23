"use client";

/**
 * Sprint 24.4: 12-Question Diagnostic Check-In
 * Single-pass, no branching, fully protocol-aligned
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDevMode } from "@/components/developer-mode-toggle";
import { setActiveProfile, setActiveRegimen } from "@/lib/app-state";
import type { CheckInAnswers } from "@/types/diagnostic-input";

const TOTAL_STEPS = 12;

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 20 : -20,
    opacity: 0,
  }),
};

const transition = {
  x: { type: "spring" as const, stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

export function CheckInShellV3() {
  const router = useRouter();
  const isDevMode = useDevMode();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [answers, setAnswers] = useState<Partial<CheckInAnswers>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const updateAnswer = (key: keyof CheckInAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = (): boolean => {
    if (isDevMode) return true;

    const requiredFields: (keyof CheckInAnswers)[] = [
      "primary_concern",
      "secondary_concern",
      "oil_profile",
      "dehydration",
      "barrier_state",
      "sensitivity",
      "breakout_pattern",
      "actives_experience",
      "current_actives",
      "spf_compliance",
      "age_group",
      "sun_sensitivity",
    ];

    const fieldIndex = currentStep - 1;
    const field = requiredFields[fieldIndex];
    return !!answers[field];
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsGenerating(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Import new protocol engine
    const { generateProtocolFromDiagnostic } = await import("@/lib/protocol-engine-v2");

    // Transform answers to DiagnosticInput and generate protocol
    const result = generateProtocolFromDiagnostic(answers as CheckInAnswers);

    // Store in sessionStorage for results page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("check_in_result", JSON.stringify(result));
    }

    // Save to app-state for dashboard
    setActiveProfile(result.profile);
    setActiveRegimen(result.analysisResult);

    router.push("/results");
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-16 h-16 mx-auto">
            <motion.div
              className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="space-y-2">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-headline text-2xl font-semibold text-on-surface"
            >
              Building your protocol
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-on-surface-variant"
            >
              Analyzing your skin profile
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-surface-container-low z-50">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-2xl flex flex-col" style={{ height: "calc(100vh - 12rem)" }}>
          <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
            <AnimatePresence mode="wait" custom={direction}>
              {/* Q1: Primary Concern */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="w-full space-y-8"
                >
                  <div className="text-center space-y-3">
                    <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                      What is your main skin concern?
                    </h1>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: "acne", label: "Breakouts / Acne" },
                      { value: "pigmentation", label: "Dark spots / Pigmentation" },
                      { value: "redness", label: "Redness / Sensitivity" },
                      { value: "texture", label: "Rough texture" },
                      { value: "aging", label: "Fine lines / Aging" },
                      { value: "dehydration", label: "Dryness / Dehydration" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateAnswer("primary_concern", option.value)}
                        className={`w-full p-5 rounded-xl text-left font-body text-lg transition-all ${
                          answers.primary_concern === option.value
                            ? "bg-primary text-on-primary shadow-md"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Q2: Secondary Concern */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="w-full space-y-8"
                >
                  <div className="text-center space-y-3">
                    <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                      Do you have a secondary concern?
                    </h1>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: "none", label: "No secondary concern" },
                      { value: "acne", label: "Breakouts / Acne" },
                      { value: "pigmentation", label: "Dark spots / Pigmentation" },
                      { value: "redness", label: "Redness / Sensitivity" },
                      { value: "texture", label: "Rough texture" },
                      { value: "aging", label: "Fine lines / Aging" },
                      { value: "dehydration", label: "Dryness / Dehydration" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateAnswer("secondary_concern", option.value)}
                        className={`w-full p-5 rounded-xl text-left font-body text-lg transition-all ${
                          answers.secondary_concern === option.value
                            ? "bg-primary text-on-primary shadow-md"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Q3: Oil Profile */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="w-full space-y-8"
                >
                  <div className="text-center space-y-3">
                    <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                      How does your skin feel by midday?
                    </h1>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: "dry", label: "Tight and dry" },
                      { value: "balanced", label: "Comfortable and balanced" },
                      { value: "combination", label: "Oily in T-zone (nose, forehead)" },
                      { value: "oily", label: "Very oily all over" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateAnswer("oil_profile", option.value)}
                        className={`w-full p-5 rounded-xl text-left font-body text-lg transition-all ${
                          answers.oil_profile === option.value
                            ? "bg-primary text-on-primary shadow-md"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Q4: Dehydration */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="w-full space-y-8"
                >
                  <div className="text-center space-y-3">
                    <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                      Does your skin feel tight or dehydrated?
                    </h1>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: "none", label: "No, feels comfortable" },
                      { value: "sometimes", label: "Sometimes, especially after cleansing" },
                      { value: "often", label: "Often, feels tight throughout the day" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateAnswer("dehydration", option.value)}
                        className={`w-full p-5 rounded-xl text-left font-body text-lg transition-all ${
                          answers.dehydration === option.value
                            ? "bg-primary text-on-primary shadow-md"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Q5: Barrier State */}
              {currentStep === 5 && (
                <motion.div
                  key="step-5"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="w-full space-y-8"
                >
                  <div className="text-center space-y-3">
                    <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                      How is your skin feeling right now?
                    </h1>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: "calm", label: "Calm and comfortable" },
                      { value: "slightly_sensitive", label: "Slightly sensitive or reactive" },
                      { value: "irritated", label: "Tight, stinging, or easily irritated" },
                      { value: "damaged", label: "Burning, flaking, or very damaged" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateAnswer("barrier_state", option.value)}
                        className={`w-full p-5 rounded-xl text-left font-body text-lg transition-all ${
                          answers.barrier_state === option.value
                            ? "bg-primary text-on-primary shadow-md"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Q6: Sensitivity */}
              {currentStep === 6 && (
                <motion.div
                  key="step-6"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="w-full space-y-8"
                >
                  <div className="text-center space-y-3">
                    <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                      How does your skin usually react to new products?
                    </h1>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: "rarely_reacts", label: "Rarely reacts, tolerates most things" },
                      { value: "sometimes_irritated", label: "Sometimes irritated by strong products" },
                      { value: "often_reactive", label: "Often reactive, many products sting" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateAnswer("sensitivity", option.value)}
                        className={`w-full p-5 rounded-xl text-left font-body text-lg transition-all ${
                          answers.sensitivity === option.value
                            ? "bg-primary text-on-primary shadow-md"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Q7: Breakout Pattern */}
              {currentStep === 7 && (
                <motion.div
                  key="step-7"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="w-full space-y-8"
                >
                  <div className="text-center space-y-3">
                    <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                      What best describes your breakouts?
                    </h1>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: "none", label: "No breakouts" },
                      { value: "occasional", label: "Occasional small spots" },
                      { value: "comedonal", label: "Clogged pores and blackheads" },
                      { value: "inflamed", label: "Red, inflamed pimples" },
                      { value: "cystic", label: "Deep, painful, or cystic breakouts" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateAnswer("breakout_pattern", option.value)}
                        className={`w-full p-5 rounded-xl text-left font-body text-lg transition-all ${
                          answers.breakout_pattern === option.value
                            ? "bg-primary text-on-primary shadow-md"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Q8: Actives Experience */}
              {currentStep === 8 && (
                <motion.div
                  key="step-8"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="w-full space-y-8"
                >
                  <div className="text-center space-y-3">
                    <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                      What is your experience with active ingredients?
                    </h1>
                    <p className="text-sm text-on-surface-variant">
                      (retinoids, acids, etc.)
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: "never", label: "Never used actives" },
                      { value: "occasional", label: "Used occasionally with mixed results" },
                      { value: "regular", label: "Use regularly with good tolerance" },
                      { value: "advanced", label: "Very experienced, high tolerance" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateAnswer("actives_experience", option.value)}
                        className={`w-full p-5 rounded-xl text-left font-body text-lg transition-all ${
                          answers.actives_experience === option.value
                            ? "bg-primary text-on-primary shadow-md"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Q9: Current Actives */}
              {currentStep === 9 && (
                <motion.div
                  key="step-9"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="w-full space-y-8"
                >
                  <div className="text-center space-y-3">
                    <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                      Are you currently using any active treatments?
                    </h1>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: "none", label: "None" },
                      { value: "mild", label: "Mild actives (niacinamide, hyaluronic acid)" },
                      { value: "moderate", label: "Moderate actives (AHA/BHA acids)" },
                      { value: "strong", label: "Strong actives (retinoids, benzoyl peroxide)" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateAnswer("current_actives", option.value)}
                        className={`w-full p-5 rounded-xl text-left font-body text-lg transition-all ${
                          answers.current_actives === option.value
                            ? "bg-primary text-on-primary shadow-md"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Q10: SPF Compliance */}
              {currentStep === 10 && (
                <motion.div
                  key="step-10"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="w-full space-y-8"
                >
                  <div className="text-center space-y-3">
                    <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                      How often do you use sunscreen?
                    </h1>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: "never", label: "Never or rarely" },
                      { value: "sometimes", label: "Sometimes (2-3x per week)" },
                      { value: "daily", label: "Daily without fail" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateAnswer("spf_compliance", option.value)}
                        className={`w-full p-5 rounded-xl text-left font-body text-lg transition-all ${
                          answers.spf_compliance === option.value
                            ? "bg-primary text-on-primary shadow-md"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Q11: Age Group */}
              {currentStep === 11 && (
                <motion.div
                  key="step-11"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="w-full space-y-8"
                >
                  <div className="text-center space-y-3">
                    <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                      Which age range best describes you?
                    </h1>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: "under25", label: "Under 25" },
                      { value: "25to34", label: "25-34" },
                      { value: "35to44", label: "35-44" },
                      { value: "45plus", label: "45+" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateAnswer("age_group", option.value)}
                        className={`w-full p-5 rounded-xl text-left font-body text-lg transition-all ${
                          answers.age_group === option.value
                            ? "bg-primary text-on-primary shadow-md"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Q12: Sun Sensitivity */}
              {currentStep === 12 && (
                <motion.div
                  key="step-12"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                  className="w-full space-y-8"
                >
                  <div className="text-center space-y-3">
                    <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                      How does your skin react to sun exposure?
                    </h1>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: "burns_easily", label: "Burns easily, rarely tans" },
                      { value: "sometimes_burns", label: "Sometimes burns, tans gradually" },
                      { value: "rarely_burns", label: "Rarely burns, tans easily" },
                      { value: "never_burns", label: "Almost never burns" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateAnswer("sun_sensitivity", option.value)}
                        className={`w-full p-5 rounded-xl text-left font-body text-lg transition-all ${
                          answers.sun_sensitivity === option.value
                            ? "bg-primary text-on-primary shadow-md"
                            : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-outline-variant flex-shrink-0">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-0 disabled:pointer-events-none font-medium"
            >
              ← Back
            </button>

            <div className="text-xs text-muted">
              {currentStep} of {TOTAL_STEPS}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                canProceed()
                  ? "bg-primary text-on-primary hover:opacity-90 shadow-sm"
                  : "bg-surface-container-low text-muted cursor-not-allowed opacity-50"
              }`}
            >
              {currentStep === TOTAL_STEPS ? "See your protocol" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

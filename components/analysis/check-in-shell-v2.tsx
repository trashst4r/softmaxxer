"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { runAnalysisFromProfile } from "@/lib/analysis-engine";
import { useDevMode } from "@/components/developer-mode-toggle";
import { computeProfile } from "@/lib/scoring/computeProfile";
import { setActiveProfile, setActiveRegimen } from "@/lib/app-state";
import { addHistoryEntry } from "@/lib/history-state";
import type { AnalysisAnswers } from "@/types/analysis";

type PrimaryConcern = "breakouts" | "dryness" | "redness" | "oiliness" | "texture";
type SkinBehavior = "tight" | "balanced" | "shiny_areas" | "shiny_all";
type Frequency = "rarely" | "sometimes" | "often" | "constant";
type Sensitivity = "rarely" | "sometimes" | "very_easily";
type ActiveIngredient = "retinoid" | "aha_bha" | "vitamin_c" | "benzoyl_peroxide" | "azelaic_acid";
type SpfUsage = "daily" | "sometimes" | "rarely";
type RoutineRealism = "easy" | "manageable" | "too_much";

interface CheckInAnswers {
  concerns: PrimaryConcern[];
  skin_behavior?: SkinBehavior;
  frequency?: Frequency;
  sensitivity?: Sensitivity;
  has_actives?: boolean;
  actives?: ActiveIngredient[];
  spf_usage?: SpfUsage;
  routine_realism?: RoutineRealism;
}

const TOTAL_STEPS = 7;

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

export function CheckInShellV2() {
  const router = useRouter();
  const isDevMode = useDevMode();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [answers, setAnswers] = useState<CheckInAnswers>({ concerns: [] });
  const [isGenerating, setIsGenerating] = useState(false);

  const updateAnswer = <K extends keyof CheckInAnswers>(
    key: K,
    value: CheckInAnswers[K]
  ) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const toggleConcern = (concern: PrimaryConcern) => {
    setAnswers((prev) => {
      const current = prev.concerns || [];
      if (current.includes(concern)) {
        return { ...prev, concerns: current.filter((c) => c !== concern) };
      } else if (current.length < 2) {
        return { ...prev, concerns: [...current, concern] };
      }
      return prev;
    });
  };

  const toggleActive = (active: ActiveIngredient) => {
    setAnswers((prev) => {
      const current = prev.actives || [];
      if (current.includes(active)) {
        return { ...prev, actives: current.filter((a) => a !== active) };
      }
      return { ...prev, actives: [...current, active] };
    });
  };

  const canProceed = (): boolean => {
    if (isDevMode) return true;

    switch (currentStep) {
      case 1:
        return answers.concerns.length > 0;
      case 2:
        return !!answers.skin_behavior;
      case 3:
        return !!answers.frequency;
      case 4:
        return !!answers.sensitivity;
      case 5:
        return answers.has_actives !== undefined;
      case 6:
        return !!answers.spf_usage;
      case 7:
        return !!answers.routine_realism;
      default:
        return false;
    }
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

    // Simulate generation (1200-1800ms)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Import new deterministic engine
    const { inferSkinProfile } = await import("@/lib/analysis/infer-skin-profile");
    const { buildRoutineFromProfile } = await import("@/lib/analysis/build-routine-from-profile");
    const { convertToAnalysisResult } = await import("@/lib/analysis/routine-compatibility");

    // Run new deterministic engine
    const profile = inferSkinProfile(answers);
    const routine = buildRoutineFromProfile(profile);

    // Create result payload
    const resultPayload = {
      profile,
      routine,
      timestamp: Date.now(),
    };

    // Store in sessionStorage for results page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("check_in_result", JSON.stringify(resultPayload));
    }

    // Save to app-state for dashboard (convert to legacy AnalysisResult)
    setActiveProfile(profile);
    const legacyResult = convertToAnalysisResult(routine, profile);
    setActiveRegimen(legacyResult);

    router.push("/results");
  };

  const mapToScoringAnswers = (answers: CheckInAnswers) => {
    // Map quiz SkinBehavior to scoring SkinBehavior
    let mappedBehavior: "tight_dry" | "balanced" | "oily_tzone" | "oily_all" | undefined;
    if (answers.skin_behavior === "tight") mappedBehavior = "tight_dry";
    else if (answers.skin_behavior === "balanced") mappedBehavior = "balanced";
    else if (answers.skin_behavior === "shiny_areas") mappedBehavior = "oily_tzone";
    else if (answers.skin_behavior === "shiny_all") mappedBehavior = "oily_all";

    // Map quiz ActiveIngredients to scoring ActiveIngredients
    type ScoringActiveIngredient = "retinol" | "acids" | "vitamin_c" | "benzoyl_peroxide" | "other";
    const mappedActives: ScoringActiveIngredient[] | undefined = answers.actives?.map((active) => {
      if (active === "retinoid") return "retinol";
      if (active === "aha_bha") return "acids";
      if (active === "vitamin_c") return "vitamin_c";
      if (active === "benzoyl_peroxide") return "benzoyl_peroxide";
      if (active === "azelaic_acid") return "other";
      return "other";
    });

    // Map quiz SpfUsage to scoring SpfUsage
    let mappedSpf: "yes" | "sometimes" | "no" | undefined;
    if (answers.spf_usage === "daily") mappedSpf = "yes";
    else if (answers.spf_usage === "sometimes") mappedSpf = "sometimes";
    else if (answers.spf_usage === "rarely") mappedSpf = "no";

    return {
      concerns: answers.concerns,
      skin_behavior: mappedBehavior,
      concern_severity: answers.frequency,
      has_actives: answers.has_actives,
      actives: mappedActives,
      sensitivity: answers.sensitivity,
      spf_daily: mappedSpf,
    };
  };

  const mapToAnalysisAnswers = (answers: CheckInAnswers): AnalysisAnswers => {
    return {
      skin_feel_after_cleansing: answers.skin_behavior === "tight" ? "tight" : "normal",
      midday_oiliness:
        answers.skin_behavior === "shiny_all"
          ? "high"
          : answers.skin_behavior === "shiny_areas"
          ? "moderate"
          : "low",
      breakout_frequency:
        answers.concerns.includes("breakouts")
          ? answers.frequency === "constant" || answers.frequency === "often"
            ? "frequent"
            : answers.frequency === "sometimes"
            ? "occasional"
            : "rare"
          : "rare",
      visible_redness: answers.concerns.includes("redness") ? "high" : "low",
      flaking_or_dry_patches: answers.concerns.includes("dryness") ? "clear" : "none",
      sensitivity_level:
        answers.sensitivity === "very_easily" ? "high" : answers.sensitivity === "sometimes" ? "moderate" : "low",
      primary_goal:
        answers.concerns[0] === "breakouts"
          ? "acne"
          : answers.concerns[0] === "redness"
          ? "redness"
          : answers.concerns[0] === "texture"
          ? "texture"
          : answers.concerns[0] === "oiliness"
          ? "oil_control"
          : "maintenance",
      spf_usage: answers.spf_usage === "daily" ? "daily" : answers.spf_usage === "sometimes" ? "sometimes" : "never",
      breakout_zones: answers.concerns.includes("breakouts") ? ["forehead", "cheeks"] : [],
      current_active_use: answers.actives?.join(", ") || "",
    };
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
              Building your routine
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-on-surface-variant"
            >
              Balancing actives and barrier support
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

      {/* Main Content - Fixed Frame */}
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-2xl flex flex-col" style={{ height: "calc(100vh - 12rem)" }}>
          {/* Question Body - Scrollable if needed, horizontal overflow hidden for transitions */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden pb-6">
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1: Primary Concerns */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="w-full space-y-12"
              >
                <div className="text-center space-y-4">
                  <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                    What are you dealing with most right now?
                  </h1>
                  <p className="text-sm text-on-surface-variant">Select up to 2</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: "breakouts" as const, label: "Breakouts" },
                    { value: "dryness" as const, label: "Dryness" },
                    { value: "redness" as const, label: "Redness" },
                    { value: "oiliness" as const, label: "Oiliness" },
                    { value: "texture" as const, label: "Texture" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => toggleConcern(option.value)}
                      className={`p-8 rounded-xl text-left font-headline text-xl font-semibold transition-all ${
                        answers.concerns.includes(option.value)
                          ? "bg-primary text-on-primary shadow-md scale-[0.98]"
                          : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Skin Behavior */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="w-full space-y-12"
              >
                <div className="text-center space-y-4">
                  <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                    By the middle of the day, your skin usually feels...
                  </h1>
                </div>

                <div className="space-y-4">
                  {[
                    { value: "tight" as const, label: "Tight" },
                    { value: "balanced" as const, label: "Balanced" },
                    { value: "shiny_areas" as const, label: "Shiny in some areas" },
                    { value: "shiny_all" as const, label: "Shiny all over" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateAnswer("skin_behavior", option.value)}
                      className={`w-full p-6 rounded-xl text-left font-body text-lg transition-all ${
                        answers.skin_behavior === option.value
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

            {/* Step 3: Frequency */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="w-full space-y-12"
              >
                <div className="text-center space-y-4">
                  <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                    How often does your main issue show up?
                  </h1>
                </div>

                <div className="space-y-4">
                  {[
                    { value: "rarely" as const, label: "Rarely" },
                    { value: "sometimes" as const, label: "Sometimes" },
                    { value: "often" as const, label: "Often" },
                    { value: "constant" as const, label: "Constant" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateAnswer("frequency", option.value)}
                      className={`w-full p-6 rounded-xl text-left font-body text-lg transition-all ${
                        answers.frequency === option.value
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

            {/* Step 4: Sensitivity */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="w-full space-y-12"
              >
                <div className="text-center space-y-4">
                  <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                    How easily does your skin get irritated by new products?
                  </h1>
                </div>

                <div className="space-y-4">
                  {[
                    { value: "rarely" as const, label: "Rarely" },
                    { value: "sometimes" as const, label: "Sometimes" },
                    { value: "very_easily" as const, label: "Very easily" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateAnswer("sensitivity", option.value)}
                      className={`w-full p-6 rounded-xl text-left font-body text-lg transition-all ${
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

            {/* Step 5: Actives */}
            {currentStep === 5 && (
              <motion.div
                key="step-5"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="w-full space-y-12"
              >
                <div className="text-center space-y-4">
                  <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                    Are you already using actives?
                  </h1>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      updateAnswer("has_actives", false);
                      updateAnswer("actives", []);
                    }}
                    className={`w-full p-6 rounded-xl text-left font-body text-lg transition-all ${
                      answers.has_actives === false
                        ? "bg-primary text-on-primary shadow-md"
                        : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    No
                  </button>

                  <button
                    onClick={() => updateAnswer("has_actives", true)}
                    className={`w-full p-6 rounded-xl text-left font-body text-lg transition-all ${
                      answers.has_actives === true
                        ? "bg-primary text-on-primary shadow-md"
                        : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    Yes
                  </button>
                </div>

                {answers.has_actives === true && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <p className="text-center text-sm text-on-surface-variant">
                      Which ones?
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {[
                        { value: "retinoid" as const, label: "Retinoid" },
                        { value: "aha_bha" as const, label: "AHA/BHA" },
                        { value: "vitamin_c" as const, label: "Vitamin C" },
                        { value: "benzoyl_peroxide" as const, label: "Benzoyl peroxide" },
                        { value: "azelaic_acid" as const, label: "Azelaic acid" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => toggleActive(option.value)}
                          className={`px-6 py-3 rounded-full font-body text-sm font-medium transition-all ${
                            answers.actives?.includes(option.value)
                              ? "bg-primary text-on-primary"
                              : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 6: SPF Usage */}
            {currentStep === 6 && (
              <motion.div
                key="step-6"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="w-full space-y-12"
              >
                <div className="text-center space-y-4">
                  <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                    How often do you wear SPF?
                  </h1>
                </div>

                <div className="space-y-4">
                  {[
                    { value: "daily" as const, label: "Daily" },
                    { value: "sometimes" as const, label: "Sometimes" },
                    { value: "rarely" as const, label: "Rarely" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateAnswer("spf_usage", option.value)}
                      className={`w-full p-6 rounded-xl text-left font-body text-lg transition-all ${
                        answers.spf_usage === option.value
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

            {/* Step 7: Routine Realism */}
            {currentStep === 7 && (
              <motion.div
                key="step-7"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="w-full space-y-12"
              >
                <div className="text-center space-y-4">
                  <h1 className="font-headline text-4xl md:text-5xl font-semibold tracking-tight text-on-surface">
                    How realistic is a 4-step routine for you right now?
                  </h1>
                </div>

                <div className="space-y-4">
                  {[
                    { value: "easy" as const, label: "Easy" },
                    { value: "manageable" as const, label: "Manageable" },
                    { value: "too_much" as const, label: "Probably too much" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateAnswer("routine_realism", option.value)}
                      className={`w-full p-6 rounded-xl text-left font-body text-lg transition-all ${
                        answers.routine_realism === option.value
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

          {/* Navigation Footer - Fixed Position */}
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
              {currentStep === TOTAL_STEPS ? "See your routine" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

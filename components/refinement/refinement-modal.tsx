"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RefinementAnswers } from "@/lib/refinement/types";
import type { AnalysisResult } from "@/types/analysis";
import { motion as motionConfig } from "@/lib/motion-config";
import { shouldAskPregnancyStatus } from "@/lib/refinement/safety";

interface RefinementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (answers: RefinementAnswers) => void;
  regimen: AnalysisResult;
}

const BASE_STEPS = 6;

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

export function RefinementModal({ isOpen, onClose, onComplete, regimen }: RefinementModalProps) {
  const [hasPregnancyStep, setHasPregnancyStep] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // Start at 0 for conditional pregnancy
  const [direction, setDirection] = useState(0);
  const [answers, setAnswers] = useState<RefinementAnswers & { is_pregnant?: boolean }>({});

  // Check if pregnancy step is needed
  useEffect(() => {
    if (isOpen) {
      const needsPregnancyCheck = shouldAskPregnancyStatus(regimen);
      setHasPregnancyStep(needsPregnancyCheck);
      setCurrentStep(needsPregnancyCheck ? 0 : 1);
    }
  }, [isOpen, regimen]);

  const totalSteps = hasPregnancyStep ? BASE_STEPS + 1 : BASE_STEPS;
  const displayStep = hasPregnancyStep ? currentStep : currentStep - 1;

  const handleNext = () => {
    const maxStep = hasPregnancyStep ? BASE_STEPS : BASE_STEPS;
    const actualMax = hasPregnancyStep ? maxStep : maxStep;

    if (currentStep < actualMax) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    const minStep = hasPregnancyStep ? 0 : 1;
    if (currentStep > minStep) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleComplete = () => {
    onComplete(answers);
    onClose();
  };

  const handleSkipAll = () => {
    // Save empty answers to mark as completed
    onComplete({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          duration: motionConfig.duration.modal / 1000,
          ease: motionConfig.easing.standard,
        }}
        className="w-full max-w-2xl bg-surface rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-headline font-bold text-on-surface">
                {currentStep === 0 ? "Safety check" : "Fine-tune your recommendations"}
              </h2>
              <p className="text-sm text-muted mt-1">
                {currentStep === 0
                  ? "Required for pregnancy-sensitive actives"
                  : `Step ${displayStep + 1} of ${BASE_STEPS} • All questions optional`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted hover:text-on-surface transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1 bg-surface-container-low rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{
                duration: motionConfig.duration.base / 1000,
                ease: motionConfig.easing.standard,
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 min-h-[400px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
            >
              {currentStep === 0 && hasPregnancyStep && (
                <StepPregnancyCheck
                  value={answers.is_pregnant}
                  onChange={(is_pregnant) => setAnswers({ ...answers, is_pregnant })}
                />
              )}
              {currentStep === 1 && (
                <StepAgeRange
                  value={answers.age_range}
                  onChange={(age_range) => setAnswers({ ...answers, age_range })}
                />
              )}
              {currentStep === 2 && (
                <StepSkinType
                  value={answers.self_described_type}
                  onChange={(self_described_type) => setAnswers({ ...answers, self_described_type })}
                />
              )}
              {currentStep === 3 && (
                <StepCleanserPreference
                  value={answers.cleanser_texture}
                  onChange={(cleanser_texture) => setAnswers({ ...answers, cleanser_texture })}
                />
              )}
              {currentStep === 4 && (
                <StepMoisturizerPreference
                  texture={answers.moisturizer_texture}
                  finish={answers.moisturizer_finish}
                  onChange={(moisturizer_texture, moisturizer_finish) =>
                    setAnswers({ ...answers, moisturizer_texture, moisturizer_finish })
                  }
                />
              )}
              {currentStep === 5 && (
                <StepBudgetPreference
                  value={answers.budget}
                  onChange={(budget) => setAnswers({ ...answers, budget })}
                />
              )}
              {currentStep === 6 && (
                <StepIngredientPreferences
                  wants={answers.ingredient_wants}
                  avoids={answers.ingredient_avoids}
                  onChange={(ingredient_wants, ingredient_avoids) =>
                    setAnswers({ ...answers, ingredient_wants, ingredient_avoids })
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-outline-variant flex items-center justify-between">
          <button
            onClick={handleSkipAll}
            className="text-sm text-muted hover:text-on-surface transition-colors"
          >
            Skip all & use defaults
          </button>

          <div className="flex items-center gap-3">
            {currentStep > (hasPregnancyStep ? 0 : 1) && (
              <button
                onClick={handleBack}
                className="px-6 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-highest rounded-lg transition-colors"
              >
                Back
              </button>
            )}
            {currentStep > 0 && (
              <button
                onClick={handleSkip}
                className="px-6 py-2.5 text-sm font-medium text-muted hover:text-on-surface transition-colors"
              >
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-8 py-2.5 text-sm font-semibold bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity"
            >
              {currentStep === totalSteps ? "Save & Apply" : "Next"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Step Components

import type { AgeRange, SelfDescribedType, TexturePreference, FinishPreference, BudgetPreference } from "@/lib/refinement/types";

function StepAgeRange({
  value,
  onChange,
}: {
  value?: AgeRange;
  onChange: (value: AgeRange | undefined) => void;
}) {
  const options: { value: AgeRange; label: string }[] = [
    { value: "under_25", label: "Under 25" },
    { value: "25_34", label: "25-34" },
    { value: "35_44", label: "35-44" },
    { value: "45_54", label: "45-54" },
    { value: "55_plus", label: "55+" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-headline font-semibold text-on-surface">What's your age range?</h3>
        <p className="text-sm text-muted mt-2">
          Helps us prioritize prevention, maintenance, or targeted aging concerns.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(value === option.value ? undefined : option.value)}
            className={`px-6 py-4 rounded-lg text-sm font-medium transition-all ${
              value === option.value
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface hover:bg-surface-container-highest"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepSkinType({
  value,
  onChange,
}: {
  value?: SelfDescribedType;
  onChange: (value: SelfDescribedType | undefined) => void;
}) {
  const options: { value: SelfDescribedType; label: string }[] = [
    { value: "dry", label: "Dry" },
    { value: "oily", label: "Oily" },
    { value: "combination", label: "Combination" },
    { value: "normal", label: "Normal" },
    { value: "unsure", label: "Not sure" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-headline font-semibold text-on-surface">
          How would you describe your skin?
        </h3>
        <p className="text-sm text-muted mt-2">Used as a tiebreaker for texture preferences.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(value === option.value ? undefined : option.value)}
            className={`px-6 py-4 rounded-lg text-sm font-medium transition-all ${
              value === option.value
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface hover:bg-surface-container-highest"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepCleanserPreference({
  value,
  onChange,
}: {
  value?: TexturePreference;
  onChange: (value: TexturePreference | undefined) => void;
}) {
  const options: { value: TexturePreference; label: string; desc: string }[] = [
    { value: "foaming", label: "Foaming / Gel", desc: "Feels clean" },
    { value: "creamy", label: "Creamy / Milky", desc: "Feels gentle" },
    { value: "balm", label: "Balm / Oil", desc: "Removes makeup" },
    { value: "none", label: "No preference", desc: "Surprise me" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-headline font-semibold text-on-surface">
          What do you prefer in a cleanser?
        </h3>
      </div>
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(value === option.value ? undefined : option.value)}
            className={`w-full px-6 py-4 rounded-lg text-left transition-all ${
              value === option.value
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface hover:bg-surface-container-highest"
            }`}
          >
            <div className="font-medium">{option.label}</div>
            <div className={`text-sm mt-1 ${value === option.value ? "text-on-primary/80" : "text-muted"}`}>
              {option.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepMoisturizerPreference({
  texture,
  finish,
  onChange,
}: {
  texture?: TexturePreference;
  finish?: FinishPreference;
  onChange: (texture: TexturePreference | undefined, finish: FinishPreference | undefined) => void;
}) {
  const textureOptions: { value: TexturePreference; label: string }[] = [
    { value: "lightweight", label: "Lightweight / Fast-absorbing" },
    { value: "rich", label: "Rich / Nourishing" },
  ];

  const finishOptions: { value: FinishPreference; label: string }[] = [
    { value: "matte", label: "Matte finish (no shine)" },
    { value: "dewy", label: "Dewy finish (glowy)" },
    { value: "none", label: "No preference" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-headline font-semibold text-on-surface">
          What do you prefer in a moisturizer?
        </h3>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-on-surface">Texture</p>
        <div className="space-y-2">
          {textureOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(texture === option.value ? undefined : option.value, finish)}
              className={`w-full px-6 py-3 rounded-lg text-sm font-medium text-left transition-all ${
                texture === option.value
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container-highest"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-on-surface">Finish</p>
        <div className="space-y-2">
          {finishOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(texture, finish === option.value ? undefined : option.value)}
              className={`w-full px-6 py-3 rounded-lg text-sm font-medium text-left transition-all ${
                finish === option.value
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container-highest"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepBudgetPreference({
  value,
  onChange,
}: {
  value?: BudgetPreference;
  onChange: (value: BudgetPreference | undefined) => void;
}) {
  const options: { value: BudgetPreference; label: string; desc: string; range: string }[] = [
    { value: "essential", label: "Essential", desc: "Budget-friendly basics", range: "$6-16" },
    { value: "balanced", label: "Balanced", desc: "Mix of budget & core picks", range: "$12-35" },
    { value: "premium", label: "Premium", desc: "Best-in-class formulas", range: "$25-75" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-headline font-semibold text-on-surface">
          What's your budget preference?
        </h3>
      </div>
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(value === option.value ? undefined : option.value)}
            className={`w-full px-6 py-4 rounded-lg text-left transition-all ${
              value === option.value
                ? "bg-primary text-on-primary"
                : "bg-surface-container-low text-on-surface hover:bg-surface-container-highest"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{option.label}</div>
                <div className={`text-sm mt-1 ${value === option.value ? "text-on-primary/80" : "text-muted"}`}>
                  {option.desc}
                </div>
              </div>
              <div className={`text-sm font-mono ${value === option.value ? "text-on-primary/80" : "text-muted"}`}>
                {option.range}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepPregnancyCheck({
  value,
  onChange,
}: {
  value?: boolean;
  onChange: (value: boolean | undefined) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-headline font-semibold text-on-surface">
          Are you currently pregnant or breastfeeding?
        </h3>
        <p className="text-sm text-muted mt-2">
          Your routine includes actives that require safety screening. We'll filter products accordingly.
        </p>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => onChange(false)}
          className={`w-full px-6 py-4 rounded-lg text-left transition-all ${
            value === false
              ? "bg-primary text-on-primary"
              : "bg-surface-container-low text-on-surface hover:bg-surface-container-highest"
          }`}
        >
          <div className="font-medium">No</div>
          <div className={`text-sm mt-1 ${value === false ? "text-on-primary/80" : "text-muted"}`}>
            I can use all recommended actives
          </div>
        </button>
        <button
          onClick={() => onChange(true)}
          className={`w-full px-6 py-4 rounded-lg text-left transition-all ${
            value === true
              ? "bg-primary text-on-primary"
              : "bg-surface-container-low text-on-surface hover:bg-surface-container-highest"
          }`}
        >
          <div className="font-medium">Yes</div>
          <div className={`text-sm mt-1 ${value === true ? "text-on-primary/80" : "text-muted"}`}>
            Filter out pregnancy-restricted ingredients
          </div>
        </button>
      </div>
    </div>
  );
}

function StepIngredientPreferences({
  wants,
  avoids,
  onChange,
}: {
  wants?: string[];
  avoids?: string[];
  onChange: (wants: string[] | undefined, avoids: string[] | undefined) => void;
}) {
  const wantOptions = ["niacinamide", "hyaluronic_acid", "vitamin_c", "peptides", "ceramides"];
  const avoidOptions = ["fragrance", "essential_oils", "silicones", "alcohol"];

  const toggleWant = (ingredient: string) => {
    const current = wants || [];
    const updated = current.includes(ingredient)
      ? current.filter((i) => i !== ingredient)
      : [...current, ingredient];
    onChange(updated.length > 0 ? updated : undefined, avoids);
  };

  const toggleAvoid = (ingredient: string) => {
    const current = avoids || [];
    const updated = current.includes(ingredient)
      ? current.filter((i) => i !== ingredient)
      : [...current, ingredient];
    onChange(wants, updated.length > 0 ? updated : undefined);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-headline font-semibold text-on-surface">
          Any ingredient preferences?
        </h3>
        <p className="text-sm text-muted mt-2">Select any that apply (optional).</p>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-on-surface">Want to include:</p>
        <div className="flex flex-wrap gap-2">
          {wantOptions.map((ingredient) => (
            <button
              key={ingredient}
              onClick={() => toggleWant(ingredient)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                wants?.includes(ingredient)
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container-highest"
              }`}
            >
              {ingredient.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium text-on-surface">Avoid:</p>
        <div className="flex flex-wrap gap-2">
          {avoidOptions.map((ingredient) => (
            <button
              key={ingredient}
              onClick={() => toggleAvoid(ingredient)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                avoids?.includes(ingredient)
                  ? "bg-error text-white"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container-highest"
              }`}
            >
              {ingredient.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

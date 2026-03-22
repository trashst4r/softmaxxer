"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressHeader } from "./progress-header";
import { FaceUploadStep } from "./face-upload-step";
import { QuestionStep } from "./question-step";
import { TextInputStep } from "./text-input-step";
import { runAnalysis } from "@/lib/analysis-engine";
import { useDevMode } from "@/components/developer-mode-toggle";
import { useAccessState } from "@/lib/access-state";
import { TierContextBanner } from "@/components/shared/tier-context-banner";
import { setActiveRegimen } from "@/lib/app-state";
import type {
  AnalysisAnswers,
  SkinFeelAfterCleansing,
  MiddayOiliness,
  BreakoutFrequency,
  VisibleRedness,
  FlakingOrDryPatches,
  SensitivityLevel,
  PrimaryGoal,
  SpfUsage,
} from "@/types/analysis";

const TOTAL_STEPS = 11;

export function AnalysisShell() {
  const router = useRouter();
  const isDevMode = useDevMode();
  const [accessState] = useAccessState();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [answers, setAnswers] = useState<Partial<AnalysisAnswers>>({
    breakout_zones: [],
  });

  const updateAnswer = <K extends keyof AnalysisAnswers>(
    key: K,
    value: AnalysisAnswers[K]
  ) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final step - run analysis and navigate to results
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Validate that all required fields are filled (skip in dev mode)
    if (!isDevMode && !isAnswersComplete(answers)) {
      alert("Please complete all questions before submitting.");
      return;
    }

    // Run analysis (use mock answers if incomplete in dev mode)
    const completeAnswers = isDevMode ? getMockAnswers(answers) : (answers as AnalysisAnswers);
    const result = runAnalysis(completeAnswers);

    // Sprint D11: Save to app-state
    setActiveRegimen(result);

    // Store result in sessionStorage for results page (legacy)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("analysis_result", JSON.stringify(result));
    }

    // Navigate to results
    router.push("/results");
  };

  const isAnswersComplete = (ans: Partial<AnalysisAnswers>): ans is AnalysisAnswers => {
    return !!(
      ans.skin_feel_after_cleansing &&
      ans.midday_oiliness &&
      ans.breakout_frequency &&
      ans.breakout_zones !== undefined &&
      ans.visible_redness &&
      ans.flaking_or_dry_patches &&
      ans.current_active_use &&
      ans.sensitivity_level &&
      ans.primary_goal &&
      ans.spf_usage
    );
  };

  const canProceed = () => {
    // Dev mode: always allow proceeding
    if (isDevMode) return true;

    switch (currentStep) {
      case 1:
        return uploadedImage !== null;
      case 2:
        return !!answers.skin_feel_after_cleansing;
      case 3:
        return !!answers.midday_oiliness;
      case 4:
        return !!answers.breakout_frequency;
      case 5:
        return true; // Breakout zones can be empty
      case 6:
        return !!answers.visible_redness;
      case 7:
        return !!answers.flaking_or_dry_patches;
      case 8:
        return !!answers.current_active_use;
      case 9:
        return !!answers.sensitivity_level;
      case 10:
        return !!answers.primary_goal;
      case 11:
        return !!answers.spf_usage;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <ProgressHeader
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          title={getStepTitle(currentStep)}
        />

        {currentStep === 1 && (
          <TierContextBanner tier={accessState} context="analysis" />
        )}

        <div>
          {currentStep === 1 && (
            <FaceUploadStep
              onImageSelect={setUploadedImage}
              currentImage={uploadedImage}
            />
          )}

          {currentStep === 2 && (
            <QuestionStep
              question="How does your skin feel 5-10 minutes after cleansing (without products)?"
              description="Consider your bare skin immediately after washing, before applying any products."
              options={[
                {
                  value: "tight",
                  label: "Tight, Dry, or Uncomfortable",
                  description: "Skin feels taut, stretched, or like it needs immediate moisturizer. May feel like it's pulling when you make facial expressions."
                },
                {
                  value: "normal",
                  label: "Comfortable and Balanced",
                  description: "Skin feels soft and neutral. No tightness, no oiliness. Can comfortably wait 10-15 minutes before applying products."
                },
                {
                  value: "oily",
                  label: "Still Oily or Shiny",
                  description: "You can see or feel oil returning quickly. T-zone (forehead/nose) looks shiny or feels slick within 5-10 minutes of cleansing."
                },
              ]}
              value={answers.skin_feel_after_cleansing || ""}
              onChange={(v) => v && updateAnswer("skin_feel_after_cleansing", v as SkinFeelAfterCleansing)}
            />
          )}

          {currentStep === 3 && (
            <QuestionStep
              question="How much oil appears on your face by midday (4-6 hours after morning routine)?"
              description="Consider your skin around noon if you did your routine in the morning. Think about visible shine and how your skin feels to touch."
              options={[
                {
                  value: "low",
                  label: "Minimal to None",
                  description: "Skin looks matte or slightly dewy. No visible shine. Touching your forehead/nose with a finger doesn't leave noticeable oil."
                },
                {
                  value: "moderate",
                  label: "Moderate T-Zone Shine",
                  description: "Forehead, nose, and possibly chin show visible shine. Blotting papers pick up some oil. Cheeks remain relatively matte."
                },
                {
                  value: "high",
                  label: "Significant Overall Shine",
                  description: "Forehead, nose, cheeks, and chin all look visibly shiny or glossy. Touching your face leaves clear oil on your fingers. May need to blot multiple times."
                },
              ]}
              value={answers.midday_oiliness || ""}
              onChange={(v) => v && updateAnswer("midday_oiliness", v as MiddayOiliness)}
            />
          )}

          {currentStep === 4 && (
            <QuestionStep
              question="How often do you experience breakouts (pimples, whiteheads, cysts)?"
              description="Think about your typical month. Count all types of acne: small pimples, whiteheads, blackheads, deeper cysts."
              options={[
                {
                  value: "rare",
                  label: "Rare or Never",
                  description: "Less than once per month. Skin is generally clear. If you get a pimple, it's unusual and often tied to a specific trigger (stress, period, etc.)."
                },
                {
                  value: "occasional",
                  label: "Occasional",
                  description: "1-3 breakouts per month. You usually have 1-2 active spots at any time. Might flare around your cycle or stress periods."
                },
                {
                  value: "frequent",
                  label: "Frequent or Persistent",
                  description: "Multiple active breakouts most of the time. Usually have 3+ spots on your face. New breakouts appear before old ones fully heal."
                },
              ]}
              value={answers.breakout_frequency || ""}
              onChange={(v) => v && updateAnswer("breakout_frequency", v as BreakoutFrequency)}
            />
          )}

          {currentStep === 5 && (
            <QuestionStep
              question="Where do breakouts typically occur?"
              description="Select all areas where you regularly get breakouts. Skip this if you rarely get breakouts."
              multiSelect
              options={[
                { value: "forehead", label: "Forehead", description: "Upper face, hairline area" },
                { value: "cheeks", label: "Cheeks", description: "Mid-face, under eyes to mouth" },
                { value: "chin", label: "Chin", description: "Lower face center, below lips" },
                { value: "jawline", label: "Jawline", description: "Along jaw edge, near ears" },
                { value: "nose", label: "Nose", description: "Bridge, tip, or sides of nose" },
              ]}
              value={answers.breakout_zones || []}
              onChange={(v) => updateAnswer("breakout_zones", v as string[])}
            />
          )}

          {currentStep === 6 && (
            <QuestionStep
              question="How much visible redness do you have on your face?"
              description="Consider your baseline skin without makeup. Think about redness, flushing, or inflamed areas."
              options={[
                {
                  value: "low",
                  label: "Minimal or None",
                  description: "Skin tone is mostly even. No persistent red areas. You might flush briefly with temperature changes but it fades quickly."
                },
                {
                  value: "moderate",
                  label: "Moderate Redness",
                  description: "Noticeable redness in certain zones (cheeks, nose). May have visible capillaries. Skin flushes with heat, alcohol, or spicy food."
                },
                {
                  value: "high",
                  label: "Persistent or Widespread Redness",
                  description: "Significant redness across large areas (full cheeks, nose, forehead). May look flushed even when you feel calm. Visible broken capillaries or inflammation."
                },
              ]}
              value={answers.visible_redness || ""}
              onChange={(v) => v && updateAnswer("visible_redness", v as VisibleRedness)}
            />
          )}

          {currentStep === 7 && (
            <QuestionStep
              question="Do you experience visible flaking, peeling, or dry patches?"
              description="Consider your bare skin. Look for texture issues, rough patches, or areas that feel tight or uncomfortable."
              options={[
                {
                  value: "none",
                  label: "None",
                  description: "Skin texture is smooth. No flaking, peeling, or rough patches. Skin feels comfortable and hydrated throughout the day."
                },
                {
                  value: "mild",
                  label: "Mild or Occasional",
                  description: "Minor dry patches sometimes appear (around nose, between brows, or cheeks). Might see slight texture after cleansing or in dry weather. Moisturizer resolves it."
                },
                {
                  value: "clear",
                  label: "Clear or Frequent Flaking",
                  description: "Visible flaking, peeling, or rough texture regularly. Makeup may not sit smoothly. Areas feel tight or uncomfortable even with moisturizer."
                },
              ]}
              value={answers.flaking_or_dry_patches || ""}
              onChange={(v) => v && updateAnswer("flaking_or_dry_patches", v as FlakingOrDryPatches)}
            />
          )}

          {currentStep === 8 && (
            <TextInputStep
              question="What active ingredients are you currently using?"
              description="List any active ingredients in your current routine. We'll use this to assess your skin's tolerance and barrier health."
              placeholder="e.g., retinol, niacinamide, salicylic acid, vitamin C, azelaic acid..."
              value={answers.current_active_use || ""}
              onChange={(v) => updateAnswer("current_active_use", v)}
            />
          )}

          {currentStep === 9 && (
            <QuestionStep
              question="How sensitive is your skin to new products or ingredients?"
              description="Think about what happens when you try new skincare. Consider burning, stinging, itching, or redness reactions."
              options={[
                {
                  value: "low",
                  label: "Low Sensitivity",
                  description: "Skin tolerates most products well. Rarely experience burning, stinging, or reactions. Can introduce multiple new products without issues."
                },
                {
                  value: "moderate",
                  label: "Moderate Sensitivity",
                  description: "Occasional mild reactions to certain ingredients (fragrances, strong actives). Need to introduce products slowly. Some products cause temporary redness or tingling."
                },
                {
                  value: "high",
                  label: "High Sensitivity",
                  description: "Skin reacts easily to new products. Frequent burning, stinging, or redness with actives. Must patch test everything. Many products labeled 'gentle' still cause reactions."
                },
              ]}
              value={answers.sensitivity_level || ""}
              onChange={(v) => v && updateAnswer("sensitivity_level", v as SensitivityLevel)}
            />
          )}

          {currentStep === 10 && (
            <QuestionStep
              question="What is your primary skin goal right now?"
              description="Choose the single most important thing you want to address. This will influence the regimen priorities."
              options={[
                {
                  value: "acne",
                  label: "Clear Active Acne",
                  description: "Reduce breakouts, prevent new pimples, minimize inflammation. Main concern is active acne (not just scars or texture)."
                },
                {
                  value: "redness",
                  label: "Reduce Redness & Sensitivity",
                  description: "Calm flushing, reduce visible redness, strengthen barrier, minimize reactivity. Focus on soothing and calming."
                },
                {
                  value: "texture",
                  label: "Improve Texture & Tone",
                  description: "Smooth rough patches, refine pores, even out skin tone, reduce dullness. Focus on surface refinement."
                },
                {
                  value: "maintenance",
                  label: "Maintain Healthy Skin",
                  description: "Keep skin balanced and healthy. Preventative care, hydration, protection. No major active concerns."
                },
                {
                  value: "oil_control",
                  label: "Control Oil & Shine",
                  description: "Reduce excess sebum production, minimize shine, manage large pores. Main concern is oiliness throughout the day."
                },
              ]}
              value={answers.primary_goal || ""}
              onChange={(v) => v && updateAnswer("primary_goal", v as PrimaryGoal)}
            />
          )}

          {currentStep === 11 && (
            <QuestionStep
              question="How often do you apply SPF / sunscreen to your face?"
              description="Consider your actual daily behavior, not aspirational habits. This helps assess sun damage risk and active tolerance."
              options={[
                {
                  value: "never",
                  label: "Never or Rarely",
                  description: "Don't use sunscreen on your face, or only a few times per year. No dedicated SPF product in your routine."
                },
                {
                  value: "sometimes",
                  label: "Sometimes",
                  description: "Use SPF occasionally (2-4 times per week) or only when you know you'll be in direct sun for extended periods (beach, hiking, etc.)."
                },
                {
                  value: "daily",
                  label: "Daily or Near-Daily",
                  description: "Apply SPF every morning as part of your routine (or at least 5+ days per week). Have a dedicated face sunscreen product."
                },
              ]}
              value={answers.spf_usage || ""}
              onChange={(v) => v && updateAnswer("spf_usage", v as SpfUsage)}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-border">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="clinical-button-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="clinical-button disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {currentStep === TOTAL_STEPS ? "Complete Analysis" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

function getMockAnswers(partial: Partial<AnalysisAnswers>): AnalysisAnswers {
  // Fill in mock answers for any missing fields in dev mode
  return {
    skin_feel_after_cleansing: partial.skin_feel_after_cleansing || "normal",
    midday_oiliness: partial.midday_oiliness || "moderate",
    breakout_frequency: partial.breakout_frequency || "occasional",
    breakout_zones: partial.breakout_zones || ["forehead", "chin"],
    visible_redness: partial.visible_redness || "moderate",
    flaking_or_dry_patches: partial.flaking_or_dry_patches || "mild",
    current_active_use: partial.current_active_use || "none",
    sensitivity_level: partial.sensitivity_level || "moderate",
    primary_goal: partial.primary_goal || "maintenance",
    spf_usage: partial.spf_usage || "sometimes",
  };
}

function getStepTitle(step: number): string {
  const titles = [
    "Face Reference Upload",
    "Post-Cleansing Feel",
    "Midday Oiliness",
    "Breakout Frequency",
    "Breakout Zones",
    "Visible Redness",
    "Flaking & Dryness",
    "Current Actives",
    "Sensitivity Level",
    "Primary Goal",
    "SPF Usage",
  ];
  return titles[step - 1] || "";
}

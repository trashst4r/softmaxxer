/**
 * Sprint 24.5: Weekly Protocol Engine V2 - Canonical DiagnosticInput Integration
 * Direct generation from 12-question diagnostic schema
 */

import type { DiagnosticInput } from "@/types/diagnostic-input";
import type {
  WeeklyProtocol,
  ProtocolTargets,
  ProtocolConcern,
  ToleranceTier,
  BarrierState as ProtocolBarrierState,
  IngredientFamily,
  ProtocolDay,
  ProtocolStep,
  DayType,
} from "./protocol-types";
import {
  getFrequencyCap,
  requiresSpfForIngredient,
} from "./protocol-rules";

/**
 * Convert DiagnosticInput directly to ProtocolTargets (no intermediate numeric profile)
 */
export function deriveProtocolTargetsFromDiagnostic(input: DiagnosticInput): ProtocolTargets {
  // Map primary concern directly
  const concernMap: Record<string, ProtocolConcern> = {
    acne: "acne",
    pigmentation: "pigmentation",
    redness: "redness",
    texture: "texture",
    aging: "early-aging",
    dehydration: "dehydration",
  };

  const primaryConcern = concernMap[input.primaryConcern] || "barrier-repair";
  const secondaryConcern = input.secondaryConcern !== "none"
    ? concernMap[input.secondaryConcern]
    : undefined;

  // Map barrier state
  const barrierStateMap: Record<string, ProtocolBarrierState> = {
    calm: "robust",
    slightly_sensitive: "sensitive",
    irritated: "compromised",
    damaged: "compromised",
  };
  const barrierState = barrierStateMap[input.barrierState] || "stable";

  // Calculate tolerance tier from multiple inputs
  let toleranceTier: ToleranceTier = "beginner";

  // Safety override
  if (input.barrierState === "irritated" || input.barrierState === "damaged") {
    toleranceTier = "beginner";
  }
  // Advanced
  else if (
    input.sensitivity === "rarely_reacts" &&
    input.activesExperience === "advanced" &&
    input.barrierState === "calm"
  ) {
    toleranceTier = "advanced";
  }
  // Moderate
  else if (
    input.sensitivity === "sometimes_irritated" &&
    (input.activesExperience === "regular" || input.activesExperience === "occasional")
  ) {
    toleranceTier = "moderate";
  }
  // Cautious
  else if (
    input.sensitivity === "often_reactive" ||
    input.barrierState === "slightly_sensitive" ||
    input.activesExperience === "occasional"
  ) {
    toleranceTier = "cautious";
  }

  // Map oil profile
  const oilProfileMap: Record<string, "dry" | "balanced" | "oily"> = {
    dry: "dry",
    balanced: "balanced",
    combination: "balanced", // Treat combination as balanced for protocol purposes
    oily: "oily",
  };
  const oilProfile = oilProfileMap[input.oilProfile] || "balanced";

  // Map breakout intensity
  const breakoutMap: Record<string, "none" | "mild" | "moderate" | "severe"> = {
    none: "none",
    occasional: "mild",
    comedonal: "moderate",
    inflamed: "moderate",
    cystic: "severe",
  };
  const breakoutIntensity = breakoutMap[input.breakoutPattern] || "none";

  // Map redness level (from sensitivity + primary concern)
  let rednessLevel: "none" | "mild" | "moderate" | "severe" = "none";
  if (input.primaryConcern === "redness") {
    rednessLevel = input.sensitivity === "often_reactive" ? "severe"
      : input.sensitivity === "sometimes_irritated" ? "moderate"
      : "mild";
  } else if (input.sensitivity === "often_reactive") {
    rednessLevel = "moderate";
  } else if (input.sensitivity === "sometimes_irritated") {
    rednessLevel = "mild";
  }

  // Map SPF reliability
  const spfMap: Record<string, "poor" | "inconsistent" | "reliable"> = {
    never: "poor",
    sometimes: "inconsistent",
    daily: "reliable",
  };
  const spfReliability = spfMap[input.spfCompliance] || "poor";

  // Determine actives experience
  const activesExperience = input.activesExperience !== "never";

  // Sensitive skin flag
  const sensitiveSkin = input.sensitivity === "often_reactive" || input.barrierState !== "calm";

  return {
    primaryConcern,
    secondaryConcern,
    barrierState,
    toleranceTier,
    oilProfile,
    breakoutIntensity,
    rednessLevel,
    activesExperience,
    spfReliability,
    sensitiveSkin,
  };
}

/**
 * Select hero active from DiagnosticInput (moved from protocol-engine-v2.ts)
 */
function selectHeroActive(input: DiagnosticInput, targets: ProtocolTargets): IngredientFamily {
  const { barrierState, spfReliability, toleranceTier } = targets;
  const { primaryConcern, breakoutPattern, sunSensitivity } = input;

  // Safety override: barrier compromised or damaged
  if (input.barrierState === "irritated" || input.barrierState === "damaged") {
    return "barrier-support";
  }

  // Calculate PIH risk
  const pigmentRisk =
    sunSensitivity === "burns_easily" ? "high" :
    sunSensitivity === "never_burns" ? "very_high" :
    "moderate";

  switch (primaryConcern) {
    case "acne":
      return selectAcneActive(breakoutPattern, input.barrierState, pigmentRisk, toleranceTier);

    case "pigmentation":
      if (spfReliability === "poor") return "niacinamide";
      if (pigmentRisk === "high" || pigmentRisk === "very_high") return "azelaic-acid";
      if (toleranceTier === "advanced" && spfReliability === "reliable") return "vitamin-c";
      return "azelaic-acid";

    case "texture":
      if (spfReliability === "poor") return "niacinamide";
      if (toleranceTier === "beginner" || toleranceTier === "cautious") return "lactic-acid";
      if (toleranceTier === "moderate") return "glycolic-acid";
      if (spfReliability === "reliable") return "retinoid";
      return "glycolic-acid";

    case "aging":
      if (spfReliability === "poor") return "peptides";
      if (barrierState === "sensitive" || toleranceTier === "beginner") return "peptides";
      return "retinoid";

    case "redness":
      return "azelaic-acid";

    case "dehydration":
      return "hydrating-serum";

    default:
      return "niacinamide";
  }
}

function selectAcneActive(
  breakoutPattern: string,
  barrierState: string,
  pigmentRisk: "low" | "moderate" | "high" | "very_high",
  toleranceTier: ToleranceTier
): IngredientFamily {
  // High PIH risk → avoid BP
  if (pigmentRisk === "high" || pigmentRisk === "very_high") {
    return "azelaic-acid";
  }

  switch (breakoutPattern) {
    case "comedonal":
      return "salicylic-acid";

    case "inflamed":
      if (barrierState === "slightly_sensitive" || toleranceTier === "beginner") {
        return "azelaic-acid";
      }
      return "benzoyl-peroxide";

    case "cystic":
      if (toleranceTier === "beginner" || toleranceTier === "cautious") {
        return "azelaic-acid";
      }
      return "adapalene-retinoid";

    case "occasional":
      return "niacinamide";

    default:
      return "niacinamide";
  }
}

/**
 * Select support active if secondary concern exists
 */
function selectSupportActive(
  input: DiagnosticInput,
  targets: ProtocolTargets,
  heroActive: IngredientFamily
): IngredientFamily | undefined {
  if (!targets.secondaryConcern) return undefined;

  const { spfReliability } = targets;

  switch (targets.secondaryConcern) {
    case "acne":
      if (heroActive !== "niacinamide") return "niacinamide";
      return undefined;

    case "pigmentation":
      if (spfReliability === "reliable" && heroActive !== "azelaic-acid") {
        return "azelaic-acid";
      }
      if (heroActive !== "niacinamide") return "niacinamide";
      return undefined;

    case "redness":
      if (heroActive !== "azelaic-acid") return "azelaic-acid";
      return undefined;

    case "dehydration":
      if (heroActive !== "hydrating-serum") return "hydrating-serum";
      return undefined;

    case "early-aging":
      if (heroActive !== "peptides" && targets.barrierState !== "compromised") {
        return "peptides";
      }
      return undefined;

    default:
      return undefined;
  }
}

/**
 * Build base AM routine (consistent across all days)
 */
function buildBaseAMRoutine(targets: ProtocolTargets, heroActive: IngredientFamily): ProtocolStep[] {
  const steps: ProtocolStep[] = [];

  steps.push({
    order: 1,
    category: "cleanse",
    ingredientFamily: "gentle-cleanser",
    purpose: "Remove overnight buildup without stripping",
    intensity: "gentle",
  });

  if (targets.spfReliability === "reliable" && heroActive !== "vitamin-c") {
    steps.push({
      order: 2,
      category: "treat",
      ingredientFamily: "vitamin-c",
      purpose: "Antioxidant protection and brightening",
      intensity: "moderate",
      cautionNote: "Requires consistent SPF",
    });
  }

  steps.push({
    order: 3,
    category: "support",
    ingredientFamily: "hydrating-serum",
    purpose: "Hydration layer for barrier support",
    intensity: "gentle",
  });

  steps.push({
    order: 4,
    category: "moisturize",
    ingredientFamily: "moisturizer",
    purpose: "Seal in hydration",
    intensity: "gentle",
  });

  steps.push({
    order: 5,
    category: "protect",
    ingredientFamily: "sunscreen",
    purpose: "UV protection essential for all actives",
    intensity: "gentle",
    cautionNote: "Non-negotiable for active use",
  });

  return steps;
}

/**
 * Build PM routine for specific day type
 */
function buildPMRoutine(
  dayType: DayType,
  targets: ProtocolTargets,
  heroActive: IngredientFamily,
  supportActive?: IngredientFamily
): ProtocolStep[] {
  const steps: ProtocolStep[] = [];

  steps.push({
    order: 1,
    category: "cleanse",
    ingredientFamily: targets.oilProfile === "oily" ? "salicylic-acid" : "gentle-cleanser",
    purpose: targets.oilProfile === "oily" ? "Oil control + light exfoliation" : "Remove SPF and buildup",
    intensity: targets.oilProfile === "oily" ? "moderate" : "gentle",
  });

  if (dayType === "active") {
    const heroIntensity =
      heroActive.includes("retinoid") || heroActive.includes("exfoliating") ? "strong" :
      heroActive.includes("acid") || heroActive.includes("peroxide") ? "moderate" :
      "gentle";

    steps.push({
      order: 2,
      category: "treat",
      ingredientFamily: heroActive,
      purpose: `Primary treatment for ${targets.primaryConcern}`,
      intensity: heroIntensity,
      cautionNote: heroIntensity === "strong" ? "Build tolerance gradually" : undefined,
    });
  }

  if (dayType === "maintenance" && supportActive) {
    steps.push({
      order: 3,
      category: "support",
      ingredientFamily: supportActive,
      purpose: "Supportive treatment on maintenance day",
      intensity: "gentle",
    });
  } else if (dayType === "recovery" || dayType === "barrier-repair") {
    steps.push({
      order: 3,
      category: "support",
      ingredientFamily: "barrier-support",
      purpose: "Barrier recovery and repair",
      intensity: "gentle",
    });
  } else {
    steps.push({
      order: 3,
      category: "support",
      ingredientFamily: "hydrating-serum",
      purpose: "Hydration support",
      intensity: "gentle",
    });
  }

  const isRichMoisturizerDay = dayType === "active" || targets.oilProfile === "dry";
  steps.push({
    order: 4,
    category: "moisturize",
    ingredientFamily: "moisturizer",
    purpose: isRichMoisturizerDay ? "Buffer and support barrier" : "Seal in treatment",
    intensity: "gentle",
  });

  return steps;
}

/**
 * Distribute active days across week with proper recovery spacing
 */
function distributeActiveDays(frequency: number, minRecoveryDays: number): number[] {
  if (frequency >= 7) return [1, 2, 3, 4, 5, 6, 7];
  if (frequency === 0) return [];

  const spacing = Math.floor(7 / frequency);
  const days: number[] = [];

  for (let i = 0; i < frequency; i++) {
    const day = 1 + i * spacing;
    if (day <= 7) days.push(day);
  }

  return days;
}

/**
 * Calculate risk level for protocol day
 */
function calculateDayRisk(
  dayType: DayType,
  heroActive: IngredientFamily,
  targets: ProtocolTargets
): { riskLevel: "low" | "moderate" | "elevated" | "high"; riskReason?: string } {
  if (dayType === "recovery" || dayType === "maintenance") {
    return { riskLevel: "low" };
  }

  if (dayType === "barrier-repair") {
    return { riskLevel: "low", riskReason: "Gentle barrier support only" };
  }

  let risk: "low" | "moderate" | "elevated" | "high" = "low";
  const reasons: string[] = [];

  if (dayType === "active") {
    risk = "moderate";
  }

  if (targets.barrierState === "compromised") {
    risk = "high";
    reasons.push("Compromised barrier increases irritation risk");
  } else if (targets.barrierState === "sensitive") {
    if (risk === "moderate") risk = "elevated";
    reasons.push("Sensitive barrier requires careful monitoring");
  }

  if (requiresSpfForIngredient(heroActive) && targets.spfReliability === "poor") {
    risk = "high";
    reasons.push("Photosensitizing active without reliable SPF");
  } else if (requiresSpfForIngredient(heroActive) && targets.spfReliability === "inconsistent") {
    if (risk === "moderate") risk = "elevated";
    reasons.push("Inconsistent SPF use with photosensitizing active");
  }

  const strongActives: IngredientFamily[] = ["adapalene-retinoid", "exfoliating-acid", "retinoid", "glycolic-acid"];
  if (strongActives.includes(heroActive)) {
    if (risk === "moderate") risk = "elevated";
    if (targets.toleranceTier === "beginner") {
      reasons.push("Strong active with beginner tolerance");
    }
  }

  if (targets.sensitiveSkin && dayType === "active") {
    if (risk === "moderate") risk = "elevated";
    reasons.push("Sensitive skin requires close monitoring");
  }

  return {
    riskLevel: risk,
    riskReason: reasons.length > 0 ? reasons.join(". ") : undefined,
  };
}

/**
 * Generate day label, rationale, purpose, etc. (copied from original)
 */
function getDayLabel(dayType: DayType, dayNumber: number): string {
  switch (dayType) {
    case "active": return `Active Treatment`;
    case "maintenance": return `Maintenance`;
    case "recovery": return `Recovery Day`;
    case "barrier-repair": return `Barrier Repair`;
    default: return `Day ${dayNumber}`;
  }
}

function getDayRationale(dayType: DayType, heroActive: IngredientFamily, concern: ProtocolConcern): string {
  switch (dayType) {
    case "active":
      return `Applying ${heroActive} to directly target ${concern}. Strong actives require recovery spacing.`;
    case "maintenance":
      return `Maintenance day with gentle support. Keeps skin stable between active treatments.`;
    case "recovery":
      return `Full recovery day focusing on barrier repair and hydration. Prepares skin for next active cycle.`;
    case "barrier-repair":
      return `Barrier compromised - focusing exclusively on gentle repair before introducing actives.`;
    default:
      return `Standard maintenance routine.`;
  }
}

function getDayPurpose(dayType: DayType, heroActive: IngredientFamily): string {
  switch (dayType) {
    case "active":
      if (heroActive.includes("retinoid")) return "Renew and resurface";
      if (heroActive.includes("acid") || heroActive.includes("exfoliating")) return "Exfoliate and refine";
      if (heroActive.includes("peroxide")) return "Target breakouts";
      if (heroActive.includes("azelaic")) return "Calm and brighten";
      return "Active treatment";
    case "recovery": return "Restore and strengthen";
    case "maintenance": return "Support and protect";
    case "barrier-repair": return "Heal barrier damage";
    default: return "Maintain routine";
  }
}

function getWhyThisDay(dayType: DayType, heroActive: IngredientFamily, concern: ProtocolConcern, dayNumber: number, frequency: number): string {
  switch (dayType) {
    case "active":
      return `Day ${dayNumber} applies ${heroActive.replace(/-/g, " ")} to directly address ${concern}. This is one of ${frequency} treatment days per week, spaced to allow recovery between applications.`;
    case "recovery":
      return `Day ${dayNumber} is a full recovery day. Your skin needs downtime after active treatment to rebuild and strengthen. Skipping recovery leads to barrier damage.`;
    case "maintenance":
      return `Day ${dayNumber} maintains progress without aggressive actives. Gentle support keeps skin stable between treatment days.`;
    case "barrier-repair":
      return `Day ${dayNumber} focuses exclusively on barrier repair. Your skin is compromised and needs gentle restoration before introducing actives.`;
    default:
      return `Day ${dayNumber} follows your standard routine.`;
  }
}

function getDayCaution(heroActive: IngredientFamily): string | undefined {
  if (heroActive.includes("retinoid")) {
    return "Do not layer with vitamin C or exfoliating acids tonight. Expect mild flaking days 2-4 after use. This is normal.";
  }
  if (heroActive.includes("exfoliating") || heroActive.includes("glycolic")) {
    return "Do not use retinoids or additional acids tonight. Over-exfoliation causes lasting barrier damage.";
  }
  if (heroActive.includes("benzoyl-peroxide")) {
    return "Benzoyl peroxide bleaches fabric. Use white towels and pillowcases. Do not combine with retinoids tonight.";
  }
  if (heroActive.includes("azelaic")) {
    return "May cause mild tingling on first use. This subsides with continued use. Avoid layering with strong acids.";
  }
  return undefined;
}

function getExpectedOutcome(dayType: DayType, heroActive: IngredientFamily): string {
  switch (dayType) {
    case "active":
      if (heroActive.includes("retinoid")) {
        return "Skin may feel slightly tight or look pink. Mild flaking is expected 2-3 days later.";
      }
      if (heroActive.includes("exfoliating") || heroActive.includes("glycolic") || heroActive.includes("lactic")) {
        return "Skin feels smooth immediately. Some redness may occur. Brightening visible within 3-5 days.";
      }
      if (heroActive.includes("peroxide")) {
        return "Active breakouts dry out faster. New breakouts may surface (purging). Redness fades quickly.";
      }
      if (heroActive.includes("azelaic")) {
        return "Redness calms within hours. Skin tone looks more even. Dark spots begin fading gradually.";
      }
      return "Active ingredient working on target concern.";
    case "recovery":
      return "Skin feels hydrated and calm. Any irritation from treatment day subsides. Barrier strengthens.";
    case "maintenance":
      return "Skin stays balanced and comfortable. Progress maintained without additional stress.";
    case "barrier-repair":
      return "Tightness and sensitivity reduce. Skin feels softer and more resilient day by day.";
    default:
      return "Routine maintains current skin state.";
  }
}

function buildSafetyNotes(targets: ProtocolTargets, hero: IngredientFamily, support?: IngredientFamily): string[] {
  const notes: string[] = [];

  if (requiresSpfForIngredient(hero)) {
    notes.push("Consistent SPF use is non-negotiable with this protocol. Skipping SPF risks hyperpigmentation.");
  }

  if (hero === "adapalene-retinoid" || hero === "retinoid") {
    notes.push("Start slowly with retinoids. Expect mild flaking in weeks 2-4. Do not use if pregnant/nursing.");
  }

  if (hero === "exfoliating-acid" || hero === "salicylic-acid" || hero === "glycolic-acid") {
    notes.push("Over-exfoliation causes barrier damage. Stick to prescribed frequency even if skin feels fine.");
  }

  if (targets.barrierState === "compromised" || targets.barrierState === "sensitive") {
    notes.push("Your barrier is fragile. Pause all actives if you experience stinging, burning, or increased redness.");
  }

  if (hero === "benzoyl-peroxide" || support === "benzoyl-peroxide") {
    notes.push("Benzoyl peroxide can bleach fabrics. Use white towels and pillowcases.");
  }

  return notes;
}

function buildExpectedTimeline(concern: ProtocolConcern, barrierState: ProtocolBarrierState): string {
  if (barrierState === "compromised") {
    return "2-3 weeks for barrier recovery, then gradual active introduction over 4-6 weeks. Visible results at 8-12 weeks.";
  }

  switch (concern) {
    case "acne":
      return "Purging possible in weeks 2-4. Breakout reduction at 6-8 weeks. Sustained improvement at 12+ weeks.";
    case "pigmentation":
      return "Gradual fading over 8-12 weeks. Dark spots can take 3-6 months for significant improvement.";
    case "redness":
      return "Calming effects within 2-3 weeks. Sustained redness reduction at 6-8 weeks.";
    case "dehydration":
      return "Immediate plumping within days. Barrier restoration at 2-4 weeks.";
    case "texture":
      return "Smoothing visible at 4-6 weeks. Continued refinement over 12+ weeks.";
    case "early-aging":
      return "Texture improvement at 6-8 weeks. Fine line softening at 12+ weeks. Preventative benefits accumulate over months.";
    default:
      return "6-8 weeks for initial changes. 12+ weeks for sustained improvement.";
  }
}

/**
 * Main entry: Generate weekly protocol from DiagnosticInput
 */
export function generateWeeklyProtocolFromDiagnostic(input: DiagnosticInput): WeeklyProtocol {
  const targets = deriveProtocolTargetsFromDiagnostic(input);
  const heroActive = selectHeroActive(input, targets);
  const supportActive = selectSupportActive(input, targets, heroActive);

  const heroCap = getFrequencyCap(heroActive, targets.toleranceTier);
  const heroFrequency = heroCap?.maxPerWeek || 3;
  const minRecoveryDays = heroCap?.minRecoveryDays || 1;

  const activeDayIndices = distributeActiveDays(heroFrequency, minRecoveryDays);

  const days: ProtocolDay[] = [];
  let activeDayCount = 0;
  let recoveryDayCount = 0;

  for (let i = 1; i <= 7; i++) {
    const isActiveDay = activeDayIndices.includes(i);
    const dayType: DayType =
      targets.barrierState === "compromised" ? "barrier-repair" :
      isActiveDay ? "active" :
      i === 7 ? "recovery" :
      "maintenance";

    if (dayType === "active") activeDayCount++;
    if (dayType === "recovery") recoveryDayCount++;

    const am = buildBaseAMRoutine(targets, heroActive);
    const pm = buildPMRoutine(dayType, targets, heroActive, supportActive);

    const { riskLevel, riskReason } = calculateDayRisk(dayType, heroActive, targets);

    days.push({
      dayNumber: i as 1 | 2 | 3 | 4 | 5 | 6 | 7,
      dayType,
      label: getDayLabel(dayType, i),
      am,
      pm,
      rationale: getDayRationale(dayType, heroActive, targets.primaryConcern),
      purpose: getDayPurpose(dayType, heroActive),
      whyThisDay: getWhyThisDay(dayType, heroActive, targets.primaryConcern, i, heroFrequency),
      caution: dayType === "active" ? getDayCaution(heroActive) : undefined,
      expectedOutcome: getExpectedOutcome(dayType, heroActive),
      riskLevel,
      riskReason,
    });
  }

  const protocolId = `${targets.primaryConcern}-${targets.toleranceTier}-${heroActive}-${heroFrequency}`;

  const keyPrinciples = [
    `${heroFrequency}x weekly ${heroActive} for ${targets.primaryConcern}`,
    `${minRecoveryDays} day${minRecoveryDays > 1 ? "s" : ""} recovery between active treatments`,
    `Barrier support on ${7 - activeDayCount} maintenance/recovery days`,
  ];

  if (supportActive) {
    keyPrinciples.push(`${supportActive} for additional support`);
  }

  const safetyNotes = buildSafetyNotes(targets, heroActive, supportActive);
  const expectedTimeline = buildExpectedTimeline(targets.primaryConcern, targets.barrierState);

  return {
    protocolId,
    primaryConcern: targets.primaryConcern,
    secondaryConcern: targets.secondaryConcern,
    toleranceTier: targets.toleranceTier,
    barrierState: targets.barrierState,
    heroActive,
    supportActive,
    days,
    summary: {
      totalActiveDays: activeDayCount,
      totalRecoveryDays: recoveryDayCount,
      heroActiveFrequency: heroFrequency,
      supportActiveFrequency: supportActive ? 7 - activeDayCount : undefined,
      keyPrinciples,
    },
    safetyNotes,
    expectedTimeline,
  };
}

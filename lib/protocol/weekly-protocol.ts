/**
 * Weekly Protocol Engine - Main Scheduler
 * Sprint 20: Deterministic weekly protocol generation from skin profile
 */

import type { SkinProfile } from "@/lib/scoring/types";
import type {
  WeeklyProtocol,
  ProtocolTargets,
  ProtocolConcern,
  ToleranceTier,
  BarrierState,
  IngredientFamily,
  ProtocolDay,
  ProtocolStep,
  DayType,
} from "./protocol-types";
import {
  FREQUENCY_CAPS,
  getFrequencyCap,
  hasConflict,
  isAllowedForBarrier,
  requiresSpfForIngredient,
} from "./protocol-rules";

/**
 * Convert SkinProfile to ProtocolTargets
 */
export function deriveProtocolTargets(profile: SkinProfile): ProtocolTargets {
  // Map SkinProfile fields to concerns with derived scores
  // profile.acne: 0 = clear, 100 = severe breakouts
  // profile.oil: 0 = dry/tight, 100 = very oily
  // profile.barrier: 0 = compromised, 100 = strong
  // profile.sensitivity: 0 = tolerant, 100 = highly reactive
  // profile.tolerance: 0 = can't handle actives, 100 = high tolerance
  // profile.uvRisk: 0 = daily SPF, 100 = never uses SPF

  const concerns: { concern: ProtocolConcern; score: number }[] = [
    { concern: "acne", score: profile.acne },
    { concern: "dehydration", score: profile.oil < 30 ? 100 - profile.oil : 0 }, // Low oil = dehydration
    { concern: "redness", score: profile.sensitivity }, // High sensitivity often = redness
    { concern: "texture", score: profile.acne > 50 ? profile.acne * 0.6 : 0 }, // Acne contributes to texture
    { concern: "early-aging", score: profile.tolerance < 30 && profile.barrier < 50 ? 40 : 0 }, // Low tolerance/barrier = aging concern
  ];

  // Sort by severity
  concerns.sort((a, b) => b.score - a.score);
  const primaryConcern = concerns[0].concern;
  const secondaryConcern = concerns[1].score >= 30 ? concerns[1].concern : undefined;

  // Determine barrier state
  let barrierState: BarrierState;
  if (profile.barrier < 40) {
    barrierState = "compromised";
  } else if (profile.barrier < 60) {
    barrierState = "sensitive";
  } else if (profile.barrier < 80) {
    barrierState = "stable";
  } else {
    barrierState = "robust";
  }

  // Determine tolerance tier
  let toleranceTier: ToleranceTier;
  const hasActivesExperience = profile.tolerance > 40;

  if (barrierState === "compromised") {
    toleranceTier = "beginner";
  } else if (!hasActivesExperience) {
    toleranceTier = "beginner";
  } else if (profile.sensitivity > 60) {
    toleranceTier = "cautious";
  } else if (profile.barrier > 70 && profile.tolerance > 60) {
    toleranceTier = "advanced";
  } else {
    toleranceTier = "moderate";
  }

  // Map profile fields to targets
  const oilProfile: "dry" | "balanced" | "oily" =
    profile.oil < 40 ? "dry" : profile.oil > 60 ? "oily" : "balanced";

  const breakoutIntensity: "none" | "mild" | "moderate" | "severe" =
    profile.acne < 20
      ? "none"
      : profile.acne < 50
      ? "mild"
      : profile.acne < 75
      ? "moderate"
      : "severe";

  const rednessLevel: "none" | "mild" | "moderate" | "severe" =
    profile.sensitivity < 20
      ? "none"
      : profile.sensitivity < 50
      ? "mild"
      : profile.sensitivity < 75
      ? "moderate"
      : "severe";

  const spfReliability: "poor" | "inconsistent" | "reliable" =
    profile.uvRisk > 60 ? "poor" : profile.uvRisk > 30 ? "inconsistent" : "reliable";

  return {
    primaryConcern,
    secondaryConcern,
    barrierState,
    toleranceTier,
    oilProfile,
    breakoutIntensity,
    rednessLevel,
    activesExperience: hasActivesExperience,
    spfReliability,
    sensitiveSkin: profile.sensitivity > 60,
  };
}

/**
 * Select hero active ingredient based on primary concern and constraints
 */
function selectHeroActive(
  targets: ProtocolTargets
): { hero: IngredientFamily; support?: IngredientFamily } {
  const { primaryConcern, barrierState, spfReliability } = targets;

  // If barrier compromised, no strong actives
  if (barrierState === "compromised") {
    return { hero: "niacinamide" };
  }

  // SPF-dependent actives require reliable SPF
  const canUseSpfDependentActives = spfReliability === "reliable";

  switch (primaryConcern) {
    case "acne":
      if (targets.breakoutIntensity === "severe") {
        return { hero: "adapalene-retinoid", support: "benzoyl-peroxide" };
      } else if (targets.oilProfile === "oily") {
        return { hero: "salicylic-acid", support: "niacinamide" };
      } else {
        return { hero: "benzoyl-peroxide", support: "niacinamide" };
      }

    case "pigmentation":
      if (canUseSpfDependentActives) {
        return { hero: "azelaic-acid", support: "vitamin-c" };
      } else {
        return { hero: "niacinamide", support: "azelaic-acid" };
      }

    case "redness":
      return { hero: "azelaic-acid", support: "niacinamide" };

    case "dehydration":
      return { hero: "hydrating-serum", support: "niacinamide" };

    case "texture":
      if (canUseSpfDependentActives && barrierState !== "sensitive") {
        return { hero: "exfoliating-acid", support: "niacinamide" };
      } else {
        return { hero: "salicylic-acid", support: "niacinamide" };
      }

    case "early-aging":
      if (canUseSpfDependentActives) {
        return { hero: "adapalene-retinoid", support: "vitamin-c" };
      } else {
        return { hero: "copper-peptides", support: "niacinamide" };
      }

    case "barrier-repair":
      return { hero: "barrier-support", support: "niacinamide" };

    default:
      return { hero: "niacinamide" };
  }
}

/**
 * Build base AM routine (consistent across all days)
 */
function buildBaseAMRoutine(targets: ProtocolTargets, heroActive: IngredientFamily): ProtocolStep[] {
  const steps: ProtocolStep[] = [];

  // 1. Cleanse
  steps.push({
    order: 1,
    category: "cleanse",
    ingredientFamily: "gentle-cleanser",
    purpose: "Remove overnight buildup without stripping",
    intensity: "gentle",
  });

  // 2. Vitamin C (if appropriate and SPF reliable)
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

  // 3. Hydration
  steps.push({
    order: 3,
    category: "support",
    ingredientFamily: "hydrating-serum",
    purpose: "Hydration layer for barrier support",
    intensity: "gentle",
  });

  // 4. Moisturize
  steps.push({
    order: 4,
    category: "moisturize",
    ingredientFamily: "moisturizer",
    purpose: "Seal in hydration",
    intensity: "gentle",
  });

  // 5. SPF (non-negotiable)
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
 * Build PM routine for a specific day type
 */
function buildPMRoutine(
  dayType: DayType,
  targets: ProtocolTargets,
  heroActive: IngredientFamily,
  supportActive?: IngredientFamily
): ProtocolStep[] {
  const steps: ProtocolStep[] = [];

  // 1. Cleanse (always)
  steps.push({
    order: 1,
    category: "cleanse",
    ingredientFamily: targets.oilProfile === "oily" ? "salicylic-acid" : "gentle-cleanser",
    purpose: targets.oilProfile === "oily" ? "Oil control + light exfoliation" : "Remove SPF and buildup",
    intensity: targets.oilProfile === "oily" ? "moderate" : "gentle",
  });

  // 2. Active treatment (if active day)
  if (dayType === "active") {
    // Hero active
    const heroIntensity = heroActive.includes("retinoid") || heroActive.includes("exfoliating")
      ? "strong"
      : heroActive.includes("acid") || heroActive.includes("peroxide")
      ? "moderate"
      : "gentle";

    steps.push({
      order: 2,
      category: "treat",
      ingredientFamily: heroActive,
      purpose: `Primary treatment for ${targets.primaryConcern}`,
      intensity: heroIntensity,
      cautionNote: heroIntensity === "strong" ? "Build tolerance gradually" : undefined,
    });
  }

  // 3. Support active or hydration
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

  // 4. Moisturize (always)
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
 * Generate deterministic 7-day weekly protocol
 */
export function generateWeeklyProtocol(profile: SkinProfile): WeeklyProtocol {
  const targets = deriveProtocolTargets(profile);
  const { hero, support } = selectHeroActive(targets);

  // Get frequency cap for hero active
  const heroCap = getFrequencyCap(hero, targets.toleranceTier);
  const heroFrequency = heroCap?.maxPerWeek || 3;
  const minRecoveryDays = heroCap?.minRecoveryDays || 1;

  // Calculate active days layout with proper spacing
  const activeDayIndices = distributeActiveDays(heroFrequency, minRecoveryDays);

  // Build 7-day protocol
  const days: ProtocolDay[] = [];
  let activeDayCount = 0;
  let recoveryDayCount = 0;

  for (let i = 1; i <= 7; i++) {
    const isActiveDay = activeDayIndices.includes(i);
    const dayType: DayType = targets.barrierState === "compromised"
      ? "barrier-repair"
      : isActiveDay
      ? "active"
      : i === 7
      ? "recovery"
      : "maintenance";

    if (dayType === "active") activeDayCount++;
    if (dayType === "recovery") recoveryDayCount++;

    const am = buildBaseAMRoutine(targets, hero);
    const pm = buildPMRoutine(dayType, targets, hero, support);

    days.push({
      dayNumber: i as 1 | 2 | 3 | 4 | 5 | 6 | 7,
      dayType,
      label: getDayLabel(dayType, i),
      am,
      pm,
      rationale: getDayRationale(dayType, hero, targets.primaryConcern),
      // Sprint 21: Human-readable translation
      purpose: getDayPurpose(dayType, hero, targets.primaryConcern),
      whyThisDay: getWhyThisDay(dayType, hero, targets.primaryConcern, i, heroFrequency),
      caution: dayType === "active" ? getDayCaution(hero) : undefined,
      expectedOutcome: getExpectedOutcome(dayType, hero, targets.primaryConcern),
    });
  }

  // Generate protocol ID (deterministic based on inputs)
  const protocolId = `${targets.primaryConcern}-${targets.toleranceTier}-${hero}-${heroFrequency}`;

  // Build summary
  const keyPrinciples = [
    `${heroFrequency}x weekly ${hero} for ${targets.primaryConcern}`,
    `${minRecoveryDays} day${minRecoveryDays > 1 ? "s" : ""} recovery between active treatments`,
    `Barrier support on ${7 - activeDayCount} maintenance/recovery days`,
  ];

  if (support) {
    keyPrinciples.push(`${support} for additional support`);
  }

  const safetyNotes = buildSafetyNotes(targets, hero, support);
  const expectedTimeline = buildExpectedTimeline(targets.primaryConcern, targets.barrierState);

  return {
    protocolId,
    primaryConcern: targets.primaryConcern,
    secondaryConcern: targets.secondaryConcern,
    toleranceTier: targets.toleranceTier,
    barrierState: targets.barrierState,
    heroActive: hero,
    supportActive: support,
    days,
    summary: {
      totalActiveDays: activeDayCount,
      totalRecoveryDays: recoveryDayCount,
      heroActiveFrequency: heroFrequency,
      supportActiveFrequency: support ? 7 - activeDayCount : undefined,
      keyPrinciples,
    },
    safetyNotes,
    expectedTimeline,
  };
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
 * Get human-readable day label
 */
function getDayLabel(dayType: DayType, dayNumber: number): string {
  switch (dayType) {
    case "active":
      return `Active Treatment`;
    case "maintenance":
      return `Maintenance`;
    case "recovery":
      return `Recovery Day`;
    case "barrier-repair":
      return `Barrier Repair`;
    default:
      return `Day ${dayNumber}`;
  }
}

/**
 * Get day-specific rationale
 */
function getDayRationale(
  dayType: DayType,
  heroActive: IngredientFamily,
  concern: ProtocolConcern
): string {
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

/**
 * Build safety notes based on protocol configuration
 */
function buildSafetyNotes(
  targets: ProtocolTargets,
  hero: IngredientFamily,
  support?: IngredientFamily
): string[] {
  const notes: string[] = [];

  // SPF requirement
  if (requiresSpfForIngredient(hero)) {
    notes.push("Consistent SPF use is non-negotiable with this protocol. Skipping SPF risks hyperpigmentation.");
  }

  // Retinoid warning
  if (hero === "adapalene-retinoid") {
    notes.push("Start slowly with retinoids. Expect mild flaking in weeks 2-4. Do not use if pregnant/nursing.");
  }

  // Exfoliation warning
  if (hero === "exfoliating-acid" || hero === "salicylic-acid") {
    notes.push("Over-exfoliation causes barrier damage. Stick to prescribed frequency even if skin feels fine.");
  }

  // Barrier sensitivity warning
  if (targets.barrierState === "compromised" || targets.barrierState === "sensitive") {
    notes.push("Your barrier is fragile. Pause all actives if you experience stinging, burning, or increased redness.");
  }

  // Benzoyl peroxide warning
  if (hero === "benzoyl-peroxide" || support === "benzoyl-peroxide") {
    notes.push("Benzoyl peroxide can bleach fabrics. Use white towels and pillowcases.");
  }

  return notes;
}

/**
 * Build expected timeline for results
 */
function buildExpectedTimeline(concern: ProtocolConcern, barrierState: BarrierState): string {
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
 * Sprint 21: Get clear day purpose (directive style)
 */
function getDayPurpose(
  dayType: DayType,
  heroActive: IngredientFamily,
  concern: ProtocolConcern
): string {
  switch (dayType) {
    case "active":
      if (heroActive.includes("retinoid")) return "Renew and resurface";
      if (heroActive.includes("acid") || heroActive.includes("exfoliating")) return "Exfoliate and refine";
      if (heroActive.includes("peroxide")) return "Target breakouts";
      if (heroActive.includes("azelaic")) return "Calm and brighten";
      return "Active treatment";
    case "recovery":
      return "Restore and strengthen";
    case "maintenance":
      return "Support and protect";
    case "barrier-repair":
      return "Heal barrier damage";
    default:
      return "Maintain routine";
  }
}

/**
 * Sprint 21: Explain why this specific day exists
 */
function getWhyThisDay(
  dayType: DayType,
  heroActive: IngredientFamily,
  concern: ProtocolConcern,
  dayNumber: number,
  frequency: number
): string {
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

/**
 * Sprint 21: Get caution message for active days
 */
function getDayCaution(heroActive: IngredientFamily): string {
  if (heroActive.includes("retinoid")) {
    return "Do not layer with vitamin C or exfoliating acids tonight. Expect mild flaking days 2-4 after use. This is normal.";
  }
  if (heroActive.includes("exfoliating-acid")) {
    return "Do not use retinoids or additional acids tonight. Over-exfoliation causes lasting barrier damage.";
  }
  if (heroActive.includes("benzoyl-peroxide")) {
    return "Benzoyl peroxide bleaches fabric. Use white towels and pillowcases. Do not combine with retinoids tonight.";
  }
  if (heroActive.includes("azelaic")) {
    return "May cause mild tingling on first use. This subsides with continued use. Avoid layering with strong acids.";
  }
  return "Follow application instructions carefully. Do not increase frequency without consulting a professional.";
}

/**
 * Sprint 21: What user should notice from this day
 */
function getExpectedOutcome(
  dayType: DayType,
  heroActive: IngredientFamily,
  concern: ProtocolConcern
): string {
  switch (dayType) {
    case "active":
      if (heroActive.includes("retinoid")) {
        return "Skin may feel slightly tight or look pink. Mild flaking is expected 2-3 days later.";
      }
      if (heroActive.includes("exfoliating-acid")) {
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

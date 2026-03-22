/**
 * Routine Builder v2
 * Deterministic routine construction with catalog-v1 integration
 * Sprint 18: Uses eligibility → ranking → selection pipeline with new product schema
 */

import type { SkinProfile } from "@/types/skin-profile";
import type { Routine, RegimenStep } from "@/types/regimen";
import type { ProductSpec, ProductRole } from "@/types/product";
import { CATALOG_V1 } from "@/lib/products/catalog-v1";
import { filterEligibleProducts, isAmSuitable, isPmSuitable } from "./product-eligibility";
import { selectBestProduct } from "./product-ranking";

/**
 * Select cleanser using eligibility → ranking pipeline
 */
function selectCleanser(
  profile: SkinProfile,
  timeOfDay: "am" | "pm",
  existingRoutine: ProductSpec[]
): string {
  // Get all cleansers
  let cleansers = CATALOG_V1.filter((p) => p.role === "cleanser");

  // Filter by time of day
  if (timeOfDay === "am") {
    cleansers = cleansers.filter(isAmSuitable);
  } else {
    cleansers = cleansers.filter(isPmSuitable);
  }

  // Apply eligibility rules
  const { eligible } = filterEligibleProducts(cleansers, profile, existingRoutine);

  // For AM or reactive users, prefer gentle cleansers
  if (timeOfDay === "am" || profile.sensitivity === "reactive") {
    const gentleCleansers = eligible.filter(
      (p) => p.category === "cleanser_gentle"
    );
    const selected = selectBestProduct(
      gentleCleansers.length > 0 ? gentleCleansers : eligible,
      profile
    );
    return selected?.id || "cerave-hydrating-cleanser";
  }

  // For PM, rank all eligible cleansers
  const selected = selectBestProduct(eligible, profile);
  return selected?.id || "cerave-foaming-facial-cleanser";
}

/**
 * Select treatment/serum using eligibility → ranking pipeline
 */
function selectTreatment(
  profile: SkinProfile,
  timeOfDay: "am" | "pm",
  existingRoutine: ProductSpec[]
): string {
  // Get all treatments (serums, treatments, support)
  let treatments = CATALOG_V1.filter(
    (p) => p.role === "serum" || p.role === "treatment" || p.role === "support"
  );

  // Filter by time of day
  if (timeOfDay === "am") {
    treatments = treatments.filter(isAmSuitable);
  } else {
    treatments = treatments.filter(isPmSuitable);
  }

  // Apply eligibility rules
  const { eligible } = filterEligibleProducts(treatments, profile, existingRoutine);

  // Priority-based filtering before ranking
  let priorityFiltered = eligible;

  switch (profile.priorityGoal) {
    case "breakout_control":
      // Prioritize acne-targeting products
      const acneProducts = eligible.filter((p) =>
        p.concernTargets.includes("breakouts")
      );
      priorityFiltered = acneProducts.length > 0 ? acneProducts : eligible;
      break;

    case "redness_calm":
      // Prioritize calming/barrier products
      const calmingProducts = eligible.filter(
        (p) =>
          p.concernTargets.includes("redness") ||
          p.category === "calming_support" ||
          p.category === "barrier_support"
      );
      priorityFiltered = calmingProducts.length > 0 ? calmingProducts : eligible;
      break;

    case "hydration_restore":
      // Prioritize hydrating products
      const hydratingProducts = eligible.filter(
        (p) =>
          p.concernTargets.includes("dehydration") ||
          p.category === "hydration_support"
      );
      priorityFiltered = hydratingProducts.length > 0 ? hydratingProducts : eligible;
      break;

    case "texture_smooth":
      // Prioritize texture-targeting actives
      const textureProducts = eligible.filter(
        (p) =>
          p.concernTargets.includes("texture") ||
          p.category === "aha" ||
          p.category === "bha" ||
          p.category === "retinoid"
      );
      priorityFiltered = textureProducts.length > 0 ? textureProducts : eligible;
      break;

    case "barrier_strengthen":
      // Prioritize barrier-friendly products
      const barrierProducts = eligible.filter(
        (p) =>
          p.barrierFriendly && p.concernTargets.includes("barrier")
      );
      priorityFiltered = barrierProducts.length > 0 ? barrierProducts : eligible;
      break;
  }

  const selected = selectBestProduct(priorityFiltered, profile);
  return selected?.id || "ordinary-niacinamide-10-zinc-1";
}

/**
 * Select moisturizer using eligibility → ranking pipeline
 */
function selectMoisturizer(
  profile: SkinProfile,
  timeOfDay: "am" | "pm",
  existingRoutine: ProductSpec[]
): string {
  // Get all moisturizers (including balms)
  let moisturizers = CATALOG_V1.filter(
    (p) => p.role === "moisturizer" || p.role === "balm"
  );

  // Filter by time of day
  if (timeOfDay === "am") {
    moisturizers = moisturizers.filter(isAmSuitable);
  } else {
    moisturizers = moisturizers.filter(isPmSuitable);
  }

  // Apply eligibility rules
  const { eligible } = filterEligibleProducts(moisturizers, profile, existingRoutine);

  // Texture preference filtering
  if (
    profile.oiliness === "dry" ||
    profile.hydrationNeed === "high" ||
    profile.priorityGoal === "barrier_strengthen"
  ) {
    // Prefer richer textures
    const richMoisturizers = eligible.filter(
      (p) => p.textureWeight === "rich" || p.textureWeight === "occlusive"
    );
    const selected = selectBestProduct(
      richMoisturizers.length > 0 ? richMoisturizers : eligible,
      profile
    );
    return selected?.id || "fab-ultra-repair-cream";
  }

  if (
    profile.oiliness === "oily_all" ||
    (profile.oiliness === "oily_tzone" && profile.breakoutProneness !== "rare")
  ) {
    // Prefer lightweight textures
    const lightMoisturizers = eligible.filter(
      (p) => p.textureWeight === "weightless" || p.textureWeight === "light"
    );
    const selected = selectBestProduct(
      lightMoisturizers.length > 0 ? lightMoisturizers : eligible,
      profile
    );
    return selected?.id || "neutrogena-hydro-boost-water-gel";
  }

  // General ranking
  const selected = selectBestProduct(eligible, profile);
  return selected?.id || "cerave-daily-moisturizing-lotion";
}

/**
 * Select SPF using eligibility → ranking pipeline
 */
function selectSpf(
  profile: SkinProfile,
  existingRoutine: ProductSpec[]
): string {
  // Get all sunscreens
  let sunscreens = CATALOG_V1.filter((p) => p.role === "sunscreen");

  // Sunscreens are AM only
  sunscreens = sunscreens.filter(isAmSuitable);

  // Apply eligibility rules
  const { eligible } = filterEligibleProducts(sunscreens, profile, existingRoutine);

  // Finish preference filtering
  if (
    profile.oiliness === "oily_all" ||
    profile.oiliness === "oily_tzone" ||
    profile.priorityGoal === "breakout_control"
  ) {
    // Prefer matte finish
    const matteSPF = eligible.filter((p) => p.finish === "matte" || p.finish === "natural");
    const selected = selectBestProduct(
      matteSPF.length > 0 ? matteSPF : eligible,
      profile
    );
    return selected?.id || "lrp-anthelios-invisible-fluid-spf50";
  }

  if (profile.oiliness === "dry" || profile.hydrationNeed === "high") {
    // Prefer dewy/glossy finish
    const dewySPF = eligible.filter((p) => p.finish === "dewy" || p.finish === "glossy");
    const selected = selectBestProduct(
      dewySPF.length > 0 ? dewySPF : eligible,
      profile
    );
    return selected?.id || "beauty-of-joseon-relief-sun-spf50";
  }

  // General ranking
  const selected = selectBestProduct(eligible, profile);
  return selected?.id || "eltamd-uv-clear-spf46";
}

/**
 * Generate step labels based on profile and priority
 */
function getTreatmentLabel(profile: SkinProfile, timeOfDay: "am" | "pm"): string {
  if (timeOfDay === "am") {
    switch (profile.priorityGoal) {
      case "breakout_control":
        return "Oil Control Serum";
      case "redness_calm":
        return "Calming Treatment";
      case "hydration_restore":
        return "Hydrating Serum";
      case "texture_smooth":
        return "Smoothing Treatment";
      case "barrier_strengthen":
        return "Barrier Support";
      default:
        return "Balancing Treatment";
    }
  }

  // PM labels
  if (!profile.hasActiveExperience) {
    return "Gentle Evening Treatment";
  }

  switch (profile.priorityGoal) {
    case "breakout_control":
      return "Acne Treatment";
    case "texture_smooth":
      return "Resurfacing Treatment";
    default:
      return "Active Treatment";
  }
}

function getCleanserLabel(profile: SkinProfile, timeOfDay: "am" | "pm"): string {
  if (timeOfDay === "am") {
    return "Gentle Cleanse";
  }

  if (profile.sensitivity === "reactive") {
    return "Gentle Evening Cleanse";
  }

  if (profile.oiliness === "oily_all" || profile.breakoutProneness === "persistent") {
    return "Deep Cleanse";
  }

  return "Evening Cleanse";
}

function getMoisturizerLabel(profile: SkinProfile, timeOfDay: "am" | "pm"): string {
  const needsRich =
    profile.oiliness === "dry" ||
    profile.hydrationNeed === "high" ||
    profile.priorityGoal === "barrier_strengthen";

  if (timeOfDay === "am") {
    return needsRich ? "Barrier Support" : "Lightweight Hydration";
  }

  return needsRich ? "Rich Barrier Support" : "Evening Hydration";
}

function getSpfLabel(profile: SkinProfile): string {
  if (profile.oiliness === "oily_all" || profile.priorityGoal === "breakout_control") {
    return "Matte SPF";
  }

  if (profile.oiliness === "dry") {
    return "Hydrating SPF";
  }

  return "Broad Spectrum SPF";
}

/**
 * Build complete AM and PM routines from skin profile
 * Returns routine with product IDs selected via deterministic pipeline
 */
export function buildRoutineFromProfile(profile: SkinProfile): Routine {
  const amRoutine: ProductSpec[] = [];
  const pmRoutine: ProductSpec[] = [];

  // Morning routine: cleanse → treat → moisturize → protect
  const amCleanser = selectCleanser(profile, "am", amRoutine);
  amRoutine.push(CATALOG_V1.find((p) => p.id === amCleanser)!);

  const amTreatment = selectTreatment(profile, "am", amRoutine);
  amRoutine.push(CATALOG_V1.find((p) => p.id === amTreatment)!);

  const amMoisturizer = selectMoisturizer(profile, "am", amRoutine);
  amRoutine.push(CATALOG_V1.find((p) => p.id === amMoisturizer)!);

  const amSpf = selectSpf(profile, amRoutine);
  amRoutine.push(CATALOG_V1.find((p) => p.id === amSpf)!);

  const am: RegimenStep[] = [
    {
      role: "cleanse",
      label: getCleanserLabel(profile, "am"),
      productId: amCleanser,
    },
    {
      role: "treat",
      label: getTreatmentLabel(profile, "am"),
      productId: amTreatment,
    },
    {
      role: "moisturize",
      label: getMoisturizerLabel(profile, "am"),
      productId: amMoisturizer,
    },
    {
      role: "protect",
      label: getSpfLabel(profile),
      productId: amSpf,
    },
  ];

  // Evening routine: cleanse → treat → moisturize
  const pmCleanser = selectCleanser(profile, "pm", pmRoutine);
  pmRoutine.push(CATALOG_V1.find((p) => p.id === pmCleanser)!);

  const pmTreatment = selectTreatment(profile, "pm", pmRoutine);
  pmRoutine.push(CATALOG_V1.find((p) => p.id === pmTreatment)!);

  const pmMoisturizer = selectMoisturizer(profile, "pm", pmRoutine);
  pmRoutine.push(CATALOG_V1.find((p) => p.id === pmMoisturizer)!);

  const pm: RegimenStep[] = [
    {
      role: "cleanse",
      label: getCleanserLabel(profile, "pm"),
      productId: pmCleanser,
    },
    {
      role: "treat",
      label: getTreatmentLabel(profile, "pm"),
      productId: pmTreatment,
    },
    {
      role: "moisturize",
      label: getMoisturizerLabel(profile, "pm"),
      productId: pmMoisturizer,
    },
  ];

  return { am, pm };
}

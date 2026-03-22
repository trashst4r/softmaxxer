import type { SkinScores, RoutineStep, ProductSuggestion } from "@/types/analysis";
import { getProductsForIngredient, type PriceTier } from "./product-map";
import { getRegion } from "./region";
import { getConcernsForIngredient } from "./concern-map";
import { classifyProducts } from "./product-logic";

/**
 * Generate dynamic AM/PM routines from skin scores.
 * Uses ingredient-level logic with conflict handling.
 * Optimized but safe approach.
 */
export function generateRegimen(scores: SkinScores): {
  am_routine: RoutineStep[];
  pm_routine: RoutineStep[];
} {
  const am_routine = generateAMRoutine(scores);
  const pm_routine = generatePMRoutine(scores);

  // Attach concern affects to each step (Sprint 8)
  am_routine.forEach((step) => {
    step.affects = calculateAffects(step);
  });

  pm_routine.forEach((step) => {
    step.affects = calculateAffects(step);
  });

  return { am_routine, pm_routine };
}

/**
 * Helper function to create a ProductSuggestion with attached products.
 * Automatically fetches matching products from the product database.
 * Sprint 9: Classifies products with roles and reasoning based on skin profile.
 */
function createProductSuggestion(
  ingredient: string,
  category: string,
  examples: string[],
  rationale: string,
  tier: PriceTier = "mid",
  scores?: SkinScores
): ProductSuggestion {
  const region = getRegion();
  let products = getProductsForIngredient(ingredient, tier, region);

  // Sprint 9: Classify products with roles if scores provided
  if (scores && products.length > 0) {
    products = classifyProducts(products, scores, ingredient);
  }

  return {
    ingredient,
    category,
    examples,
    rationale,
    products: products.length > 0 ? products : undefined,
  };
}

/**
 * Determine which concerns a routine step addresses.
 * Extracts all ingredients from product suggestions and maps to concerns.
 */
function calculateAffects(step: RoutineStep): string[] {
  if (!step.products || step.products.length === 0) {
    return [];
  }

  const concerns = new Set<string>();

  step.products.forEach((productSuggestion) => {
    const ingredientConcerns = getConcernsForIngredient(productSuggestion.ingredient);
    ingredientConcerns.forEach((c) => concerns.add(c));
  });

  return Array.from(concerns);
}

function generateAMRoutine(scores: SkinScores): RoutineStep[] {
  const routine: RoutineStep[] = [];

  // 1. Cleanser
  routine.push(selectCleanser(scores, "am", "am_cleanse"));

  // 2. Treatment serum (optional, only if safe and beneficial)
  const amTreatment = selectAMTreatment(scores);
  if (amTreatment) {
    routine.push(amTreatment);
  }

  // 3. Moisturizer
  routine.push(selectMoisturizer(scores, "am", "am_moisturize"));

  // 4. SPF (always required)
  routine.push({
    id: "am_spf",
    step: "Sunscreen SPF 30+ (broad spectrum)",
    products: [
      createProductSuggestion(
        "Zinc Oxide / Titanium Dioxide",
        "Mineral SPF",
        ["EltaMD UV Clear", "La Roche-Posay Anthelios Mineral", "Australian Gold Tinted Mineral"],
        "Non-irritating mineral protection suitable for sensitive skin",
        "mid",
        scores
      ),
      createProductSuggestion(
        "Chemical UV Filters",
        "Chemical SPF",
        ["Supergoop Unseen Sunscreen", "Biore UV Aqua Rich", "Skin Aqua UV Moisture Milk"],
        "Lightweight, cosmetically elegant for daily wear",
        "mid",
        scores
      ),
    ],
  });

  return routine;
}

function generatePMRoutine(scores: SkinScores): RoutineStep[] {
  const routine: RoutineStep[] = [];

  // 1. First cleanse (if using SPF or makeup)
  if (scores.oil_production > 40) {
    routine.push({
      id: "pm_first_cleanse",
      step: "Oil-based first cleanser",
      products: [
        createProductSuggestion(
          "Cleansing Oil",
          "First Cleanser",
          ["DHC Deep Cleansing Oil", "Kose Softymo Speedy Cleansing Oil", "Banila Co Clean It Zero"],
          "Effective SPF and sebum removal"
        ),
      ],
    });
  }

  // 2. Second cleanser
  routine.push(selectCleanser(scores, "pm", "pm_cleanse"));

  // 3. Treatment/Active (core of PM routine)
  const pmActive = selectPMActive(scores);
  if (pmActive) {
    routine.push(pmActive);
  }

  // 4. Hydrating serum (optional, for dry/barrier-compromised)
  if (scores.dryness_dehydration > 50 || scores.barrier_health < 50) {
    routine.push({
      id: "pm_hydrate",
      step: "Hydrating serum",
      products: [
        createProductSuggestion(
          "Hyaluronic Acid",
          "Hydrator",
          ["The Ordinary Hyaluronic Acid 2% + B5", "Hada Labo Gokujyun Premium", "CosRx Hyaluronic Acid Intensive Cream"],
          "Lightweight hydration without heaviness"
        ),
      ],
    });
  }

  // 5. Moisturizer
  routine.push(selectMoisturizer(scores, "pm", "pm_moisturize"));

  // 6. Occlusive (for severe dryness or barrier repair)
  if (scores.dryness_dehydration > 70 || scores.barrier_health < 40) {
    routine.push({
      id: "pm_occlusive",
      step: "Occlusive layer (optional)",
      products: [
        createProductSuggestion(
          "Petrolatum / Ceramides",
          "Occlusive",
          ["CeraVe Healing Ointment", "La Roche-Posay Cicaplast Baume B5", "Aquaphor Healing Ointment"],
          "Seals in moisture and protects compromised barrier"
        ),
      ],
    });
  }

  return routine;
}

function selectCleanser(scores: SkinScores, timeOfDay: "am" | "pm", id: string): RoutineStep {
  const { oil_production, sensitivity_reactivity, barrier_health } = scores;

  // Barrier-compromised or highly sensitive: gentlest cleansers
  if (barrier_health < 50 || sensitivity_reactivity > 60) {
    return {
      id,
      step: timeOfDay === "am" ? "Gentle cream cleanser or water only" : "Gentle cream cleanser",
      products: [
        createProductSuggestion(
          "Non-foaming Cream",
          "Gentle Cleanser",
          ["CeraVe Hydrating Cleanser", "La Roche-Posay Toleriane Hydrating Cleanser", "Vanicream Gentle Facial Cleanser"],
          "Non-stripping, maintains barrier integrity",
          "mid",
          scores
        ),
      ],
    };
  }

  // High oil production: foaming cleanser
  if (oil_production > 60) {
    return {
      id,
      step: "Foaming cleanser",
      products: [
        createProductSuggestion(
          "Gentle Foaming Agent",
          "Foaming Cleanser",
          ["CeraVe Foaming Facial Cleanser", "La Roche-Posay Effaclar Purifying Foaming Gel", "Neutrogena Ultra Gentle Foaming Cleanser"],
          "Effective oil removal without over-stripping"
        ),
      ],
    };
  }

  // Moderate/normal: gel or low-foam cleanser
  return {
    id,
    step: "Gel cleanser",
    products: [
      createProductSuggestion(
        "Balanced Surfactant",
        "Gel Cleanser",
        ["CeraVe Foaming Facial Cleanser", "Glossier Milky Jelly Cleanser", "Youth to the People Superfood Cleanser"],
        "Balanced cleansing for normal skin"
      ),
    ],
  };
}

function selectAMTreatment(scores: SkinScores): RoutineStep | null {
  const { sensitivity_reactivity, barrier_health, dryness_dehydration } = scores;

  // Skip AM actives if barrier is compromised or high sensitivity
  if (barrier_health < 50 || sensitivity_reactivity > 70) {
    return null;
  }

  // Azelaic acid is safe and beneficial for many concerns
  if (scores.acne_severity > 40 || scores.sensitivity_reactivity > 30) {
    return {
      id: "am_treatment",
      step: "Azelaic acid 10% serum",
      products: [
        createProductSuggestion(
          "Azelaic Acid",
          "Multi-benefit Active",
          ["The Ordinary Azelaic Acid 10%", "Paula's Choice 10% Azelaic Acid Booster", "Finacea Gel (15%, Rx)"],
          "Anti-inflammatory, reduces redness and acne without irritation"
        ),
      ],
    };
  }

  // Niacinamide is universally beneficial
  if (scores.oil_production > 30 || dryness_dehydration > 30) {
    return {
      id: "am_treatment",
      step: "Niacinamide 5-10% serum",
      products: [
        createProductSuggestion(
          "Niacinamide",
          "Multi-benefit Active",
          ["The Ordinary Niacinamide 10% + Zinc 1%", "Paula's Choice 10% Niacinamide Booster", "CeraVe PM Facial Moisturizing Lotion"],
          "Regulates oil, strengthens barrier, reduces inflammation"
        ),
      ],
    };
  }

  return null;
}

function selectPMActive(scores: SkinScores): RoutineStep | null {
  const { acne_severity, sensitivity_reactivity, barrier_health, dryness_dehydration, oil_production } = scores;

  // Barrier repair phase: NO actives
  if (barrier_health < 40) {
    return {
      id: "pm_active",
      step: "PAUSE ALL ACTIVES — Barrier repair phase",
      products: [
        createProductSuggestion(
          "Centella Asiatica / Panthenol",
          "Barrier Repair",
          ["CosRx Centella Blemish Cream", "La Roche-Posay Cicaplast Baume B5", "Purito Centella Unscented Serum"],
          "Accelerates barrier recovery without irritation"
        ),
      ],
    };
  }

  // High sensitivity or moderate barrier issues: gentle actives only
  if (sensitivity_reactivity > 70 || barrier_health < 60) {
    return {
      id: "pm_active",
      step: "Azelaic acid 10% (3-4x per week)",
      products: [
        createProductSuggestion(
          "Azelaic Acid",
          "Gentle Active",
          ["The Ordinary Azelaic Acid 10%", "Paula's Choice 10% Azelaic Acid Booster"],
          "Gentlest effective active for sensitive skin"
        ),
      ],
    };
  }

  // High acne severity: targeted acne actives
  if (acne_severity > 60) {
    if (dryness_dehydration < 40) {
      // Can tolerate stronger actives
      return {
        id: "pm_active",
        step: "Benzoyl peroxide 2.5-5% or adapalene 0.1%",
        products: [
          createProductSuggestion(
            "Benzoyl Peroxide",
            "Acne Treatment",
            ["La Roche-Posay Effaclar Duo", "CeraVe Acne Foaming Cream Cleanser", "PanOxyl 4% Creamy Wash"],
            "Kills acne bacteria, reduces inflammation"
          ),
          createProductSuggestion(
            "Adapalene",
            "Retinoid",
            ["Differin Gel 0.1%", "La Roche-Posay Adapalene Gel"],
            "Prescription-strength retinoid for acne (OTC in US)"
          ),
        ],
      };
    } else {
      // Drier skin: gentler acne treatment
      return {
        id: "pm_active",
        step: "Salicylic acid 2% (3-4x per week)",
        products: [
          createProductSuggestion(
            "Salicylic Acid",
            "BHA Exfoliant",
            ["Paula's Choice 2% BHA Liquid", "CosRx BHA Blackhead Power Liquid", "The Ordinary Salicylic Acid 2%"],
            "Oil-soluble exfoliant, unclogs pores"
          ),
        ],
      };
    }
  }

  // Moderate acne or oil: salicylic acid
  if (acne_severity > 35 || oil_production > 50) {
    return {
      id: "pm_active",
      step: "Salicylic acid 2% (3-4x per week)",
      products: [
        createProductSuggestion(
          "Salicylic Acid",
          "BHA Exfoliant",
          ["Paula's Choice 2% BHA Liquid", "CosRx BHA Blackhead Power Liquid"],
          "Exfoliates inside pores, controls oil"
        ),
      ],
    };
  }

  // Balanced/maintenance: retinoid for prevention
  if (acne_severity < 35 && barrier_health > 60 && sensitivity_reactivity < 50) {
    return {
      id: "pm_active",
      step: "Retinoid 0.025-0.05% (2-3x per week, build tolerance)",
      products: [
        createProductSuggestion(
          "Retinol / Tretinoin",
          "Retinoid",
          [
            "CeraVe Resurfacing Retinol Serum",
            "The Ordinary Retinol 0.5% in Squalane",
            "Tretinoin 0.025% (Rx)",
            "Differin Gel 0.1%",
          ],
          "Anti-aging, texture improvement, acne prevention"
        ),
      ],
    };
  }

  return null;
}

function selectMoisturizer(scores: SkinScores, timeOfDay: "am" | "pm", id: string): RoutineStep {
  const { dryness_dehydration, oil_production, barrier_health } = scores;

  // Barrier-compromised: rich barrier repair moisturizer
  if (barrier_health < 50) {
    return {
      id,
      step: "Barrier repair moisturizer",
      products: [
        createProductSuggestion(
          "Ceramides + Cholesterol + Fatty Acids",
          "Barrier Repair",
          ["CeraVe Moisturizing Cream", "La Roche-Posay Toleriane Double Repair", "Stratia Liquid Gold"],
          "Optimized lipid ratio for barrier repair"
        ),
      ],
    };
  }

  // Very dry: rich cream
  if (dryness_dehydration > 60) {
    return {
      id,
      step: timeOfDay === "am" ? "Rich moisturizer" : "Rich night cream",
      products: [
        createProductSuggestion(
          "Emollient-Rich Cream",
          "Rich Moisturizer",
          ["CeraVe Moisturizing Cream", "Vanicream Daily Facial Moisturizer", "Avène Tolerance Extreme Cream"],
          "Heavy hydration for dry skin"
        ),
      ],
    };
  }

  // Very oily: lightweight gel or skip AM moisturizer
  if (oil_production > 70 && timeOfDay === "am") {
    return {
      id,
      step: "Lightweight gel moisturizer (optional if using SPF with moisturizing base)",
      products: [
        createProductSuggestion(
          "Gel Moisturizer",
          "Lightweight",
          ["Neutrogena Hydro Boost Water Gel", "CosRx Oil-Free Ultra-Moisturizing Lotion", "Clinique Dramatically Different Gel"],
          "Hydration without added oil"
        ),
      ],
    };
  }

  // Oily: gel or light lotion
  if (oil_production > 50) {
    return {
      id,
      step: "Lightweight lotion",
      products: [
        createProductSuggestion(
          "Oil-Free Lotion",
          "Lightweight Moisturizer",
          ["CeraVe PM Facial Moisturizing Lotion", "Neutrogena Oil-Free Moisture", "La Roche-Posay Effaclar Mat"],
          "Hydration without excess oil"
        ),
      ],
    };
  }

  // Normal/balanced: standard lotion
  return {
    id,
    step: "Moisturizer",
    products: [
      createProductSuggestion(
        "Balanced Lotion",
        "Standard Moisturizer",
        ["CeraVe Facial Moisturizing Lotion PM", "Neutrogena Hydro Boost Gel-Cream", "Vanicream Daily Facial Moisturizer"],
        "Balanced hydration for normal skin"
      ),
    ],
  };
}

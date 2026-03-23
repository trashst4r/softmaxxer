/**
 * Mock Routine Generator for Preset Mode
 *
 * Generates deterministic AM/PM routines for preset profiles.
 * Used when rendering dashboard/results in preset mode without live analysis.
 *
 * Uses real CATALOG_V1 product IDs for screenshot-ready presentation.
 */

import type { SkinProfile } from "@/types/skin-profile";
import type { AnalysisResult, RoutineStep, RankedConcern, SkinScores, BarrierRisk } from "@/types/analysis";
import type { Routine, RegimenStep } from "@/types/regimen";
import { getSkinTexture, getPrimaryConcern } from "./texture-map";

/**
 * Generate mock routine for a preset profile
 * Returns a complete AnalysisResult with AM/PM routines and ranked concerns
 */
export function generateMockRoutine(profile: SkinProfile): AnalysisResult {
  const textureType = getSkinTexture(profile);
  const primaryConcern = getPrimaryConcern(profile);

  // Generate routines based on texture type using real catalog product IDs
  let am_routine: RoutineStep[];
  let pm_routine: RoutineStep[];

  if (textureType === "compromised") {
    // Barrier-focused routine
    am_routine = [
      {
        id: "am_cleanse",
        step: "Gentle hydrating cleanser",
        products: [{
          category: "cleanser",
          ingredient: "Ceramides + Hyaluronic Acid",
          examples: ["CeraVe Hydrating Cleanser"]
        }]
      },
      {
        id: "am_serum",
        step: "Barrier support serum",
        products: [{
          category: "serum",
          ingredient: "Niacinamide 10% + Zinc",
          examples: ["The Ordinary Niacinamide"]
        }]
      },
      {
        id: "am_moisturize",
        step: "Barrier repair moisturizer",
        products: [{
          category: "moisturizer",
          ingredient: "Panthenol + Madecassoside",
          examples: ["La Roche-Posay Cicaplast Baume B5"]
        }]
      },
      {
        id: "am_spf",
        step: "Mineral SPF protection",
        products: [{
          category: "sunscreen",
          ingredient: "Zinc Oxide + Ceramides",
          examples: ["CeraVe Mineral SPF 50"]
        }]
      },
    ];

    pm_routine = [
      {
        id: "pm_cleanse",
        step: "Gentle hydrating cleanser",
        products: [{
          category: "cleanser",
          ingredient: "Ceramides + Hyaluronic Acid",
          examples: ["CeraVe Hydrating Cleanser"]
        }]
      },
      {
        id: "pm_serum",
        step: "Barrier support serum",
        products: [{
          category: "serum",
          ingredient: "Niacinamide 10% + Zinc",
          examples: ["The Ordinary Niacinamide"]
        }]
      },
      {
        id: "pm_moisturize",
        step: "Barrier repair moisturizer",
        products: [{
          category: "moisturizer",
          ingredient: "Panthenol + Madecassoside",
          examples: ["La Roche-Posay Cicaplast Baume B5"]
        }]
      },
    ];
  } else if (textureType === "roughness") {
    // Texture-focused routine
    am_routine = [
      {
        id: "am_cleanse",
        step: "Foaming cleanser for oil control",
        products: [{
          category: "cleanser",
          ingredient: "Ceramides + Niacinamide",
          examples: ["CeraVe Foaming Facial Cleanser"]
        }]
      },
      {
        id: "am_serum",
        step: "Pore-refining serum",
        products: [{
          category: "serum",
          ingredient: "Niacinamide 10% + Zinc",
          examples: ["The Ordinary Niacinamide"]
        }]
      },
      {
        id: "am_moisturize",
        step: "Lightweight gel moisturizer",
        products: [{
          category: "moisturizer",
          ingredient: "Hyaluronic Acid",
          examples: ["Neutrogena Hydro Boost Water Gel"]
        }]
      },
      {
        id: "am_spf",
        step: "Lightweight fluid SPF",
        products: [{
          category: "sunscreen",
          ingredient: "Chemical Filters",
          examples: ["La Roche-Posay Anthelios Invisible Fluid SPF 50"]
        }]
      },
    ];

    pm_routine = [
      {
        id: "pm_cleanse",
        step: "Foaming cleanser for oil control",
        products: [{
          category: "cleanser",
          ingredient: "Ceramides + Niacinamide",
          examples: ["CeraVe Foaming Facial Cleanser"]
        }]
      },
      {
        id: "pm_treatment",
        step: "Retinol for texture refinement",
        products: [{
          category: "treatment",
          ingredient: "Retinol 0.2%",
          examples: ["The Ordinary Retinol in Squalane"]
        }]
      },
      {
        id: "pm_serum",
        step: "Pore-refining serum",
        products: [{
          category: "serum",
          ingredient: "Niacinamide 10% + Zinc",
          examples: ["The Ordinary Niacinamide"]
        }]
      },
      {
        id: "pm_moisturize",
        step: "Lightweight gel moisturizer",
        products: [{
          category: "moisturizer",
          ingredient: "Hyaluronic Acid",
          examples: ["Neutrogena Hydro Boost Water Gel"]
        }]
      },
    ];
  } else {
    // Balanced routine
    am_routine = [
      {
        id: "am_cleanse",
        step: "Gentle daily cleanser",
        products: [{
          category: "cleanser",
          ingredient: "Ceramides + Hyaluronic Acid",
          examples: ["CeraVe Hydrating Cleanser"]
        }]
      },
      {
        id: "am_serum",
        step: "Hydration-boosting serum",
        products: [{
          category: "serum",
          ingredient: "Hyaluronic Acid 2% + B5",
          examples: ["The Ordinary Hyaluronic Acid"]
        }]
      },
      {
        id: "am_moisturize",
        step: "Daily moisturizing lotion",
        products: [{
          category: "moisturizer",
          ingredient: "Ceramides + MVE Technology",
          examples: ["CeraVe Daily Moisturizing Lotion"]
        }]
      },
      {
        id: "am_spf",
        step: "Lightweight fluid SPF",
        products: [{
          category: "sunscreen",
          ingredient: "Chemical Filters",
          examples: ["La Roche-Posay Anthelios Invisible Fluid SPF 50"]
        }]
      },
    ];

    pm_routine = [
      {
        id: "pm_cleanse",
        step: "Gentle daily cleanser",
        products: [{
          category: "cleanser",
          ingredient: "Ceramides + Hyaluronic Acid",
          examples: ["CeraVe Hydrating Cleanser"]
        }]
      },
      {
        id: "pm_serum",
        step: "Hydration-boosting serum",
        products: [{
          category: "serum",
          ingredient: "Hyaluronic Acid 2% + B5",
          examples: ["The Ordinary Hyaluronic Acid"]
        }]
      },
      {
        id: "pm_moisturize",
        step: "Richer night moisturizer",
        products: [{
          category: "moisturizer",
          ingredient: "Ceramides + Niacinamide",
          examples: ["La Roche-Posay Toleriane Double Repair"]
        }]
      },
    ];
  }

  // Generate ranked concerns
  const ranked_concerns: RankedConcern[] = [
    { concern: primaryConcern, score: 85, priority: "high" },
  ];

  if (textureType === "compromised") {
    ranked_concerns.push(
      { concern: "Barrier Sensitivity", score: 70, priority: "high" },
      { concern: "Dehydration", score: 60, priority: "medium" }
    );
  } else if (textureType === "roughness") {
    ranked_concerns.push(
      { concern: "Enlarged Pores", score: 70, priority: "high" },
      { concern: "Oil Control", score: 55, priority: "medium" }
    );
  } else {
    ranked_concerns.push(
      { concern: "Preventive Care", score: 50, priority: "medium" },
      { concern: "Hydration", score: 45, priority: "low" }
    );
  }

  // Mock scores (minimal for type satisfaction)
  const scores: SkinScores = {
    acne_severity: 50,
    oil_production: 50,
    dryness_dehydration: 50,
    sensitivity_reactivity: 50,
    barrier_health: 50,
    overall_condition: 50,
  };

  // Mock barrier risk
  let barrier_risk: BarrierRisk = "Low";
  if (textureType === "compromised") {
    barrier_risk = "Elevated";
  } else if (textureType === "roughness") {
    barrier_risk = "Moderate";
  }

  return {
    // Core profile
    profile_label: textureType === "compromised" ? "Barrier Compromised" : textureType === "roughness" ? "Texture Focus" : "Balanced",
    profile_maturity: "Initial Profile",
    summary: `Mock profile for preset: ${textureType}`,

    // Scoring
    scores,
    confidence_score: 85,
    confidence_label: "High confidence profile",

    // Concerns
    ranked_concerns,
    concern_clusters: ranked_concerns.map(c => c.concern),
    barrier_risk,

    // Routines
    am_routine,
    pm_routine,

    // Guidance
    next_tests: ["Monitor skin response over 2 weeks", "Note any irritation or improvement"],
  };
}

/**
 * Generate mock Routine (Regimen format) for results page
 * Uses real CATALOG_V1 product IDs for proper product display
 */
export function generateMockRegimen(profile: SkinProfile): Routine {
  const textureType = getSkinTexture(profile);

  let am: RegimenStep[];
  let pm: RegimenStep[];

  if (textureType === "compromised") {
    // Barrier-focused regimen
    am = [
      { role: "cleanse", label: "Gentle hydrating cleanser", productId: "cerave-hydrating-cleanser" },
      { role: "treat", label: "Barrier support serum", productId: "ordinary-niacinamide-10-zinc-1" },
      { role: "moisturize", label: "Barrier repair moisturizer", productId: "lrp-cicaplast-baume-b5" },
      { role: "protect", label: "Mineral SPF protection", productId: "cerave-hydrating-mineral-spf50" },
    ];

    pm = [
      { role: "cleanse", label: "Gentle hydrating cleanser", productId: "cerave-hydrating-cleanser" },
      { role: "treat", label: "Barrier support serum", productId: "ordinary-niacinamide-10-zinc-1" },
      { role: "moisturize", label: "Barrier repair moisturizer", productId: "lrp-cicaplast-baume-b5" },
    ];
  } else if (textureType === "roughness") {
    // Texture-focused regimen
    am = [
      { role: "cleanse", label: "Foaming cleanser for oil control", productId: "cerave-foaming-facial-cleanser" },
      { role: "treat", label: "Pore-refining serum", productId: "ordinary-niacinamide-10-zinc-1" },
      { role: "moisturize", label: "Lightweight gel moisturizer", productId: "neutrogena-hydro-boost-water-gel" },
      { role: "protect", label: "Lightweight fluid SPF", productId: "lrp-anthelios-invisible-fluid-spf50" },
    ];

    pm = [
      { role: "cleanse", label: "Foaming cleanser for oil control", productId: "cerave-foaming-facial-cleanser" },
      { role: "treat", label: "Retinol for texture refinement", productId: "ordinary-retinol-0-2-squalane" },
      { role: "treat", label: "Pore-refining serum", productId: "ordinary-niacinamide-10-zinc-1" },
      { role: "moisturize", label: "Lightweight gel moisturizer", productId: "neutrogena-hydro-boost-water-gel" },
    ];
  } else {
    // Balanced regimen
    am = [
      { role: "cleanse", label: "Gentle daily cleanser", productId: "cerave-hydrating-cleanser" },
      { role: "treat", label: "Hydration-boosting serum", productId: "ordinary-hyaluronic-acid-2-b5" },
      { role: "moisturize", label: "Daily moisturizing lotion", productId: "cerave-daily-moisturizing-lotion" },
      { role: "protect", label: "Lightweight fluid SPF", productId: "lrp-anthelios-invisible-fluid-spf50" },
    ];

    pm = [
      { role: "cleanse", label: "Gentle daily cleanser", productId: "cerave-hydrating-cleanser" },
      { role: "treat", label: "Hydration-boosting serum", productId: "ordinary-hyaluronic-acid-2-b5" },
      { role: "moisturize", label: "Richer night moisturizer", productId: "lrp-toleriane-double-repair-moisturizer" },
    ];
  }

  return { am, pm };
}

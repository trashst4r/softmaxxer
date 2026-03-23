/**
 * Sprint 22: Ingredient Action Bridge
 * Maps ingredient families to actionable search intents for product discovery
 * Maintains clinical tone without introducing product-first or sales-heavy UX
 */

import type { IngredientFamily } from "@/lib/protocol/protocol-types";

export interface IngredientAction {
  searchIntent: string; // What to search for
  searchQuery: string; // URL-encoded search term
  guidance?: string; // Optional product selection guidance
  concentration?: string; // Recommended concentration/strength
}

/**
 * Generate search intent and guidance for each ingredient family
 */
export function getIngredientAction(ingredient: IngredientFamily): IngredientAction | null {
  switch (ingredient) {
    // Actives
    case "adapalene-retinoid":
      return {
        searchIntent: "adapalene gel 0.1%",
        searchQuery: encodeURIComponent("adapalene gel 0.1% skincare"),
        concentration: "0.1%",
        guidance: "Look for adapalene gel 0.1%. Available OTC or prescription strength 0.3%.",
      };

    case "exfoliating-acid":
      return {
        searchIntent: "AHA BHA exfoliating acid",
        searchQuery: encodeURIComponent("glycolic acid lactic acid BHA toner serum"),
        guidance: "Glycolic acid (5-10%), lactic acid (5-10%), or salicylic acid (2%). Start lower.",
      };

    case "azelaic-acid":
      return {
        searchIntent: "azelaic acid 10% serum",
        searchQuery: encodeURIComponent("azelaic acid 10% 15% serum suspension"),
        concentration: "10-15%",
        guidance: "Look for 10% (OTC) or 15-20% (prescription). Cream or suspension form.",
      };

    case "benzoyl-peroxide":
      return {
        searchIntent: "benzoyl peroxide 2.5% gel",
        searchQuery: encodeURIComponent("benzoyl peroxide 2.5% 5% gel wash"),
        concentration: "2.5-5%",
        guidance: "Start with 2.5% gel or wash. Higher strengths (5-10%) not more effective.",
      };

    case "salicylic-acid":
      return {
        searchIntent: "salicylic acid 2% cleanser",
        searchQuery: encodeURIComponent("salicylic acid 2% BHA cleanser toner"),
        concentration: "2%",
        guidance: "2% is standard. Available in cleansers, toners, or leave-on treatments.",
      };

    case "vitamin-c":
      return {
        searchIntent: "vitamin C L-ascorbic acid serum",
        searchQuery: encodeURIComponent("vitamin C serum L-ascorbic acid 10% 15%"),
        concentration: "10-20%",
        guidance: "L-ascorbic acid 10-20% or stable derivatives (SAP, MAP). Check pH < 3.5.",
      };

    case "niacinamide":
      return {
        searchIntent: "niacinamide 10% serum",
        searchQuery: encodeURIComponent("niacinamide 10% serum vitamin B3"),
        concentration: "5-10%",
        guidance: "5-10% niacinamide. Well-tolerated, pairs with most actives.",
      };

    case "copper-peptides":
      return {
        searchIntent: "copper peptides serum",
        searchQuery: encodeURIComponent("copper peptides GHK-Cu serum"),
        guidance: "Look for GHK-Cu (copper tripeptide-1). Do not mix with vitamin C or acids.",
      };

    // Supporting ingredients
    case "hydrating-serum":
      return {
        searchIntent: "hyaluronic acid serum",
        searchQuery: encodeURIComponent("hyaluronic acid serum hydrating"),
        guidance: "Hyaluronic acid, glycerin, or ceramides. Apply to damp skin.",
      };

    case "barrier-support":
      return {
        searchIntent: "ceramide barrier repair cream",
        searchQuery: encodeURIComponent("ceramide barrier repair cream sensitive skin"),
        guidance: "Ceramides, cholesterol, fatty acids. Look for gentle, fragrance-free formulas.",
      };

    case "moisturizer":
      return {
        searchIntent: "facial moisturizer",
        searchQuery: encodeURIComponent("facial moisturizer fragrance free"),
        guidance: "Fragrance-free, appropriate for your skin type. Heavier for dry, lighter for oily.",
      };

    case "sunscreen":
      return {
        searchIntent: "sunscreen SPF 50",
        searchQuery: encodeURIComponent("facial sunscreen SPF 50 broad spectrum"),
        concentration: "SPF 50+",
        guidance: "SPF 50+, broad spectrum. Mineral (zinc/titanium) or chemical. Reapply every 2 hours.",
      };

    case "gentle-cleanser":
      return {
        searchIntent: "gentle facial cleanser",
        searchQuery: encodeURIComponent("gentle face cleanser fragrance free"),
        guidance: "pH-balanced, fragrance-free. Cream or gel depending on skin type.",
      };

    // These typically don't need specific product searches
    default:
      return null;
  }
}

/**
 * Generate external search URL for ingredient
 * Uses Google search by default (no affiliate bias)
 */
export function getSearchUrl(searchQuery: string): string {
  return `https://www.google.com/search?q=${searchQuery}`;
}

/**
 * Check if ingredient is actionable (needs product search)
 */
export function isActionableIngredient(ingredient: IngredientFamily): boolean {
  // Base ingredients that don't need explicit product search
  const nonActionable: IngredientFamily[] = [];

  return !nonActionable.includes(ingredient);
}

/**
 * Get neutral CTA text for ingredient action
 * Maintains clinical tone, not sales-driven
 */
export function getActionCTA(ingredient: IngredientFamily): string {
  // Active treatments get more directive language
  const actives: IngredientFamily[] = [
    "adapalene-retinoid",
    "exfoliating-acid",
    "azelaic-acid",
    "benzoyl-peroxide",
    "salicylic-acid",
    "vitamin-c",
    "copper-peptides",
  ];

  if (actives.includes(ingredient)) {
    return "Find this ingredient";
  }

  // Support ingredients get softer language
  return "Find products";
}

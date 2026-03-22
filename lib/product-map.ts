/**
 * Sprint 6A: Affiliate Link Infrastructure
 * Sprint 9: Product Intelligence + Conversion Layer
 * Product database with region-aware affiliate URLs and role-based classification
 */

export type Region = "AU" | "US" | "UK" | "GLOBAL";
export type AffiliateNetwork = "amazon" | "awin" | "impact" | "shopmy" | "direct" | "placeholder";
export type PriceTier = "budget" | "mid" | "premium";
export type StrengthTier = "gentle" | "standard" | "strong";
export type ProductRole = "best" | "budget" | "sensitive" | "strongest";

export interface Product {
  id: string;
  brand: string;
  name: string;
  category: string;
  ingredient_tags: string[];
  skin_context_tags: string[];
  region: Region;
  merchant: string;
  affiliate_network: AffiliateNetwork;
  affiliate_url: string;
  fallback_url?: string;
  price_tier: PriceTier;
  strength_tier?: StrengthTier;
  // Sprint 9: Product classification and reasoning
  role?: ProductRole;
  why?: string;
  who?: string;
  caution?: string;
}

// Product database with affiliate-ready metadata
const PRODUCT_DB: Product[] = [
  // Cleansers
  {
    id: "cerave-hydrating-cleanser",
    name: "Hydrating Facial Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    ingredient_tags: ["ceramides", "hyaluronic acid", "glycerin"],
    skin_context_tags: ["dry", "sensitive", "barrier-compromised"],
    region: "US",
    merchant: "Amazon",
    affiliate_network: "amazon",
    affiliate_url: "https://www.amazon.com/dp/B01MSSDEPK",
    price_tier: "budget",
  },
  {
    id: "lrp-toleriane-cleanser",
    name: "Toleriane Hydrating Gentle Cleanser",
    brand: "La Roche-Posay",
    category: "cleanser",
    ingredient_tags: ["ceramides", "niacinamide", "glycerin"],
    skin_context_tags: ["sensitive", "reactive", "barrier-compromised"],
    region: "US",
    merchant: "Amazon",
    affiliate_network: "amazon",
    affiliate_url: "https://www.amazon.com/dp/B01N7T7JKJ",
    price_tier: "mid",
  },
  {
    id: "cerave-sa-cleanser",
    name: "SA Smoothing Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    ingredient_tags: ["salicylic acid", "ceramides", "niacinamide"],
    skin_context_tags: ["oily", "acne-prone", "texture"],
    region: "US",
    merchant: "Amazon",
    affiliate_network: "amazon",
    affiliate_url: "https://www.amazon.com/dp/B00U1YCRD8",
    price_tier: "budget",
    strength_tier: "standard",
  },

  // Moisturizers
  {
    id: "cerave-daily-moisturizer",
    name: "Daily Moisturizing Lotion",
    brand: "CeraVe",
    category: "moisturizer",
    ingredient_tags: ["ceramides", "hyaluronic acid", "glycerin"],
    skin_context_tags: ["dry", "normal", "barrier-repair"],
    region: "US",
    merchant: "Amazon",
    affiliate_network: "amazon",
    affiliate_url: "https://www.amazon.com/dp/B000YJ2SKM",
    price_tier: "budget",
  },
  {
    id: "lrp-toleriane-double-repair",
    name: "Toleriane Double Repair Face Moisturizer",
    brand: "La Roche-Posay",
    category: "moisturizer",
    ingredient_tags: ["ceramides", "niacinamide", "glycerin"],
    skin_context_tags: ["sensitive", "barrier-compromised"],
    region: "US",
    merchant: "Amazon",
    affiliate_network: "amazon",
    affiliate_url: "https://www.amazon.com/dp/B01N9SPQHQ",
    price_tier: "mid",
  },
  {
    id: "to-nmf-ha",
    name: "Natural Moisturizing Factors + HA",
    brand: "The Ordinary",
    category: "moisturizer",
    ingredient_tags: ["hyaluronic acid", "amino acids", "ceramides"],
    skin_context_tags: ["dry", "dehydrated"],
    region: "GLOBAL",
    merchant: "The Ordinary",
    affiliate_network: "direct",
    affiliate_url: "https://theordinary.com/en-us/natural-moisturizing-factors-ha-face-moisturizer-100419.html",
    price_tier: "budget",
  },

  // SPF
  {
    id: "cerave-am-spf",
    name: "AM Facial Moisturizing Lotion SPF 30",
    brand: "CeraVe",
    category: "spf",
    ingredient_tags: ["ceramides", "niacinamide", "hyaluronic acid", "zinc oxide"],
    skin_context_tags: ["daily-protection", "sensitive"],
    region: "US",
    merchant: "Amazon",
    affiliate_network: "amazon",
    affiliate_url: "https://www.amazon.com/dp/B00F97FHAW",
    price_tier: "budget",
  },
  {
    id: "lrp-anthelios-spf60",
    name: "Anthelios Melt-in Milk Sunscreen SPF 60",
    brand: "La Roche-Posay",
    category: "spf",
    ingredient_tags: ["chemical-filters", "antioxidants"],
    skin_context_tags: ["daily-protection", "water-resistant"],
    region: "US",
    merchant: "Amazon",
    affiliate_network: "amazon",
    affiliate_url: "https://www.amazon.com/dp/B002CML1W0",
    price_tier: "mid",
  },

  // Niacinamide Serums
  {
    id: "to-niacinamide-10",
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "serum",
    ingredient_tags: ["niacinamide", "zinc"],
    skin_context_tags: ["oily", "acne-prone", "pores"],
    region: "GLOBAL",
    merchant: "The Ordinary",
    affiliate_network: "direct",
    affiliate_url: "https://theordinary.com/en-us/niacinamide-10-zinc-1-serum-100436.html",
    price_tier: "budget",
    strength_tier: "strong",
  },
  {
    id: "pc-niacinamide-10",
    name: "10% Niacinamide Booster",
    brand: "Paula's Choice",
    category: "serum",
    ingredient_tags: ["niacinamide", "vitamin c", "licorice extract"],
    skin_context_tags: ["brightening", "texture", "pores"],
    region: "US",
    merchant: "Paula's Choice",
    affiliate_network: "direct",
    affiliate_url: "https://www.paulaschoice.com/10pct-niacinamide-booster/764.html",
    price_tier: "mid",
    strength_tier: "strong",
  },

  // Salicylic Acid
  {
    id: "pc-bha-2",
    name: "2% BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    category: "treatment",
    ingredient_tags: ["salicylic acid", "green tea"],
    skin_context_tags: ["oily", "acne-prone", "blackheads"],
    region: "US",
    merchant: "Paula's Choice",
    affiliate_network: "direct",
    affiliate_url: "https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201.html",
    price_tier: "mid",
    strength_tier: "standard",
  },
  {
    id: "to-salicylic-2",
    name: "Salicylic Acid 2% Solution",
    brand: "The Ordinary",
    category: "treatment",
    ingredient_tags: ["salicylic acid"],
    skin_context_tags: ["acne-prone", "blackheads"],
    region: "GLOBAL",
    merchant: "The Ordinary",
    affiliate_network: "direct",
    affiliate_url: "https://theordinary.com/en-us/salicylic-acid-2pct-solution-100411.html",
    price_tier: "budget",
    strength_tier: "standard",
  },

  // Retinoids
  {
    id: "to-retinol-05",
    name: "Retinol 0.5% in Squalane",
    brand: "The Ordinary",
    category: "treatment",
    ingredient_tags: ["retinol", "squalane"],
    skin_context_tags: ["anti-aging", "texture", "acne"],
    region: "GLOBAL",
    merchant: "The Ordinary",
    affiliate_network: "direct",
    affiliate_url: "https://theordinary.com/en-us/retinol-0-5pct-in-squalane-100393.html",
    price_tier: "budget",
    strength_tier: "standard",
  },
  {
    id: "pc-retinol-1",
    name: "Clinical 1% Retinol Treatment",
    brand: "Paula's Choice",
    category: "treatment",
    ingredient_tags: ["retinol", "peptides", "licorice extract"],
    skin_context_tags: ["anti-aging", "texture", "advanced"],
    region: "US",
    merchant: "Paula's Choice",
    affiliate_network: "direct",
    affiliate_url: "https://www.paulaschoice.com/clinical-1pct-retinol-treatment/803.html",
    price_tier: "premium",
    strength_tier: "strong",
  },
  {
    id: "differin-adapalene",
    name: "Adapalene Gel 0.1%",
    brand: "Differin",
    category: "treatment",
    ingredient_tags: ["adapalene", "retinoid"],
    skin_context_tags: ["acne", "texture", "otc-rx"],
    region: "US",
    merchant: "Amazon",
    affiliate_network: "amazon",
    affiliate_url: "https://www.amazon.com/dp/B07P34W8TK",
    price_tier: "mid",
    strength_tier: "strong",
  },

  // Barrier Repair
  {
    id: "lrp-cicaplast-baume",
    name: "Cicaplast Baume B5",
    brand: "La Roche-Posay",
    category: "moisturizer",
    ingredient_tags: ["panthenol", "shea butter", "glycerin"],
    skin_context_tags: ["barrier-repair", "sensitive", "irritated"],
    region: "US",
    merchant: "Amazon",
    affiliate_network: "amazon",
    affiliate_url: "https://www.amazon.com/dp/B0060D82V4",
    price_tier: "mid",
  },
  {
    id: "cerave-healing-ointment",
    name: "Healing Ointment",
    brand: "CeraVe",
    category: "moisturizer",
    ingredient_tags: ["ceramides", "hyaluronic acid", "petrolatum"],
    skin_context_tags: ["barrier-repair", "occlusive", "severe-dryness"],
    region: "US",
    merchant: "Amazon",
    affiliate_network: "amazon",
    affiliate_url: "https://www.amazon.com/dp/B0009ET7BK",
    price_tier: "budget",
  },

  // Azelaic Acid
  {
    id: "pc-azelaic-10",
    name: "Azelaic Acid 10% Booster",
    brand: "Paula's Choice",
    category: "treatment",
    ingredient_tags: ["azelaic acid", "salicylic acid", "licorice extract"],
    skin_context_tags: ["redness", "texture", "brightening"],
    region: "US",
    merchant: "Paula's Choice",
    affiliate_network: "direct",
    affiliate_url: "https://www.paulaschoice.com/10pct-azelaic-acid-booster/784.html",
    price_tier: "mid",
    strength_tier: "standard",
  },
  {
    id: "to-azelaic-10",
    name: "Azelaic Acid Suspension 10%",
    brand: "The Ordinary",
    category: "treatment",
    ingredient_tags: ["azelaic acid"],
    skin_context_tags: ["redness", "texture", "acne"],
    region: "GLOBAL",
    merchant: "The Ordinary",
    affiliate_network: "direct",
    affiliate_url: "https://theordinary.com/en-us/azelaic-acid-suspension-10pct-100404.html",
    price_tier: "budget",
    strength_tier: "standard",
  },

  // Benzoyl Peroxide
  {
    id: "cerave-bp-cleanser",
    name: "Acne Foaming Cream Cleanser 10%",
    brand: "CeraVe",
    category: "cleanser",
    ingredient_tags: ["benzoyl peroxide", "ceramides", "hyaluronic acid"],
    skin_context_tags: ["acne", "severe", "body-acne"],
    region: "US",
    merchant: "Amazon",
    affiliate_network: "amazon",
    affiliate_url: "https://www.amazon.com/dp/B08SYCRXLR",
    price_tier: "budget",
    strength_tier: "strong",
  },
  {
    id: "pc-bp-25",
    name: "Clear Regular Strength 2.5%",
    brand: "Paula's Choice",
    category: "treatment",
    ingredient_tags: ["benzoyl peroxide"],
    skin_context_tags: ["acne", "spot-treatment"],
    region: "US",
    merchant: "Paula's Choice",
    affiliate_network: "direct",
    affiliate_url: "https://www.paulaschoice.com/clear-regular-strength-daily-skin-clearing-treatment/620.html",
    price_tier: "mid",
    strength_tier: "gentle",
  },
];

/**
 * Get products that match ingredient tags, filtered by price tier and region.
 * Prefers region-specific products, falls back to GLOBAL.
 */
export function getProductsForIngredient(
  ingredient: string,
  tier: PriceTier = "mid",
  region: Region = "GLOBAL"
): Product[] {
  const normalizedIngredient = ingredient.toLowerCase().trim();

  // First try: match region and ingredient
  let matches = PRODUCT_DB.filter((p) => {
    const hasMatchingIngredient =
      p.ingredient_tags.some((tag) =>
        normalizedIngredient.includes(tag) || tag.includes(normalizedIngredient)
      ) ||
      p.skin_context_tags.some((tag) =>
        normalizedIngredient.includes(tag) || tag.includes(normalizedIngredient)
      ) ||
      p.category.toLowerCase() === normalizedIngredient;

    const matchesRegion = p.region === region || p.region === "GLOBAL";
    const matchesTier = p.price_tier === tier;

    return hasMatchingIngredient && matchesRegion && matchesTier;
  });

  // If no matches, try global products only
  if (matches.length === 0) {
    matches = PRODUCT_DB.filter((p) => {
      const hasMatchingIngredient =
        p.ingredient_tags.some((tag) =>
          normalizedIngredient.includes(tag) || tag.includes(normalizedIngredient)
        ) ||
        p.skin_context_tags.some((tag) =>
          normalizedIngredient.includes(tag) || tag.includes(normalizedIngredient)
        ) ||
        p.category.toLowerCase() === normalizedIngredient;

      return hasMatchingIngredient && p.region === "GLOBAL" && p.price_tier === tier;
    });
  }

  // Limit to 3 products per ingredient
  return matches.slice(0, 3);
}

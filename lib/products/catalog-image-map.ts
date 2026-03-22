/**
 * Catalog Image Mapping Layer v1
 * Deterministic mapping from catalog-v1 products to pack1 visual assets
 * Preserves product differentiation by role, category, and visual characteristics
 */

/**
 * Pack1 image inventory (12 assets):
 * - Serums: 4 variants (gentle_hydrating, active_moderate x2, active_clinical)
 * - Moisturizers: 3 variants (lightweight, medium, rich)
 * - Cleansers: 2 variants (gentle, deep)
 * - Sunscreens: 2 variants (matte, glossy)
 * - Treatments: 1 variant (calming/neutral)
 */

const PACK1_IMAGES = {
  // Serums
  serum_gentle_hydrating: "/pack1/4528d520-2095-417c-a8fa-1b43d617be7c.png",
  serum_active_moderate: "/pack1/2854538a-0eae-4985-8c7c-0f3a4c032956.png",
  serum_active_moderate_alt: "/pack1/4a825ae9-c62a-4876-910a-6202fe187b40.png",
  serum_clinical_strength: "/pack1/5042c19f-3d0e-4d86-a5d5-1db174338b4a.png",

  // Moisturizers
  moisturizer_lightweight: "/pack1/a8f55b7f-84f2-4060-8174-fae3a7e02aab.png",
  moisturizer_medium: "/pack1/b46aee69-36df-4252-bd87-dd4c08a6b197.png",
  moisturizer_rich: "/pack1/b5229b96-2af6-48ea-8950-343028860ea8.png",

  // Cleansers
  cleanser_gentle: "/pack1/b7a96626-ea93-49c6-bd8d-e6a73d796c21.png",
  cleanser_deep: "/pack1/b9314b59-63a0-4058-aaba-9a7fa62ac694.png",

  // Sunscreens
  sunscreen_matte: "/pack1/c869d2a1-20ce-4e0b-b13a-43b7a90a1450.png",
  sunscreen_glossy: "/pack1/d44d974f-15c7-40b3-bc98-0e3c3348696b.png",

  // Treatments
  treatment_neutral: "/pack1/f333dce4-2eec-4a0c-b64b-ce3445dcace7.png",
} as const;

/**
 * Deterministic product-to-image mapping
 * Maps catalog-v1 product IDs to appropriate pack1 visual assets
 * Preserves visual differentiation by role, category, and intensity
 */
export const CATALOG_IMAGE_MAP: Record<string, string> = {
  // CLEANSERS (6 products → 2 images)
  // Gentle cleansers → gentle cleanser image
  "cerave-hydrating-cleanser": PACK1_IMAGES.cleanser_gentle,
  "lrp-toleriane-hydrating-gentle-cleanser": PACK1_IMAGES.cleanser_gentle,
  "ordinary-glycolipid-cream-cleanser": PACK1_IMAGES.cleanser_gentle,
  "vanicream-gentle-facial-cleanser": PACK1_IMAGES.cleanser_gentle,

  // Gel/active cleansers → deep cleanser image
  "cerave-foaming-facial-cleanser": PACK1_IMAGES.cleanser_deep,
  "inkey-list-salicylic-acid-cleanser": PACK1_IMAGES.cleanser_deep,

  // MOISTURIZERS (6 products → 3 images)
  // Gel moisturizers → lightweight
  "neutrogena-hydro-boost-water-gel": PACK1_IMAGES.moisturizer_lightweight,
  "aveeno-calm-restore-oat-gel-moisturizer": PACK1_IMAGES.moisturizer_lightweight,

  // Lotion moisturizers → medium
  "cerave-daily-moisturizing-lotion": PACK1_IMAGES.moisturizer_medium,
  "lrp-toleriane-double-repair-moisturizer": PACK1_IMAGES.moisturizer_medium,

  // Cream/balm moisturizers → rich
  "fab-ultra-repair-cream": PACK1_IMAGES.moisturizer_rich,
  "lrp-cicaplast-baume-b5": PACK1_IMAGES.moisturizer_rich,

  // SUNSCREENS (4 products → 2 images)
  // Matte/mineral sunscreens → matte sunscreen image
  "lrp-anthelios-invisible-fluid-spf50": PACK1_IMAGES.sunscreen_matte,
  "eltamd-uv-clear-spf46": PACK1_IMAGES.sunscreen_matte,
  "cerave-hydrating-mineral-spf50": PACK1_IMAGES.sunscreen_matte,

  // Dewy/glossy sunscreens → glossy sunscreen image
  "beauty-of-joseon-relief-sun-spf50": PACK1_IMAGES.sunscreen_glossy,

  // SERUMS - VITAMIN C (3 products → 2 serum images)
  // Clinical/potent vitamin C → active moderate
  "skinceuticals-ce-ferulic": PACK1_IMAGES.serum_active_moderate,
  "ordinary-ascorbyl-tetraisopalmitate-20": PACK1_IMAGES.serum_active_moderate,

  // Gentle vitamin C → gentle hydrating serum
  "ordinary-ascorbyl-glucoside-12": PACK1_IMAGES.serum_gentle_hydrating,

  // SERUMS - PEPTIDES (2 products → gentle serum)
  "ordinary-multi-peptide-copper-peptides-1": PACK1_IMAGES.serum_gentle_hydrating,
  "niod-cais-3-1-1": PACK1_IMAGES.serum_gentle_hydrating,

  // TREATMENTS - ACTIVES (5 products → clinical/active images)
  // Strong actives → clinical strength
  "paulas-choice-2-bha-liquid": PACK1_IMAGES.serum_clinical_strength,
  "benzac-ac-2-5-gel": PACK1_IMAGES.serum_clinical_strength,

  // Moderate actives → active moderate alt
  "ordinary-azelaic-acid-10": PACK1_IMAGES.serum_active_moderate_alt,
  "ordinary-glycolic-acid-7-toning-solution": PACK1_IMAGES.serum_active_moderate_alt,
  "ordinary-lactic-acid-5-ha": PACK1_IMAGES.serum_active_moderate_alt,

  // SERUMS - NIACINAMIDE (1 product → active moderate)
  "ordinary-niacinamide-10-zinc-1": PACK1_IMAGES.serum_active_moderate,

  // TREATMENTS - RETINOIDS (2 products → clinical strength)
  "ordinary-retinol-0-2-squalane": PACK1_IMAGES.serum_clinical_strength,
  "ordinary-granactive-retinoid-2-emulsion": PACK1_IMAGES.serum_active_moderate_alt,

  // SUPPORT SERUMS (3 products → gentle/neutral)
  // Hydration support → gentle hydrating
  "ordinary-hyaluronic-acid-2-b5": PACK1_IMAGES.serum_gentle_hydrating,
  "ordinary-100-squalane": PACK1_IMAGES.serum_gentle_hydrating,

  // Barrier/calming support → treatment neutral
  "dr-jart-cicapair-tiger-grass-serum": PACK1_IMAGES.treatment_neutral,
  "inkey-list-ceramide-serum": PACK1_IMAGES.treatment_neutral,
};

/**
 * Resolve image URL for a catalog product
 * Returns mapped pack1 image or fallback placeholder
 */
export function getCatalogProductImage(productId: string): string {
  return CATALOG_IMAGE_MAP[productId] || "/pack1/placeholder.png";
}

/**
 * Get all unique images used in mapping
 * Useful for preloading or validation
 */
export function getUsedImages(): string[] {
  return Array.from(new Set(Object.values(CATALOG_IMAGE_MAP)));
}

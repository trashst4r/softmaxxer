import type { SkinScores } from "@/types/analysis";

/**
 * Derive primary skin profile from score patterns.
 * Profile emerges from dominant scores, not hardcoded selection.
 */
export function deriveProfile(scores: SkinScores): string {
  const { acne_severity, oil_production, dryness_dehydration, sensitivity_reactivity, barrier_health } = scores;

  // Define thresholds
  const HIGH_THRESHOLD = 60;
  const MODERATE_THRESHOLD = 35;
  const LOW_BARRIER_THRESHOLD = 50; // Barrier is inverse

  // Check for barrier-compromised state first (highest priority)
  if (barrier_health < LOW_BARRIER_THRESHOLD && (dryness_dehydration > MODERATE_THRESHOLD || sensitivity_reactivity > MODERATE_THRESHOLD)) {
    return "Barrier-Compromised";
  }

  // Sensitive/Reactive profile
  if (sensitivity_reactivity >= HIGH_THRESHOLD) {
    if (dryness_dehydration > oil_production) {
      return "Sensitive Dry";
    } else if (oil_production > dryness_dehydration) {
      return "Sensitive Oily";
    } else {
      return "Sensitive Combination";
    }
  }

  // Oily Acne-Prone profile
  if (oil_production >= HIGH_THRESHOLD && acne_severity >= HIGH_THRESHOLD) {
    return "Oily Acne-Prone";
  }

  // Acne-Prone but not necessarily oily
  if (acne_severity >= HIGH_THRESHOLD && oil_production < HIGH_THRESHOLD) {
    return "Acne-Prone";
  }

  // Dry/Dehydrated profile
  if (dryness_dehydration >= HIGH_THRESHOLD && oil_production < MODERATE_THRESHOLD) {
    return "Dry Dehydrated";
  }

  // Oily but minimal acne
  if (oil_production >= HIGH_THRESHOLD && acne_severity < MODERATE_THRESHOLD) {
    return "Oily";
  }

  // Combination profile (both oil and dryness present)
  if (
    oil_production >= MODERATE_THRESHOLD &&
    dryness_dehydration >= MODERATE_THRESHOLD &&
    Math.abs(oil_production - dryness_dehydration) < 20
  ) {
    return "Combination";
  }

  // Balanced/Maintenance profile (no major issues)
  if (
    acne_severity < MODERATE_THRESHOLD &&
    oil_production < MODERATE_THRESHOLD &&
    dryness_dehydration < MODERATE_THRESHOLD &&
    sensitivity_reactivity < MODERATE_THRESHOLD
  ) {
    return "Balanced";
  }

  // Default fallback based on dominant score
  const maxScore = Math.max(acne_severity, oil_production, dryness_dehydration, sensitivity_reactivity);

  if (maxScore === acne_severity) return "Acne-Prone";
  if (maxScore === oil_production) return "Oily";
  if (maxScore === dryness_dehydration) return "Dry";
  if (maxScore === sensitivity_reactivity) return "Sensitive";

  return "Normal";
}

/**
 * Generate profile summary text based on profile and scores
 */
export function generateProfileSummary(profile: string): string {
  const summaries: Record<string, string> = {
    "Oily Acne-Prone":
      "Your skin leans oily with frequent breakouts. Your routine is built around oil control, clear pores, and calming inflammation.",

    "Acne-Prone":
      "You're dealing with breakouts without much oiliness. We're keeping this routine focused on targeted treatment and hydration balance.",

    "Oily":
      "Your skin leans oily but breakouts aren't constant. We're focusing on oil control and pore refinement without overdrying.",

    "Dry Dehydrated":
      "Your skin leans dry and dehydrated right now. We're keeping this routine focused on barrier support and consistent hydration.",

    "Sensitive Dry":
      "Your skin leans dry and reactive. Your routine is built around gentle hydration and barrier support with calm actives.",

    "Sensitive Oily":
      "Your skin leans oily but reacts easily. We're balancing oil control with gentle, non-irritating options.",

    "Sensitive Combination":
      "Your skin is reactive with mixed zones. We're focusing on gentle products that work across different areas.",

    "Combination":
      "Your skin shows oiliness in some areas and dryness in others. We're keeping this routine balanced for both zones.",

    "Barrier-Compromised":
      "Your skin is showing signs of barrier stress. We're pausing actives temporarily and focusing on barrier repair and hydration.",

    "Sensitive":
      "Your skin reacts easily to most things. We're keeping this routine minimal, gentle, and focused on barrier support.",

    "Balanced":
      "Your skin is in good shape overall. We're focusing on prevention, protection, and gentle maintenance.",

    "Normal":
      "Your skin doesn't have major concerns right now. We're keeping this routine simple and preventive.",
  };

  return summaries[profile] || "We're building a balanced maintenance routine for you.";
}

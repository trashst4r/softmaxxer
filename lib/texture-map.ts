/**
 * Texture Pack 2 Integration
 * Deterministic skin state to clinical texture mapping
 * Maps analysis output to visual texture assets for clinical credibility
 */

import type { SkinProfile } from "@/types/skin-profile";

/**
 * Skin texture visual types
 * Represents clinical texture assets in /public/textures
 */
export type SkinTextureType = "balanced" | "roughness" | "compromised";

/**
 * Texture metadata including asset path and optimal positioning
 */
interface TextureMetadata {
  asset: string;
  objectPosition: string; // CSS object-position value
  description: string;
}

/**
 * Texture asset paths and positioning metadata
 * Maps to actual clinical texture files in /public/pack2/
 * Available assets:
 * - flawless.png: Clean, healthy skin texture
 * - roughness.png: Visible texture irregularity, enlarged pores
 * - dry.png: Barrier disruption, compromised state
 * - oily.png: Excess sebum, shine
 * - fragile.png: Sensitive, reactive skin
 * - inflamed-redness.png: Active inflammation
 */
const TEXTURE_METADATA: Record<SkinTextureType, TextureMetadata> = {
  balanced: {
    asset: "/pack2/flawless.png",
    objectPosition: "center center",
    description: "Smooth, healthy skin surface",
  },
  roughness: {
    asset: "/pack2/roughness.png",
    objectPosition: "center 45%", // Slightly above center to capture pore detail
    description: "Visible texture irregularity and enlarged pores",
  },
  compromised: {
    asset: "/pack2/dry.png",
    objectPosition: "center center", // Center to preserve crack structure
    description: "Barrier disruption with visible cracking",
  },
};

/**
 * Deterministic mapping from skin profile to texture type
 * Maps analysis state flags to appropriate clinical texture visual
 */
export function getSkinTexture(profile: SkinProfile): SkinTextureType {
  // COMPROMISED: Reactive skin + barrier concerns
  if (
    profile.sensitivity === "reactive" ||
    profile.priorityGoal === "barrier_strengthen" ||
    profile.priorityGoal === "redness_calm"
  ) {
    return "compromised";
  }

  // ROUGHNESS: Texture concerns or persistent breakouts
  if (
    profile.priorityGoal === "texture_smooth" ||
    profile.breakoutProneness === "persistent" ||
    profile.breakoutProneness === "frequent"
  ) {
    return "roughness";
  }

  // BALANCED: Default healthy state or mild concerns
  return "balanced";
}

/**
 * Get texture asset path for a skin profile
 * Returns full asset path for use in Image components
 */
export function getTextureAsset(profile: SkinProfile): string {
  const textureType = getSkinTexture(profile);
  return TEXTURE_METADATA[textureType].asset;
}

/**
 * Get texture object-position for optimal detail preservation
 * Returns CSS object-position value
 */
export function getTexturePosition(profile: SkinProfile): string {
  const textureType = getSkinTexture(profile);
  return TEXTURE_METADATA[textureType].objectPosition;
}

/**
 * Get full texture metadata for a skin profile
 */
export function getTextureMetadata(profile: SkinProfile): TextureMetadata {
  const textureType = getSkinTexture(profile);
  return TEXTURE_METADATA[textureType];
}

/**
 * Get protocol label from SkinProfile
 * Unified source of truth for dashboard protocol card label
 */
export function getProtocolLabel(profile: SkinProfile): string {
  // COMPROMISED: Reactive skin + barrier concerns
  if (
    profile.sensitivity === "reactive" ||
    profile.priorityGoal === "barrier_strengthen" ||
    profile.priorityGoal === "redness_calm"
  ) {
    if (profile.hydrationNeed === "high") {
      return "Barrier Compromised + Dehydrated";
    }
    if (profile.priorityGoal === "redness_calm") {
      return "Reactive + Redness";
    }
    return "Barrier Compromised";
  }

  // ROUGHNESS: Texture concerns or persistent breakouts
  if (
    profile.priorityGoal === "texture_smooth" ||
    profile.breakoutProneness === "persistent" ||
    profile.breakoutProneness === "frequent"
  ) {
    if (profile.priorityGoal === "texture_smooth") {
      return "Texture Refinement";
    }
    return "Acne-Prone + Active";
  }

  // BALANCED: Default healthy state
  if (profile.hydrationNeed === "high") {
    return "Balanced + Hydration Support";
  }

  return "Balanced Maintenance";
}

/**
 * Get texture metadata for debugging and validation
 */
export function getTextureInfo(profile: SkinProfile): {
  type: SkinTextureType;
  asset: string;
  position: string;
  reason: string;
} {
  const type = getSkinTexture(profile);
  const metadata = TEXTURE_METADATA[type];

  let reason = "";
  if (type === "compromised") {
    reason = profile.sensitivity === "reactive"
      ? "Reactive sensitivity detected"
      : "Barrier strengthen or redness calm priority";
  } else if (type === "roughness") {
    reason = profile.priorityGoal === "texture_smooth"
      ? "Texture smoothing priority"
      : "Frequent or persistent breakouts";
  } else {
    reason = "Balanced skin state";
  }

  return {
    type,
    asset: metadata.asset,
    position: metadata.objectPosition,
    reason,
  };
}

/**
 * Get state badge label for protocol summary card
 * Returns clinical state label: Balanced, Texture Focus, or Barrier Risk
 */
export function getStateBadge(profile: SkinProfile): string {
  const textureType = getSkinTexture(profile);

  if (textureType === "compromised") {
    return "Barrier Risk";
  } else if (textureType === "roughness") {
    return "Texture Focus";
  }

  return "Balanced";
}

/**
 * Get clinical summary bullets for protocol card
 * Returns 2-3 explanatory bullets derived from SkinProfile
 */
export function getSummaryBullets(profile: SkinProfile): string[] {
  const textureType = getSkinTexture(profile);
  const bullets: string[] = [];

  // COMPROMISED state
  if (textureType === "compromised") {
    if (profile.sensitivity === "reactive") {
      bullets.push("Reactive sensitivity requires gentle barrier support");
    }
    if (profile.priorityGoal === "barrier_strengthen") {
      bullets.push("Focus on strengthening protective barrier function");
    }
    if (profile.priorityGoal === "redness_calm") {
      bullets.push("Calming protocol targets visible redness");
    }
    if (profile.hydrationNeed === "high") {
      bullets.push("Dehydration compounds barrier vulnerability");
    }

    // Fallback if no specific conditions matched
    if (bullets.length === 0) {
      bullets.push("Barrier protection is your primary focus");
    }

    return bullets.slice(0, 3);
  }

  // ROUGHNESS state
  if (textureType === "roughness") {
    if (profile.priorityGoal === "texture_smooth") {
      bullets.push("Surface texture refinement through gentle exfoliation");
    }
    if (profile.breakoutProneness === "persistent" || profile.breakoutProneness === "frequent") {
      bullets.push("Active breakout management with targeted actives");
      bullets.push("Consistent routine minimizes future breakouts");
    }
    if (profile.oiliness === "oily_all" || profile.oiliness === "oily_tzone") {
      bullets.push("Oil control supports pore appearance");
    }

    // Ensure at least 2 bullets
    if (bullets.length === 1) {
      bullets.push("Consistent routine improves texture over time");
    }

    return bullets.slice(0, 3);
  }

  // BALANCED state
  bullets.push("Skin barrier is stable and functioning well");

  if (profile.hydrationNeed === "high") {
    bullets.push("Hydration support maintains plump appearance");
  }

  if (profile.oiliness === "dry") {
    bullets.push("Light moisture preservation prevents tightness");
  } else if (profile.oiliness === "oily_all") {
    bullets.push("Oil regulation keeps shine in check");
  }

  // Default maintenance message if only one bullet
  if (bullets.length < 2) {
    bullets.push("Focus on maintaining current healthy state");
  }

  return bullets.slice(0, 3);
}

/**
 * Get protocol title (alias for getProtocolLabel)
 * Ensures consistent naming across codebase
 */
export function getProtocolTitle(profile: SkinProfile): string {
  return getProtocolLabel(profile);
}

/**
 * Get primary concern label from SkinProfile
 * Derives the main concern from profile state for dashboard display
 */
export function getPrimaryConcern(profile: SkinProfile): string {
  const textureType = getSkinTexture(profile);

  // COMPROMISED state concerns
  if (textureType === "compromised") {
    if (profile.priorityGoal === "redness_calm") {
      return "Redness + Inflammation";
    }
    if (profile.priorityGoal === "barrier_strengthen") {
      return "Barrier Dysfunction";
    }
    if (profile.hydrationNeed === "high") {
      return "Dehydration";
    }
    return "Barrier Sensitivity";
  }

  // ROUGHNESS state concerns
  if (textureType === "roughness") {
    if (profile.priorityGoal === "texture_smooth") {
      return "Texture Irregularity";
    }
    if (profile.breakoutProneness === "persistent") {
      return "Persistent Acne";
    }
    if (profile.breakoutProneness === "frequent") {
      return "Frequent Breakouts";
    }
    return "Texture + Breakouts";
  }

  // BALANCED state concerns
  if (profile.hydrationNeed === "high") {
    return "Hydration Support";
  }
  if (profile.oiliness === "dry") {
    return "Dryness";
  }
  if (profile.oiliness === "oily_all") {
    return "Oil Control";
  }

  return "Maintenance";
}

/**
 * Sprint D3: Autofill Prefill
 *
 * Converts mock face scan signals into partial check-in answers.
 * User can review and override all prefilled values.
 */

import type {
  ScanSignals,
  PrimaryConcern,
  SkinBehavior,
  Frequency,
  Sensitivity,
} from "./types";

interface PrefillAnswers {
  concerns: PrimaryConcern[];
  skin_behaviors?: SkinBehavior[];
  concern_severity?: Frequency;
  sensitivity?: Sensitivity;
}

/**
 * Converts scan signals to partial check-in answers
 * All values are overridable by user
 */
export function prefillFromScan(scan: ScanSignals): PrefillAnswers {
  const answers: PrefillAnswers = {
    concerns: inferConcerns(scan),
    skin_behaviors: inferSkinBehaviors(scan),
    concern_severity: inferSeverity(scan),
    sensitivity: inferSensitivity(scan),
  };

  return answers;
}

/**
 * Infer primary concerns from scan signals
 * Returns ordered array (most significant first)
 */
function inferConcerns(scan: ScanSignals): PrimaryConcern[] {
  const concerns: PrimaryConcern[] = [];

  // Threshold-based detection
  if (scan.blemish > 40) concerns.push("breakouts");
  if (scan.shine > 60) concerns.push("oiliness");
  if (scan.redness > 50) concerns.push("redness");
  if (scan.texture > 55) concerns.push("texture");

  // Dryness inferred from LOW shine + high texture
  if (scan.shine < 25 && scan.texture > 45) {
    concerns.push("dryness");
  }

  // Ensure at least one concern (default to texture if nothing detected)
  if (concerns.length === 0) {
    concerns.push("texture");
  }

  return concerns;
}

/**
 * Infer skin behaviors from scan signals
 */
function inferSkinBehaviors(scan: ScanSignals): SkinBehavior[] {
  const behaviors: SkinBehavior[] = [];

  if (scan.shine > 70) {
    behaviors.push("oily_all");
  } else if (scan.shine >= 45 && scan.shine <= 70) {
    behaviors.push("oily_tzone");
  } else if (scan.shine < 30) {
    behaviors.push("tight_dry");
  }

  // Balanced as default if nothing else detected
  if (behaviors.length === 0) {
    behaviors.push("balanced");
  }

  return behaviors;
}

/**
 * Infer concern severity from signal intensity
 * Uses highest signal as proxy for severity
 */
function inferSeverity(scan: ScanSignals): Frequency {
  const maxSignal = Math.max(
    scan.shine,
    scan.redness,
    scan.blemish,
    scan.texture
  );

  if (maxSignal >= 75) return "constant";
  if (maxSignal >= 55) return "often";
  if (maxSignal >= 35) return "sometimes";
  return "rarely";
}

/**
 * Infer sensitivity from redness signal
 */
function inferSensitivity(scan: ScanSignals): Sensitivity {
  if (scan.redness >= 65) return "very_easily";
  if (scan.redness >= 35) return "sometimes";
  return "rarely";
}

/**
 * Generate mock scan signals for testing
 * In production, this would come from actual face scan
 */
export function generateMockScan(): ScanSignals {
  return {
    shine: Math.floor(Math.random() * 100),
    redness: Math.floor(Math.random() * 100),
    blemish: Math.floor(Math.random() * 100),
    texture: Math.floor(Math.random() * 100),
  };
}

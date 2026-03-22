/**
 * Sprint 16 Correction: Scan Influence Layer (Simplified)
 * Scan outputs reinforce interpretation without introducing micro-adjustments.
 * Focus on high-level area emphasis, not technique or product dictation.
 */

import type { ProScanResult } from "@/types/face-scan";
import type { AnalysisResult } from "@/types/analysis";
import { interpretSkinState } from "./skin-state-analyzer";

export interface ScanInfluencedAdjustment {
  area: string; // e.g., "T-zone", "Lower face", "Mid-face"
  emphasis: string; // e.g., "Primary focus area", "Secondary attention needed"
  reasoning: string; // Why this area matters based on skin state
}

export interface ScanProtocolIntegration {
  hasValidScan: boolean;
  scanQuality: string; // "High", "Moderate", "Low"
  adjustments: ScanInfluencedAdjustment[];
  overallGuidance: string; // Summary statement reinforcing interpretation
}

/**
 * Analyze scan data and generate high-level area emphasis.
 * Returns supportive guidance that reinforces existing interpretation.
 */
export function generateScanProtocolIntegration(
  scan: ProScanResult | null,
  analysis: AnalysisResult
): ScanProtocolIntegration {
  // No scan available - return empty integration
  if (!scan || !scan.quality.hasValidLandmarks) {
    return {
      hasValidScan: false,
      scanQuality: "None",
      adjustments: [],
      overallGuidance: "Complete a Pro face scan to highlight areas of focus for your protocol.",
    };
  }

  // Validate scan quality
  const scanQuality = getScanQuality(scan);
  if (scan.quality.confidence < 0.7) {
    return {
      hasValidScan: false,
      scanQuality: "Low",
      adjustments: [],
      overallGuidance: "Scan confidence too low for reliable insights. Re-scan with better lighting.",
    };
  }

  const adjustments: ScanInfluencedAdjustment[] = [];

  // Facial thirds analysis → high-level area emphasis only
  const thirdsAdjustment = analyzeFacialThirds(scan, analysis);
  if (thirdsAdjustment) {
    adjustments.push(thirdsAdjustment);
  }

  // Generate overall guidance with interpretation context
  const overallGuidance = generateOverallGuidance(adjustments, scan, analysis);

  return {
    hasValidScan: true,
    scanQuality,
    adjustments,
    overallGuidance,
  };
}

/**
 * Determine scan quality level.
 */
function getScanQuality(scan: ProScanResult): string {
  if (scan.quality.confidence >= 0.9) return "High";
  if (scan.quality.confidence >= 0.75) return "Moderate";
  return "Low";
}

/**
 * Analyze facial thirds for high-level area emphasis.
 * Reinforces interpretation by highlighting where to focus attention.
 */
function analyzeFacialThirds(
  scan: ProScanResult,
  analysis: AnalysisResult
): ScanInfluencedAdjustment | null {
  const { upperThird, middleThird, lowerThird } = scan.metrics;

  // Identify which third is largest (dominant area)
  const thirds = [
    { name: "upper", value: upperThird, label: "Upper face" },
    { name: "middle", value: middleThird, label: "T-zone and mid-face" },
    { name: "lower", value: lowerThird, label: "Lower face" },
  ];

  const dominant = thirds.reduce((max, third) => (third.value > max.value ? third : max));

  // Only flag if significantly larger (>5% deviation from ideal 33.3%)
  if (dominant.value < 0.38) return null;

  // Match dominant area to skin concerns for high-level emphasis
  let reasoning = "";
  let emphasis = "";

  if (dominant.name === "lower" && analysis.scores.acne_severity > 60) {
    emphasis = "Primary focus area";
    reasoning =
      "Your lower face is a larger area where acne concerns are present. Give this zone appropriate attention in your routine.";
  } else if (dominant.name === "middle" && analysis.scores.oil_production > 65) {
    emphasis = "Primary focus area";
    reasoning =
      "Your T-zone and mid-face area is larger and shows elevated oil activity. This area benefits from consistent attention.";
  } else if (dominant.name === "upper" && analysis.scores.sensitivity_reactivity > 60) {
    emphasis = "Monitor carefully";
    reasoning =
      "Your upper face is a larger area with sensitivity present. Introduce new products gradually and observe this zone.";
  } else {
    return null; // No emphasis needed
  }

  return {
    area: dominant.label,
    emphasis,
    reasoning,
  };
}

/**
 * Generate supportive guidance that reinforces interpretation.
 */
function generateOverallGuidance(
  adjustments: ScanInfluencedAdjustment[],
  _scan: ProScanResult,
  analysis: AnalysisResult
): string {
  const interpretation = interpretSkinState(analysis);

  if (adjustments.length === 0) {
    return (
      "Your facial proportions are balanced. Continue with your protocol as planned, focusing on your primary driver: " +
      interpretation.primaryDriver +
      "."
    );
  }

  const areaName = adjustments[0].area;
  return (
    "Based on your facial structure, consider giving extra attention to your " +
    areaName.toLowerCase() +
    " as you work on your identified pattern: " +
    interpretation.underlyingPattern +
    "."
  );
}

/**
 * Sprint 10: Pro Face Scan Foundation
 * Types for client-side facial landmark analysis.
 */

export interface FaceLandmark {
  x: number; // Normalized 0-1
  y: number; // Normalized 0-1
  z: number; // Depth (normalized)
}

export interface FaceScanQuality {
  isFrontal: boolean;
  confidence: number;
  hasValidLandmarks: boolean;
  errorMessage?: string;
}

export interface DerivedFaceMetrics {
  // Symmetry
  horizontalSymmetry: number; // 0-1, 1 = perfect symmetry
  verticalSymmetry: number; // 0-1, 1 = perfect symmetry

  // Facial thirds (vertical proportions)
  upperThird: number; // Hairline to brow
  middleThird: number; // Brow to nose base
  lowerThird: number; // Nose base to chin

  // Eye region
  eyeSpacingRatio: number; // Inter-pupil distance / face width
  eyeWidthRatio: number; // Eye width / face width
  browEyeSpacing: number; // Normalized vertical distance

  // Mid-face
  noseWidthRatio: number; // Nose width / face width
  cheekboneWidth: number; // Normalized zygomatic width

  // Lower face
  lipWidthRatio: number; // Mouth width / face width
  jawWidthRatio: number; // Jaw width / face width
  chinProminence: number; // Normalized chin projection

  // Angular measurements
  jawAngle: number; // Gonial angle proxy (degrees)
  nasalAngle: number; // Nasolabial angle proxy (degrees)
}

export interface ProScanResult {
  scanId: string;
  timestamp: string;
  quality: FaceScanQuality;
  metrics: DerivedFaceMetrics;
  landmarkCount: number;
}

export interface ProScanHistory {
  scans: ProScanResult[];
  latestScanId?: string;
}

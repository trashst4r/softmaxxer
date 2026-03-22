/**
 * Sprint 10: Pro Face Scan Foundation
 * Deterministic facial ratio calculations from MediaPipe landmarks.
 * All ratios are normalized and clinical - no attractiveness scoring.
 */

import type { FaceLandmark, DerivedFaceMetrics } from "@/types/face-scan";

/**
 * MediaPipe Face Landmarker key indices (468 total landmarks).
 * Using canonical indices for major facial features.
 */
const LANDMARK_INDICES = {
  // Eye landmarks
  leftEyeInner: 133,
  leftEyeOuter: 33,
  rightEyeInner: 362,
  rightEyeOuter: 263,
  leftPupil: 468, // Iris landmark
  rightPupil: 473, // Iris landmark

  // Brow landmarks
  leftBrowInner: 70,
  leftBrowOuter: 46,
  rightBrowInner: 300,
  rightBrowOuter: 276,

  // Nose landmarks
  noseTip: 1,
  noseBase: 2,
  leftNostril: 98,
  rightNostril: 327,

  // Mouth landmarks
  leftMouthCorner: 61,
  rightMouthCorner: 291,
  upperLipTop: 0,
  lowerLipBottom: 17,

  // Face contour
  chin: 152,
  leftJaw: 234,
  rightJaw: 454,
  leftCheekbone: 234,
  rightCheekbone: 454,
  topOfHead: 10,
  leftTemple: 127,
  rightTemple: 356,
};

/**
 * Calculate Euclidean distance between two landmarks.
 */
function distance(p1: FaceLandmark, p2: FaceLandmark): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate midpoint between two landmarks.
 * Currently unused - kept for potential future use.
 */
// function midpoint(p1: FaceLandmark, p2: FaceLandmark): FaceLandmark {
//   return {
//     x: (p1.x + p2.x) / 2,
//     y: (p1.y + p2.y) / 2,
//     z: (p1.z + p2.z) / 2,
//   };
// }

/**
 * Calculate horizontal symmetry score (0-1).
 * Compares distances from facial midline to paired landmarks.
 */
function calculateHorizontalSymmetry(landmarks: FaceLandmark[]): number {
  try {
    const leftEyeInner = landmarks[LANDMARK_INDICES.leftEyeInner];
    const rightEyeInner = landmarks[LANDMARK_INDICES.rightEyeInner];
    const midline = (leftEyeInner.x + rightEyeInner.x) / 2;

    // Compare paired feature distances from midline
    const leftEyeOuter = landmarks[LANDMARK_INDICES.leftEyeOuter];
    const rightEyeOuter = landmarks[LANDMARK_INDICES.rightEyeOuter];

    const leftDist = Math.abs(leftEyeOuter.x - midline);
    const rightDist = Math.abs(rightEyeOuter.x - midline);

    const symmetryScore = 1 - Math.abs(leftDist - rightDist);
    return Math.max(0, Math.min(1, symmetryScore));
  } catch {
    return 0.5; // Fallback
  }
}

/**
 * Calculate vertical symmetry (facial balance).
 */
function calculateVerticalSymmetry(landmarks: FaceLandmark[]): number {
  try {
    const leftEye = landmarks[LANDMARK_INDICES.leftEyeInner];
    const rightEye = landmarks[LANDMARK_INDICES.rightEyeInner];

    // Vertical alignment of eyes
    const eyeHeightDiff = Math.abs(leftEye.y - rightEye.y);
    const symmetryScore = 1 - eyeHeightDiff * 5; // Scale factor
    return Math.max(0, Math.min(1, symmetryScore));
  } catch {
    return 0.5;
  }
}

/**
 * Calculate facial thirds ratios.
 */
function calculateFacialThirds(landmarks: FaceLandmark[]): {
  upper: number;
  middle: number;
  lower: number;
} {
  try {
    const topOfHead = landmarks[LANDMARK_INDICES.topOfHead];
    const brow = landmarks[LANDMARK_INDICES.leftBrowInner];
    const noseBase = landmarks[LANDMARK_INDICES.noseBase];
    const chin = landmarks[LANDMARK_INDICES.chin];

    const totalHeight = distance(topOfHead, chin);
    const upperThird = distance(topOfHead, brow);
    const middleThird = distance(brow, noseBase);
    const lowerThird = distance(noseBase, chin);

    return {
      upper: upperThird / totalHeight,
      middle: middleThird / totalHeight,
      lower: lowerThird / totalHeight,
    };
  } catch {
    return { upper: 0.33, middle: 0.33, lower: 0.33 };
  }
}

/**
 * Calculate derived face metrics from landmarks.
 */
export function calculateDerivedMetrics(landmarks: FaceLandmark[]): DerivedFaceMetrics {
  if (!landmarks || landmarks.length < 468) {
    throw new Error("Invalid landmark data: expected 468 landmarks");
  }

  // Get key landmarks
  const leftEye = landmarks[LANDMARK_INDICES.leftEyeInner];
  const rightEye = landmarks[LANDMARK_INDICES.rightEyeInner];
  const leftMouth = landmarks[LANDMARK_INDICES.leftMouthCorner];
  const rightMouth = landmarks[LANDMARK_INDICES.rightMouthCorner];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    const noseTip = landmarks[LANDMARK_INDICES.noseTip];
  const leftNostril = landmarks[LANDMARK_INDICES.leftNostril];
  const rightNostril = landmarks[LANDMARK_INDICES.rightNostril];

  // Calculate face width (inter-pupil distance as proxy)
  const faceWidth = distance(leftEye, rightEye);

  // Facial thirds
  const thirds = calculateFacialThirds(landmarks);

  // Eye metrics
  const eyeSpacing = distance(leftEye, rightEye);
  const leftEyeWidth = distance(
    landmarks[LANDMARK_INDICES.leftEyeInner],
    landmarks[LANDMARK_INDICES.leftEyeOuter]
  );
  const eyeSpacingRatio = eyeSpacing / faceWidth;
  const eyeWidthRatio = leftEyeWidth / faceWidth;

  // Nose metrics
  const noseWidth = distance(leftNostril, rightNostril);
  const noseWidthRatio = noseWidth / faceWidth;

  // Mouth metrics
  const mouthWidth = distance(leftMouth, rightMouth);
  const lipWidthRatio = mouthWidth / faceWidth;

  // Jaw metrics (simplified)
  const chin = landmarks[LANDMARK_INDICES.chin];
  const leftJaw = landmarks[LANDMARK_INDICES.leftJaw];
  const rightJaw = landmarks[LANDMARK_INDICES.rightJaw];
  const jawWidth = distance(leftJaw, rightJaw);
  const jawWidthRatio = jawWidth / faceWidth;

  // Brow-eye spacing
  const leftBrow = landmarks[LANDMARK_INDICES.leftBrowInner];
  const browEyeSpacing = Math.abs(leftBrow.y - leftEye.y);

  return {
    horizontalSymmetry: calculateHorizontalSymmetry(landmarks),
    verticalSymmetry: calculateVerticalSymmetry(landmarks),
    upperThird: thirds.upper,
    middleThird: thirds.middle,
    lowerThird: thirds.lower,
    eyeSpacingRatio: Math.round(eyeSpacingRatio * 100) / 100,
    eyeWidthRatio: Math.round(eyeWidthRatio * 100) / 100,
    browEyeSpacing: Math.round(browEyeSpacing * 100) / 100,
    noseWidthRatio: Math.round(noseWidthRatio * 100) / 100,
    cheekboneWidth: 0.8, // Placeholder - needs more complex calculation
    lipWidthRatio: Math.round(lipWidthRatio * 100) / 100,
    jawWidthRatio: Math.round(jawWidthRatio * 100) / 100,
    chinProminence: Math.round(chin.z * 100) / 100,
    jawAngle: 120, // Placeholder - requires angle calculation
    nasalAngle: 100, // Placeholder - requires angle calculation
  };
}

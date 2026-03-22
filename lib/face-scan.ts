/**
 * Sprint 10: Pro Face Scan Foundation
 * Client-side face scanning using MediaPipe Face Landmarker.
 * NO SERVER UPLOAD - all processing happens in browser.
 */

import type {
  FaceLandmark,
  FaceScanQuality,
  ProScanResult,
  ProScanHistory,
} from "@/types/face-scan";
import { calculateDerivedMetrics } from "./face-ratios";

const PRO_SCAN_HISTORY_KEY = "pro_scan_history";

/**
 * Detect face and extract landmarks from image.
 * This is a placeholder - actual MediaPipe integration would happen here.
 * For now, we'll use a mock implementation.
 */
export async function scanFaceFromImage(imageFile: File): Promise<ProScanResult> {
  // Validate file
  if (!imageFile.type.startsWith("image/")) {
    throw new Error("Invalid file type. Please upload an image.");
  }

  // Create image element for processing
  const imageUrl = URL.createObjectURL(imageFile);
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = async () => {
      try {
        // Clean up object URL
        URL.revokeObjectURL(imageUrl);

        // In production, this would use MediaPipe Face Landmarker
        // For Sprint 10 foundation, we'll create a mock result
        const mockResult = await processFaceImage(img);
        resolve(mockResult);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = imageUrl;
  });
}

/**
 * Process face image and extract landmarks.
 * MOCK IMPLEMENTATION - replace with actual MediaPipe in production.
 */
async function processFaceImage(_img: HTMLImageElement): Promise<ProScanResult> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Quality checks (mock)
  const quality: FaceScanQuality = {
    isFrontal: true,
    confidence: 0.92,
    hasValidLandmarks: true,
  };

  // Generate mock landmarks (468 points)
  const mockLandmarks: FaceLandmark[] = [];
  for (let i = 0; i < 468; i++) {
    mockLandmarks.push({
      x: 0.3 + Math.random() * 0.4, // Center region
      y: 0.3 + Math.random() * 0.4,
      z: Math.random() * 0.1 - 0.05,
    });
  }

  // Calculate derived metrics
  const metrics = calculateDerivedMetrics(mockLandmarks);

  const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    scanId,
    timestamp: new Date().toISOString(),
    quality,
    metrics,
    landmarkCount: mockLandmarks.length,
  };
}

/**
 * Validate scan quality.
 */
export function validateScanQuality(result: ProScanResult): {
  isValid: boolean;
  message?: string;
} {
  if (!result.quality.hasValidLandmarks) {
    return {
      isValid: false,
      message: "No valid face detected. Please ensure face is clearly visible.",
    };
  }

  if (!result.quality.isFrontal) {
    return {
      isValid: false,
      message: "Face angle not optimal. Please use a front-facing photo.",
    };
  }

  if (result.quality.confidence < 0.7) {
    return {
      isValid: false,
      message: "Low confidence. Please use a well-lit, clear photo.",
    };
  }

  return { isValid: true };
}

/**
 * Save scan to history (localStorage only - NO IMAGE DATA).
 */
export function saveScanToHistory(result: ProScanResult): void {
  if (typeof window === "undefined") return;

  try {
    const history = getProScanHistory();

    // Add new scan
    history.scans.unshift(result);
    history.latestScanId = result.scanId;

    // Keep last 10 scans
    history.scans = history.scans.slice(0, 10);

    localStorage.setItem(PRO_SCAN_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save scan history:", error);
  }
}

/**
 * Get scan history from localStorage.
 */
export function getProScanHistory(): ProScanHistory {
  if (typeof window === "undefined") {
    return { scans: [] };
  }

  try {
    const stored = localStorage.getItem(PRO_SCAN_HISTORY_KEY);
    if (!stored) return { scans: [] };
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load scan history:", error);
    return { scans: [] };
  }
}

/**
 * Get latest scan result.
 */
export function getLatestScan(): ProScanResult | null {
  const history = getProScanHistory();
  return history.scans[0] || null;
}

/**
 * Clear scan history.
 */
export function clearScanHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PRO_SCAN_HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear scan history:", error);
  }
}

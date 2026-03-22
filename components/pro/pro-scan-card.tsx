"use client";

import { useEffect, useState } from "react";
import type { ProScanResult } from "@/types/face-scan";
import { getLatestScan } from "@/lib/face-scan";

export function ProScanCard() {
  const [scan, setScan] = useState<ProScanResult | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScan(getLatestScan());
  }, []);

  if (!scan) {
    return (
      <div className="clinical-card space-y-4">
        <h2 className="clinical-label">Pro Face Scan</h2>
        <div className="text-sm text-muted">
          No Pro scan available. Upload a face photo to get landmark analysis.
        </div>
      </div>
    );
  }

  const { metrics, quality, timestamp } = scan;

  return (
    <div className="clinical-card space-y-6">
      <div className="space-y-1">
        <h2 className="clinical-label">Pro Face Scan</h2>
        <p className="text-xs text-muted">
          Landmark-based geometric analysis (client-side)
        </p>
      </div>

      {/* Quality Indicators */}
      <div className="border border-border rounded-sm p-3 space-y-2">
        <div className="text-xs uppercase tracking-wider text-muted">Scan Quality</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted">Confidence</span>
            <span className="text-foreground font-mono">{Math.round(quality.confidence * 100)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Frontal Angle</span>
            <span className="text-foreground">{quality.isFrontal ? "✓ Valid" : "✗ Invalid"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Landmarks</span>
            <span className="text-foreground font-mono">{scan.landmarkCount}</span>
          </div>
        </div>
      </div>

      {/* Symmetry Metrics */}
      <div className="border border-border rounded-sm p-3 space-y-2">
        <div className="text-xs uppercase tracking-wider text-muted">Symmetry Analysis</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted">Horizontal</span>
            <span className="text-foreground font-mono">
              {Math.round(metrics.horizontalSymmetry * 100)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Vertical</span>
            <span className="text-foreground font-mono">
              {Math.round(metrics.verticalSymmetry * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Facial Proportions */}
      <div className="border border-border rounded-sm p-3 space-y-2">
        <div className="text-xs uppercase tracking-wider text-muted">Facial Thirds</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted">Upper Third</span>
            <span className="text-foreground font-mono">
              {Math.round(metrics.upperThird * 100)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Middle Third</span>
            <span className="text-foreground font-mono">
              {Math.round(metrics.middleThird * 100)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Lower Third</span>
            <span className="text-foreground font-mono">
              {Math.round(metrics.lowerThird * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Feature Ratios */}
      <div className="border border-border rounded-sm p-3 space-y-2">
        <div className="text-xs uppercase tracking-wider text-muted">Feature Ratios</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted">Eye Spacing</span>
            <span className="text-foreground font-mono">{metrics.eyeSpacingRatio.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Nose Width</span>
            <span className="text-foreground font-mono">{metrics.noseWidthRatio.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Lip Width</span>
            <span className="text-foreground font-mono">{metrics.lipWidthRatio.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Jaw Width</span>
            <span className="text-foreground font-mono">{metrics.jawWidthRatio.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="pt-3 border-t border-border text-xs text-muted">
        Scanned {new Date(timestamp).toLocaleDateString()} at{" "}
        {new Date(timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}

/**
 * Sprint 16 Correction: Scan Protocol Integration Component
 * Displays high-level area emphasis from face scan without micro-adjustments.
 * Pro tier only.
 */

"use client";

import { useEffect, useState } from "react";
import type { AnalysisResult } from "@/types/analysis";
import type { ProScanResult } from "@/types/face-scan";
import { getLatestScan } from "@/lib/face-scan";
import { generateScanProtocolIntegration } from "@/lib/interpretation/scan-protocol-mapper";

interface ScanProtocolIntegrationProps {
  result: AnalysisResult;
}

export function ScanProtocolIntegration({ result }: ScanProtocolIntegrationProps) {
  const [scan, setScan] = useState<ProScanResult | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScan(getLatestScan());
  }, []);

  const integration = generateScanProtocolIntegration(scan, result);

  // No valid scan - show prompt
  if (!integration.hasValidScan) {
    return (
      <div className="clinical-card bg-muted/5 border-muted/30 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-muted mt-2" />
          <div className="flex-1 space-y-2">
            <h3 className="text-sm font-medium text-foreground">
              Scan-to-Protocol Integration
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              {integration.overallGuidance}
            </p>
            <button className="clinical-button-secondary text-xs mt-3">
              Upload Face Scan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Valid scan - show area emphasis
  return (
    <div className="clinical-card bg-primary/5 border-primary/30 space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-light text-foreground">
            Scan-Informed Area Emphasis
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs text-muted uppercase tracking-wider">
              {integration.scanQuality} Confidence
            </span>
          </div>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          {integration.overallGuidance}
        </p>
      </div>

      {/* Area Emphasis */}
      {integration.adjustments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-primary/20" />
            <span className="text-xs uppercase tracking-wider text-muted">
              Focus Areas
            </span>
            <div className="h-px flex-1 bg-primary/20" />
          </div>

          <div className="space-y-4">
            {integration.adjustments.map((adjustment, index) => (
              <div
                key={index}
                className="border border-primary/20 rounded-sm p-4 space-y-3 bg-background/50"
              >
                {/* Area + Emphasis */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-xs">▸</span>
                    <span className="text-sm font-medium text-foreground">
                      {adjustment.area}
                    </span>
                  </div>
                  <p className="text-xs text-primary/80 font-medium pl-4">
                    {adjustment.emphasis}
                  </p>
                </div>

                {/* Reasoning */}
                <div className="pl-4">
                  <p className="text-xs text-muted leading-relaxed">
                    {adjustment.reasoning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scan Metadata */}
      {scan && (
        <div className="pt-4 border-t border-primary/20 flex items-center justify-between text-xs text-muted">
          <span>
            Based on scan from {new Date(scan.timestamp).toLocaleDateString()}
          </span>
          <span className="font-mono">
            {scan.landmarkCount} landmarks analyzed
          </span>
        </div>
      )}
    </div>
  );
}

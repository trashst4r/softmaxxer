"use client";

import { useEffect } from "react";
import Link from "next/link";
import { setDevTierOverride } from "@/lib/dev-session";
import type { AccessState } from "@/lib/access-state";

interface TierPreviewProps {
  tier: AccessState;
}

export function TierPreview({ tier }: TierPreviewProps) {
  useEffect(() => {
    // Set dev tier override when component mounts
    setDevTierOverride(tier);

    // Clear on unmount
    return () => {
      setDevTierOverride(null);
    };
  }, [tier]);

  const tierInfo = {
    guest: {
      label: "Guest",
      description: "Limited product visibility, constrained guidance",
      features: [
        "Basic skin analysis",
        "Limited product recommendations",
        "Simplified routine guidance",
        "No face scan access",
        "No console history tracking"
      ],
      color: "text-muted"
    },
    member: {
      label: "Member",
      description: "Full product stack, expanded protocol depth",
      features: [
        "Complete skin analysis",
        "Full product catalog access",
        "Detailed regimen protocols",
        "Console progress tracking",
        "Scan history management"
      ],
      color: "text-foreground"
    },
    pro: {
      label: "Pro",
      description: "Deep analysis layer, face scan intelligence",
      features: [
        "All Member features",
        "Pro Face Scan with landmark analysis",
        "Geometric ratio calculations",
        "Advanced facial metrics",
        "Scan history with trend analysis"
      ],
      color: "text-primary"
    }
  };

  const info = tierInfo[tier];

  return (
    <div className="min-h-screen px-6 py-12 bg-background dark:bg-background-dark">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className={`text-4xl font-light tracking-tight ${info.color}`}>
              {info.label} Preview
            </h1>
            <div className="clinical-label text-xs">DEV MODE</div>
          </div>
          <div className="h-px w-12 bg-primary/40" />
          <p className="text-sm text-muted max-w-2xl">
            {info.description}
          </p>
        </div>

        {/* Tier Details */}
        <div className="clinical-card">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-light text-foreground">Active Tier State</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-border/30 bg-background/50">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm font-medium capitalize">{tier}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="clinical-label">Available Features</h3>
              <ul className="space-y-2">
                {info.features.map((feature, index) => (
                  <li key={index} className="text-sm text-foreground/80 flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Preview Navigation */}
        <div className="clinical-card">
          <div className="space-y-6">
            <h2 className="text-lg font-light text-foreground">Preview Navigation</h2>
            <div className="space-y-3">
              <p className="text-sm text-muted">
                Navigate to core pages to see how they render in <span className="capitalize font-medium">{tier}</span> mode.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/analysis" className="clinical-button-secondary text-sm">
                  Analysis →
                </Link>
                <Link href="/results" className="clinical-button-secondary text-sm">
                  Results →
                </Link>
                <Link href="/dashboard" className="clinical-button-secondary text-sm">
                  Console →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product State Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="clinical-card bg-background/50">
            <div className="space-y-2">
              <div className="clinical-label text-xs">Product Visibility</div>
              <div className="text-sm font-medium text-foreground">
                {tier === "guest" ? "Limited" : "Full Catalog"}
              </div>
            </div>
          </div>
          <div className="clinical-card bg-background/50">
            <div className="space-y-2">
              <div className="clinical-label text-xs">Protocol Depth</div>
              <div className="text-sm font-medium text-foreground">
                {tier === "guest" ? "Basic" : tier === "member" ? "Detailed" : "Advanced"}
              </div>
            </div>
          </div>
          <div className="clinical-card bg-background/50">
            <div className="space-y-2">
              <div className="clinical-label text-xs">Face Scan</div>
              <div className="text-sm font-medium text-foreground">
                {tier === "pro" ? "Enabled" : "Locked"}
              </div>
            </div>
          </div>
        </div>

        {/* Dev Panel Link */}
        <div className="pt-8 border-t border-border/30 flex gap-4">
          <Link href="/dev" className="clinical-button-secondary text-sm">
            ← Dev Panel
          </Link>
          <Link href="/" className="clinical-button-secondary text-sm">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

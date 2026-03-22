"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccessState } from "@/lib/access-state";
import { getDevTierOverride, setDevTierOverride } from "@/lib/dev-session";
import type { AccessState } from "@/lib/access-state";

export function DevPanel() {
  const [accessState] = useAccessState();
  const [devOverride, setDevOverrideState] = useState<AccessState | null>(() => {
    // Initialize state from localStorage on mount
    if (typeof window !== "undefined") {
      return getDevTierOverride();
    }
    return null;
  });

  const handleTierChange = (tier: AccessState | null) => {
    setDevTierOverride(tier);
    setDevOverrideState(tier);
    // Reload to apply changes
    window.location.reload();
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-background dark:bg-background-dark">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-light tracking-tight text-foreground">
            Dev Panel
          </h1>
          <div className="h-px w-12 bg-primary/40" />
          <p className="text-sm text-muted">
            Deterministic tier preview system for auditing guest, member, and pro product states.
          </p>
        </div>

        {/* Current State */}
        <div className="clinical-card">
          <div className="space-y-4">
            <h2 className="text-lg font-light text-foreground">Current State</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="clinical-label">Active Tier</div>
                <div className="text-sm font-medium text-foreground capitalize">
                  {devOverride || accessState}
                </div>
              </div>
              <div className="space-y-1">
                <div className="clinical-label">Dev Mode</div>
                <div className="text-sm font-medium text-foreground">
                  {devOverride ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
            {devOverride && (
              <button
                onClick={() => handleTierChange(null)}
                className="clinical-button-secondary text-sm"
              >
                Clear Dev Override
              </button>
            )}
          </div>
        </div>

        {/* Tier Preview Pages */}
        <div className="clinical-card">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-light text-foreground">Tier Preview Pages</h2>
              <p className="text-sm text-muted">
                Each page renders the product in a fixed tier state for audit and screenshot review.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Guest Preview */}
              <div className="clinical-card bg-background/50">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="clinical-label">Guest</div>
                    <p className="text-xs text-muted">
                      Limited product visibility, basic analysis
                    </p>
                  </div>
                  <Link
                    href="/dev/guest"
                    className="clinical-button-secondary text-sm inline-block w-full text-center"
                  >
                    Preview Guest →
                  </Link>
                </div>
              </div>

              {/* Member Preview */}
              <div className="clinical-card bg-background/50">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="clinical-label">Member</div>
                    <p className="text-xs text-muted">
                      Full product stack, expanded guidance
                    </p>
                  </div>
                  <Link
                    href="/dev/member"
                    className="clinical-button-secondary text-sm inline-block w-full text-center"
                  >
                    Preview Member →
                  </Link>
                </div>
              </div>

              {/* Pro Preview */}
              <div className="clinical-card bg-primary/5 border-primary/30">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="clinical-label">Pro</div>
                    <p className="text-xs text-muted">
                      Deep analysis, face scan, all features
                    </p>
                  </div>
                  <Link
                    href="/dev/pro"
                    className="clinical-button text-sm inline-block w-full text-center"
                  >
                    Preview Pro →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="clinical-card">
          <div className="space-y-6">
            <h2 className="text-lg font-light text-foreground">Quick Actions</h2>
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

        {/* Home Link */}
        <div className="pt-8 border-t border-border/30">
          <Link href="/" className="clinical-button-secondary text-sm">
            ← Home
          </Link>
        </div>
      </div>
    </div>
  );
}

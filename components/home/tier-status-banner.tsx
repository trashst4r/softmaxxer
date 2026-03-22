"use client";

import type { AccessState } from "@/lib/access-state";

interface TierStatusBannerProps {
  tier: AccessState;
}

export function TierStatusBanner({ tier }: TierStatusBannerProps) {
  const tierConfig = {
    guest: {
      label: "Guest",
      description: "Limited system access. Create an account to unlock full protocol and product stack.",
      color: "text-muted"
    },
    member: {
      label: "Member",
      description: "Full protocol access. Upgrade to Pro for face scan intelligence and deep analysis.",
      color: "text-foreground"
    },
    pro: {
      label: "Pro",
      description: "Complete system access. Face scan, deep analysis, and full intelligence layer unlocked.",
      color: "text-primary"
    }
  };

  const config = tierConfig[tier];

  return (
    <div className="clinical-card bg-primary/5 border-primary/30">
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium uppercase tracking-wider ${config.color}`}>
              {config.label} Access
            </span>
            <div className={`w-2 h-2 rounded-full ${tier === "pro" ? "bg-primary" : tier === "member" ? "bg-foreground/50" : "bg-muted/50"}`} />
          </div>
          <p className="text-xs text-muted max-w-2xl">
            {config.description}
          </p>
        </div>

        {tier !== "pro" && (
          <button className="clinical-button text-sm">
            {tier === "guest" ? "Create Account" : "Upgrade to Pro"} →
          </button>
        )}
      </div>
    </div>
  );
}

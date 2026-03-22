"use client";

import { useAccessState } from "@/lib/access-state";
import type { AccessState } from "@/lib/access-state";

interface TierContextBannerProps {
  tier?: AccessState;
  context: "analysis" | "results" | "console" | "dashboard";
}

export function TierContextBanner({ tier: overrideTier, context }: TierContextBannerProps) {
  const [accessState] = useAccessState();
  const tier = overrideTier ?? accessState;

  const messaging = {
    analysis: {
      guest: "Analysis available to all users. Create an account to unlock full product recommendations and progress tracking.",
      member: "Full analysis and product access. Upgrade to Pro for face scan intelligence and deep protocol explanations.",
      pro: "Complete analysis access with Pro face scan and deep protocol intelligence."
    },
    results: {
      guest: "Basic results available. Create an account for full product stack and persistent protocol access.",
      member: "Full results and product access. Upgrade to Pro for face scan analysis and deep protocol insights.",
      pro: "Complete results with Pro face scan, deep analysis, and optimization strategies."
    },
    console: {
      guest: "Limited console access. Create an account for full adherence tracking and progress monitoring.",
      member: "Full console access with progress tracking. Upgrade to Pro for face scan intelligence.",
      pro: "Complete console access with Pro face scan and advanced protocol intelligence."
    },
    dashboard: {
      guest: "Limited dashboard access. Create an account for full adherence tracking and progress monitoring.",
      member: "Full dashboard access with progress tracking. Upgrade to Pro for face scan intelligence.",
      pro: "Complete dashboard access with Pro face scan and advanced protocol intelligence."
    }
  };

  const message = messaging[context][tier];

  const tierConfig = {
    guest: { color: "bg-muted/10 border-muted/30", textColor: "text-muted" },
    member: { color: "bg-foreground/5 border-foreground/20", textColor: "text-foreground/80" },
    pro: { color: "bg-primary/5 border-primary/30", textColor: "text-primary" }
  };

  const config = tierConfig[tier];

  return (
    <div className={`border rounded-sm p-4 ${config.color}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium uppercase tracking-wider ${config.textColor}`}>
              {tier} {tier === "guest" ? "Access" : "Member"}
            </span>
            <div className={`w-1.5 h-1.5 rounded-full ${tier === "pro" ? "bg-primary" : tier === "member" ? "bg-foreground/50" : "bg-muted/50"}`} />
          </div>
          <p className="text-xs text-muted leading-relaxed max-w-2xl">
            {message}
          </p>
        </div>

        {tier !== "pro" && (
          <button className="clinical-button-secondary text-xs whitespace-nowrap">
            {tier === "guest" ? "Create Account" : "Upgrade to Pro"}
          </button>
        )}
      </div>
    </div>
  );
}

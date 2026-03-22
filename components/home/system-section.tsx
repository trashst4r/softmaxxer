/**
 * Reusable system section component for tier-aware home page.
 * Establishes the visual contract for how system modules are presented.
 */

import Link from "next/link";
import type { ReactNode } from "react";

interface SystemSectionProps {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon?: ReactNode;
  tier?: "guest" | "member" | "pro";
  locked?: boolean;
}

export function SystemSection({
  title,
  description,
  href,
  cta,
  icon,
  tier,
  locked = false,
}: SystemSectionProps) {
  return (
    <div className={`clinical-card ${locked ? "opacity-60" : ""} relative`}>
      {locked && (
        <div className="absolute top-4 right-4 text-xs uppercase tracking-wider text-muted font-medium">
          {tier === "member" ? "Member" : "Pro"} Feature
        </div>
      )}

      <div className="space-y-4">
        {/* Icon + Title */}
        <div className="flex items-start gap-4">
          {icon && <div className="text-primary mt-1">{icon}</div>}
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-light text-foreground">{title}</h2>
            <p className="text-sm text-muted leading-relaxed">{description}</p>
          </div>
        </div>

        {/* CTA */}
        {!locked ? (
          <Link
            href={href}
            className="clinical-button-secondary text-sm inline-block"
          >
            {cta} →
          </Link>
        ) : (
          <button className="clinical-button text-sm">
            Unlock Feature →
          </button>
        )}
      </div>
    </div>
  );
}

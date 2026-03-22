/**
 * Clinical Protocol Summary Card for Results Page
 * Aligned with dashboard's clinical language system
 * Uses same helpers: getStateBadge, getProtocolTitle, getPrimaryConcern, getSummaryBullets
 */

import type { SkinProfile } from "@/types/skin-profile";
import { RawTextureImage } from "@/components/analysis/TextureSurface";
import { getStateBadge, getProtocolTitle, getPrimaryConcern, getSummaryBullets } from "@/lib/texture-map";

interface ProfileSummaryCardProps {
  profile: SkinProfile;
}

export function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl p-8 space-y-6 sticky top-24">
      {/* Header with Badge */}
      <div className="flex justify-between items-start">
        <h3 className="font-headline font-extrabold text-xl tracking-tight text-on-surface">
          Your Protocol
        </h3>
        <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold tracking-widest uppercase rounded-full">
          {getStateBadge(profile)}
        </span>
      </div>

      {/* Thumbnail + Status */}
      <div className="flex items-start space-x-6">
        {/* Small Raw Texture Thumbnail */}
        <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-surface-container-high">
          <RawTextureImage profile={profile} />
        </div>

        {/* Status Info */}
        <div className="flex-1 space-y-1">
          <p className="text-label-sm text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
            Status
          </p>
          <h4 className="font-headline font-bold text-lg text-on-surface">
            {getProtocolTitle(profile)}
          </h4>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs font-medium text-on-surface-variant">Primary Concern:</span>
            <span className="text-xs font-bold text-primary">
              {getPrimaryConcern(profile)}
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Summary Bullets */}
      <div className="space-y-4 pt-4">
        {getSummaryBullets(profile).map((bullet, i) => (
          <div key={i} className="flex items-start space-x-3">
            <span className="material-symbols-outlined text-primary text-lg mt-0.5">
              check_circle
            </span>
            <p className="text-sm leading-relaxed text-on-surface-variant font-medium">
              {bullet}
            </p>
          </div>
        ))}
      </div>

      {/* Analysis Timeline */}
      <div className="pt-6 border-t border-outline-variant/10">
        <div className="flex justify-between items-center text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
          <span>Analysis Date</span>
          <span>Next Review</span>
        </div>
        <div className="flex justify-between items-center text-sm font-bold text-on-surface mt-1">
          <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          <span>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
      </div>
    </div>
  );
}

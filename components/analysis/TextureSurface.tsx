/**
 * Raw Texture Image Component
 * Renders clinical texture assets with ZERO visual treatments
 * No overlays, no gradients, no opacity reduction, no filters
 */

import type { SkinProfile } from "@/types/skin-profile";
import { getTextureAsset, getSkinTexture } from "@/lib/texture-map";

interface RawTextureImageProps {
  profile: SkinProfile;
  className?: string;
}

/**
 * RawTextureImage - Pure asset rendering
 * Just the image, nothing else
 */
export function RawTextureImage({ profile, className = "" }: RawTextureImageProps) {
  const textureAsset = getTextureAsset(profile);
  const textureType = getSkinTexture(profile);

  return (
    <img
      src={textureAsset}
      alt={`${textureType} clinical texture`}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}

/**
 * TextureSurfaceDebug - Development overlay
 * Shows mapping state outside the image
 */
export function TextureSurfaceDebug({ profile }: { profile: SkinProfile }) {
  const textureType = getSkinTexture(profile);
  const textureAsset = getTextureAsset(profile);

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 border-2 border-primary rounded-lg p-4 text-xs font-mono z-[9999] max-w-sm shadow-2xl">
      <div className="font-bold text-primary mb-3 text-sm">🔍 TEXTURE DEBUG</div>
      <div className="space-y-2 text-white">
        <div className="pb-2 border-b border-primary/30">
          <div className="text-primary font-semibold mb-1">Mapped Texture:</div>
          <div className="text-lg font-bold">{textureType.toUpperCase()}</div>
        </div>
        <div>
          <div className="text-primary/70 text-[10px]">Asset Path:</div>
          <div className="text-white break-all">{textureAsset}</div>
        </div>
        <div className="pt-2 border-t border-primary/30 space-y-1">
          <div className="text-primary/70 text-[10px]">Profile State:</div>
          <div><span className="text-primary/70">Sensitivity:</span> {profile.sensitivity}</div>
          <div><span className="text-primary/70">Goal:</span> {profile.priorityGoal}</div>
          <div><span className="text-primary/70">Breakouts:</span> {profile.breakoutProneness}</div>
          <div><span className="text-primary/70">Oiliness:</span> {profile.oiliness}</div>
          <div><span className="text-primary/70">Hydration:</span> {profile.hydrationNeed}</div>
        </div>
      </div>
    </div>
  );
}

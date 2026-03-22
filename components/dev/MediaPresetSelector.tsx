/**
 * Dev Tools Media Sandbox v1
 * Quick preset selector for common screenshot scenarios
 */

import type { MediaPreset } from "@/types/dev-media-state";

interface MediaPresetSelectorProps {
  presets: MediaPreset[];
  onLoadPreset: (preset: MediaPreset) => void;
}

export function MediaPresetSelector({ presets, onLoadPreset }: MediaPresetSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs uppercase tracking-wider font-medium text-muted mb-4">
        Quick Presets
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onLoadPreset(preset)}
            className="text-left p-3 rounded-lg bg-surface-container-low border border-outline-variant hover:bg-surface-container-high hover:border-primary/50 transition-colors"
          >
            <div className="font-semibold text-xs mb-1 text-on-surface">
              {preset.name}
            </div>
            <div className="text-[10px] text-muted line-clamp-2">
              {preset.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

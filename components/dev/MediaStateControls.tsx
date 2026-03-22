/**
 * Dev Tools Media Sandbox v1
 * Sliders and toggles for fabricating controlled states
 */

import type { DevMediaState } from "@/types/dev-media-state";

interface MediaStateControlsProps {
  state: DevMediaState;
  onStateChange: (state: DevMediaState) => void;
}

export function MediaStateControls({ state, onStateChange }: MediaStateControlsProps) {
  const updateField = <K extends keyof DevMediaState>(key: K, value: DevMediaState[K]) => {
    onStateChange({ ...state, [key]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xs uppercase tracking-wider font-medium text-muted mb-4">
        State Controls
      </h3>

      {/* Oiliness */}
      <div>
        <label className="text-xs font-medium text-on-surface block mb-2">
          Oiliness
        </label>
        <select
          value={state.oiliness}
          onChange={(e) => updateField("oiliness", e.target.value as any)}
          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-sm text-on-surface"
        >
          <option value="dry">Dry</option>
          <option value="balanced">Balanced</option>
          <option value="oily_tzone">Oily T-Zone</option>
          <option value="oily_all">Oily All Over</option>
        </select>
      </div>

      {/* Sensitivity */}
      <div>
        <label className="text-xs font-medium text-on-surface block mb-2">
          Sensitivity
        </label>
        <select
          value={state.sensitivity}
          onChange={(e) => updateField("sensitivity", e.target.value as any)}
          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-sm text-on-surface"
        >
          <option value="resilient">Resilient</option>
          <option value="moderate">Moderate</option>
          <option value="reactive">Reactive</option>
        </select>
      </div>

      {/* Breakout Proneness */}
      <div>
        <label className="text-xs font-medium text-on-surface block mb-2">
          Breakout Proneness
        </label>
        <select
          value={state.breakoutProneness}
          onChange={(e) => updateField("breakoutProneness", e.target.value as any)}
          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-sm text-on-surface"
        >
          <option value="rare">Rare</option>
          <option value="occasional">Occasional</option>
          <option value="frequent">Frequent</option>
          <option value="persistent">Persistent</option>
        </select>
      </div>

      {/* Hydration Need */}
      <div>
        <label className="text-xs font-medium text-on-surface block mb-2">
          Hydration Need
        </label>
        <select
          value={state.hydrationNeed}
          onChange={(e) => updateField("hydrationNeed", e.target.value as any)}
          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-sm text-on-surface"
        >
          <option value="low">Low</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Priority Goal */}
      <div>
        <label className="text-xs font-medium text-on-surface block mb-2">
          Priority Goal
        </label>
        <select
          value={state.priorityGoal}
          onChange={(e) => updateField("priorityGoal", e.target.value as any)}
          className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-sm text-on-surface"
        >
          <option value="breakout_control">Breakout Control</option>
          <option value="hydration_restore">Hydration Restore</option>
          <option value="redness_calm">Redness Calm</option>
          <option value="barrier_strengthen">Barrier Strengthen</option>
          <option value="texture_smooth">Texture Smooth</option>
        </select>
      </div>

      {/* Context Flags */}
      <div className="pt-4 border-t border-outline-variant space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={state.hasActiveExperience}
            onChange={(e) => updateField("hasActiveExperience", e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-on-surface">Active Experience</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={state.needsSpfEducation}
            onChange={(e) => updateField("needsSpfEducation", e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-on-surface">Needs SPF Education</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={state.prefersMinimalRoutine}
            onChange={(e) => updateField("prefersMinimalRoutine", e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-on-surface">Prefers Minimal Routine</span>
        </label>
      </div>

      {/* Dashboard Metrics */}
      <div className="pt-4 border-t border-outline-variant space-y-4">
        <div>
          <label className="text-xs font-medium text-on-surface block mb-2">
            Adherence: {state.adherencePercentage}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={state.adherencePercentage}
            onChange={(e) => updateField("adherencePercentage", parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-on-surface block mb-2">
            Current Streak: {state.currentStreak} days
          </label>
          <input
            type="range"
            min="0"
            max="60"
            value={state.currentStreak}
            onChange={(e) => updateField("currentStreak", parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-on-surface block mb-2">
            Total Check-Ins: {state.totalCheckIns}
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={state.totalCheckIns}
            onChange={(e) => updateField("totalCheckIns", parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-on-surface block mb-2">
            Last Check-In: {state.lastCheckInDays} days ago
          </label>
          <input
            type="range"
            min="0"
            max="14"
            value={state.lastCheckInDays}
            onChange={(e) => updateField("lastCheckInDays", parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

"use client";

/**
 * Sprint 19 Task 19.3: Refinement Preferences Form
 * Minimal UI controls for post-profile product preferences
 */

import { useState } from "react";
import type {
  RefinementPreferences,
  BudgetTier,
  FragranceTolerance,
  RoutineComplexity,
} from "@/types/refinement";
import type { TextureWeight, Finish } from "@/types/product";

interface RefinementPreferencesFormProps {
  initialPreferences?: RefinementPreferences | null;
  onSave: (preferences: RefinementPreferences) => void;
  onCancel?: () => void;
}

export function RefinementPreferencesForm({
  initialPreferences,
  onSave,
  onCancel,
}: RefinementPreferencesFormProps) {
  const [preferences, setPreferences] = useState<RefinementPreferences>(
    initialPreferences || {}
  );
  const [ingredientInput, setIngredientInput] = useState("");

  const updatePreference = <K extends keyof RefinementPreferences>(
    key: K,
    value: RefinementPreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const addIngredient = () => {
    if (!ingredientInput.trim()) return;
    const current = preferences.avoidIngredients || [];
    updatePreference("avoidIngredients", [...current, ingredientInput.trim()]);
    setIngredientInput("");
  };

  const removeIngredient = (index: number) => {
    const current = preferences.avoidIngredients || [];
    updatePreference(
      "avoidIngredients",
      current.filter((_, i) => i !== index)
    );
  };

  const handleSave = () => {
    onSave(preferences);
  };

  return (
    <div className="space-y-8">
      {/* Budget Tier */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-on-surface">
          Budget Preference
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["budget", "mid", "premium"] as BudgetTier[]).map((tier) => (
            <button
              key={tier}
              onClick={() => updatePreference("budgetTier", tier)}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                preferences.budgetTier === tier
                  ? "bg-primary text-on-primary shadow-md"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {tier === "budget"
                ? "Budget"
                : tier === "mid"
                ? "Mid-Range"
                : "Premium"}
            </button>
          ))}
        </div>
      </div>

      {/* Texture Preference */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-on-surface">
          Texture Preference
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["lightweight", "medium", "rich"] as TextureWeight[]).map(
            (texture) => (
              <button
                key={texture}
                onClick={() => updatePreference("texturePreference", texture)}
                className={`p-3 rounded-lg text-sm font-medium transition-all capitalize ${
                  preferences.texturePreference === texture
                    ? "bg-primary text-on-primary shadow-md"
                    : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {texture}
              </button>
            )
          )}
        </div>
      </div>

      {/* Finish Preference */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-on-surface">
          Finish Preference
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["matte", "satin", "dewy"] as Finish[]).map((finish) => (
            <button
              key={finish}
              onClick={() => updatePreference("finishPreference", finish)}
              className={`p-3 rounded-lg text-sm font-medium transition-all capitalize ${
                preferences.finishPreference === finish
                  ? "bg-primary text-on-primary shadow-md"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {finish}
            </button>
          ))}
        </div>
      </div>

      {/* Fragrance Tolerance */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-on-surface">
          Fragrance Tolerance
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["avoid", "tolerate", "prefer"] as FragranceTolerance[]).map(
            (tolerance) => (
              <button
                key={tolerance}
                onClick={() =>
                  updatePreference("fragranceTolerance", tolerance)
                }
                className={`p-3 rounded-lg text-sm font-medium transition-all capitalize ${
                  preferences.fragranceTolerance === tolerance
                    ? "bg-primary text-on-primary shadow-md"
                    : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {tolerance}
              </button>
            )
          )}
        </div>
      </div>

      {/* Routine Complexity */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-on-surface">
          Routine Complexity
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["minimal", "standard", "flexible"] as RoutineComplexity[]).map(
            (complexity) => (
              <button
                key={complexity}
                onClick={() =>
                  updatePreference("routineComplexity", complexity)
                }
                className={`p-3 rounded-lg text-sm font-medium transition-all capitalize ${
                  preferences.routineComplexity === complexity
                    ? "bg-primary text-on-primary shadow-md"
                    : "bg-surface-container-low text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {complexity}
              </button>
            )
          )}
        </div>
      </div>

      {/* Avoid Ingredients */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-on-surface">
          Ingredients to Avoid
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addIngredient()}
            placeholder="e.g., alcohol, fragrance, retinol"
            className="flex-1 px-4 py-2 rounded-lg bg-surface-container-low text-on-surface border border-outline-variant focus:outline-none focus:border-primary text-sm"
          />
          <button
            onClick={addIngredient}
            className="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg hover:bg-surface-container-highest text-sm font-medium transition-colors"
          >
            Add
          </button>
        </div>
        {preferences.avoidIngredients &&
          preferences.avoidIngredients.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {preferences.avoidIngredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-high text-on-surface rounded-full text-sm"
                >
                  {ingredient}
                  <button
                    onClick={() => removeIngredient(index)}
                    className="text-muted hover:text-on-surface transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-outline-variant">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          className="px-6 py-2.5 text-sm font-semibold bg-primary text-on-primary rounded-lg hover:opacity-90 transition-opacity"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

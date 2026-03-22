"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { RoutineStep } from "@/types/analysis";
import { toggleStepCompletion, isStepCompleted } from "@/lib/adherence-state";
import { CATALOG_V1 } from "@/lib/products/catalog-v1";

interface RoutineChecklistProps {
  steps: RoutineStep[];
  routine: "am" | "pm";
  onCheckChange?: () => void;
}

// Map product name or category to catalog product for imagery
function getProductImageForStep(step: RoutineStep): string | null {
  // First try to match by product example name
  const exampleName = step.products?.[0]?.examples?.[0];
  if (exampleName) {
    // Try exact product name match
    const exactMatch = CATALOG_V1.find(p =>
      p.fullName === exampleName ||
      p.productName === exampleName ||
      exampleName.toLowerCase().includes(p.productName.toLowerCase())
    );
    if (exactMatch?.imageUrl) return exactMatch.imageUrl;
  }

  // Fallback to category-based matching
  const category = step.products?.[0]?.category;
  if (!category) return null;

  const categoryLower = category.toLowerCase();

  // Map to catalog products based on role
  if (categoryLower.includes("cleanser")) {
    const cleanser = CATALOG_V1.find(p => p.role === "cleanser");
    return cleanser?.imageUrl || null;
  }
  if (categoryLower.includes("serum") || categoryLower.includes("active")) {
    const serum = CATALOG_V1.find(p => p.role === "serum");
    return serum?.imageUrl || null;
  }
  if (categoryLower.includes("moisturizer")) {
    const moisturizer = CATALOG_V1.find(p => p.role === "moisturizer");
    return moisturizer?.imageUrl || null;
  }
  if (categoryLower.includes("sunscreen") || categoryLower.includes("spf")) {
    const sunscreen = CATALOG_V1.find(p => p.role === "sunscreen");
    return sunscreen?.imageUrl || null;
  }
  if (categoryLower.includes("treatment")) {
    const treatment = CATALOG_V1.find(p => p.role === "treatment");
    return treatment?.imageUrl || null;
  }

  return null;
}

export function RoutineChecklist({ steps, routine, onCheckChange }: RoutineChecklistProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Load completed steps on mount
  useEffect(() => {
    const completed = new Set<string>();
    steps.forEach((step) => {
      if (isStepCompleted(step.id, routine)) {
        completed.add(step.id);
      }
    });
    setCompletedSteps(completed);
  }, [steps, routine]);

  const handleToggle = (stepId: string) => {
    toggleStepCompletion(stepId, routine);

    // Update local state
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });

    // Notify parent for chart refresh
    onCheckChange?.();
  };

  return (
    <div className="space-y-4">
      <h2 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant/70 mb-6">
        Step-by-step Adherence
      </h2>
      {steps.map((step) => {
        const isCompleted = completedSteps.has(step.id);
        const productImage = getProductImageForStep(step);

        return (
          <div
            key={step.id}
            className={`group flex items-center justify-between p-6 bg-surface-container-lowest rounded-xl transition-[box-shadow,transform] cursor-pointer ${
              isCompleted
                ? "shadow-[0px_12px_32px_rgba(45,52,50,0.06)] ring-1 ring-primary/10"
                : "hover:translate-y-[-2px]"
            }`}
            onClick={() => handleToggle(step.id)}
          >
            <div className="flex items-center gap-4">
              {/* Checkbox */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-[background-color,border-color] flex-shrink-0 ${
                  isCompleted
                    ? "bg-primary"
                    : "border-2 border-primary/20 group-hover:border-primary"
                }`}
              >
                {isCompleted && (
                  <svg className="w-4 h-4 text-on-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              {/* Product Image - Scaled up for better visibility */}
              {productImage && (
                <div className="flex-shrink-0 w-16 h-16 relative bg-white rounded-lg overflow-hidden border border-outline-variant">
                  <Image
                    src={productImage}
                    alt={step.products?.[0]?.category || "Product"}
                    fill
                    className="object-contain p-2"
                    sizes="64px"
                  />
                </div>
              )}

              {/* Step info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold text-on-surface ${
                    isCompleted ? "line-through opacity-50" : ""
                  }`}
                >
                  {step.step}
                </p>
                {step.products?.[0] && (
                  <p
                    className={`text-sm text-on-surface-variant ${
                      isCompleted ? "opacity-50" : ""
                    }`}
                  >
                    {step.products[0].ingredient || step.products[0].category}
                  </p>
                )}
              </div>
            </div>

            {/* Status badge */}
            {isCompleted && (
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}

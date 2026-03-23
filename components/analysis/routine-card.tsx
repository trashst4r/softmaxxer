"use client";

import { useState } from "react";
import type { RoutineStep } from "@/types/analysis";
import { getRoleLabel, getRoleColor } from "@/lib/product-logic";

interface RoutineCardProps {
  title: "AM Routine" | "PM Routine";
  steps: RoutineStep[];
}

export function RoutineCard({ title, steps }: RoutineCardProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xs uppercase tracking-widest font-semibold text-muted border-b border-border pb-2">
        {title}
      </h3>
      <ol className="space-y-6">
        {steps.map((routineStep, index) => {
          const isExpanded = expandedSteps.has(routineStep.id);
          const hasProducts = routineStep.products && routineStep.products.length > 0;

          return (
            <li key={routineStep.id} className="space-y-3">
              <div className="flex gap-4 items-start">
                <span className="text-primary font-mono text-xs mt-1 opacity-60 flex-shrink-0">
                  {String(index + 1).padStart(2, "0")}.
                </span>
                <div className="flex-1 space-y-2">
                  <div className="text-sm font-medium text-foreground">{routineStep.step}</div>
                  {hasProducts && (
                    <button
                      onClick={() => toggleStep(routineStep.id)}
                      className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                    >
                      {isExpanded ? "Hide products" : "View products"}
                    </button>
                  )}
                </div>
              </div>

              {isExpanded && hasProducts && (
                <div className="ml-10 space-y-4 pt-2 border-l border-primary/20 pl-4">
                  {routineStep.products!.map((productSuggestion, pIndex) => {
                    const canSeeFullProducts = true;
                    const actualProducts = productSuggestion.products || [];
                    const displayProducts = canSeeFullProducts
                      ? actualProducts
                      : actualProducts.slice(0, 1); // Guest: only first product

                    return (
                      <div key={pIndex} className="space-y-2">
                        <div className="text-xs font-medium text-foreground">
                          {productSuggestion.ingredient}
                          <span className="text-muted ml-2 font-normal">({productSuggestion.category})</span>
                        </div>
                        {productSuggestion.rationale && (
                          <div className="text-xs text-muted leading-relaxed">{productSuggestion.rationale}</div>
                        )}

                        {/* Actual product recommendations */}
                        {actualProducts.length > 0 && (
                          <div className="space-y-2 pt-2">
                            {displayProducts.map((product, prodIndex) => (
                              <div
                                key={prodIndex}
                                className="text-xs border border-border rounded-sm p-3 bg-background space-y-2"
                              >
                                {/* Role Label */}
                                {product.role && (
                                  <div
                                    className={`text-xs font-semibold uppercase tracking-wider ${getRoleColor(product.role)}`}
                                  >
                                    {getRoleLabel(product.role)}
                                  </div>
                                )}

                                <div className="space-y-1">
                                  <div className="font-medium text-foreground">
                                    {product.brand} {product.name}
                                  </div>
                                  <div className="flex items-center gap-3 text-muted/80">
                                    <span>
                                      {product.price_tier === "budget" && "$ Budget"}
                                      {product.price_tier === "mid" && "$$ Mid-range"}
                                      {product.price_tier === "premium" && "$$$ Premium"}
                                    </span>
                                    <span>·</span>
                                    <span>{product.merchant}</span>
                                  </div>
                                </div>

                                {/* Product Reasoning */}
                                {product.why && (
                                  <div className="text-xs text-muted leading-relaxed">
                                    <span className="font-medium">Why:</span> {product.why}
                                  </div>
                                )}
                                {product.who && (
                                  <div className="text-xs text-muted leading-relaxed">
                                    <span className="font-medium">For:</span> {product.who}
                                  </div>
                                )}
                                {product.caution && (
                                  <div className="text-xs text-yellow-600 dark:text-yellow-400 leading-relaxed">
                                    <span className="font-medium">⚠ Caution:</span> {product.caution}
                                  </div>
                                )}

                                <a
                                  href={product.affiliate_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block text-xs text-primary hover:text-primary/80 font-medium uppercase tracking-wider transition-colors"
                                >
                                  View Product →
                                </a>
                              </div>
                            ))}

                            {/* Guest CTA: Show locked products */}
                            {!canSeeFullProducts && actualProducts.length > 1 && (
                              <div className="relative">
                                <div className="text-xs border border-primary/30 rounded-sm p-3 bg-primary/5 space-y-2">
                                  <div className="text-sm font-medium text-foreground">
                                    Your protocol is incomplete
                                  </div>
                                  <div className="text-xs text-muted leading-relaxed">
                                    Unlock {actualProducts.length - 1} more product option{actualProducts.length > 2 ? "s" : ""} (Budget, Sensitive-Safe, Maximum Strength) to properly treat your concerns.
                                  </div>
                                  <button className="text-xs text-primary hover:text-primary/80 font-medium uppercase tracking-wider">
                                    Unlock Full Product Stack →
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Fallback to examples if no actual products */}
                        {actualProducts.length === 0 && productSuggestion.examples.length > 0 && (
                          <div className="text-xs text-muted/80 pt-1">
                            Examples: {productSuggestion.examples.slice(0, 3).join(" · ")}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

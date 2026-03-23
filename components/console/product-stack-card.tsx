"use client";

import type { AnalysisResult } from "@/types/analysis";
import { getRoleLabel, getRoleColor } from "@/lib/product-logic";

interface ProductStackCardProps {
  result: AnalysisResult;
}

export function ProductStackCard({ result }: ProductStackCardProps) {
  // Collect all products from routine
  const allProductSuggestions = [
    ...result.am_routine.flatMap((step) => step.products || []),
    ...result.pm_routine.flatMap((step) => step.products || []),
  ];

  // Get unique products (first recommended from each category)
  const uniqueProducts = allProductSuggestions
    .filter((ps) => ps.products && ps.products.length > 0)
    .map((ps) => ({
      ingredient: ps.ingredient,
      category: ps.category,
      product: ps.products![0], // First product = recommended
    }))
    .slice(0, 8); // Show up to 8 products

  return (
    <div className="clinical-card space-y-6">
      <div className="space-y-3">
        <h2 className="clinical-label">Product Stack</h2>
        <p className="text-xs text-muted">
          Recommended products for your regimen
        </p>
      </div>

      <div className="space-y-3">
        {uniqueProducts.map((item, index) => (
          <div
            key={index}
            className="border border-border rounded-sm p-3 space-y-2"
          >
            {/* Role Label */}
            {item.product.role && (
              <div
                className={`text-xs font-semibold uppercase tracking-wider ${getRoleColor(item.product.role)}`}
              >
                {getRoleLabel(item.product.role)}
              </div>
            )}

            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">
                {item.product.brand} {item.product.name}
              </div>
              <div className="text-xs text-muted">
                {item.ingredient} · {item.category}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted/80">
                <span>
                  {item.product.price_tier === "budget" && "$ Budget"}
                  {item.product.price_tier === "mid" && "$$ Mid-range"}
                  {item.product.price_tier === "premium" && "$$$ Premium"}
                </span>
                <span>·</span>
                <span>{item.product.merchant}</span>
              </div>
            </div>

            {/* Product Reasoning */}
            {item.product.why && (
              <div className="text-xs text-muted leading-relaxed">
                {item.product.why}
              </div>
            )}

            <a
              href={item.product.affiliate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs text-primary hover:text-primary/80 font-medium uppercase tracking-wider transition-colors"
            >
              View Product →
            </a>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-border">
        <button className="text-xs text-primary hover:text-primary/80 uppercase tracking-wider font-medium">
          View Full Regimen Details →
        </button>
      </div>
    </div>
  );
}

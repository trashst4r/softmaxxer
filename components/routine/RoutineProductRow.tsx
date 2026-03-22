/**
 * Results Visual Layer — Catalog-v1 Product Display
 * Enhanced routine row with prominent product imagery
 * Sprint 7: Added product swap selector integration
 * Sprint 10: Increased image size for visual prominence
 * Sprint 11: Further increased image dominance to 112px
 * Sprint 18: Migrated to catalog-v1 schema
 * Catalog Routine Image Scale Up v1: Increased to 136px for premium presentation
 */

import Image from "next/image";
import type { RegimenStep } from "@/types/regimen";
import { CATALOG_V1 } from "@/lib/products/catalog-v1";
import { ProductSwapSelector } from "./ProductSwapSelector";

interface RoutineProductRowProps {
  step: RegimenStep;
  stepNumber: number;
  onSwap?: (newProductId: string) => void;
}

export function RoutineProductRow({ step, stepNumber, onSwap }: RoutineProductRowProps) {
  // Find product from catalog
  const product = CATALOG_V1.find((p) => p.id === step.productId);

  if (!product) {
    return (
      <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg border border-error">
        <span className="text-sm text-error">
          Product not found: {step.productId}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-8 p-6 bg-surface-container-lowest rounded-xl hover:shadow-sm transition-all">
      {/* Product Image - PRIMARY VISUAL (96px for stability) */}
      <div className="flex-shrink-0 w-24 h-24 relative bg-white rounded-lg overflow-hidden">
        <Image
          src={product.imageUrl || "/images/products/placeholder.jpg"}
          alt={`${product.brand} ${product.productName}`}
          fill
          className="object-contain p-2"
          sizes="96px"
          priority
        />
      </div>

      {/* Step Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            Step {stepNumber}
          </span>
        </div>
        <p className="text-base font-semibold text-on-surface mb-1 leading-tight">
          {step.label}
        </p>
        <p className="text-sm text-on-surface-variant font-medium mb-3">
          {product.brand} · {product.productName}
        </p>
        {onSwap && (
          <ProductSwapSelector
            role={step.role}
            currentProductId={step.productId}
            onSwap={onSwap}
          />
        )}
      </div>
    </div>
  );
}

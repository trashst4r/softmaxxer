/**
 * Protocol: Product Selector
 * Grid of product cards with controlled selection animations
 */

"use client";

import { motion } from "framer-motion";
import type { CatalogProduct } from "@/lib/products/types";
import type { RoutineStep } from "@/types/analysis";
import type { SelectedProduct } from "@/lib/protocol-state";
import { ProductCard } from "./product-card";
import { motion as motionConfig } from "@/lib/motion-config";

interface ProductSelectorProps {
  step: RoutineStep;
  stepNumber: number;
  routine: "am" | "pm";
  products: CatalogProduct[];
  selectedProductId: string | null;
  onSelect: (product: SelectedProduct) => void;
}

export function ProductSelector({
  step,
  stepNumber,
  routine,
  products,
  selectedProductId,
  onSelect,
}: ProductSelectorProps) {
  const handleProductSelect = (product: CatalogProduct) => {
    const selection: SelectedProduct = {
      stepId: step.id,
      stepLabel: step.step,
      stepNumber,
      routine,
      productId: product.id,
      brand: product.brand,
      name: product.name,
      price: product.price,
      tier: product.tier,
      roleLabel: product.roleLabel,
      affiliateUrl: "",
    };

    onSelect(selection);
  };

  if (products.length === 0) {
    return (
      <div className="text-sm text-muted italic py-4">
        No products available for this step
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product, index) => {
        const isSelected = selectedProductId === product.id;
        const hasSelection = selectedProductId !== null;

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{
              opacity: hasSelection && !isSelected ? 0.6 : 1,
              y: 0,
            }}
            transition={{
              opacity: {
                duration: motionConfig.duration.base / 1000,
                ease: motionConfig.easing.standard,
              },
              y: {
                duration: motionConfig.duration.base / 1000,
                ease: motionConfig.easing.standard,
                delay: index * (motionConfig.stagger.cards / 1000),
              },
            }}
          >
            <ProductCard
              product={product}
              isSelected={isSelected}
              onSelect={() => handleProductSelect(product)}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

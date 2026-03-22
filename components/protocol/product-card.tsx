/**
 * Protocol: Product Card
 * Individual selectable product with controlled motion
 */

"use client";

import { motion } from "framer-motion";
import type { CatalogProduct } from "@/lib/products/types";
import { motion as motionConfig } from "@/lib/motion-config";

interface ProductCardProps {
  product: CatalogProduct;
  isSelected: boolean;
  onSelect: () => void;
}

export function ProductCard({ product, isSelected, onSelect }: ProductCardProps) {
  return (
    <motion.button
      onClick={onSelect}
      className={`
        relative border rounded-xl p-6 text-left transition-colors cursor-pointer w-full
        ${
          isSelected
            ? "border-primary border-2 bg-primary/5"
            : "border-outline-variant bg-surface-container-lowest hover:border-outline"
        }
      `}
      animate={{
        y: isSelected ? -2 : 0,
        boxShadow: isSelected
          ? "0 4px 12px rgba(0, 0, 0, 0.08)"
          : "0 0 0 rgba(0, 0, 0, 0)",
      }}
      transition={{
        duration: motionConfig.duration.base / 1000,
        ease: motionConfig.easing.standard,
      }}
    >
      <div className="space-y-4">
        {/* Product Image Placeholder */}
        <div className="w-full aspect-square bg-surface-container-highest rounded-lg flex items-center justify-center overflow-hidden">
          <svg
            className="w-16 h-16 text-muted/20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <div className="font-body text-sm font-semibold text-on-surface">
            {product.brand}
          </div>
          <div className="font-body text-xs text-on-surface-variant line-clamp-2">
            {product.name}
          </div>
        </div>

        {/* Role Label */}
        {product.roleLabel && (
          <div className="text-xs font-medium text-primary">
            {product.roleLabel}
          </div>
        )}

        {/* Price and Selection State */}
        <div className="flex items-center justify-between pt-3 border-t border-outline-variant">
          <div className="font-body text-sm font-semibold text-on-surface">
            ${product.price}
          </div>

          {/* Checkmark with controlled animation */}
          <motion.div
            initial={false}
            animate={{
              opacity: isSelected ? 1 : 0,
              scale: isSelected ? 1 : 0.9,
            }}
            transition={{
              duration: motionConfig.duration.fast / 1000,
              ease: motionConfig.easing.standard,
              delay: isSelected ? 0.1 : 0,
            }}
          >
            {isSelected && (
              <div className="text-primary text-xs font-semibold flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Selected
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.button>
  );
}

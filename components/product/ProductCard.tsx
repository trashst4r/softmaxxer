/**
 * Product Card Component
 * Minimal clinical product card for catalog-v1 products
 * Sprint 18: Updated to use real product schema
 */

import Image from "next/image";
import type { ProductSpec } from "@/types/product";

interface ProductCardProps {
  product: ProductSpec;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white border border-outline-variant rounded-lg overflow-hidden hover:border-primary/30 transition-colors">
      {/* Image Container - Fixed Aspect Ratio */}
      <div className="relative aspect-square bg-white flex items-center justify-center p-6">
        <Image
          src={product.imageUrl || "/images/products/placeholder.jpg"}
          alt={`${product.brand} ${product.productName}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>

      {/* Product Info */}
      <div className="px-4 py-3 border-t border-outline-variant">
        <p className="text-xs uppercase tracking-wider text-muted font-medium mb-1">
          {product.brand}
        </p>
        <p className="text-sm font-medium text-on-surface truncate">
          {product.productName}
        </p>
        {product.priceAUD && (
          <p className="text-xs text-muted mt-1">
            ${product.priceAUD} AUD
          </p>
        )}
      </div>
    </div>
  );
}

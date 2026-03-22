/**
 * Routine Customization Layer v2
 * Product swap selector using catalog-v1 role-based filtering
 * Sprint 18: Migrated to real product catalog
 */

import Image from "next/image";
import { CATALOG_V1 } from "@/lib/products/catalog-v1";
import type { RegimenStepRole } from "@/types/regimen";
import type { ProductRole } from "@/types/product";

interface ProductSwapSelectorProps {
  role: RegimenStepRole;
  currentProductId: string;
  onSwap: (newProductId: string) => void;
}

// Map regimen step role to product role
function mapRegimenRoleToProductRole(role: RegimenStepRole): ProductRole {
  switch (role) {
    case "cleanse":
      return "cleanser";
    case "treat":
      return "serum"; // Treats can be serum, treatment, or support
    case "moisturize":
      return "moisturizer";
    case "protect":
      return "sunscreen";
    default:
      return "support";
  }
}

export function ProductSwapSelector({
  role,
  currentProductId,
  onSwap,
}: ProductSwapSelectorProps) {
  // Get all products for this role from catalog
  const productRole = mapRegimenRoleToProductRole(role);

  // For treatment role, include serums, treatments, and support products
  let availableProducts = CATALOG_V1.filter((p) => {
    if (role === "treat") {
      return p.role === "serum" || p.role === "treatment" || p.role === "support";
    }
    if (role === "moisturize") {
      return p.role === "moisturizer" || p.role === "balm";
    }
    return p.role === productRole;
  });

  // Filter out current product if there are alternatives
  const alternatives = availableProducts.filter((p) => p.id !== currentProductId);

  // If no alternatives, don't show selector
  if (alternatives.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <select
        value={currentProductId}
        onChange={(e) => onSwap(e.target.value)}
        className="text-xs text-muted bg-transparent border border-outline-variant rounded px-2 py-1 cursor-pointer hover:border-primary/50 transition-colors appearance-none pr-6"
        style={{ minWidth: "180px" }}
      >
        {availableProducts.map((product) => {
          return (
            <option key={product.id} value={product.id}>
              {product.brand} {product.productName}
              {product.id === currentProductId ? " (current)" : ""}
            </option>
          );
        })}
      </select>
      <svg
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  );
}

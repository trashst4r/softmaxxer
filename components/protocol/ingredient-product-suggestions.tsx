"use client";

import type { WeeklyProtocol } from "@/lib/protocol/protocol-types";

interface ProductSuggestion {
  name: string;
  brand: string;
  strength: string;
  priceRange: "budget" | "mid" | "premium";
  price: string;
  notes?: string;
}

interface IngredientProductSuggestionsProps {
  protocol: WeeklyProtocol;
}

// Product database per ingredient family
const productSuggestions: Record<string, ProductSuggestion[]> = {
  "retinoid": [
    { name: "Retinol 0.2%", brand: "The Ordinary", strength: "0.2%", priceRange: "budget", price: "$6", notes: "Beginner-friendly" },
    { name: "Retinol 1% in Squalane", brand: "The Ordinary", strength: "1.0%", priceRange: "budget", price: "$7", notes: "Intermediate strength" },
    { name: "Clinical 1% Retinol", brand: "Paula's Choice", strength: "1.0%", priceRange: "mid", price: "$58", notes: "Advanced formula" },
  ],
  "tretinoin": [
    { name: "Tretinoin 0.025%", brand: "Curology (Rx)", strength: "0.025%", priceRange: "mid", price: "$40/mo", notes: "Prescription required" },
    { name: "Tretinoin 0.05%", brand: "Dermatica (Rx)", strength: "0.05%", priceRange: "mid", price: "$50/mo", notes: "Stronger, Rx" },
    { name: "Retin-A 0.1%", brand: "Retin-A (Rx)", strength: "0.1%", priceRange: "premium", price: "$80", notes: "Maximum strength" },
  ],
  "vitamin-c": [
    { name: "Ascorbic Acid 8%", brand: "The Ordinary", strength: "8%", priceRange: "budget", price: "$6", notes: "pH 2.0" },
    { name: "C15 Super Booster", brand: "Paula's Choice", strength: "15%", priceRange: "mid", price: "$52", notes: "Stabilized" },
    { name: "C E Ferulic", brand: "SkinCeuticals", strength: "15%", priceRange: "premium", price: "$182", notes: "Gold standard" },
  ],
  "niacinamide": [
    { name: "Niacinamide 10% + Zinc", brand: "The Ordinary", strength: "10%", priceRange: "budget", price: "$6" },
    { name: "10% Niacinamide Booster", brand: "Paula's Choice", strength: "10%", priceRange: "mid", price: "$52" },
    { name: "Niacinamide Serum", brand: "Glossier", strength: "5%", priceRange: "mid", price: "$28", notes: "Gentle" },
  ],
  "azelaic-acid": [
    { name: "Azelaic Acid 10%", brand: "The Ordinary", strength: "10%", priceRange: "budget", price: "$8" },
    { name: "Azelaic Acid Booster", brand: "Paula's Choice", strength: "10%", priceRange: "mid", price: "$42" },
    { name: "Finacea Gel", brand: "Finacea (Rx)", strength: "15%", priceRange: "premium", price: "$70", notes: "Prescription" },
  ],
  "aha": [
    { name: "Glycolic Acid 7% Toner", brand: "The Ordinary", strength: "7%", priceRange: "budget", price: "$9" },
    { name: "8% AHA Gel", brand: "Paula's Choice", strength: "8%", priceRange: "mid", price: "$36" },
    { name: "Glycolic Renewal", brand: "Drunk Elephant", strength: "10%", priceRange: "premium", price: "$90" },
  ],
  "bha": [
    { name: "Salicylic Acid 2%", brand: "The Ordinary", strength: "2%", priceRange: "budget", price: "$6" },
    { name: "2% BHA Liquid", brand: "Paula's Choice", strength: "2%", priceRange: "mid", price: "$35", notes: "Cult favorite" },
    { name: "Clarifying BHA", brand: "Glossier", strength: "2%", priceRange: "mid", price: "$28" },
  ],
  "gentle-cleanser": [
    { name: "Squalane Cleanser", brand: "The Ordinary", strength: "N/A", priceRange: "budget", price: "$8" },
    { name: "Hydrating Cleanser", brand: "CeraVe", strength: "N/A", priceRange: "budget", price: "$15", notes: "Dermatologist favorite" },
    { name: "Ultra Facial Cleanser", brand: "Kiehl's", strength: "N/A", priceRange: "mid", price: "$22" },
  ],
  "barrier-cream": [
    { name: "Natural Moisturizing Factors", brand: "The Ordinary", strength: "N/A", priceRange: "budget", price: "$7" },
    { name: "Moisturizing Cream", brand: "CeraVe", strength: "N/A", priceRange: "budget", price: "$17", notes: "Ceramides" },
    { name: "Protini Peptide", brand: "Drunk Elephant", strength: "N/A", priceRange: "premium", price: "$68" },
  ],
  "spf": [
    { name: "Mineral UV Filters SPF 50", brand: "The Ordinary", strength: "SPF 50", priceRange: "budget", price: "$13" },
    { name: "Ultra Light Fluid SPF 50+", brand: "La Roche-Posay", strength: "SPF 50+", priceRange: "mid", price: "$36", notes: "EU filters" },
    { name: "Invisible Shield SPF 42", brand: "Supergoop", strength: "SPF 42", priceRange: "premium", price: "$38", notes: "Cosmetically elegant" },
  ],
};

export function IngredientProductSuggestions({ protocol }: IngredientProductSuggestionsProps) {
  // Extract unique ingredient families from protocol
  const allIngredients = new Set<string>();

  protocol.days.forEach(day => {
    day.am.forEach(step => allIngredients.add(step.ingredientFamily));
    day.pm.forEach(step => allIngredients.add(step.ingredientFamily));
  });

  const ingredients = Array.from(allIngredients);

  const getPriceRangeBadge = (range: string) => {
    switch (range) {
      case "budget":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "mid":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "premium":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-surface-container text-on-surface-variant";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-on-surface font-headline mb-2">
          Product Recommendations
        </h2>
        <p className="text-sm text-on-surface-variant">
          Suggested products for each ingredient in your protocol. Choose based on your budget and tolerance.
        </p>
      </div>

      <div className="space-y-6">
        {ingredients.map((ingredient) => {
          const suggestions = productSuggestions[ingredient] || [];
          if (suggestions.length === 0) return null;

          return (
            <div key={ingredient} className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/20">
              <h3 className="text-lg font-bold text-on-surface capitalize mb-4 font-headline">
                {ingredient.replace(/-/g, " ")}
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                {suggestions.map((product, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-container-highest rounded-lg p-4 border border-outline-variant/10 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-on-surface leading-tight">
                          {product.name}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {product.brand}
                        </p>
                      </div>
                      <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold ${getPriceRangeBadge(product.priceRange)}`}>
                        {product.priceRange}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-lg font-bold text-primary">
                        {product.price}
                      </span>
                      {product.strength !== "N/A" && (
                        <span className="text-xs text-on-surface-variant">
                          {product.strength}
                        </span>
                      )}
                    </div>

                    {product.notes && (
                      <p className="text-[11px] text-on-surface-variant mt-2 italic">
                        {product.notes}
                      </p>
                    )}

                    <button className="w-full mt-3 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 py-2 rounded-lg transition-colors">
                      View Product
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Protocol: Deck Review Modal
 * Purchase list with controlled modal animations
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ProductSelections } from "@/lib/protocol-state";
import { getSelectedProductsArray, calculatePriceSummary } from "@/lib/protocol-state";
import { variants } from "@/lib/motion-config";

interface DeckReviewProps {
  selections: ProductSelections;
  totalSteps: number;
  onClose: () => void;
  isOpen: boolean;
}

export function DeckReview({ selections, totalSteps, onClose, isOpen }: DeckReviewProps) {
  const selectedProducts = getSelectedProductsArray(selections);
  const summary = calculatePriceSummary(selections, totalSteps);

  const amProducts = selectedProducts.filter((p) => p.routine === "am");
  const pmProducts = selectedProducts.filter((p) => p.routine === "pm");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={variants.modalBackdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              variants={variants.modalContent}
              initial="initial"
              animate="animate"
              exit="exit"
              className="bg-surface rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-surface border-b border-outline-variant p-6 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-headline text-2xl font-semibold text-on-surface">
                      Your Complete Deck
                    </h2>
                    <p className="text-sm text-muted mt-1">
                      {summary.selectedCount} products · ${summary.selectedPrice} total
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-muted hover:text-on-surface transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* AM Routine */}
                {amProducts.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-headline text-lg font-semibold text-on-surface border-b border-outline-variant pb-2">
                      Morning Routine
                    </h3>
                    <div className="space-y-3">
                      {amProducts.map((product) => (
                        <ProductReviewCard key={product.stepId} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                {/* PM Routine */}
                {pmProducts.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-headline text-lg font-semibold text-on-surface border-b border-outline-variant pb-2">
                      Evening Routine
                    </h3>
                    <div className="space-y-3">
                      {pmProducts.map((product) => (
                        <ProductReviewCard key={product.stepId} product={product} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="border-t border-outline-variant pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-headline text-xl font-semibold text-on-surface">
                        Total
                      </div>
                      <div className="text-sm text-muted">
                        {summary.selectedCount} products
                      </div>
                    </div>
                    <div className="font-headline text-3xl font-light text-on-surface">
                      ${summary.selectedPrice}
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-surface-container-low rounded-lg p-4">
                  <p className="text-sm text-muted leading-relaxed">
                    Click "Open Link" for each product to view on the retailer's site.
                    Links open in new tabs so you can compare options and add to your cart.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * ProductReviewCard Component
 */
interface ProductReviewCardProps {
  product: {
    stepId: string;
    stepLabel: string;
    stepNumber: number;
    brand: string;
    name: string;
    price: number;
    roleLabel: string;
    affiliateUrl: string;
  };
}

function ProductReviewCard({ product }: ProductReviewCardProps) {
  return (
    <div className="border border-outline-variant rounded-lg p-4 flex items-start gap-4">
      <div className="flex-1 space-y-2">
        <div className="space-y-1">
          <div className="text-xs text-muted uppercase tracking-wider">
            Step {product.stepNumber}: {product.stepLabel}
          </div>
          <div className="font-body text-sm font-semibold text-on-surface">
            {product.brand} {product.name}
          </div>
          <div className="text-xs text-primary">
            {product.roleLabel}
          </div>
        </div>
        <div className="font-body text-lg font-semibold text-on-surface">
          ${product.price}
        </div>
      </div>
      {product.affiliateUrl ? (
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          View Product →
        </a>
      ) : (
        <div className="px-4 py-2 border border-outline-variant rounded-lg text-sm text-muted whitespace-nowrap">
          Link Coming Soon
        </div>
      )}
    </div>
  );
}

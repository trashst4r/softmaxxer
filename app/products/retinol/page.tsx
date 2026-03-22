import Link from "next/link";
import { PRODUCT_CATALOG } from "@/lib/products/catalog";

export const metadata = {
  title: "Best Retinol Products | Softmaxxer",
  description: "Evidence-backed retinoids for anti-aging, acne, and texture improvement.",
};

export default function RetinolPage() {
  // Pull retinoid products from catalog
  const retinoids = PRODUCT_CATALOG.filter(p => p.stepType === "retinoid");

  return (
    <main className="pt-24 pb-32 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-3 block">
          Product Guide
        </span>
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface mb-4">
          Retinoids: The Gold Standard Active
        </h1>
        <p className="text-lg text-muted leading-relaxed max-w-2xl">
          The most researched ingredient for acne, photoaging, and texture—when used correctly.
        </p>
      </header>

      {/* Content */}
      <div className="space-y-12">
        {/* Intro Section */}
        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Why Retinoids Work
          </h2>
          <p className="text-muted leading-relaxed">
            Retinoids (vitamin A derivatives) accelerate cell turnover, increase collagen production,
            regulate sebum, and prevent clogged pores. Decades of research support their efficacy for
            acne, fine lines, hyperpigmentation, and overall texture improvement.
          </p>
          <p className="text-muted leading-relaxed">
            The challenge: retinoids also cause dryness, peeling, and increased sun sensitivity when
            introduced too aggressively. Success requires starting low, building tolerance slowly, and
            pairing with strong barrier support.
          </p>
        </section>

        {/* Product Grid */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">
            Recommended Retinol Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {retinoids.map((product) => (
              <div
                key={product.id}
                className="bg-surface-container-low rounded-xl p-6 border border-outline-variant hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted font-medium mb-1">
                      {product.brand}
                    </p>
                    <h3 className="font-semibold text-on-surface">
                      {product.name}
                    </h3>
                  </div>
                  <span className="text-sm font-mono text-muted">
                    ${product.price}
                  </span>
                </div>
                <p className="text-sm text-muted mb-3">
                  {product.roleLabel}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.ageOptimized && (
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                      {product.ageOptimized}
                    </span>
                  )}
                  {product.skinTargets.slice(0, 2).map((target) => (
                    <span
                      key={target}
                      className="px-2 py-1 text-xs rounded-full bg-surface-container-highest text-on-surface"
                    >
                      {target}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-3">
            Get a Retinoid Routine Built for Your Tolerance
          </h3>
          <p className="text-muted mb-6">
            Our check-in evaluates your barrier health, current active usage, and sensitivity to
            recommend the right retinoid strength and introduction schedule—plus the support products
            to minimize irritation.
          </p>
          <Link
            href="/analysis"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Build Your Routine
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </section>
      </div>

      {/* Footer Links */}
      <footer className="mt-16 pt-8 border-t border-outline-variant flex flex-wrap items-center justify-center gap-3 text-sm text-muted">
        <Link href="/products/cleanser" className="hover:text-on-surface transition-colors">
          Cleansers
        </Link>
        <span>·</span>
        <Link href="/products/moisturizer" className="hover:text-on-surface transition-colors">
          Moisturizers
        </Link>
        <span>·</span>
        <Link href="/products/spf" className="hover:text-on-surface transition-colors">
          SPF
        </Link>
        <span>·</span>
        <Link href="/how-it-works" className="hover:text-on-surface transition-colors">
          How It Works
        </Link>
      </footer>
    </main>
  );
}

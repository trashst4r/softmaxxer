"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Media Kit v3: Visual System Pitch
 *
 * Clean, minimal, high-end layout showcasing Soft Productivity's
 * conversion infrastructure for product-led systems.
 */
export default function MediaKitPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* SECTION 1: Hero */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <motion.h1
            className="font-headline text-6xl font-light tracking-tight text-on-surface"
            {...fadeIn}
          >
            Soft Productivity
          </motion.h1>
          <motion.p
            className="font-body text-2xl font-light text-on-surface-variant"
            {...fadeIn}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            Conversion Infrastructure for Product-Led Systems
          </motion.p>
          <motion.p
            className="font-body text-base text-muted max-w-2xl mx-auto"
            {...fadeIn}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            We embed products into decision flows, not ads
          </motion.p>
        </div>
      </section>

      {/* SECTION 2: System Flow */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="font-headline text-3xl font-medium text-on-surface mb-16 text-center"
            {...fadeIn}
          >
            How It Works
          </motion.h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {[
              { label: "Check-In", desc: "Diagnostic questions" },
              { label: "Profile", desc: "Algorithmic analysis" },
              { label: "Routine", desc: "Personalized regimen" },
              { label: "Product Selection", desc: "Curated deck builder" },
              { label: "Purchase", desc: "Affiliate conversion" },
            ].map((step, index) => (
              <motion.div
                key={step.label}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              >
                <div className="border border-outline-variant bg-surface-container-lowest rounded-lg p-6 min-w-[180px] text-center">
                  <div className="font-headline text-lg font-medium text-on-surface mb-2">
                    {step.label}
                  </div>
                  <div className="font-body text-xs text-muted">
                    {step.desc}
                  </div>
                </div>
                {index < 4 && (
                  <div className="hidden md:block text-muted text-2xl">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Product (Softmaxxer UI Mock) */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="font-headline text-3xl font-medium text-on-surface mb-16 text-center"
            {...fadeIn}
          >
            Product Experience: Softmaxxer
          </motion.h2>
          <motion.div
            className="border border-outline-variant rounded-lg p-8 bg-surface-container-low"
            {...fadeIn}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-xl font-medium text-on-surface">
                  Morning Routine
                </h3>
                <span className="font-body text-sm text-muted">4 steps</span>
              </div>

              {/* Step 1: Cleanser */}
              <div className="space-y-4">
                <div className="font-body text-sm font-medium text-on-surface">
                  01. Cleanser
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProductCard
                    brand="CeraVe"
                    name="Foaming Cleanser"
                    price={15}
                    selected={true}
                  />
                  <ProductCard
                    brand="La Roche-Posay"
                    name="Effaclar Gel"
                    price={24}
                  />
                  <ProductCard
                    brand="Vanicream"
                    name="Gentle Cleanser"
                    price={12}
                  />
                </div>
              </div>

              {/* Step 2: Treatment */}
              <div className="space-y-4">
                <div className="font-body text-sm font-medium text-on-surface">
                  02. Treatment Serum
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProductCard
                    brand="The Ordinary"
                    name="Niacinamide 10%"
                    price={6}
                  />
                  <ProductCard
                    brand="Paula's Choice"
                    name="Niacinamide Booster"
                    price={29}
                    selected={true}
                  />
                  <ProductCard
                    brand="CeraVe"
                    name="PM Lotion"
                    price={17}
                  />
                </div>
              </div>

              {/* Step 3: Moisturizer */}
              <div className="space-y-4">
                <div className="font-body text-sm font-medium text-on-surface">
                  03. Moisturizer
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProductCard
                    brand="Neutrogena"
                    name="Hydro Boost Gel"
                    price={18}
                    selected={true}
                  />
                  <ProductCard
                    brand="CeraVe"
                    name="Moisturizing Lotion"
                    price={16}
                  />
                </div>
              </div>

              {/* Step 4: SPF */}
              <div className="space-y-4">
                <div className="font-body text-sm font-medium text-on-surface">
                  04. Sunscreen SPF 30+
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ProductCard
                    brand="EltaMD"
                    name="UV Clear SPF 46"
                    price={39}
                  />
                  <ProductCard
                    brand="Supergoop"
                    name="Unseen Sunscreen"
                    price={36}
                    selected={true}
                  />
                  <ProductCard
                    brand="La Roche-Posay"
                    name="Anthelios Mineral"
                    price={34}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: Why It Converts */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="font-headline text-3xl font-medium text-on-surface mb-16 text-center"
            {...fadeIn}
          >
            Why It Converts
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Purchase Intent at Entry",
                desc: "Users arrive seeking product recommendations, not content. The entire flow is pre-qualified for conversion.",
              },
              {
                title: "Structured Decision Architecture",
                desc: "Each product is positioned within a system, not as isolated choice. Context drives selection confidence.",
              },
              {
                title: "Single-Selection Commitment",
                desc: "Deck-building model creates ownership. Users complete their stack before purchase, increasing basket size.",
              },
              {
                title: "Embedded Affiliate Distribution",
                desc: "Links live at step level and final CTA. No redirects, no broken flows. Conversion happens in-context.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="border border-outline-variant rounded-lg p-6 bg-surface-container-lowest"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              >
                <h3 className="font-headline text-lg font-medium text-on-surface mb-3">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Integration */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="font-headline text-3xl font-medium text-on-surface mb-16 text-center"
            {...fadeIn}
          >
            Affiliate Integration Points
          </motion.h2>
          <motion.div
            className="space-y-8"
            {...fadeIn}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            {/* Step Level */}
            <div className="border border-outline-variant rounded-lg p-6 bg-surface-container-low">
              <div className="font-body text-sm font-medium text-on-surface mb-4">
                Step-Level Product Cards
              </div>
              <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded border border-outline-variant">
                <div className="flex-1">
                  <div className="font-body text-sm font-medium text-on-surface">
                    CeraVe Foaming Cleanser
                  </div>
                  <div className="font-body text-xs text-muted">$15 · Budget Pick</div>
                </div>
                <div className="px-4 py-2 bg-primary text-on-primary rounded text-xs font-medium">
                  View Product →
                </div>
              </div>
            </div>

            {/* Buy All Bar */}
            <div className="border-2 border-primary/30 rounded-lg p-6 bg-primary/5">
              <div className="font-body text-sm font-medium text-on-surface mb-4">
                Complete Routine CTA (Sticky Bottom Bar)
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded border border-outline-variant">
                <div>
                  <div className="font-body text-sm font-medium text-on-surface">
                    Your Deck: 4 of 4 steps complete
                  </div>
                  <div className="font-body text-xs text-muted">Total: $96</div>
                </div>
                <div className="px-6 py-3 bg-primary text-on-primary rounded font-medium">
                  Review & Buy All
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6: Positioning */}
      <section className="py-24 px-6 bg-surface-container-low">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              className="space-y-6"
              {...fadeIn}
            >
              <h3 className="font-headline text-2xl font-medium text-on-surface">
                Not This
              </h3>
              <ul className="space-y-3 font-body text-sm text-muted">
                <li className="flex items-start gap-3">
                  <span className="text-error">×</span>
                  <span>Influencers with discount codes in bio</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-error">×</span>
                  <span>Blogs with affiliate links in listicles</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-error">×</span>
                  <span>Banner ads on product review sites</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-error">×</span>
                  <span>Email lists pushing weekly deals</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="space-y-6"
              {...fadeIn}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <h3 className="font-headline text-2xl font-medium text-on-surface">
                This Instead
              </h3>
              <ul className="space-y-3 font-body text-sm text-on-surface">
                <li className="flex items-start gap-3">
                  <span className="text-primary">✓</span>
                  <span>Structured recommendation system with diagnostic entry</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">✓</span>
                  <span>Product selection as part of decision architecture</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">✓</span>
                  <span>Conversion embedded in workflow, not interruption</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">✓</span>
                  <span>Purchase intent at every stage, not retrofitted</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Contact */}
      <section className="py-16 px-6 border-t border-outline-variant">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="font-headline text-xl font-medium text-on-surface">
            Soft Productivity
          </div>
          <div className="font-body text-sm text-muted space-y-1">
            <div>softproductivity.online</div>
            <div>contact@softproductivity.online</div>
          </div>
          <div className="pt-4">
            <Link
              href="/"
              className="font-body text-sm text-primary hover:underline"
            >
              ← Back to Softmaxxer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * ProductCard Component
 * Minimal product card for UI mock
 */
interface ProductCardProps {
  brand: string;
  name: string;
  price: number;
  selected?: boolean;
}

function ProductCard({ brand, name, price, selected = false }: ProductCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-outline-variant bg-surface-container-lowest hover:border-outline"
      }`}
    >
      <div className="space-y-2">
        <div className="font-body text-sm font-medium text-on-surface">
          {brand}
        </div>
        <div className="font-body text-xs text-muted">
          {name}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="font-body text-sm font-medium text-on-surface">
            ${price}
          </div>
          {selected && (
            <div className="text-primary text-xs font-medium">
              ✓ Selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

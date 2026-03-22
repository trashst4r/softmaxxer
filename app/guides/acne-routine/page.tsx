import Link from "next/link";
import { motion } from "framer-motion";

export const metadata = {
  title: "Acne Routine Guide | Softmaxxer",
  description: "Evidence-based routine for managing breakouts with effective actives and barrier support.",
};

export default function AcneRoutinePage() {
  return (
    <main className="pt-24 pb-32 px-6 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-3 block">
          Guide
        </span>
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface mb-4">
          Managing Acne with Evidence-Based Actives
        </h1>
        <p className="text-lg text-muted leading-relaxed max-w-2xl">
          A structured approach to reducing breakouts while maintaining barrier health.
        </p>
      </header>

      {/* Content Sections */}
      <div className="space-y-12">
        {/* Problem */}
        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            The Challenge
          </h2>
          <p className="text-muted leading-relaxed">
            Active breakouts occur when sebum, dead skin cells, and bacteria accumulate in pores. Most
            over-the-counter approaches either over-dry skin or focus on single targets, leading to
            inconsistent results and barrier damage.
          </p>
          <p className="text-muted leading-relaxed">
            Effective acne management requires three coordinated steps: controlling oil production,
            exfoliating pore-clogging debris, and reducing inflammation—all while preserving barrier function.
          </p>
        </section>

        {/* Solution */}
        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            The Solution
          </h2>
          <p className="text-muted leading-relaxed">
            A minimal acne routine combines proven actives in the right order:
          </p>
          <ul className="space-y-3 text-muted">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">→</span>
              <span><strong className="text-on-surface">Morning niacinamide:</strong> Regulates sebum and reduces inflammation without irritation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">→</span>
              <span><strong className="text-on-surface">Evening salicylic or benzoyl:</strong> Penetrates pores to clear debris and reduce bacteria</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">→</span>
              <span><strong className="text-on-surface">Barrier support:</strong> Ceramide-rich moisturizer and daily SPF to prevent damage</span>
            </li>
          </ul>
          <p className="text-muted leading-relaxed mt-4">
            This layered approach targets multiple acne pathways while minimizing the risk of dryness,
            peeling, or sensitization.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-3">
            Get Your Personalized Acne Protocol
          </h3>
          <p className="text-muted mb-6">
            Our check-in analyzes your specific skin behavior, active breakout severity, and barrier
            health to recommend the right combination of actives and support products.
          </p>
          <Link
            href="/analysis"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Start Free Check-In
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </section>
      </div>

      {/* Footer Links */}
      <footer className="mt-16 pt-8 border-t border-outline-variant flex flex-wrap items-center justify-center gap-3 text-sm text-muted">
        <Link href="/guides/beginner-routine" className="hover:text-on-surface transition-colors">
          Beginner Routine
        </Link>
        <span>·</span>
        <Link href="/guides/dry-skin-routine" className="hover:text-on-surface transition-colors">
          Dry Skin Routine
        </Link>
        <span>·</span>
        <Link href="/how-it-works" className="hover:text-on-surface transition-colors">
          How It Works
        </Link>
      </footer>
    </main>
  );
}

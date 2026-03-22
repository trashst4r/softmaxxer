import Link from "next/link";

export const metadata = {
  title: "Dry Skin Routine Guide | Softmaxxer",
  description: "Restore barrier health and lock in hydration with layered humectants and occlusives.",
};

export default function DrySkinRoutinePage() {
  return (
    <main className="pt-24 pb-32 px-6 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-3 block">
          Guide
        </span>
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface mb-4">
          Managing Dry, Dehydrated Skin
        </h1>
        <p className="text-lg text-muted leading-relaxed max-w-2xl">
          Rebuild moisture retention and restore barrier function with strategic layering.
        </p>
      </header>

      {/* Content Sections */}
      <div className="space-y-12">
        {/* Problem */}
        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            The Root Cause
          </h2>
          <p className="text-muted leading-relaxed">
            Tight, flaky, or sensitized skin signals a compromised moisture barrier. When lipid layers
            between skin cells break down, water escapes faster than it can be replaced, leading to
            chronic dehydration and increased reactivity.
          </p>
          <p className="text-muted leading-relaxed">
            Most "hydrating" products focus only on adding water without repairing the barrier or
            preventing evaporation, creating a cycle of temporary relief followed by worsening dryness.
          </p>
        </section>

        {/* Solution */}
        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            The Layered Approach
          </h2>
          <p className="text-muted leading-relaxed">
            Restoring barrier health requires three coordinated layers:
          </p>
          <ul className="space-y-3 text-muted">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">→</span>
              <span><strong className="text-on-surface">Gentle cleanse:</strong> Remove impurities without stripping natural oils (cream or balm formulas)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">→</span>
              <span><strong className="text-on-surface">Hydrate:</strong> Apply humectants like hyaluronic acid to draw water into skin</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">→</span>
              <span><strong className="text-on-surface">Seal:</strong> Lock everything in with ceramides and occlusives (moisturizer + optional balm)</span>
            </li>
          </ul>
          <p className="text-muted leading-relaxed mt-4">
            This sequence ensures water is both delivered and retained, while supporting long-term
            barrier repair through lipid replenishment.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-3">
            Get a Dry Skin Protocol Built for You
          </h3>
          <p className="text-muted mb-6">
            Our check-in assesses your barrier health and dryness severity to recommend the optimal
            combination of gentle cleansing, hydration layers, and occlusive support.
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
        <Link href="/guides/acne-routine" className="hover:text-on-surface transition-colors">
          Acne Routine
        </Link>
        <span>·</span>
        <Link href="/guides/beginner-routine" className="hover:text-on-surface transition-colors">
          Beginner Routine
        </Link>
        <span>·</span>
        <Link href="/how-it-works" className="hover:text-on-surface transition-colors">
          How It Works
        </Link>
      </footer>
    </main>
  );
}

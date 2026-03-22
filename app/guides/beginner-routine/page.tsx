import Link from "next/link";

export const metadata = {
  title: "Beginner Skincare Routine | Softmaxxer",
  description: "Start with the essentials: cleanse, moisturize, protect. Simple, effective, science-backed.",
};

export default function BeginnerRoutinePage() {
  return (
    <main className="pt-24 pb-32 px-6 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-3 block">
          Guide
        </span>
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface mb-4">
          Start Simple: The Core Routine
        </h1>
        <p className="text-lg text-muted leading-relaxed max-w-2xl">
          Three essential steps that work for everyone, regardless of skin type or concerns.
        </p>
      </header>

      {/* Content Sections */}
      <div className="space-y-12">
        {/* Problem */}
        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Why Most Routines Fail
          </h2>
          <p className="text-muted leading-relaxed">
            Skincare marketing promotes complex multi-step routines with trendy ingredients, leading to
            confusion, wasted money, and inconsistent results. Most people need far less than they think.
          </p>
          <p className="text-muted leading-relaxed">
            Research shows that a minimal routine focused on barrier protection and sun defense delivers
            better long-term outcomes than layering multiple actives without clear objectives.
          </p>
        </section>

        {/* Solution */}
        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            The Core Three Steps
          </h2>
          <p className="text-muted leading-relaxed">
            Every effective skincare routine starts with these fundamentals:
          </p>
          <ul className="space-y-3 text-muted">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">→</span>
              <span><strong className="text-on-surface">Cleanse:</strong> Remove debris and excess oil without stripping your skin's natural barrier</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">→</span>
              <span><strong className="text-on-surface">Moisturize:</strong> Lock in hydration with ceramides and humectants that support barrier function</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">→</span>
              <span><strong className="text-on-surface">Protect (AM only):</strong> Daily broad-spectrum SPF to prevent photoaging and pigmentation</span>
            </li>
          </ul>
          <p className="text-muted leading-relaxed mt-4">
            Master these three steps for 4–6 weeks before adding targeted actives. A strong foundation
            makes everything else work better.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-3">
            Build Your Custom Beginner Routine
          </h3>
          <p className="text-muted mb-6">
            Our check-in identifies your skin behavior and sensitivities to recommend the right cleanser,
            moisturizer, and SPF formulas for your baseline routine.
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

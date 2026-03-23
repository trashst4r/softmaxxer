import Link from "next/link";

export const metadata = {
  title: "How It Works | Softmaxxer",
  description: "Evidence-based routine optimization in three steps: analyze, build, track.",
};

export default function HowItWorksPage() {
  return (
    <main className="pt-24 pb-32 px-6 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-3 block">
          Process
        </span>
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface mb-4">
          How Softmaxxer Works
        </h1>
        <p className="text-lg text-muted leading-relaxed max-w-2xl">
          Evidence-based routine optimization in three steps.
        </p>
      </header>

      {/* Content Sections */}
      <div className="space-y-16">
        {/* Step 1 */}
        <section className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-headline text-4xl font-bold text-primary">01</span>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              Skin Analysis
            </h2>
          </div>
          <p className="text-muted leading-relaxed">
            Complete a 7-question check-in covering skin behavior, current concerns, active ingredient
            usage, and SPF habits. Our scoring engine evaluates five core dimensions:
          </p>
          <ul className="space-y-2 text-muted ml-6">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>Oil production and sebum patterns</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>Acne severity and breakout frequency</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>Dryness and dehydration levels</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>Sensitivity and reactive tendencies</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>Barrier health and moisture retention</span>
            </li>
          </ul>
          <p className="text-muted leading-relaxed mt-4">
            Results include your skin profile summary, ranked concerns, and a complete AM/PM routine
            structure designed for your current state.
          </p>
        </section>

        {/* Step 2 */}
        <section className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-headline text-4xl font-bold text-primary">02</span>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              Receive Your Protocol
            </h2>
          </div>
          <p className="text-muted leading-relaxed">
            Your weekly protocol is generated algorithmically based on your skin profile. The system
            determines active ingredients, frequency, recovery spacing, and safety constraints automatically.
          </p>
          <p className="text-muted leading-relaxed">
            Each protocol includes:
          </p>
          <ul className="space-y-2 text-muted ml-6">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>7-day schedule with active treatment and recovery days</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>Day-by-day AM/PM routines with ingredient guidance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>Risk assessment and safety constraints for your profile</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>Product search links for each ingredient family</span>
            </li>
          </ul>
          <p className="text-muted leading-relaxed mt-4">
            Protocols are locked to ensure safety and efficacy. To change your protocol, retake the
            check-in with updated answers.
          </p>
        </section>

        {/* Step 3 */}
        <section className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-headline text-4xl font-bold text-primary">03</span>
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              Track Consistency
            </h2>
          </div>
          <p className="text-muted leading-relaxed">
            Use the dashboard to check off each step as you complete your AM and PM routines. Consistency
            data is logged locally to show your adherence trends over time.
          </p>
          <p className="text-muted leading-relaxed">
            Most skincare results require 4–8 weeks of consistent use. The dashboard helps you stay
            accountable without complex tracking or manual logging.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-3">
            Ready to Build Your Routine?
          </h3>
          <p className="text-muted mb-6">
            Start with our free skin check-in. Get a personalized routine structure, ranked product
            recommendations, and a dashboard to track consistency—all in under 3 minutes.
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
          Beginner Guide
        </Link>
        <span>·</span>
        <Link href="/guides/acne-routine" className="hover:text-on-surface transition-colors">
          Acne Guide
        </Link>
        <span>·</span>
        <Link href="/products/cleanser" className="hover:text-on-surface transition-colors">
          Browse Products
        </Link>
      </footer>
    </main>
  );
}

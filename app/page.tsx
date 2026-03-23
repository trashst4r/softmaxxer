import Link from "next/link";

export const metadata = {
  title: "Softmaxxer — Evidence-Based Skincare Routine Optimization",
  description: "Build a personalized skincare routine based on your skin's unique needs. Get product recommendations, track consistency, and optimize results with evidence-based guidance.",
};

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main headline */}
          <div className="space-y-4">
            <span className="font-label text-xs uppercase tracking-[0.2em] text-primary">
              Evidence-Based Skincare
            </span>
            <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-on-surface leading-tight">
              Build Your Perfect
              <br />
              Skincare Routine
            </h1>
            <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              Get a personalized AM/PM routine based on your skin's unique needs. Evidence-based
              product recommendations, consistency tracking, and protocol optimization—all in one place.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/analysis"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity text-lg"
            >
              Start Free Check-In
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Trust Badge */}
          <p className="text-sm text-muted pt-4">
            Free to use • No account required • Privacy-focused
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-surface-container-low border-y border-outline-variant">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-4">
              Three Steps to Optimized Skincare
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Science-backed analysis, personalized recommendations, and accountability tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="space-y-4 p-6 rounded-lg bg-surface border border-outline-variant">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">
                  analytics
                </span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface">
                Skin Analysis
              </h3>
              <p className="text-muted leading-relaxed">
                Complete a 7-question check-in covering oil production, acne patterns, dryness,
                sensitivity, and barrier health. Get a detailed skin profile and ranked concerns.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-4 p-6 rounded-lg bg-surface border border-outline-variant">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">
                  recommend
                </span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface">
                Build Your Protocol
              </h3>
              <p className="text-muted leading-relaxed">
                Get personalized product recommendations for each routine step. Choose from curated
                options ranked by skin target match, budget tier, and ingredient compatibility.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4 p-6 rounded-lg bg-surface border border-outline-variant">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">
                  trending_up
                </span>
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface">
                Track Consistency
              </h3>
              <p className="text-muted leading-relaxed">
                Use your dashboard to check off completed routine steps. View adherence trends
                over time and stay accountable without complex manual logging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-4">
                Evidence-Based Approach
              </h2>
              <p className="text-muted text-lg">
                Our analysis engine evaluates five core dimensions to create your personalized routine structure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg">
                    check
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-on-surface mb-1">
                    Oil Production Analysis
                  </h4>
                  <p className="text-sm text-muted">
                    Sebum patterns and shine control needs
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg">
                    check
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-on-surface mb-1">
                    Acne Assessment
                  </h4>
                  <p className="text-sm text-muted">
                    Breakout frequency and severity tracking
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg">
                    check
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-on-surface mb-1">
                    Hydration Needs
                  </h4>
                  <p className="text-sm text-muted">
                    Dryness and moisture retention evaluation
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg">
                    check
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-on-surface mb-1">
                    Sensitivity Screening
                  </h4>
                  <p className="text-sm text-muted">
                    Reactive tendencies and tolerance levels
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 md:col-span-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg">
                    check
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-on-surface mb-1">
                    Barrier Health
                  </h4>
                  <p className="text-sm text-muted">
                    Protective function and recovery capacity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-surface-container-low border-y border-outline-variant">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">
            Ready to Optimize Your Routine?
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Start with our free skin check-in. Get your personalized protocol, product recommendations,
            and consistency dashboard in under 3 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/analysis"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity text-lg"
            >
              Start Free Check-In
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

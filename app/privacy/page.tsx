export const metadata = {
  title: "Privacy Policy | Softmaxxer",
  description: "How Softmaxxer handles your data and privacy.",
};

export default function PrivacyPage() {
  return (
    <main className="pt-24 pb-32 px-6 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mb-3 block">
          Legal
        </span>
        <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted">
          Last updated: March 22, 2026
        </p>
      </header>

      {/* Content */}
      <div className="prose prose-invert max-w-none space-y-8">
        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Overview
          </h2>
          <p className="text-muted leading-relaxed">
            Softmaxxer is built and operated by Soft Productivity. We are committed to protecting
            your privacy and being transparent about how we handle your data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Data Storage
          </h2>
          <p className="text-muted leading-relaxed">
            Your skin profile, routine data, and consistency tracking are stored locally in your
            browser using localStorage. This data never leaves your device and is not transmitted
            to our servers.
          </p>
          <p className="text-muted leading-relaxed">
            We do not maintain user accounts or databases at this time. All data is ephemeral and
            specific to your browser session.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Data We Collect
          </h2>
          <p className="text-muted leading-relaxed">
            We collect minimal information necessary to provide our service:
          </p>
          <ul className="space-y-2 text-muted ml-6">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong>Skin analysis responses:</strong> Your answers to check-in questions
                (stored locally only)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong>Routine selections:</strong> Products you choose for your protocol
                (stored locally only)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong>Consistency data:</strong> Your daily routine completion records
                (stored locally only)
              </span>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Third-Party Services
          </h2>
          <p className="text-muted leading-relaxed">
            We do not currently integrate with third-party analytics, tracking, or advertising
            services. Your browsing activity on Softmaxxer is not shared with external parties.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Affiliate Links
          </h2>
          <p className="text-muted leading-relaxed">
            Product recommendations may include affiliate links. When you click these links and
            make a purchase, we may earn a commission at no additional cost to you. This does not
            affect our product recommendations, which are based solely on skin profile compatibility.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Data Security
          </h2>
          <p className="text-muted leading-relaxed">
            Since all data is stored locally in your browser, security depends on your device and
            browser security settings. We recommend using a modern, up-to-date browser and enabling
            standard security features.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Your Rights
          </h2>
          <p className="text-muted leading-relaxed">
            You have complete control over your data:
          </p>
          <ul className="space-y-2 text-muted ml-6">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong>Access:</strong> Your data is stored in your browser's localStorage
                and can be viewed using browser developer tools
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong>Deletion:</strong> Clear your browser's localStorage to permanently
                delete all Softmaxxer data
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span>
              <span>
                <strong>Portability:</strong> Export your protocol data at any time from
                the dashboard
              </span>
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Changes to This Policy
          </h2>
          <p className="text-muted leading-relaxed">
            We may update this privacy policy from time to time. Significant changes will be
            communicated via our website. Continued use of Softmaxxer after changes constitutes
            acceptance of the updated policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Contact
          </h2>
          <p className="text-muted leading-relaxed">
            If you have questions about this privacy policy or how we handle data, contact us at:{" "}
            <a
              href="mailto:hello@softmaxxer.com"
              className="text-primary hover:underline"
            >
              hello@softmaxxer.com
            </a>
          </p>
        </section>

        <section className="pt-8 border-t border-outline-variant">
          <p className="text-sm text-muted">
            <strong>Softmaxxer</strong><br />
            Built and operated by Soft Productivity<br />
            hello@softmaxxer.com
          </p>
        </section>
      </div>
    </main>
  );
}

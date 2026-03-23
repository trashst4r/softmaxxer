import Link from "next/link";

/**
 * Site Footer
 *
 * Minimal production footer with:
 * - Softmaxxer branding
 * - Ownership attribution (Soft Productivity)
 * - Contact information
 * - Privacy policy link
 *
 * Provides trust signals for public deployment and affiliate network approval.
 */

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-outline-variant bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="font-semibold text-lg tracking-tight text-foreground">
              Softmaxxer
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Evidence-based skincare routine optimization with personalized product recommendations.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">
              Product
            </div>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/analysis"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Start Check-In
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">
              Legal
            </div>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/privacy"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-outline-variant flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-muted">
          <div className="space-y-1">
            <p>Built and operated by Soft Productivity</p>
            <p className="text-xs">
              Contact:{" "}
              <a
                href="mailto:hello@softmaxxer.com"
                className="text-primary hover:underline"
              >
                hello@softmaxxer.com
              </a>
            </p>
          </div>
          <div className="text-xs">
            © {currentYear} Softmaxxer. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

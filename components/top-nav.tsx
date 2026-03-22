/**
 * Header Bar Audit & Stabilization v1
 * Stable, minimal header with fixed height and clean responsive behavior
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function TopNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isGuideActive = pathname.startsWith("/guides");
  const isProductActive = pathname.startsWith("/products");

  return (
    <nav className="border-b border-outline-variant bg-surface sticky top-0 z-40">
      {/* Fixed height container: h-16 = 64px */}
      <div className="max-w-7xl mx-auto px-6 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo - Fixed vertical center */}
          <Link
            href="/dashboard"
            className="text-base font-medium tracking-tight text-foreground hover:text-primary transition-colors flex-shrink-0"
          >
            Softmaxxer
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/how-it-works"
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                isActive("/how-it-works")
                  ? "text-primary"
                  : "text-muted hover:text-foreground"
              }`}
            >
              How It Works
            </Link>
            <Link
              href="/analysis"
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                isActive("/analysis")
                  ? "text-primary"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Check-In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/how-it-works")
                  ? "text-primary"
                  : "text-muted hover:text-foreground"
              }`}
            >
              How It Works
            </Link>
            <Link
              href="/analysis"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/analysis")
                  ? "text-primary"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Check-In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

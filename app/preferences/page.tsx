"use client";

/**
 * Sprint 19 Task 19.3: Refinement Preferences Page
 * User settings for post-profile product selection modifiers
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RefinementPreferencesForm } from "@/components/refinement/RefinementPreferencesForm";
import {
  getRefinementPreferences,
  setRefinementPreferences,
} from "@/lib/app-state";
import type { RefinementPreferences } from "@/types/refinement";

export default function PreferencesPage() {
  const router = useRouter();
  const [preferences, setPreferences] =
    useState<RefinementPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Load existing preferences
    const existing = getRefinementPreferences();
    setPreferences(existing);
    setIsLoading(false);
  }, []);

  const handleSave = (newPreferences: RefinementPreferences) => {
    setRefinementPreferences(newPreferences);
    setPreferences(newPreferences);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-sm text-muted">Loading preferences...</div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-32 px-6 max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface mb-3">
          Refinement Preferences
        </h1>
        <p className="text-base text-muted max-w-2xl">
          Customize your product recommendations with optional preferences. These
          settings modify product selection after your skin profile is determined.
        </p>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg text-sm text-on-surface">
          ✓ Preferences saved successfully
        </div>
      )}

      {/* Form */}
      <div className="bg-surface-container-low rounded-xl p-8">
        <RefinementPreferencesForm
          initialPreferences={preferences}
          onSave={handleSave}
          onCancel={() => router.back()}
        />
      </div>

      {/* Info Section */}
      <div className="mt-12 p-6 bg-surface-container-low rounded-lg border border-outline-variant">
        <h2 className="font-headline text-lg font-semibold text-on-surface mb-3">
          How Refinement Works
        </h2>
        <div className="space-y-3 text-sm text-muted">
          <p>
            <strong className="text-on-surface">Budget Tier:</strong> Influences
            product price range preferences (budget favors lower-priced products,
            premium allows full range).
          </p>
          <p>
            <strong className="text-on-surface">Texture & Finish:</strong> Adds
            ranking bonus when products match your preferred feel and look.
          </p>
          <p>
            <strong className="text-on-surface">Fragrance Tolerance:</strong>{" "}
            Controls whether fragranced products are excluded, neutral, or
            preferred.
          </p>
          <p>
            <strong className="text-on-surface">Ingredients to Avoid:</strong>{" "}
            Hard exclusion - products containing these will be filtered out.
          </p>
          <p>
            <strong className="text-on-surface">Routine Complexity:</strong>{" "}
            Affects selection of support products and layering (minimal prefers
            simpler routines).
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 flex items-center justify-between text-sm">
        <Link
          href="/protocol"
          className="text-muted hover:text-on-surface transition-colors"
        >
          ← Back to Protocol
        </Link>
        <Link
          href="/dashboard"
          className="text-muted hover:text-on-surface transition-colors"
        >
          Dashboard →
        </Link>
      </footer>
    </main>
  );
}

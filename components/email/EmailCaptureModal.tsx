"use client";

import { useState } from "react";
import type { SkinProfile } from "@/types/skin-profile";
import { encodeProfile } from "@/lib/encoding/profile-encoder";

interface EmailCaptureModalProps {
  profile: SkinProfile;
  onClose: () => void;
}

export function EmailCaptureModal({ profile, onClose }: EmailCaptureModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Encode profile for storage
    const encodedProfile = encodeProfile(profile);

    // Note: Email capture pending backend integration
    // TODO: Send to backend API when implemented

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSubmitted(true);
    setIsSubmitting(false);

    // Auto-close after 2 seconds
    setTimeout(onClose, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
      <div className="bg-surface-container-low rounded-2xl p-8 max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!submitted ? (
          <>
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">
              Save Your Protocol
            </h2>
            <p className="text-sm text-on-surface-variant mb-6">
              Get your personalized routine emailed to you for easy reference.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-on-surface mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-surface-container-highest text-on-surface rounded-lg border border-outline-variant focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Save Protocol"}
              </button>
            </form>

            <p className="text-xs text-on-surface-variant mt-4 text-center">
              We'll only use your email to send your routine. No spam.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">
              Protocol Saved!
            </h3>
            <p className="text-sm text-on-surface-variant">
              Check your inbox for your personalized routine.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

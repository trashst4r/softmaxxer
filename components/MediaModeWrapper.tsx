"use client";

/**
 * Media Mode Wrapper
 *
 * Conditionally renders dev/debug UI based on:
 * 1. Production environment (NODE_ENV=production) - hides all dev UI
 * 2. Media mode flag (?media=1) - hides dev UI for clean screenshots
 *
 * In production or media mode, hides:
 * - DeveloperModeToggle
 * - DevPanel
 * - Any debug/audit UI
 *
 * Used in layout to ensure production-safe and media-safe rendering.
 */

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { isMediaMode } from "@/lib/dev/media-mode";
import { DeveloperModeToggle } from "./developer-mode-toggle";
import { DevPanel } from "./dev-panel";

function MediaModeContent() {
  const searchParams = useSearchParams();
  const mediaMode = isMediaMode(searchParams);
  const isProduction = process.env.NODE_ENV === "production";

  // Hide dev controls in production or media mode
  if (isProduction || mediaMode) {
    return null;
  }

  // Render dev controls only in development mode
  return (
    <>
      <DeveloperModeToggle />
      <DevPanel />
    </>
  );
}

export function MediaModeWrapper() {
  return (
    <Suspense fallback={null}>
      <MediaModeContent />
    </Suspense>
  );
}

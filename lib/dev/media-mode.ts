/**
 * Media Mode Utilities
 *
 * Provides centralized helpers for detecting media mode and extracting preset
 * parameters from URL search params.
 *
 * Media mode removes debug/dev UI to produce clean, screenshot-ready pages.
 * Preset parameters allow deterministic state rendering without live check-in flow.
 *
 * Usage:
 *   ?media=1 - Enable media mode (hides dev controls)
 *   ?preset=balanced|texture|barrier - Load specific preset profile
 *
 * Example URLs:
 *   /dashboard?preset=balanced&media=1
 *   /results?preset=texture&media=1
 *   /dashboard?preset=barrier (preset without media mode)
 */

import type { PresetName } from "./presets";
import { isValidPresetName } from "./presets";

/**
 * Check if media mode is active
 * Media mode is enabled when ?media=1 is present in URL
 */
export function isMediaMode(searchParams: URLSearchParams | Record<string, string | string[] | undefined>): boolean {
  // Handle URLSearchParams
  if (searchParams instanceof URLSearchParams) {
    return searchParams.get("media") === "1";
  }

  // Handle Next.js searchParams object
  const media = searchParams.media;
  if (Array.isArray(media)) {
    return media[0] === "1";
  }
  return media === "1";
}

/**
 * Extract and validate preset name from search params
 * Returns validated preset name or undefined if invalid/missing
 */
export function getRequestedPreset(searchParams: URLSearchParams | Record<string, string | string[] | undefined>): PresetName | undefined {
  let presetValue: string | undefined;

  // Handle URLSearchParams
  if (searchParams instanceof URLSearchParams) {
    presetValue = searchParams.get("preset") || undefined;
  } else {
    // Handle Next.js searchParams object
    const preset = searchParams.preset;
    if (Array.isArray(preset)) {
      presetValue = preset[0];
    } else {
      presetValue = preset;
    }
  }

  // Validate preset name
  if (presetValue && isValidPresetName(presetValue)) {
    return presetValue;
  }

  return undefined;
}

/**
 * Check if preset mode is active
 * Preset mode is enabled when a valid ?preset= parameter is present
 */
export function isPresetMode(searchParams: URLSearchParams | Record<string, string | string[] | undefined>): boolean {
  return getRequestedPreset(searchParams) !== undefined;
}

/**
 * Build media mode URL
 * Helper to construct URLs with media mode and preset parameters
 */
export function buildMediaUrl(basePath: string, preset: PresetName, includeMedia: boolean = true): string {
  const params = new URLSearchParams();
  params.set("preset", preset);
  if (includeMedia) {
    params.set("media", "1");
  }
  return `${basePath}?${params.toString()}`;
}

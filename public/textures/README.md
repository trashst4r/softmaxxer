# Clinical Texture Assets - Texture Pack 2

This directory contains clinical skin texture assets that map deterministically to analysis states.

## Required Assets

Place the following PNG files in this directory:

### 1. skin-balanced.png
- **Size**: ~200-400kb (compressed)
- **Dimensions**: 1920x1080 or similar high-res
- **Visual**: Clean, healthy skin texture with minimal pores
- **Mapping**: Default state, balanced profiles, mild concerns
- **Aesthetic**: Clinical minimal, professional medical photography style

### 2. skin-roughness.png
- **Size**: ~200-400kb (compressed)
- **Dimensions**: 1920x1080 or similar high-res
- **Visual**: Visible texture irregularity, enlarged pores, uneven surface
- **Mapping**: Texture smoothing priority, frequent/persistent breakouts
- **Aesthetic**: Clinical documentation of texture concerns

### 3. skin-compromised.png
- **Size**: ~200-400kb (compressed)
- **Dimensions**: 1920x1080 or similar high-res
- **Visual**: Barrier disruption, redness, reactive skin indicators
- **Mapping**: Reactive sensitivity, barrier strengthen priority, redness concerns
- **Aesthetic**: Clinical documentation of barrier compromise

## Texture Mapping Logic

See `/lib/texture-map.ts` for the deterministic mapping:

- **Compromised**: `sensitivity === "reactive"` OR barrier/redness priority goals
- **Roughness**: `priorityGoal === "texture_smooth"` OR frequent/persistent breakouts
- **Balanced**: Default for all other states

## Usage

Textures are rendered via the `<TextureSurface>` component at 12-15% opacity with gradient overlay for text readability. They appear as subtle background layers on the results page to provide visual feedback aligned with skin state classification.

## Generation Notes

- Use consistent lighting and angle across all three textures
- Maintain clinical minimal aesthetic (no vibrant colors)
- Compress to ~200-400kb without losing medical photography quality
- Ensure no identifiable features (privacy)
- Use desaturated color palette for clinical credibility

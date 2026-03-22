# Dashboard Protocol Card Audit - Sprint 20.4

## Objective
Replace oversized ambiguous texture hero with clinical summary card using small raw texture preview as supporting visual context.

## Current Implementation Status

**Commit:** `14d6fc1` - Sprint 20.4: Replace dashboard texture hero with clinical summary card

**Modified Files:**
- `app/dashboard/page.tsx` (lines 101-148)
- `lib/texture-map.ts` (added `getStateBadge()` and `getSummaryBullets()`)

## Expected Visual Output

### Protocol Summary Card Location
- **Page:** `/dashboard`
- **Location:** Right sidebar (`aside`), below `QuickActions` component
- **Grid position:** `lg:col-span-5` (right column of 12-column grid)

### Card Structure (Lines 103-147)

```tsx
<div className="bg-surface border border-outline-variant rounded-2xl p-6 space-y-4">
  {/* Header Row with Protocol Title + Thumbnail */}
  <div className="flex items-start justify-between gap-3">
    <div className="flex-1">
      <p className="text-xs uppercase">YOUR PROTOCOL</p>
      <h3 className="font-headline font-bold text-lg">
        {getProtocolLabel(profile)} // e.g., "Barrier Compromised"
      </h3>
    </div>

    {/* Small 80x80px Texture Thumbnail */}
    <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden">
      <RawTextureImage profile={profile} />
    </div>
  </div>

  {/* State Badge */}
  <div className="inline-flex px-3 py-1.5 rounded-full bg-primary/10">
    <span className="text-xs uppercase">
      {getStateBadge(profile)} // "BALANCED" | "TEXTURE FOCUS" | "BARRIER RISK"
    </span>
  </div>

  {/* 2-3 Clinical Summary Bullets */}
  <ul className="space-y-2">
    {getSummaryBullets(profile).map((bullet, i) => (
      <li key={i}>
        <span className="text-primary">•</span>
        <span>{bullet}</span>
      </li>
    ))}
  </ul>

  {/* Primary Concern */}
  <div className="pt-3 border-t">
    <p className="text-xs uppercase">PRIMARY CONCERN</p>
    <p className="text-sm font-medium">
      {result.ranked_concerns[0]?.concern}
    </p>
  </div>
</div>
```

## What Changed (Before vs After)

### BEFORE (Removed)
```tsx
{/* Large texture hero - REMOVED */}
<div className="rounded-3xl overflow-hidden aspect-[4/3] bg-white border">
  <RawTextureImage profile={profile} />
</div>

{/* Minimal metadata below - REMOVED */}
<div className="space-y-2">
  <p className="text-xs uppercase">Your Protocol</p>
  <p className="font-headline font-bold text-base">
    {getProtocolLabel(profile)}
  </p>
  <p className="text-sm text-muted">
    {result.ranked_concerns[0]?.concern}
  </p>
</div>
```

### AFTER (Current)
- **Compact card** with clinical information
- **Small thumbnail** (80×80px, top-right corner)
- **State badge** with explicit label
- **2-3 explanatory bullets** derived from `SkinProfile`
- **Primary concern** at bottom with border separator

## Texture Mapping Logic (`lib/texture-map.ts`)

### getStateBadge(profile: SkinProfile): string
Returns one of three labels:
- **"Barrier Risk"** - if `compromised` texture type
- **"Texture Focus"** - if `roughness` texture type
- **"Balanced"** - default/balanced state

### getSummaryBullets(profile: SkinProfile): string[]
Returns 2-3 bullets based on texture type:

**COMPROMISED:**
- "Reactive sensitivity requires gentle barrier support"
- "Focus on strengthening protective barrier function"
- "Calming protocol targets visible redness"
- "Dehydration compounds barrier vulnerability"

**ROUGHNESS:**
- "Surface texture refinement through gentle exfoliation"
- "Active breakout management with targeted actives"
- "Consistent routine minimizes future breakouts"
- "Oil control supports pore appearance"

**BALANCED:**
- "Skin barrier is stable and functioning well"
- "Hydration support maintains plump appearance"
- "Light moisture preservation prevents tightness"
- "Oil regulation keeps shine in check"

## Validation Checklist

### Visual Validation
- [ ] Navigate to `http://localhost:3000/dashboard` (requires active analysis session)
- [ ] Right sidebar shows Protocol Summary Card below Quick Actions
- [ ] Texture thumbnail is **small** (80×80px), not large hero
- [ ] State badge is visible with correct label
- [ ] 2-3 bullet points render with clinical copy
- [ ] Primary concern shows at bottom with border separator

### Code Validation
- [ ] `npx tsc --noEmit` - No TypeScript errors
- [ ] `npm run build` - Production build succeeds
- [ ] No gradient/blur/overlay effects in card markup
- [ ] Image wrapper contains only `<RawTextureImage>` component
- [ ] All text derives from `SkinProfile` via helper functions

### Functional Validation
- [ ] Card only renders when `profile` exists (conditional rendering)
- [ ] State badge matches texture type:
  - Reactive/barrier → "BARRIER RISK"
  - Texture/breakouts → "TEXTURE FOCUS"
  - Default → "BALANCED"
- [ ] Bullets are relevant to profile state
- [ ] Primary concern pulls from `result.ranked_concerns[0]`

## Known Issues to Check

### Issue 1: Card Not Visible
**Symptom:** Dashboard shows old large texture hero or no card at all

**Possible Causes:**
- Browser cache (need hard refresh: `Ctrl+Shift+R`)
- Dev server serving stale code
- Profile is null (card doesn't render)

**Fix:**
1. Hard refresh browser (`Ctrl+Shift+R` / `Cmd+Shift+R`)
2. Restart dev server: `npm run dev`
3. Check browser console for errors
4. Verify analysis session exists (required for profile data)

### Issue 2: Functions Not Found
**Symptom:** `getStateBadge is not a function` or similar error

**Possible Causes:**
- Functions not exported from `lib/texture-map.ts`
- Import statement missing in `app/dashboard/page.tsx`

**Fix:**
Verify line 13 in `app/dashboard/page.tsx`:
```tsx
import { getProtocolLabel, getStateBadge, getSummaryBullets } from "@/lib/texture-map";
```

### Issue 3: Bullets Not Rendering
**Symptom:** State badge shows but no bullet points

**Possible Causes:**
- `getSummaryBullets()` returning empty array
- `profile` missing required fields

**Debug:**
Add console log in dashboard page:
```tsx
console.log('Profile:', profile);
console.log('Bullets:', getSummaryBullets(profile));
```

## Files Reference

### Primary Files
```
app/dashboard/page.tsx (lines 101-148)
lib/texture-map.ts (lines 180-266)
components/analysis/TextureSurface.tsx (RawTextureImage component)
types/skin-profile.ts (SkinProfile type definition)
```

### Supporting Files
```
lib/app-state.ts (getActiveProfile function)
types/analysis.ts (AnalysisResult type)
components/dashboard/quick-actions.tsx (component above card)
components/dashboard/consistency-chart.tsx (component above QuickActions)
```

## Manual Testing Steps

1. **Start dev server:**
   ```bash
   cd /mnt/c/Users/dylan/Desktop/Content/1ABC/softmaxxer
   npm run dev
   ```

2. **Navigate to analysis:**
   - Open `http://localhost:3000/analysis`
   - Complete check-in flow with test data

3. **Check dashboard:**
   - Navigate to `http://localhost:3000/dashboard`
   - Scroll right sidebar to Protocol Summary Card
   - Verify all elements render correctly

4. **Test different states:**
   - Complete analysis with different skin profiles
   - Verify badge changes: Balanced → Texture Focus → Barrier Risk
   - Verify bullets change based on profile

## Expected Render Example

**For Reactive/Barrier Compromised Profile:**
```
┌─────────────────────────────────────────┐
│ YOUR PROTOCOL          [flawless.png]  │
│ Barrier Compromised                     │
│                                         │
│ ┌───────────────┐                      │
│ │ BARRIER RISK  │                      │
│ └───────────────┘                      │
│                                         │
│ • Reactive sensitivity requires gentle │
│   barrier support                       │
│ • Focus on strengthening protective    │
│   barrier function                      │
│ • Dehydration compounds barrier        │
│   vulnerability                         │
│                                         │
│ ─────────────────────────────────────  │
│ PRIMARY CONCERN                         │
│ Barrier dysfunction                     │
└─────────────────────────────────────────┘
```

## Success Criteria

✅ User can identify protocol state immediately from text alone
✅ Texture thumbnail matches mapped asset cleanly (80×80px)
✅ Balanced, roughness, and compromised variants have distinct copy
✅ No TypeScript errors
✅ Production build passes
✅ No muddy large image treatment remains
✅ No decorative overlays or gradients

## Next Steps if Issues Persist

1. **Check browser console** for React/JavaScript errors
2. **Verify localStorage** has analysis data: `localStorage.getItem('active_regimen')`
3. **Check component tree** in React DevTools
4. **Verify CSS classes** are defined in Tailwind config
5. **Test in different browser** (eliminate browser-specific issues)
6. **Clear .next cache**: `rm -rf .next && npm run dev`

## Contact/Escalation

If issues persist after following this audit:
- Commit hash: `14d6fc1`
- Branch: `master`
- Last modified: Sprint 20.4
- Files changed: 2 (dashboard page + texture-map lib)

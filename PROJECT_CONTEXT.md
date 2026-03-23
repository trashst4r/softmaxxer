# Softmaxxer: Complete Project Tree & Context Documentation

## Overview
**Project**: Softmaxxer - Evidence-Based Skincare Routine Optimization
**Framework**: Next.js 16 (App Router)
**Styling**: Tailwind CSS v4
**Language**: TypeScript
**Deployment**: Vercel (Production)
**Repository**: https://github.com/trashst4r/softmaxxer

## Core Concept
A clinical skincare analysis tool that:
1. Analyzes user's skin via 7-question check-in
2. Generates personalized AM/PM skincare routines
3. Recommends products from curated catalog
4. Tracks consistency with dashboard/console
5. All data stored in localStorage (no backend)

---

## Project Structure

```
softmaxxer/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout with metadata, fonts, nav, footer
│   ├── page.tsx                  # Homepage / landing page
│   ├── globals.css               # Global styles + Tailwind imports
│   ├── template.tsx              # Page transition wrapper (Framer Motion)
│   ├── icon.tsx                  # Dynamic favicon generator
│   ├── opengraph-image.tsx       # Dynamic OG image generator
│   │
│   ├── analysis/                 # Skin check-in flow
│   │   └── page.tsx              # 7-question analysis form
│   │
│   ├── results/                  # Analysis results page
│   │   └── page.tsx              # Profile summary + routine preview
│   │
│   ├── protocol/                 # Product selection interface
│   │   └── page.tsx              # Interactive product selector (3 cards per step)
│   │
│   ├── dashboard/                # User dashboard
│   │   └── page.tsx              # Routine checklist + consistency tracking
│   │
│   ├── console/                  # Advanced dashboard view
│   │   └── page.tsx              # Protocol card + adherence + charts
│   │
│   ├── preferences/              # Refinement preferences
│   │   └── page.tsx              # User preference form (budget, sensitivities)
│   │
│   ├── privacy/                  # Privacy policy
│   │   └── page.tsx              # Legal + data handling disclosure
│   │
│   ├── how-it-works/             # Product explanation
│   │   └── page.tsx              # 3-step breakdown of system
│   │
│   ├── media-kit/                # Press/media resources
│   │   └── page.tsx              # Brand assets + contact info
│   │
│   ├── guides/                   # Educational content
│   │   ├── acne-routine/         # Acne treatment guide
│   │   ├── beginner-routine/     # Beginner skincare guide
│   │   └── dry-skin-routine/     # Dry skin guide
│   │
│   └── products/                 # Product category pages
│       ├── cleanser/
│       ├── moisturizer/
│       ├── retinol/
│       └── spf/
│
├── components/                   # React components (organized by domain)
│   │
│   ├── analysis/                 # Skin analysis flow components
│   │   ├── analysis-shell.tsx    # Main analysis container
│   │   ├── check-in-shell-v2.tsx # Check-in flow orchestrator
│   │   ├── question-step.tsx     # Individual question UI (radio buttons)
│   │   ├── text-input-step.tsx   # Text input question variant
│   │   ├── face-upload-step.tsx  # Image upload component (future)
│   │   ├── progress-header.tsx   # Step progress indicator
│   │   ├── results-summary.tsx   # Analysis results summary
│   │   ├── result-score-card.tsx # Skin score visualization
│   │   ├── result-routine-preview.tsx # Routine preview on results page
│   │   ├── result-insight-list.tsx    # Insight bullets on results
│   │   ├── routine-card.tsx      # Routine step card preview
│   │   └── TextureSurface.tsx    # Background texture visual layer
│   │
│   ├── protocol/                 # Product selection components
│   │   ├── product-selector.tsx  # Grid of product cards for step
│   │   ├── product-card.tsx      # Individual product card (clickable)
│   │   ├── deck-review.tsx       # Cart/purchase review modal
│   │   ├── deck-bar.tsx          # Bottom bar with cart summary
│   │   └── protocol-editorial.tsx # Protocol page header/copy
│   │
│   ├── routine/                  # Routine display components
│   │   ├── RoutineProductRow.tsx # Step card with product image + info
│   │   └── ProductSwapSelector.tsx # Dropdown to swap products (FIXED in Sprint 15.2)
│   │
│   ├── dashboard/                # Dashboard page components
│   │   ├── dashboard-shell.tsx   # Main dashboard container
│   │   ├── dashboard-editorial.tsx # Dashboard header copy
│   │   ├── dashboard-editorial-grid.tsx # Editorial grid layout
│   │   ├── dashboard-premium.tsx # Premium tier dashboard variant
│   │   ├── routine-checklist.tsx # AM/PM checklist UI
│   │   ├── routine-toggle.tsx    # AM/PM toggle switch
│   │   ├── consistency-chart.tsx # D3 adherence chart
│   │   └── quick-actions.tsx     # Action buttons (export, share)
│   │
│   ├── console/                  # Console (advanced dashboard) components
│   │   ├── console-shell.tsx     # Console page container
│   │   ├── current-protocol-card.tsx  # Protocol adherence card
│   │   ├── product-stack-card.tsx     # Product list card
│   │   ├── daily-checkin-card.tsx     # Daily check-in widget
│   │   ├── progress-chart-card.tsx    # Progress visualization
│   │   ├── adherence-summary-card.tsx # Adherence stats
│   │   ├── active-targets-card.tsx    # Active goals card
│   │   ├── focus-guidance-card.tsx    # Guidance text
│   │   ├── trend-snapshot-card.tsx    # Trend analytics
│   │   ├── console-intelligence-card.tsx # AI-like insights
│   │   └── proof-layer-card.tsx       # Progress proof indicators
│   │
│   ├── results/                  # Results page components
│   │   ├── RoutineResultsSection.tsx  # Routine preview section
│   │   ├── ProfileSummaryCard.tsx     # Profile summary card
│   │   ├── results-proof-block.tsx    # Proof/evidence block
│   │   ├── scan-protocol-integration.tsx # Scan integration panel
│   │   └── pro-interpretation-panel.tsx  # Pro-tier interpretation
│   │
│   ├── refinement/               # Preference refinement components
│   │   ├── refinement-modal.tsx  # Refinement modal wrapper
│   │   ├── RefinementPreferencesForm.tsx # Preference form
│   │   └── save-routine-modal.tsx # Save routine modal
│   │
│   ├── email/                    # Email capture
│   │   └── EmailCaptureModal.tsx # Email capture modal (pending backend)
│   │
│   ├── export/                   # Export/share components
│   │   ├── ExportButton.tsx      # Export routine button
│   │   └── ShareLinkButton.tsx   # Share link generator
│   │
│   ├── footer/                   # Site footer
│   │   └── SiteFooter.tsx        # Footer with contact + privacy link
│   │
│   ├── home/                     # Homepage components
│   │   ├── system-section.tsx    # How it works section
│   │   └── tier-status-banner.tsx # Tier status display
│   │
│   ├── shared/                   # Shared UI components
│   │   └── tier-context-banner.tsx # Tier upgrade prompts
│   │
│   ├── pro/                      # Pro-tier components
│   │   └── pro-scan-card.tsx     # Pro scan feature card
│   │
│   ├── product/                  # Product-related components
│   │   └── ProductCard.tsx       # Generic product card
│   │
│   ├── dev/                      # Development tools (hidden in prod)
│   │   ├── dev-panel.tsx         # Dev control panel
│   │   ├── CheckInTimeline.tsx   # Check-in history viewer
│   │   ├── DayRoutineViewer.tsx  # Daily routine inspector
│   │   ├── MediaPresetSelector.tsx # Media preset switcher
│   │   ├── MediaPreviewFrame.tsx  # Media mode preview
│   │   ├── MediaStateControls.tsx # Media state controls
│   │   ├── UserSelector.tsx      # User persona switcher
│   │   └── tier-preview.tsx      # Tier comparison preview
│   │
│   ├── top-nav.tsx               # Site navigation (client component)
│   ├── MediaModeWrapper.tsx      # Media mode controller (hides dev UI in prod)
│   ├── dev-panel.tsx             # Main dev panel wrapper
│   └── developer-mode-toggle.tsx # Dev mode toggle switch
│
├── lib/                          # Business logic + utilities
│   │
│   ├── analysis/                 # Skin analysis logic
│   │   ├── infer-skin-profile.ts # Maps answers → SkinProfile type
│   │   ├── build-routine-from-profile.ts # Generates routine from profile
│   │   ├── product-eligibility.ts # Product eligibility filters
│   │   ├── product-ranking.ts    # Product ranking algorithm
│   │   └── routine-compatibility.ts # Routine conflict detection
│   │
│   ├── products/                 # Product catalog
│   │   ├── catalog-v1.ts         # Real product catalog (30+ products)
│   │   ├── catalog.ts            # Legacy catalog (deprecated)
│   │   ├── catalog-image-map.ts  # Product image URL mapping
│   │   ├── types.ts              # Product type definitions
│   │   └── match-products.ts     # Product matching logic
│   │
│   ├── interpretation/           # Skin state interpretation
│   │   ├── skin-state-analyzer.ts # Clinical state analysis
│   │   └── scan-protocol-mapper.ts # Scan → protocol mapping
│   │
│   ├── scoring/                  # Skin scoring system
│   │   ├── types.ts              # Score type definitions
│   │   ├── computeProfile.ts     # Score → profile conversion
│   │   ├── profileToScores.ts    # Profile → scores conversion
│   │   └── prefillFromScan.ts    # Scan prefill logic
│   │
│   ├── refinement/               # Preference refinement
│   │   ├── types.ts              # Refinement types
│   │   ├── refinement-state.ts   # Refinement state management
│   │   ├── scoring.ts            # Refinement scoring
│   │   └── safety.ts             # Safety constraint checking
│   │
│   ├── progress/                 # Progress tracking
│   │   └── proof-analyzer.ts     # Progress proof detection
│   │
│   ├── encoding/                 # Data encoding
│   │   └── profile-encoder.ts    # Profile encoding/decoding for URLs
│   │
│   ├── dev/                      # Development utilities
│   │   ├── dev-users.ts          # Test user personas
│   │   ├── media-mode.ts         # Media mode state
│   │   ├── media-presets.ts      # Media preset definitions
│   │   └── presets.ts            # Analysis presets
│   │
│   ├── analysis-engine.ts        # Main analysis orchestrator
│   ├── profile.ts                # Skin profile utilities
│   ├── texture-map.ts            # Skin texture visual mapping (pack2 assets)
│   ├── product-logic.ts          # Product role/tier logic
│   ├── product-map.ts            # Product mapping utilities
│   ├── concern-map.ts            # Skin concern label mapping
│   ├── concerns.ts               # Concern definitions
│   ├── regimen.ts                # Regimen type definitions
│   ├── region.ts                 # Face region utilities
│   ├── tier.ts                   # User tier logic (guest/member/pro)
│   ├── access-state.ts           # Access control state
│   ├── app-state.ts              # Global app state (localStorage)
│   ├── protocol-state.ts         # Protocol selection state
│   ├── adherence-state.ts        # Adherence tracking state
│   ├── console-state.ts          # Console state (daily adherence)
│   ├── history-state.ts          # History tracking state
│   ├── chart-data.ts             # Chart data utilities
│   ├── console-intelligence.ts   # Console insights generator
│   ├── face-scan.ts              # Face scan utilities (future)
│   ├── face-ratios.ts            # Face ratio calculations
│   ├── mock-routine.ts           # Mock routine generator
│   ├── motion-config.ts          # Framer Motion animation config
│   └── scoring.ts                # Legacy scoring (deprecated)
│
├── types/                        # TypeScript type definitions
│   ├── analysis.ts               # Analysis result types
│   ├── skin-profile.ts           # Skin profile types
│   ├── product.ts                # Product types
│   ├── regimen.ts                # Regimen types
│   └── ...                       # Other type definitions
│
├── public/                       # Static assets
│   ├── icon.svg                  # Favicon source
│   ├── pack1/                    # Product images (UUID-named PNGs)
│   ├── pack2/                    # Skin texture images
│   │   ├── flawless.png          # Balanced skin texture
│   │   ├── roughness.png         # Texture irregularity
│   │   ├── dry.png               # Barrier disruption
│   │   ├── oily.png              # Excess sebum
│   │   ├── fragile.png           # Sensitive/reactive
│   │   └── inflamed-redness.png  # Active inflammation
│   └── textures/                 # Additional texture assets
│
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore rules
├── README.md                     # Project documentation
├── README_DEPLOY.md              # Deployment guide
├── package.json                  # Dependencies + scripts
├── package-lock.json             # Locked dependencies
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── postcss.config.mjs            # PostCSS configuration
├── eslint.config.mjs             # ESLint configuration
└── tailwind.config.ts            # Tailwind CSS configuration (if present)
```

---

## Key Architecture Patterns

### 1. **Data Flow Architecture**

```
User Input (Analysis Page)
  ↓
Analysis Engine (lib/analysis-engine.ts)
  ↓
Skin Profile Generation (lib/analysis/infer-skin-profile.ts)
  ↓
Routine Building (lib/analysis/build-routine-from-profile.ts)
  ↓
Product Matching (lib/products/match-products.ts)
  ↓
Results Display (app/results/page.tsx)
  ↓
Product Selection (app/protocol/page.tsx)
  ↓
Dashboard Storage (localStorage via lib/app-state.ts)
  ↓
Consistency Tracking (app/dashboard or app/console)
```

### 2. **State Management Strategy**

**All state is stored in localStorage. No backend, no database.**

Key state modules:
- `lib/app-state.ts` - Global app state (skin profile, routine)
- `lib/protocol-state.ts` - Product selection state
- `lib/console-state.ts` - Daily adherence tracking
- `lib/adherence-state.ts` - Adherence history
- `lib/access-state.ts` - User tier/access level
- `lib/refinement/refinement-state.ts` - User preferences

### 3. **Component Organization**

Components are organized by **domain** (analysis, dashboard, protocol) rather than by type (buttons, cards). This creates clear boundaries:

- `components/analysis/` - Everything for the check-in flow
- `components/dashboard/` - Everything for the dashboard page
- `components/protocol/` - Everything for product selection
- `components/console/` - Everything for the console page
- `components/shared/` - Truly shared components

### 4. **Type System**

Core types:
- **SkinProfile** (`types/skin-profile.ts`) - User's skin characteristics
- **AnalysisResult** (`types/analysis.ts`) - Complete analysis output with AM/PM routines
- **RoutineStep** (`types/analysis.ts`) - Single step in routine with product suggestions
- **CatalogProduct** (`lib/products/types.ts`) - Product from catalog
- **RegimenStep** (`types/regimen.ts`) - Step in final selected regimen

### 5. **Styling Conventions**

- **Tailwind CSS v4** for all styling
- **No custom CSS** except in `app/globals.css`
- Clinical minimal aesthetic: bone/ink color palette
- Utility classes for everything (no @apply)
- Responsive breakpoints: mobile-first, md: tablet, lg: desktop

### 6. **Product Catalog System**

Products are stored in `lib/products/catalog-v1.ts`:
```typescript
interface CatalogProduct {
  id: string;
  brand: string;
  productName: string;
  role: ProductRole; // cleanser, serum, moisturizer, sunscreen, etc.
  tier: "budget" | "mid" | "premium";
  price: number;
  targets: string[]; // skin concerns it targets
  imageUrl: string; // path to image in public/pack1/
  keyActives: string[];
  affiliateUrl: string | null;
  // ... more fields
}
```

Products are matched to users via:
1. **Eligibility filtering** (lib/analysis/product-eligibility.ts)
2. **Compatibility scoring** (lib/analysis/routine-compatibility.ts)
3. **Ranking algorithm** (lib/analysis/product-ranking.ts)

### 7. **Analysis System**

**7-question check-in** covers:
1. Oil production patterns
2. Acne frequency/severity
3. Dryness/flaking
4. Redness distribution
5. Product sensitivity history
6. Barrier health indicators
7. Primary concern selection

Questions → Scores → Profile → Routine → Product Recommendations

### 8. **Texture Visual System**

Background textures (in `public/pack2/`) are mapped deterministically:
- **Compromised** skin → `dry.png` (barrier disruption visual)
- **Roughness** concerns → `roughness.png` (texture irregularity)
- **Balanced** state → `flawless.png` (healthy baseline)

Mapping logic in `lib/texture-map.ts`.

### 9. **Tier System**

Three access tiers:
- **Guest** - Basic analysis, limited products
- **Member** - Full product catalog, dashboard access
- **Pro** - Advanced features (face scan, detailed analytics)

Managed via `lib/tier.ts` and `lib/access-state.ts`.

### 10. **Dev Tools**

Development panel (hidden in production via `MediaModeWrapper.tsx`):
- User persona switcher
- Analysis preset loader
- Media mode simulator
- Routine inspector
- Check-in timeline viewer

Controlled by `process.env.NODE_ENV === "production"` check.

---

## Critical Files Explained

### `app/layout.tsx`
Root layout for entire app:
- Metadata (title, OG tags, Twitter cards)
- Font loading (Manrope, Inter, Material Symbols)
- TopNav, SiteFooter, MediaModeWrapper
- Flexbox structure for sticky footer

### `app/analysis/page.tsx`
7-question skin check-in flow:
- Uses `components/analysis/check-in-shell-v2.tsx`
- Saves profile to localStorage via `lib/app-state.ts`
- Redirects to `/results` on completion

### `app/results/page.tsx`
Analysis results + routine preview:
- Displays skin profile summary
- Shows recommended AM/PM routine
- Links to `/protocol` for product selection

### `app/protocol/page.tsx`
Interactive product selection:
- Shows 3 product cards per routine step
- User selects products for each step
- Saves selections to `lib/protocol-state.ts`
- Links to `/dashboard` when complete

### `app/dashboard/page.tsx`
Main user dashboard:
- AM/PM routine checklist
- Consistency chart (D3.js)
- Quick actions (export, share)
- Loads data from localStorage

### `app/console/page.tsx`
Advanced dashboard view:
- More detailed analytics cards
- Adherence tracking
- Product stack view
- Intelligence/insights panel

### `lib/analysis-engine.ts`
Core analysis logic:
- Takes question answers
- Computes skin scores (oiliness, acne, dryness, sensitivity, barrier)
- Generates skin profile
- Returns AnalysisResult with routines

### `lib/products/catalog-v1.ts`
Real product catalog:
- 30+ vetted skincare products
- Each with brand, name, role, tier, price, targets, actives
- Images in `public/pack1/`
- Affiliate URLs (some pending)

### `lib/app-state.ts`
localStorage state management:
- `saveProfile()` - Save skin profile
- `loadProfile()` - Load skin profile
- `saveRoutine()` - Save routine
- All data serialized as JSON

### `components/routine/ProductSwapSelector.tsx`
**Fixed in Sprint 15.2**:
- Dropdown to swap products in routine
- Was overflowing card boundaries due to `minWidth: 180px`
- Fixed with `w-full max-w-full truncate` classes

---

## Environment Variables

```env
NODE_ENV=production                          # Environment mode
NEXT_PUBLIC_BASE_URL=https://your-url.com    # Base URL for metadata
RESEND_API_KEY=re_xxx                        # Optional: Email API key (pending)
```

---

## Build & Deploy

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Production Build
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint

# Type Checking
npx tsc --noEmit     # TypeScript type check
```

**Deployment**: Vercel (automatic via GitHub integration)

---

## Known Issues & Tech Debt

1. **Lint warnings**: 63 issues (mostly unescaped apostrophes, unused vars)
2. **Email capture**: Modal exists but backend integration pending
3. **Face scan**: UI components exist but scan logic incomplete
4. **Affiliate links**: Some products missing affiliate URLs
5. **Type inconsistencies**: Some any types, missing strict checks
6. **OG image**: Dynamic generator works, but static image would be better for social platforms

---

## Recent Changes

### Sprint 15: Public Repository Cleanup
- Removed internal docs
- Fixed placeholder URLs
- Removed dev artifacts
- Added professional footer, privacy policy

### Sprint 15.1: Final Audit
- Removed og-image.png.txt TODO file
- Created opengraph-image.tsx dynamic generator
- Fixed README_DEPLOY.md placeholder

### Sprint 15.2: Dropdown Width Fix
- Fixed ProductSwapSelector overflow
- Removed hardcoded minWidth
- Added proper width constraints

### Sprint 16: Vercel Deployment (Pending)
- Manual deployment via Vercel dashboard
- Environment variables to be set

---

## Usage Context for ChatGPT

When working with this codebase, remember:

1. **No backend** - Everything is client-side localStorage
2. **Next.js App Router** - Use Server Components by default, "use client" when needed
3. **Tailwind v4** - All styling via utility classes
4. **Type safety** - TypeScript everywhere, avoid any
5. **Clinical aesthetic** - Minimal, professional, evidence-based tone
6. **No console.logs** - Removed for production
7. **No dev UI in prod** - MediaModeWrapper hides dev tools when NODE_ENV=production
8. **Product images** - All in public/pack1/ with UUID names, mapped via catalog
9. **Textures** - Background visuals in public/pack2/, deterministically mapped
10. **localStorage keys** - All prefixed with "softmaxxer_"

**Git commit pattern**:
```
Sprint X: Brief title

Detailed description of changes.

Changes:
- Bullet list of modifications

Validation:
✓ Build passes
✓ Lint clean

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## Contact & Resources

- **Repository**: https://github.com/trashst4r/softmaxxer
- **Production URL**: TBD (Vercel deployment pending)
- **Email**: hello@softmaxxer.com
- **Built by**: Soft Productivity

---

*Last Updated: 2026-03-23 (Sprint 15.2 complete)*

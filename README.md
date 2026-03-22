# Softmaxxer

**Evidence-based skincare routine optimization with personalized product recommendations.**

Softmaxxer analyzes your skin's unique needs and builds a customized AM/PM skincare routine with product recommendations ranked by compatibility, budget tier, and ingredient safety. Track your consistency over time and optimize your results with science-backed guidance.

---

## Features

### 🔬 Skin Analysis Engine
- 7-question check-in covering oil production, acne patterns, dryness, sensitivity, and barrier health
- Multi-dimensional scoring system evaluating five core skin metrics
- Deterministic profile generation with texture mapping

### 💡 Personalized Recommendations
- Curated product catalog with 30+ vetted products
- Smart matching algorithm ranks products by skin target compatibility
- Supports budget tiers (essential, balanced, premium)
- Ingredient compatibility checking and conflict detection

### 📊 Consistency Tracking
- Interactive dashboard with AM/PM routine checklists
- Visual adherence trends with D3-powered chart
- Local storage persistence (no account required)

### 🔒 Privacy-Focused
- All data stored locally in browser (localStorage)
- No user accounts or backend database
- No third-party analytics or tracking
- Privacy policy included

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Fonts:** Manrope, Inter (Google Fonts)
- **Icons:** Material Symbols Outlined
- **Charts:** D3.js
- **Animations:** Framer Motion
- **Language:** TypeScript

---

## Getting Started

### Prerequisites
- Node.js 20+ (LTS recommended)
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/softmaxxer.git
cd softmaxxer

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. **Quick Deploy:**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

2. **Or via GitHub Integration:**
   - Push to GitHub
   - Connect repository at [vercel.com/new](https://vercel.com/new)
   - Vercel auto-detects Next.js and deploys

### Environment Variables

Required for production:

```env
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

See `.env.example` for complete configuration.

**For detailed deployment instructions, see [README_DEPLOY.md](./README_DEPLOY.md)**

---

## Project Structure

```
softmaxxer/
├── app/                    # Next.js App Router pages
│   ├── analysis/          # Skin check-in flow
│   ├── dashboard/         # User dashboard
│   ├── results/           # Analysis results
│   ├── privacy/           # Privacy policy
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── footer/            # Site footer
│   └── ...
├── lib/                   # Business logic
│   ├── analysis/          # Skin analysis engine
│   ├── products/          # Product catalog
│   └── ...
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── README_DEPLOY.md       # Deployment guide
```

---

## Key Pages

- **Homepage** (`/`) - Landing page with value proposition
- **How It Works** (`/how-it-works`) - Product explanation
- **Check-In** (`/analysis`) - Skin analysis questionnaire
- **Results** (`/results`) - Analysis output and routine preview
- **Dashboard** (`/dashboard`) - Personalized routine + consistency tracker
- **Privacy** (`/privacy`) - Privacy policy

---

## Architecture

### Data Flow
1. User completes 7-question skin analysis
2. Analysis engine computes 5-dimensional skin profile
3. Product matching algorithm ranks catalog items
4. User selects products for each routine step
5. Dashboard displays routine + tracks consistency
6. All data persisted in browser localStorage

### No Backend Required
- Static site generation (SSG) for all pages
- Client-side state management
- localStorage for data persistence
- No database, no auth, no API

---

## Development

### Type Checking
```bash
npx tsc --noEmit
```

### Production Build Test
```bash
npm run build
npm start
```

### Environment Modes
- **Development:** Dev panel visible, hot reload enabled
- **Production:** Dev tools hidden, optimized build

---

## Roadmap

- [ ] User authentication (Clerk/Supabase)
- [ ] Data persistence (backend database)
- [ ] Affiliate link integration (Awin)
- [ ] Email capture and notifications
- [ ] Analytics (PostHog)
- [ ] Payment integration (Stripe)

See [PRODUCTION_READINESS_AUDIT.md](./PRODUCTION_READINESS_AUDIT.md) for detailed feature status.

---

## License

All rights reserved © 2026 Softmaxxer

---

## Contact

**Built and operated by Soft Productivity**

- Email: hello@softmaxxer.com
- Website: [softmaxxer.com](https://softmaxxer.com)

---

## Acknowledgments

- Skin analysis methodology based on dermatological research
- Product catalog curated from evidence-based skincare sources
- UI/UX inspired by Material Design 3 principles

# Softmaxxer Deployment Guide

**Last Updated:** March 22, 2026
**Target Platform:** Vercel (recommended)
**Production Readiness:** Sprint 12 Complete

---

## Prerequisites

- [x] Node.js 20+ installed locally
- [x] Git repository access
- [x] Vercel account (free tier sufficient)
- [x] Domain configured (optional, Vercel provides free `.vercel.app` subdomain)

---

## Quick Deploy (Vercel)

### Option 1: CLI Deployment (Recommended)

```bash
# 1. Install Vercel CLI (if not already installed)
npm i -g vercel

# 2. Navigate to project directory
cd /path/to/softmaxxer

# 3. Deploy to production
vercel --prod

# Follow prompts:
# - Login to Vercel (if first time)
# - Confirm project settings
# - Wait for build to complete
```

### Option 2: Git Integration (Automatic)

1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/trashst4r/softmaxxer.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure project settings (see below)
   - Deploy

---

## Environment Variables

Create a `.env.production` file or configure in Vercel dashboard:

### Required

```env
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

### Optional (Future Features)

```env
# Email capture (if implementing)
RESEND_API_KEY=re_your_api_key_here

# Analytics (if implementing)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Feature flags
NEXT_PUBLIC_ENABLE_AFFILIATE_LINKS=false
NEXT_PUBLIC_ENABLE_EMAIL_CAPTURE=false
```

### Setting Environment Variables in Vercel

1. Go to your project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add each variable:
   - Variable name: `NODE_ENV`
   - Value: `production`
   - Environments: Production
4. Click **Save**
5. Redeploy for changes to take effect

---

## Build Configuration

Vercel auto-detects Next.js projects. Default settings work out of the box:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

**No custom configuration required.**

---

## Pre-Deployment Checklist

Run these commands locally before deploying:

### 1. TypeScript Check
```bash
npx tsc --noEmit
```
Expected: No errors

### 2. Production Build Test
```bash
npm run build
```
Expected: Build completes successfully

### 3. Start Production Server Locally
```bash
npm run build && npm start
```
Expected: Server starts on `http://localhost:3000`

### 4. Manual Smoke Test
- [ ] Homepage loads and displays hero section
- [ ] "Start Free Check-In" button works
- [ ] How It Works page loads correctly
- [ ] Check-in flow completes (analysis page)
- [ ] Results page displays after check-in
- [ ] Dashboard shows routine and consistency chart
- [ ] Footer is visible on all pages
- [ ] No dev panel or "Dev ON/OFF" button visible
- [ ] Privacy policy page accessible

---

## Post-Deployment Verification

After deployment completes:

### 1. Check Deployment URL
- Visit your production URL (e.g., `https://softmaxxer.vercel.app`)
- Verify site loads without errors

### 2. Verify Production Mode
Open browser console (F12) and check:
- [ ] No dev UI elements visible (no "Dev ON/OFF" button, no dev panel)
- [ ] No console errors or warnings
- [ ] No React hydration errors

### 3. Test Core User Flow
Complete the full user journey:
1. **Homepage** → Click "Start Free Check-In"
2. **Analysis** → Complete 7-question check-in
3. **Results** → View analysis results and protocol summary
4. **Dashboard** → Access dashboard and interact with routine checklist
5. **Consistency Tracking** → Check off routine steps, verify chart updates

### 4. Test on Multiple Devices
- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Mobile (iOS Safari, Android Chrome)
- [ ] Tablet

### 5. Verify Trust Signals
- [ ] Footer displays on all pages
- [ ] Footer shows "Built and operated by Soft Productivity"
- [ ] Contact email link works: `hello@softmaxxer.com`
- [ ] Privacy policy page loads correctly

---

## Troubleshooting

### Build Fails

**Error:** `Type errors found`
```bash
# Check TypeScript errors locally
npx tsc --noEmit
# Fix errors and redeploy
```

**Error:** `Module not found`
```bash
# Ensure all dependencies are in package.json
npm install
npm run build
```

### Runtime Errors

**Issue:** "Dev ON/OFF" button still visible in production

**Solution:** Verify `NODE_ENV=production` is set in Vercel environment variables. Clear cache and redeploy.

**Issue:** Layout shift or hydration errors

**Solution:** Check browser console for specific errors. Common causes:
- Mismatched HTML between server and client
- `localStorage` accessed during SSR
- Dynamic content not wrapped in `<Suspense>`

### Vercel-Specific Issues

**Issue:** Deployment stuck or timing out

**Solution:**
```bash
# Cancel current deployment in Vercel dashboard
# Redeploy with:
vercel --prod --force
```

**Issue:** Environment variables not applying

**Solution:**
1. Verify variables are set in Vercel dashboard
2. Ensure "Production" environment is selected
3. Trigger new deployment (don't use cache)

---

## Domain Configuration (Optional)

### Using Custom Domain

1. **Add Domain in Vercel:**
   - Go to Project Settings > Domains
   - Enter your domain (e.g., `softmaxxer.com`)
   - Follow DNS configuration instructions

2. **Update DNS Records:**
   - Add A record or CNAME as instructed by Vercel
   - Wait for DNS propagation (up to 48 hours)

3. **Update Environment Variables:**
   ```env
   NEXT_PUBLIC_BASE_URL=https://softmaxxer.com
   ```

4. **Verify SSL:**
   - Vercel auto-provisions SSL certificates
   - Ensure HTTPS works after DNS propagates

---

## Monitoring & Analytics

### Built-in Vercel Analytics
- Enable in Project Settings > Analytics
- Free tier includes basic metrics

### PostHog (Optional)
```bash
# Install PostHog
npm install posthog-js

# Add to environment variables
NEXT_PUBLIC_POSTHOG_KEY=your_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

---

## Rollback Procedure

If deployment causes issues:

1. **Via Vercel Dashboard:**
   - Go to Deployments tab
   - Find last working deployment
   - Click "..." menu → "Promote to Production"

2. **Via CLI:**
   ```bash
   vercel rollback
   ```

---

## Performance Optimization (Post-Launch)

After initial deployment, consider:

1. **Enable Vercel Speed Insights:**
   - Project Settings > Speed Insights
   - Monitor Core Web Vitals

2. **Image Optimization:**
   - Use Next.js `<Image>` component for all images
   - Compress texture assets

3. **Edge Caching:**
   - Static pages cached at CDN edge by default
   - Verify cache headers in Network tab

---

## Support

**Deployment Issues:**
- Vercel Support: https://vercel.com/support
- Next.js Docs: https://nextjs.org/docs

**Application Issues:**
- Contact: hello@softmaxxer.com
- GitHub Issues: (if repository is public)

---

## Awin Submission Checklist

Before submitting to Awin affiliate network:

- [ ] Site deployed on public URL
- [ ] All pages load without errors
- [ ] No dev/debug UI visible in production
- [ ] Footer present with contact information
- [ ] Privacy policy accessible
- [ ] Core user flow works end-to-end
- [ ] Site looks professional and trustworthy
- [ ] Mobile responsive
- [ ] SSL certificate active (HTTPS)
- [ ] Domain name is stable (not subject to change)

---

**Deploy Command:**
```bash
vercel --prod
```

**Production URL Format:**
```
https://softmaxxer.vercel.app
```

**Estimated Deploy Time:** 2-3 minutes

---

*This guide assumes Sprint 12 production prep work is complete.*

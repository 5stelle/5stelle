# Session Handoff — 2026-03-02 (Session 6)

## What Was Done

### Session 6 (current)

#### 1. Review Prompt Screen
**Files:** NEW `src/components/feedback/ReviewPromptClient.tsx`, NEW `src/app/r/[restaurantSlug]/[formId]/review/page.tsx`

- New intermediate screen between last question and reward page
- Only shows when `feedback_sentiment === 'great'` (reads from sessionStorage); other sentiments redirect straight to reward
- Primary platform shown as large CTA with animated gold border (rotating reflex + pulsing glow + scale pulse via Framer Motion)
- Secondary review platforms shown below as slimmer full-width buttons
- 10-second countdown on "Continua" button; clicking any review link also unlocks it immediately
- "Continua" button turns black with ArrowRight icon when unlocked
- Hydration-safe: sentiment read deferred to useEffect to avoid SSR mismatch
- Server page follows same pattern as reward (force-dynamic, noindex, preview token support)

#### 2. Primary Platform (DB + Dashboard)
**Files:** `src/types/database.types.ts`, `src/components/dashboard/LinksClient.tsx`

- Added `primary_platform: string | null` column to restaurants table (requires SQL migration)
- LinksClient: star icon toggle next to review platform labels (filled yellow = primary, outline = not)
- Star disabled when platform input is empty
- `handleSave` includes `primary_platform` with guard to clear if platform's value was removed
- `removePlatform` clears primaryPlatform if the removed platform was primary

**SQL migration needed:**
```sql
ALTER TABLE restaurants ADD COLUMN primary_platform text DEFAULT NULL;
```

#### 3. Navigation Targets Updated
**Files:** `src/components/feedback/QuestionPageClient.tsx`, `src/app/r/[restaurantSlug]/[formId]/[index]/page.tsx`

- Last question now navigates to `/review` instead of `/reward`
- Overflow redirect (index > question count) also goes to `/review`

#### 4. Reduced Confetti + Removed Review Buttons from Reward
**Files:** `src/components/feedback/RewardClient.tsx`

- Replaced continuous `requestAnimationFrame` loop (~1080 particles) with 3 timed bursts at 0ms, 300ms, 600ms (~180 total particles)
- Removed review platform buttons entirely (now handled by review prompt screen)
- Removed unused `sentiment` state, `Sentiment` type import, `ExternalLink` import, `reviewLinks` computation
- Social follow links section kept as-is

#### 5. QR Code Card Mobile Fix
**Files:** `src/components/dashboard/QRCodeClient.tsx`

- "QR Code per Tavolo" card header changed from `flex items-center justify-between` to `space-y-3` vertical stack
- Title + description on top, buttons below — prevents overflow on mobile

#### 6. Stripe Live Configuration
**Files:** `.env.local`

- Added `STRIPE_WEBHOOK_SECRET` (live signing secret)
- Live keys (publishable, secret, price ID) were already configured
- `STRIPE_PRICE_ID` currently set to €1.10/day test price; `STRIPE_PRICE_ID-actual` has real €39/month price
- `NEXT_PUBLIC_APP_URL` stays as localhost for dev; production value set in Netlify env vars

---

## Architecture Decisions

- **Review prompt as separate route** (`/review`) rather than a modal or step within the question flow — keeps it clean, supports direct linking, and follows the existing pattern of one screen per route
- **Sentiment gate via sessionStorage** — review page reads `feedback_sentiment` and redirects non-great sentiments immediately. Does NOT clear sessionStorage (reward page handles cleanup)
- **Gold border animation** — solid amber-400 base border + conic-gradient reflex rotating on top + breathing boxShadow glow + scale pulse, all via Framer Motion
- **Deployment on Netlify** (not Vercel) with domain `5stelle.app`

---

## New Files

| File | Purpose |
|------|---------|
| `src/components/feedback/ReviewPromptClient.tsx` | Review prompt screen (client component) |
| `src/app/r/[restaurantSlug]/[formId]/review/page.tsx` | Review prompt server route |

---

## Files Changed

| File | Change |
|------|--------|
| `src/types/database.types.ts` | Added `primary_platform` to restaurants Row/Insert/Update |
| `src/components/dashboard/LinksClient.tsx` | Star toggle for primary platform, save/clear logic |
| `src/components/feedback/QuestionPageClient.tsx` | Nav target `/reward` → `/review` |
| `src/app/r/[restaurantSlug]/[formId]/[index]/page.tsx` | Overflow redirect `/reward` → `/review` |
| `src/components/feedback/RewardClient.tsx` | Reduced confetti, removed review buttons |
| `src/components/dashboard/QRCodeClient.tsx` | Card header stacked vertically for mobile |
| `.env.local` | Added Stripe webhook secret |

---

## Pending Items / Next Session

### Priority Tasks
- [ ] **Subscription enforcement** — block dashboard access (except billing) when subscription inactive
- [ ] **Trial expired screen** — redirect expired trials to billing with upgrade prompt
- [ ] **Test full Stripe flow on production** — deploy, subscribe with €1.10 test price, verify webhook fires and status updates
- [ ] **Swap to real price** — change `STRIPE_PRICE_ID` to `STRIPE_PRICE_ID-actual` (€39/month) when ready

### Still Open
- [ ] Favicon — add to `/public` or `src/app/`
- [ ] OpenGraph image — add `/public/og-image.png` (1200x630) and uncomment in layout.tsx
- [ ] Delete unused `src/components/dashboard/TableManager.tsx`
- [ ] Final testing
- [ ] Launch

### Skipped for MVP (unchanged)
- Logo upload (Supabase Storage)

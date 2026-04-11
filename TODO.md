# 5stelle - Implementation Plan

> **IMPORTANT:** Read this file at the start of every new chat session. Follow tasks in order. Mark tasks as complete with `[x]` when done.

---

## Phase 1: Project Setup

### 1.1 Initialize Project
- [x] Create Next.js 14 project with App Router
- [x] Initialize Git repository
- [x] Create GitHub repository and push initial commit (repo: tastereview)
- [x] Connected to Netlify for automatic deployments (domain: 5stelle.app)

### 1.2 Install Dependencies
- [x] shadcn/ui, Framer Motion, @dnd-kit, qrcode + jspdf, nanoid, Stripe, Supabase, canvas-confetti, lucide-react

### 1.3 Configure Supabase
- [x] Create Supabase project + environment variables
- [x] Create client utilities (`lib/supabase/client.ts`, `server.ts`, `middleware.ts`)
- [x] Create database tables + RLS policies
- [x] Enable email/password authentication

### 1.4 Configure Stripe
- [x] Create Stripe account + product/price (€39/month, 7-day trial)
- [x] Set up environment variables (live keys configured)
- [x] Configure webhook in Stripe dashboard (endpoint: `https://5stelle.app/api/webhooks/stripe`)
- [x] Webhook secret configured

### 1.5 Project Structure
- [x] Create folder structure and TypeScript types
- [x] ~~Apply tweakcn theme customization~~ — not needed

---

## Phase 2: Authentication & Onboarding

### 2.1 Authentication Pages
- [x] Login page (`/login`) — email/password, error handling, redirect to dashboard
- [x] Signup page (`/signup`) — email/password with confirmation, auto-login, redirect to onboarding
- [x] Auth middleware (protect dashboard routes)
- [x] Password recovery flow — forgot-password page, auth callback, reset-password page
- [x] Configure custom SMTP in Supabase (Resend)

### 2.2 Restaurant Onboarding
- [x] Onboarding page (`/onboarding`) — restaurant name + slug, auto-create restaurant + default form

### 2.3 Auth Utilities
- [x] `useAuth` hook, `useRestaurant` hook, sign-out functionality

---

## Phase 3: Dashboard

### 3.1 Dashboard Layout
- [x] Sidebar navigation (Feedback, Modulo, QR Code, Impostazioni, Abbonamento)
- [x] User menu with sign out
- [x] Responsive mobile navigation (hamburger menu)

### 3.2 Dashboard Home (`/dashboard`)
- [x] Stats cards: ScoreRing (animated SVG, color-coded), sentiment bar, summary (total/today/week/last feedback), sentiment breakdown
- [x] ScoreRing component (`src/components/dashboard/ScoreRing.tsx`) — ease-out animation, green/yellow/red thresholds

### 3.3 Feedback List (`/dashboard/feedback`)
- [x] Fetch and display submissions (date, sentiment icon, first answer preview)
- [x] Click to expand full submission (detail modal with all Q&A, timestamp, table identifier)
- [x] Empty state when no submissions
- [x] Period filter (Oggi / 7 giorni / 30 giorni)
- [x] Sentiment filter (Great / Ok / Bad)
- [x] Date-grouped sections with headers ("Oggi", "Ieri", "lunedì 17 febbraio")
- [x] Active filters indicator with "Rimuovi filtri" button

---

## Phase 4: Form Builder

### 4.1 Form Builder Page
- [x] Form builder page (`/dashboard/form-builder`)
- [x] Template selector (Quick & Simple, Feedback Dettagliato) with confirmation dialog
- [x] Sortable question list with @dnd-kit drag & drop
- [x] Question items: type icon, label, required indicator, drag handle, edit/delete buttons
- [x] Question editor (side panel): label, description, type, required toggle, options editor
- [x] Add question menu with type selector, max 6 questions enforced
- [x] Reward text editor with auto-save

---

## Phase 5: Customer Feedback Flow

### 5.1 Route & Layout
- [x] Route: `/r/[restaurantSlug]/[formId]/[index]/page.tsx`
- [x] Redirect from `/r/[slug]/[formId]` to `/r/[slug]/[formId]/1`
- [x] Full-screen centered layout, mobile-optimized, restaurant branding
- [x] `force-dynamic` on question and reward pages to prevent stale data caching

### 5.2 Question Flow
- [x] Progress bar with percentage + animated width
- [x] Framer Motion slide animations (AnimatePresence)
- [x] Field components: SentimentField, StarRatingField, OpenTextField, MultipleChoiceField, SingleChoiceField
- [x] Navigation: Back/Next buttons, "Completa" on last question, loading states

### 5.3 Answer Persistence
- [x] Create submission on first question, save answers on "Next"
- [x] Track overall_sentiment from sentiment question
- [x] Update submission with completed_at on final submit
- [x] Table identifier decoded from `?t=` URL param and stored in submission

### 5.4 Review Prompt Screen
- [x] Review prompt page (`/r/[slug]/[formId]/review`) — intermediate screen before reward
- [x] Only shows when sentiment === 'great', otherwise redirects to reward
- [x] Primary platform CTA with animated gold border (Framer Motion)
- [x] Secondary review platforms as smaller full-width buttons
- [x] 10-second countdown on "Continua" button; clicking any link also unlocks it
- [x] `primary_platform` column on restaurants table + star toggle in LinksClient

### 5.5 Reward Screen
- [x] Reward page (`/r/[slug]/[formId]/reward`) with confetti animation (3 timed bursts)
- [x] Display reward text from form settings
- [x] Always show social platform buttons as "Seguici" section
- [x] Review platform buttons removed (moved to review prompt screen)

---

## Phase 6: QR Code Generation

### 6.1 General QR Code
- [x] QR code page (`/dashboard/qr-codes`)
- [x] Generate QR with `qrcode` library (error correction H)
- [x] Display preview + encoded URL
- [x] PDF download with jspdf (restaurant name + instruction text)

### 6.2 Table QR Codes
- [x] `tables` DB table with RLS (owner-only CRUD)
- [x] TableManager component — add/delete tables with auto-generated URL-safe identifiers
- [x] Per-table QR grid on QR codes page
- [x] Table identifier base64url-encoded in URL as `?t=...` (encodeTableId/decodeTableId in `src/lib/utils.ts`)
- [x] Individual table QR PDF download
- [x] Bulk "Scarica tutti (PDF)" download

---

## Phase 7: Settings

### 7.1 Settings Page
- [x] Settings page (`/dashboard/settings`) — Restaurant Info + Social Links sections

### 7.2 Restaurant Info
- [x] Edit restaurant name and slug
- [ ] Upload logo (Supabase Storage) — skipped for MVP
- [x] Save button with loading state

### 7.3 Flexible Social Links
- [x] Replaced 4 hardcoded social columns with single `social_links` JSONB column on restaurants
- [x] 11 platforms defined in `src/lib/constants/platforms.ts`:
  - Review: Google, TripAdvisor, TheFork, Yelp, Trustpilot
  - Social: Instagram, Facebook, TikTok, YouTube, X/Twitter, LinkedIn
  - Each with: icon, name, category, placeholder, buildUrl(), buttonColor
- [x] Settings page dynamically renders platforms — 6 defaults always shown, extras addable
- [x] Google uses GooglePlaceIdFinder component (stores Place ID, not URL)
- [x] Reward screen reads from social_links JSONB, filters by category

---

## Phase 8: Stripe Integration

### 8.1 Subscription Management
- [x] Check subscription status on dashboard load + display trial days remaining
- [x] Billing page (`/dashboard/billing`) — Checkout + Customer Portal buttons
- [x] Stripe Checkout session creation with trial
- [x] Stripe Customer Portal session + redirect
- [x] Show upgrade prompt if trial expired — alert banners on billing page per status

### 8.2 Webhook Handler
- [x] Webhook route (`/api/webhooks/stripe`) with signature verification
- [x] Handle: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

### 8.3 Access Control
- [x] Middleware subscription status checks (`isSubscriptionActive` helper in middleware)
- [x] Block dashboard if subscription inactive (except billing) — redirect to `/dashboard/billing`

---

## Phase 9: Critical Fixes

### 9.1 RLS: Public Restaurant Access
- [x] Add public SELECT policy on `restaurants` table (allows anyone to SELECT, write still owner-only)
- [x] Feedback flow (`/r/[slug]/...`) now works for unauthenticated customers

---

## Phase 10: Polish & Launch Prep

### 10.1 Error Handling
- [x] Global error boundary (`error.tsx`)
- [x] 404 page (`not-found.tsx`)
- [x] User-friendly error messages in Italian
- [x] Loading skeletons for all async content

### 10.2 Landing Page
- [x] Hero section with value proposition
- [x] How it works (3 steps)
- [x] Pricing section (single plan)
- [x] CTA to signup
- [x] Footer with legal links

### 10.3 SEO & Meta
- [x] Per-page meta tags (root layout has basic metadata already)
- [ ] OpenGraph images — add `/public/og-image.png` (1200x630) and uncomment in layout.tsx
- [ ] Favicon — add to `/public` or `src/app/`
- [x] robots.txt
- [x] sitemap.xml

### 10.4 Legal Pages
- [x] Privacy Policy page (`/privacy`)
- [x] Terms of Service page (`/terms`)
- [x] Cookie banner (react-cookie-consent)
- [x] Links in footer and signup flow

### 10.5 Final Testing
- [ ] Test complete signup flow
- [ ] Test form builder (all question types)
- [ ] Test customer feedback flow (all question types)
- [ ] Test QR code generation and scanning
- [ ] Test Stripe checkout and webhooks
- [ ] Test on mobile devices
- [ ] Test edge cases (empty form, max questions, etc.)

### 10.6 Launch
- [ ] Set up production environment variables
- [ ] Configure custom domain
- [x] Enable Stripe live mode
- [x] Connected Netlify for auto-deploy
- [ ] **Update Supabase Auth URL config** — change Site URL from `localhost` to `https://5stelle.app` + add `https://5stelle.app/auth/callback**` to Redirect URLs
- [ ] Final deployment
- [ ] Monitor for errors

---

## Phase 9.5: Bug Fixes (from code review)

### 9.5.1 Turnstile Token Expiry
- [x] Add `refreshExpired: 'auto'` and `onExpire` handler to TurnstileProvider so token auto-refreshes before expiry

### 9.5.2 Onboarding Slug Race Condition
- [x] Remove redundant pre-INSERT SELECT check for slug uniqueness
- [x] Add live debounced slug availability check with inline status indicator (spinner / green "Disponibile" / red "Già in uso")
- [x] Disable submit button while slug is being checked or is taken
- [x] Catch Postgres `23505` unique violation on INSERT as race condition safety net
- [x] Reset slug auto-generation when restaurant name field is cleared

### 9.5.4 Preview Mode — Reward Page Fix
- [x] Reward page was missing preview mode support — clicking "Continua" on review page redirected to question 1 instead of reward
- [x] Pass `isPreview` through reward page route → RewardClient, skip sessionStorage submission check in preview

### 9.5.3 Preserve Answers on Question Deletion
- [x] Add `is_active` column to `questions` table (soft-delete instead of hard-delete)
- [x] Question delete → `is_active = false` instead of DELETE (preserves FK link to answers)
- [x] Template apply → soft-delete old questions, reactivate matching ones (case-insensitive label + same type)
- [x] Add question → reactivate soft-deleted match if found, otherwise create new
- [x] Filter by `is_active = true` in form builder, feedback flow, dashboard question count
- [x] FeedbackDetailDialog → flip mapping to answers→questions so historical answers always render
- [x] **DB migration required:** `ALTER TABLE public.questions ADD COLUMN is_active boolean DEFAULT true NOT NULL;`

---

## Phase 11: UX Improvements

### 11.1 Preview Mode for Form Testing
- [x] ~~Add preview route~~ — uses `?preview=<signed_token>` query param instead (simpler, no duplicate routes)
- [x] "Anteprima" button in form builder links to form with signed preview token (1-hour expiry)
- [x] Preview submissions NOT saved to database (all Supabase inserts skipped in QuestionPageClient)
- [x] Amber banner "Modalità anteprima — i dati non vengono salvati" shown at top of all feedback pages via `PreviewBanner` in layout

### 11.2 Disable "Avanti" Until Answer Selected
- [x] Disable "Avanti"/"Completa" button until user has provided an answer (except `open_text` which remains optional)
  - `sentiment`: disabled until a sentiment is selected
  - `star_rating`: disabled until a rating is selected
  - `single_choice`: disabled until an option is selected
  - `multiple_choice`: disabled until at least one option is selected
  - `open_text`: always enabled (optional by nature)
- [x] Add tooltip on hover over disabled button: "Completa la domanda per continuare"
- [x] Remove red error message validation — replaced by disabled state

### 11.3 Smart Routing for "OK" Sentiment
> **Decision (2026-04-11):** Instead of removing the "OK" option, keep all 3 sentiments but route "OK" customers to Google when their star ratings suggest they'd leave a 4+ review. Goal: maximize Google reviews without risking 3-star-or-below ratings.

- [x] Save star rating answers to sessionStorage during feedback flow (`feedback_star_ratings` key, keyed by question ID)
- [x] Update review prompt routing: `great` → Google CTA; `ok` + avg star rating ≥ 3.5 → Google CTA; everything else → reward
- [x] Handle edge cases: no star rating questions in form → `ok` skips Google (safe default); user goes back and changes rating → correctly updated via question ID key

### 11.4 Guided Tutorial / Onboarding Tour
> **Decision (2026-04-11):** Skipped — the dashboard is simple enough (5 sidebar items) that a guided tour adds complexity without real value. The QuickStartChecklist already guides new users through setup steps. For B2B with manual onboarding, a walkthrough or video is more effective.

- [x] Replaced with improved QuickStartChecklist: icon button (ListChecks) in top-right of dashboard header with remaining-steps badge, opens dialog with full checklist. Shows until all steps are complete, no dismiss/localStorage needed

### 11.5 Default Template for New Users
- [x] Set "Quick & Simple" (2 questions) as default template for new users during onboarding — already implemented in onboarding page

---

## Phase 12: Google Reviews Tracking

> **Design decisions (discussed 2026-04-08):**
> - Google is THE primary review platform — always primary, not configurable. Other platforms (TripAdvisor, TheFork, etc.) remain as optional secondary links
> - Remove `primary_platform` toggle from settings — Google is hardcoded as primary
> - Google Place ID setup happens during onboarding (not later in settings) — user searches by restaurant name via Places Autocomplete, picks their restaurant, baseline snapshot captured immediately
> - Skippable but strongly discouraged — clear copy explaining they'll lose before/after tracking
> - Dashboard nudge banner if Google not connected
> - Daily cron via Netlify Scheduled Function → calls `/api/cron/review-snapshots` API route
> - All Places API calls server-side only, single API key

### 12.1 Schema & API Setup
- [x] Create `review_snapshots` table: `id`, `restaurant_id` (FK), `fetched_at`, `rating` (numeric 2,1), `review_count` (int), `recent_reviews` (jsonb), `is_baseline` (bool). Index on `(restaurant_id, fetched_at DESC)`. RLS: owner SELECT only, writes via admin client
- [x] Set up Google Places API key (`GOOGLE_PLACES_API_KEY` env var, server-side only) — done (no restrictions yet, on main Google account)
- [x] Create server-side utility to call Places API (Autocomplete + Place Details) — `src/lib/google-places.ts`
- [x] Create shared Supabase admin client — `src/lib/supabase/admin.ts`
- [x] API routes: `/api/google/autocomplete`, `/api/google/place-details`, `/api/google/baseline-snapshot`

### 12.2 Onboarding: Google Place Setup
- [x] Add new onboarding step after slug: "Trova il tuo ristorante su Google"
- [x] Search input using Places Autocomplete API (filtered: restaurants + Italy), show dropdown suggestions
- [x] On selection: show confirmation card (name, address, current rating + stars, photo if available)
- [x] On confirm: save Place ID to `social_links.google`, fetch Place Details, store baseline snapshot (`is_baseline = true`)
- [x] Skip option: "Non trovo il mio ristorante" / "Non sono ancora su Google" — clear messaging about losing before/after comparison
- [x] After this step → redirect to dashboard
- [x] Step indicator (1 of 2, 2 of 2) + back button

### 12.3 Daily Cron Job
- [x] API route: `/api/cron/review-snapshots` — protected by `CRON_SECRET` header
- [x] Logic: fetch all restaurants with `social_links->>'google'` set, call Place Details for each, insert snapshot rows
- [x] Netlify Scheduled Function: thin trigger at 3:00 AM UTC daily — `netlify/functions/daily-review-snapshots.mts`
- [ ] Add `CRON_SECRET` env var to Netlify — **user manual step**

### 12.4 Dashboard: Google Reviews Section
- [x] Current Google rating (large display) + delta since baseline
- [ ] Rating trend chart over time (baseline marked as "Inizio 5stelle") — deferred until enough data points exist
- [x] Review count growth (now vs baseline)
- [x] Baseline reference with tracking start date
- [x] If Google not connected: nudge banner "Collega il tuo ristorante a Google per monitorare le tue recensioni"

### 12.5 Settings: Google Section Update
- [ ] Replace current Google Place ID input with the same search widget from onboarding — deferred (current manual input works)
- [ ] Show current linked restaurant (name, address, rating) with option to change — deferred
- [x] Remove `primary_platform` star toggle — Google is always primary

### 12.6 Review Prompt Screen Update
- [x] Google always shown as primary CTA (animated gold border)
- [x] Other configured review platforms shown as secondary buttons below
- [x] Remove primary_platform logic, hardcode Google

### 12.7 Review Prompt Click/View Tracking + Attribution
> Implemented 2026-04-10. Tracks how many customers see the review prompt, how many click the Google CTA, and cross-references with new reviews from daily snapshots to estimate reviews driven by 5stelle.

- [x] **DB migration:** Add 3 columns to `submissions` table (migration already run)
- [x] Update `src/types/database.types.ts` — add 3 fields to submissions Row/Insert/Update
- [x] Update `src/components/feedback/ReviewPromptClient.tsx` — track view on mount, first click wins with platform key, skipped in preview
- [x] Update dashboard page — query `review_prompt_shown_at IS NOT NULL` + `review_platform_clicked = 'google'`, pass to GoogleReviewsCard
- [x] Update `src/components/dashboard/GoogleReviewsCard.tsx` — attribution section with prompt views, Google clicks, `min(googleClicks, newReviews)` estimate

### 12.8 Landing Page Copy Update (do later, after feature is built)
- [ ] Rewrite hero/value prop to lead with Google Reviews improvement
- [ ] Add section showing the before/after tracking feature
- [ ] Social proof angle: "Migliora le tue recensioni su Google"

---

## Phase 13: Pre-Production Checklist

### 13.1 Environment & Security
- [ ] Add `GOOGLE_PLACES_API_KEY` and `CRON_SECRET` to Netlify env vars
- [ ] Add API restrictions to Google Places API key (Places API New only) + application restrictions
- [ ] Google Cloud project is on main account — consider moving to separate account later
- [ ] Update Supabase Auth URL config — change Site URL from `localhost` to `https://5stelle.app` + add redirect URLs
- [ ] Decide on email confirmation for signups (currently disabled — fine for B2B manual onboarding, risky if public signups)

---

## Known Issues

- **Duplicate sentiment question** — User reported seeing duplicate sentiment question in feedback flow. Likely a data issue (duplicate question rows in DB), not a code bug. Check with: `SELECT id, label, type, order_index, is_active FROM questions WHERE form_id = '<FORM_ID>' ORDER BY order_index;`

---

## Notes

- Keep this file updated as you complete tasks
- If you discover new tasks, add them in the appropriate phase
- Prioritize completing phases in order, but small fixes can be done anytime

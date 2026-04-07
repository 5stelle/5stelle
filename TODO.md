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
- [ ] **DB migration required:** `ALTER TABLE public.questions ADD COLUMN is_active boolean DEFAULT true NOT NULL;`

---

## Phase 11: UX Improvements

### 11.1 Preview Mode for Form Testing
- [ ] Add preview route (`/r/[slug]/[formId]/preview/[index]`) so owners can test their form without creating real submissions
- [ ] "Anteprima" button in form builder should link to preview route instead of live route
- [ ] Preview submissions should NOT be saved to the database (skip all Supabase inserts)
- [ ] Show a visual indicator (e.g. banner) that the owner is in preview mode

### 11.2 Disable "Avanti" Until Answer Selected
- [x] Disable "Avanti"/"Completa" button until user has provided an answer (except `open_text` which remains optional)
  - `sentiment`: disabled until a sentiment is selected
  - `star_rating`: disabled until a rating is selected
  - `single_choice`: disabled until an option is selected
  - `multiple_choice`: disabled until at least one option is selected
  - `open_text`: always enabled (optional by nature)
- [x] Add tooltip on hover over disabled button: "Completa la domanda per continuare"
- [x] Remove red error message validation — replaced by disabled state

### 11.3 Sentiment Question: 2 Options Instead of 3
- [ ] Replace 3 sentiment options (Ottimo / OK / Pessimo) with 2 (e.g. "Ottimo!" / "Poteva andare meglio")
- [ ] Update sentiment routing: "Ottimo" → review prompt → reward, "Poteva andare meglio" → reward directly
- [ ] Update `Sentiment` enum/type if needed (`great` / `bad`, remove `ok`)
- [ ] Update dashboard sentiment filters and icons to reflect 2 options
- [ ] Update FeedbackList sentiment breakdown display
- [ ] Consider: monitor conversion rate with first client to validate this change

### 11.4 Guided Tutorial / Onboarding Tour
- [ ] Implement a step-by-step onboarding tour for first-time dashboard users (standard web app pattern)
- [ ] Use a lightweight tour library (e.g. `driver.js` or `react-joyride`) — keep it simple and standard
- [ ] Tour steps should cover: dashboard overview, form builder basics, QR code generation, settings/social links setup
- [ ] Add contextual tooltips on key dashboard elements for discoverability
- [ ] Tour should trigger on first login after onboarding, with option to replay from settings
- [ ] Mark tour as completed in database (e.g. `has_completed_tour` flag on restaurants table)

### 11.5 Default Template for New Users
- [x] Set "Quick & Simple" (2 questions) as default template for new users during onboarding — already implemented in onboarding page

---

## Phase 12: Google Reviews Tracking

> **IMPORTANT:** Discuss schema and implementation approach before coding.

### 12.1 Schema & API Setup
- [ ] Design `review_snapshots` table (restaurant_id, fetched_at, rating, review_count, recent_reviews JSONB)
- [ ] Set up Google Places API key (server-side only, IP-restricted)
- [ ] Store Google Place ID per client in restaurants table (already have it via GooglePlaceIdFinder)

### 12.2 Onboarding Snapshot
- [ ] On new client onboarding (or when Place ID is first set), fetch Place Details (rating, userRatingCount, 5 most recent reviews)
- [ ] Store as baseline snapshot row

### 12.3 Daily Cron Job
- [ ] Daily cron to fetch Place Details for all active clients
- [ ] Store new snapshot row per client per day
- [ ] Lightweight: one API call per client per day

### 12.4 Dashboard Display
- [ ] Show rating trend over time (chart)
- [ ] Review count growth
- [ ] "Before 5stelle / After 5stelle" comparison with start date marker

---

## Notes

- Keep this file updated as you complete tasks
- If you discover new tasks, add them in the appropriate phase
- Prioritize completing phases in order, but small fixes can be done anytime

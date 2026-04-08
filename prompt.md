Hi, I'm continuing work on 5stelle.

**IMPORTANT:** Read `CLAUDE.md` and `TODO.md` first.

## Session Context

Last session (2026-04-08) implemented Phase 12: Google Reviews Tracking. The core feature is built and locally tested — onboarding Google search, baseline snapshots, daily cron, dashboard card, review prompt hardcoded to Google as primary. The next priority is implementing click/view tracking on the review prompt page (task 12.7) to measure how many reviews 5stelle drives.

## What Was Done

### Phase 12: Google Reviews Tracking (core implemented)
- Created `review_snapshots` table with RLS (migration already run)
- Built Google Places API wrapper: autocomplete search + place details + photo resolution
- Built 2-step onboarding: Step 1 (name + slug) → Step 2 (Google Place search with confirmation card, skip option)
- Built daily cron: Netlify Scheduled Function triggers `/api/cron/review-snapshots` at 3 AM UTC
- Built dashboard GoogleReviewsCard showing rating + review count + deltas from baseline
- Hardcoded Google as primary platform in review prompt (removed `primary_platform` toggle)
- Restructured dashboard: 3-column grid (ScoreRing | Riepilogo with inline sentiment counts | Google Reviews) — removed redundant standalone Sentiment card
- Updated QuickStartChecklist with 4 items including "Collega il profilo Google"

### Bug fixed during session
- Google Places Autocomplete returned 400 — `includedPrimaryTypes` max is 5, removed `food` type

## What Changed

**New files:**
- `src/lib/supabase/admin.ts` — Shared Supabase admin client (service role, bypasses RLS)
- `src/lib/google-places.ts` — Server-side Places API wrapper (Autocomplete + Place Details + photo)
- `src/app/api/google/autocomplete/route.ts` — Auth-protected autocomplete proxy
- `src/app/api/google/place-details/route.ts` — Auth-protected place details proxy
- `src/app/api/google/baseline-snapshot/route.ts` — Creates baseline snapshot via admin client
- `src/app/api/cron/review-snapshots/route.ts` — Daily cron endpoint (CRON_SECRET protected)
- `src/components/onboarding/GooglePlaceSearch.tsx` — Search + confirmation card component (reusable)
- `src/components/dashboard/GoogleReviewsCard.tsx` — Dashboard rating/count card with deltas + nudge banner
- `netlify/functions/daily-review-snapshots.mts` — Netlify scheduled function (3 AM UTC)
- `migration-review-snapshots.sql` — SQL migration (already run)

**Modified files:**
- `src/app/onboarding/page.tsx` — Restructured to 2-step flow with step indicator
- `src/types/database.types.ts` — Added `review_snapshots` table types + `ReviewSnapshot` helper
- `src/app/(dashboard)/dashboard/page.tsx` — Added GoogleReviewsCard in 3-col grid, moved sentiment counts into Riepilogo, removed standalone Sentiment card
- `src/components/dashboard/LinksClient.tsx` — Removed `primary_platform` state/toggle/save
- `src/components/dashboard/QuickStartChecklist.tsx` — Added `hasGoogleConnected` prop, 4 items now
- `src/components/feedback/ReviewPromptClient.tsx` — Hardcoded Google as primary CTA
- `package.json` — Added `@netlify/functions` dev dependency

**DB migration already run:**
- `review_snapshots` table created with RLS, index, FK to restaurants

## Decisions Made

- **Google is THE primary platform** — hardcoded, `primary_platform` column on restaurants is now unused. Other review platforms remain as secondary options. This was a strategic product decision, not just a code change.
- **Onboarding captures baseline** — Google Place ID is set during onboarding (step 2), not in settings. Baseline snapshot is created immediately. User can skip but gets strong messaging about losing before/after tracking.
- **Cron architecture** — Netlify Scheduled Function (thin trigger) → Next.js API route (all logic). If hosting changes, only the trigger changes.
- **Dashboard layout** — Removed standalone Sentiment card (redundant with ScoreRing's sentiment bar). Sentiment raw counts folded into Riepilogo card as compact inline row. Google Reviews card takes column 3.
- **Attribution model** — `min(googleClicks, newReviews)` is the conservative estimate for reviews 5stelle drove. Need click/view tracking first (task 12.7).
- **Places API types limit** — Max 5 `includedPrimaryTypes`. We use: restaurant, cafe, bar, meal_takeaway, meal_delivery.

## Failed Approaches

- Initial Google Places Autocomplete request had 6 types in `includedPrimaryTypes` — API returns 400 if >5. Removed `food` (too vague).

## Current State

- Branch: `dev`, working directory is **dirty** (changes not committed)
- Phase 12 core is complete and locally tested (onboarding flow works, dashboard shows data)
- Google Places API key is set in `.env.local` (no restrictions — needs restricting before production)
- `CRON_SECRET` is set in `.env.local`
- Neither key is in Netlify env vars yet (local dev only so far)
- The cron has NOT run yet — only the baseline snapshot exists. Can test manually: `curl -X POST http://localhost:3000/api/cron/review-snapshots -H "Authorization: Bearer <CRON_SECRET>"`
- Email confirmation for signups is currently disabled in Supabase Auth

## What's Next

1. **12.7 Review Prompt Click/View Tracking** — Fully designed, ready to implement. See TODO.md section 12.7 for detailed plan. Migration needed (3 columns on submissions), then update ReviewPromptClient + dashboard + GoogleReviewsCard.

2. **11.3 Sentiment: 2 Options** — Remove "OK" middle option, keep "Ottimo!" / "Poteva andare meglio". Update routing, types, dashboard. Note: this changes the sentiment bar/counts everywhere.

3. **11.1 Preview Mode** — Preview route that doesn't save submissions, with visual banner.

4. **11.4 Guided Tutorial** — Onboarding tour for first-time dashboard users.

5. **12.8 Landing Page Copy** — Rewrite to lead with Google Reviews value prop.

**Key files to read first:**
- `TODO.md` — Full task tracking with Phase 12.7 implementation plan
- `src/components/feedback/ReviewPromptClient.tsx` — Where click/view tracking will be added
- `src/components/dashboard/GoogleReviewsCard.tsx` — Where attribution metrics will display
- `src/app/(dashboard)/dashboard/page.tsx` — Dashboard data fetching context

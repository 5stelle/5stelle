Hi, I'm continuing work on 5stelle.

**IMPORTANT:** Read `CLAUDE.md` and `TODO.md` first.

## Session Context

Last session (2026-04-10) implemented Phase 12.7: Review Prompt Click/View Tracking + Attribution, and fixed a hydration error on the dashboard. The next priorities are the remaining UX improvements (11.1, 11.3, 11.4) and landing page copy (12.8).

## What Was Done

### Phase 12.7: Review Prompt Click/View Tracking (implemented)
- Added 3 columns to `submissions` table: `review_prompt_shown_at`, `review_link_clicked_at`, `review_platform_clicked` (migration already run)
- Updated `ReviewPromptClient.tsx`: tracks prompt view on mount (`review_prompt_shown_at`), tracks first link click with platform key (first click wins via ref guard), skipped in preview mode
- Updated dashboard `page.tsx`: queries prompt views (`review_prompt_shown_at IS NOT NULL`) and Google-specific clicks (`review_platform_clicked = 'google'`), passes counts to GoogleReviewsCard
- Updated `GoogleReviewsCard.tsx`: new attribution section showing "Invitati a recensire: X", "Hanno cliccato: Y", and conservative attribution estimate `min(googleClicks, newReviews)`

### Bug fix: Dashboard hydration error
- `QuickStartChecklist.tsx` was reading `localStorage` during `useState` initialization (server/client branch), causing hydration mismatch
- Fixed by moving localStorage read to `useEffect` — both server and client now start with `dismissed = false`, client updates after mount

## What Changed

**Modified files:**
- `src/types/database.types.ts` — Added 3 tracking fields to submissions Row/Insert/Update
- `src/components/feedback/ReviewPromptClient.tsx` — Added Supabase client import, prompt view tracking on mount, click tracking with platform key (first click wins)
- `src/app/(dashboard)/dashboard/page.tsx` — Added queries for promptViews and googleClicks, passed to GoogleReviewsCard
- `src/components/dashboard/GoogleReviewsCard.tsx` — Added promptViews/googleClicks props, attribution section with Eye/MousePointerClick icons
- `src/components/dashboard/QuickStartChecklist.tsx` — Fixed hydration error (localStorage read moved to useEffect)
- `TODO.md` — Marked 12.7 tasks complete
- `.env.local` — Re-added `GOOGLE_PLACES_API_KEY` and `CRON_SECRET` (keys were missing on this machine)

**DB migration already run:**
- 3 columns added to `submissions`: `review_prompt_shown_at`, `review_link_clicked_at`, `review_platform_clicked`

## Decisions Made

- **Google-specific click count** — Dashboard queries `review_platform_clicked = 'google'` specifically, not just any click. The GoogleReviewsCard is about Google attribution.
- **First click wins** — Only the first link click per submission is recorded (via ref guard). Prevents overwriting a Google click if user subsequently clicks another platform.
- **Conservative attribution** — `min(googleClicks, newReviews)` is the estimate. Never claims more reviews than actually appeared on Google.

## Current State

- Branch: `dev`, working directory is **dirty** (changes not committed)
- Phase 12.7 is complete — tracking columns exist, client tracks views/clicks, dashboard shows attribution
- Google Places API key and CRON_SECRET are in `.env.local`
- Neither key is in Netlify env vars yet (local dev only)
- Email confirmation for signups is currently disabled in Supabase Auth

## What's Next

1. **11.3 Sentiment: 2 Options** — Remove "OK" middle option, keep "Ottimo!" / "Poteva andare meglio". Update routing, types, dashboard.

2. **11.1 Preview Mode** — Preview route that doesn't save submissions, with visual banner.

3. **11.4 Guided Tutorial** — Onboarding tour for first-time dashboard users.

4. **12.8 Landing Page Copy** — Rewrite to lead with Google Reviews value prop.

**Key files to read first:**
- `TODO.md` — Full task tracking
- `src/components/feedback/ReviewPromptClient.tsx` — Click/view tracking implementation
- `src/components/dashboard/GoogleReviewsCard.tsx` — Attribution display
- `src/app/(dashboard)/dashboard/page.tsx` — Dashboard data fetching

Hi! Continuing work on 5stelle.

Read CLAUDE.md and TODO.md first.

Context from last session (2026-04-07/08):

## What we did

### Bug fixes (Phase 9.5 — all done)
1. **Turnstile token expiry** — Added `refreshExpired: 'auto'` + `onExpire` handler to TurnstileProvider
2. **Onboarding slug race condition** — Replaced pre-INSERT SELECT with live debounced availability check (inline spinner/green/red status). Postgres 23505 catch as safety net. Slug auto-generation resets when name is cleared
3. **Preserve answers on question deletion** — Soft-delete via `is_active` column on questions. Reactivation logic matches by case-insensitive label + same type. FeedbackDetailDialog flipped to answers→questions mapping
4. **Preview mode reward fix** — Reward page was missing `isPreview` support, redirected to question 1 instead of showing reward

### UX improvements
5. **11.2 Disable "Avanti" until answer selected** — Done. Button disabled until answer provided (except open_text). Tooltip "Completa la domanda per continuare". Removed all red error text from field components
6. **11.5 Default template** — Was already implemented (onboarding uses Quick & Simple template)

## DB migration needed (not yet run — check if done)
```sql
ALTER TABLE public.questions ADD COLUMN is_active boolean DEFAULT true NOT NULL;
```

## Known issue to investigate
- User reported seeing duplicate sentiment question in the feedback flow. Likely a data issue (duplicate question rows in DB), not a code bug. Check with: `SELECT id, label, type, order_index, is_active FROM questions WHERE form_id = '<FORM_ID>' ORDER BY order_index;`

## What's next (priority order)
1. **11.3 Sentiment: 2 options** — Remove "OK" middle option, keep "Ottimo!" / "Poteva andare meglio". Update routing, types, dashboard filters/icons
2. **11.1 Preview mode** — Preview route that doesn't save submissions, with visual banner
3. **11.4 Guided tutorial** — Onboarding tour for first-time dashboard users
4. **Phase 12: Google Reviews Tracking** — New feature, schema discussion needed before coding (see TODO.md + snapshot.md)

First client onboarding is this week (2026-04-07), one-month test period. Prioritize reliability and polish.

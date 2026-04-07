# 5stelle - Development Guide

## Project

**5stelle** — B2B SaaS for restaurants to collect customer feedback via QR codes. Happy customers get funneled to public review platforms; negative feedback stays private. Italian only (MVP).

| Layer | Tech |
|-|-|
| Framework | Next.js 14+ App Router (RSC default) |
| Language | TypeScript (strict) |
| UI | shadcn/ui + Tailwind + Framer Motion |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Payments | Stripe (Checkout + Customer Portal) |
| Hosting | Vercel (auto-deploy from GitHub) |
| Package manager | npm |

**Key files:**
- `TODO.md` — Task tracking. Read first every session, mark tasks done after implementation
- `ARCHITECTURE.md` — Route map, component trees, DB schema, integration details
- `src/types/` — TypeScript types and database types

---

## RLS Policies

- New table → enable RLS + create policies
- `restaurants`, `forms`, `questions`: owner access only (via `owner_id`)
- `submissions`, `answers`: owner can read, public can insert (no auth required for customers)

---

## Business Logic

- **Feedback flow:** One question per screen, mobile-first, Framer Motion transitions
- **Sentiment routing:** If `overall_sentiment === 'great'` → show social review buttons. If `'ok'` or `'bad'` → show only reward, no review buttons
- **Forms:** Max 6 questions per form. Types: `sentiment`, `star_rating`, `open_text`, `multiple_choice`, `single_choice`
- **Payments:** 7-day free trial (no card), €39/month single plan, Stripe Checkout + Customer Portal
- **Subscription statuses:** `trialing`, `active`, `canceled`, `past_due`

---

## Project Structure
```
src/
├── app/
│   ├── (auth)/login, signup    # Auth pages
│   ├── onboarding/             # Post-signup restaurant setup
│   ├── dashboard/              # Protected owner area
│   │   ├── feedback/           # Submission list + filters
│   │   ├── form-builder/       # Create/edit feedback forms
│   │   ├── qr-codes/           # QR generation + PDF download
│   │   ├── settings/           # Restaurant settings, social links
│   │   └── billing/            # Stripe portal redirect
│   ├── r/[slug]/[formId]/      # Public customer feedback flow
│   └── api/                    # API routes (auth, webhooks)
├── components/
│   ├── ui/                     # shadcn base components
│   ├── feedback/               # Customer-facing feedback components
│   ├── form-builder/           # Dashboard form builder components
│   └── shared/                 # Reusable across features
├── hooks/
├── lib/
│   ├── supabase/               # Client + server + admin clients
│   └── utils/
└── types/
```

---

## File Conventions

- Components: `PascalCase.tsx`
- Utilities/hooks: `camelCase.ts`
- Pages: `lowercase-hyphens/page.tsx`

# Life Quest

Life Quest is a bilingual gamified goal app that turns real-life goals into quests, concrete actions, XP, levels, weekly bosses, repeatable chains and personal rewards.

**Version: 0.11.0 — Portfolio & Launch Readiness**

## What makes it portfolio-ready

- Real authentication with Supabase Auth and PostgreSQL persistence.
- Row Level Security for every user-owned application table.
- RU/EN interface and responsive desktop/mobile UI.
- Interactive **Demo Mode** at `/demo` with realistic prefilled data and no registration.
- XP, levels, weekly bosses, non-resetting chains and rewards.
- Safe account UX: explicit sign-out, export, privacy page and permanent account deletion.
- Google OAuth-ready login in addition to email magic links.
- Playwright smoke/E2E coverage for public launch-critical flows.
- Production-ready Next.js/Vercel structure.

## Core loop

- **Quests** — turn a goal into concrete steps.
- **XP** — +1 regular step, +5 kept promise, +7 hardest/scariest action, +10 action that had been procrastinated.
- **Weekly boss** — one avoided task per week, +25 XP.
- **Chains** — repeated actions create visible links; missed days create a break without erasing earlier progress.
- **Rewards** — choose a small/regular/meaningful/big XP distance or enter custom XP.
- **Levels** — derived automatically from lifetime completed XP.

## Stack

- Next.js 16.3.8
- React 19.2.8
- TypeScript
- Supabase Auth + PostgreSQL + RLS
- Vercel
- Playwright

## Routes

- `/` — public landing
- `/demo` — interactive no-sign-up demo
- `/login` — email magic link / optional Google OAuth
- `/app` — authenticated application
- `/privacy` — public privacy notice
- `/api/account/export` — authenticated JSON export
- `/api/account/delete` — authenticated permanent account deletion

## Environment

Copy `.env.example` to `.env.local` and fill the values.

```env
NEXT_PUBLIC_APP_NAME=Life Quest
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false
SUPABASE_SECRET_KEY=YOUR_SECRET_KEY
```

`SUPABASE_SECRET_KEY` is **server-only** and must never use a `NEXT_PUBLIC_` prefix.

## Quality checks

```powershell
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

The first Playwright run may require:

```powershell
npx playwright install chromium
```

## Security model

- Application data is scoped by `auth.uid()` through RLS.
- Cross-owner quest/step and chain/check-in relationships are additionally guarded by database triggers.
- Account deletion is executed only on the server using the Supabase secret key after authenticating the current user.
- The browser never receives the secret key.
- Demo Mode uses local in-memory sample data and never writes to Supabase.

## Upgrade

For an existing 0.10.1 installation, follow `UPDATE_0.11.0_WINDOWS.md`.

No database migration is required for 0.11.0.

# QuestFrame

QuestFrame is a calm gamified goal app: turn real-life goals into quests, break them into concrete steps and earn XP for the effort that actually moves you forward.

Version: **0.7.0**


## 0.7.0 visual direction

- Modern bento-style Today dashboard: level + weekly boss share the top row; quick quest actions + chains share the next row.
- Header is no longer a full highlighted bar; brand, navigation and controls float as separate glass islands.
- Modernized typography: display sans-serif replaces the old editorial serif treatment.
- Denser action cards remove dead space while preserving the calm Glossy Game aesthetic.
- Level is shown as a circular progress ring and active quests use richer compact cards.
- Fixed the React purity lint error in XP feedback by replacing `Date.now()` IDs with a stable ref counter.
- No database migration is required.

## Core loop

- **Quests** — a goal becomes a quest with small concrete steps.
- **XP** — +1 regular step, +5 kept promise, +7 hardest/scariest action, +10 action you were procrastinating on.
- **Weekly boss** — one avoided task per week, +25 XP.
- **Chains / Цепочки** — repeatable actions build overlapping polished-steel links; missed days become a visible broken link without deleting earlier progress or resetting the count.
- **Today** — quick check-off for quest steps and repeating actions without opening their management pages; daily chain check-ins can be undone.
- **Safe account actions** — the avatar opens an account menu; sign-out and destructive actions never happen from a single ambiguous click.
- **Reversible organization** — archived quests and finished chains remain visible and can be restored.
- **Auth UX** — magic-link requests have a 60-second resend cooldown and friendly handling for expired links and Supabase rate limits.
- **Player Guide / Гид игрока** — XP rules, chain logic, boss/reward explanations and direct Email/Telegram contacts live outside the home dashboard.
- **Rewards** — unlock personal rewards at total-XP milestones without spending XP.
- **Levels** — global account level grows automatically from total XP.
- **Glossy Game feedback** — polished button/card states, chain snap animation, XP bursts, reward/boss celebrations and optional procedural sounds.
- **Accessibility** — sound can be disabled and decorative motion follows the operating system’s reduced-motion preference.

The UI is deliberately restrained: no inventory, currencies, badges, avatars or punishment mechanics.

## Stack

- Next.js 16.3.8 / React 19 / TypeScript
- Supabase Auth + PostgreSQL + Row Level Security (`@supabase/supabase-js` 2.117.2, `@supabase/ssr` 0.12.7)
- One Supabase project only
- Vercel-ready
- RU / EN interface toggle

## Existing 0.6.0 project → update to 0.7.0

Use `UPDATE_0.7.0_WINDOWS.md`. There are **no database changes** in 0.7.0, so no new Supabase SQL is required.

If updating directly from 0.1.0, first make sure the existing 0.2.0 migration `supabase/migrations/202610070002_multi_chains_and_xp.sql` has already been applied.

Do **not** create another Supabase project.

## New clean installation

Use `SETUP_WINDOWS.md` and run:

```text
supabase/bootstrap/questframe_initial.sql
```

in **Supabase → SQL Editor**.

## Quality checks

```powershell
npm run typecheck
npm run lint
npm run build
```

## Security model

- Authentication is handled by Supabase Auth.
- Every application table has RLS enabled.
- Every row is scoped to `auth.uid()`.
- Foreign ownership between quests/steps and chains/check-ins is enforced by RLS and database triggers.
- Never expose a Supabase `service_role` key in `NEXT_PUBLIC_*` variables.

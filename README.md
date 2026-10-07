# QuestFrame

QuestFrame is a calm gamified goal app: turn real-life goals into quests, break them into concrete steps and earn XP for the effort that actually moves you forward.

Version: **0.4.0**

## Core loop

- **Quests** — a goal becomes a quest with small concrete steps.
- **XP** — +1 regular step, +7 hardest/scariest action, +5 kept promise, +10 action you were procrastinating on.
- **Weekly boss** — one avoided task per week, +25 XP.
- **Chains / Цепочки** — repeatable actions build visible links; missed days appear as broken links without deleting earlier progress or resetting the count.
- **Today** — quick check-off for quest steps and repeating actions without opening their management pages.
- **Player Guide / Гид игрока** — XP rules, chain logic, boss/reward explanations and direct Email/Telegram contacts live outside the home dashboard.
- **Rewards** — unlock personal rewards at total-XP milestones without spending XP.
- **Levels** — global account level grows automatically from total XP.

The UI is deliberately restrained: no inventory, currencies, badges, avatars or punishment mechanics.

## Stack

- Next.js 16.3.8 / React 19 / TypeScript
- Supabase Auth + PostgreSQL + Row Level Security
- One Supabase project only
- Vercel-ready
- RU / EN interface toggle

## Existing 0.3.0 project → update to 0.4.0

Use `UPDATE_0.4.0_WINDOWS.md`. There are **no database changes** in 0.4.0, so no new Supabase SQL is required.

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

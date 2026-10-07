# QuestFrame

QuestFrame is a calm gamified goal app: turn a real-life goal into a quest, break it into concrete steps and earn XP for the effort that actually moves you forward.

Version: **0.1.0**

## Core loop

- **Quests** — a goal becomes a quest with small concrete steps.
- **XP** — +1 regular step, +3 hard/scary action, +5 kept promise, +10 action you were procrastinating on.
- **Weekly boss** — one avoided task per week, +25 XP.
- **Continuous chain** — one repeatable action; missed days never reset the chain.
- **Rewards** — unlock personal rewards at total-XP milestones without spending XP.
- **Levels** — global account level grows automatically from total XP.

The UI is deliberately restrained: no inventory, currencies, badges, avatars or punishment mechanics in the first version.

## Stack

- Next.js 16 / React 19 / TypeScript
- Supabase Auth + PostgreSQL + Row Level Security
- One Supabase project only
- Vercel-ready
- RU / EN interface toggle

## Quick start on Windows 11

Full step-by-step instructions are in `SETUP_WINDOWS.md`.

```powershell
cd P:\Projects\questframe
Copy-Item .env.example .env.local
npm install
npm run dev
```

Before the first real launch, create one Supabase project, run:

```text
supabase/bootstrap/questframe_initial.sql
```

in **Supabase → SQL Editor**, then fill `.env.local` with the Project URL and **publishable key**.

Open: `http://localhost:3000`

## Checks

```powershell
npm run typecheck
npm run lint
npm run build
```

## Security model

- No passwords are stored by QuestFrame; authentication is handled by Supabase Auth.
- Every application table has RLS enabled.
- Every row is scoped to `auth.uid()`.
- Foreign ownership between quests/steps and chains/check-ins is enforced both by RLS and database triggers.
- Never expose a Supabase `service_role` key in `NEXT_PUBLIC_*` variables.

## Google sign-in

Google OAuth is optional and hidden by default. Email magic-link login works without it.

After configuring Google in Supabase, set:

```dotenv
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
```

## Database

Initial schema:

```text
supabase/migrations/202610070001_initial.sql
```

For a new project you can paste the identical bootstrap copy:

```text
supabase/bootstrap/questframe_initial.sql
```

Do not run a future bootstrap file on an existing database unless its instructions explicitly say it is safe.

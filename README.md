# Life Quest

Life Quest is a bilingual gamified goal tracker that turns real-life goals into quests, concrete actions, XP, levels, weekly bosses, repeatable chains and personal rewards.

**Stable release: 1.1.2**

- Production: https://lifequest-game.vercel.app
- Interactive demo: https://lifequest-game.vercel.app/demo

## Product idea

Life Quest is built around a simple loop: **choose a quest → take a concrete action → earn XP → see progress → keep going**. Missed days do not erase earlier chain progress; they create a visible break and the user can continue from the next link.

## Highlights

- Email magic-link and Google authentication with Supabase Auth.
- Interactive no-sign-up Demo Mode.
- Quests with concrete steps and effort-based XP.
- Weekly Boss (+25 XP) for one avoided high-impact task.
- Visual chains where missed days create breaks without deleting previous links.
- Personal rewards with preset or custom XP distance.
- Optional weekly League with top-10 ranking, personal placement and permanent podium badges.
- Lifetime XP levels with an evolving visual palette.
- RU/EN responsive interface.
- Account data export, privacy notice and permanent account deletion.
- PostgreSQL Row Level Security for all user-owned application data.
- Playwright launch smoke/E2E coverage.

## XP model

- `+1 XP` — regular step
- `+5 XP` — kept promise
- `+7 XP` — hardest/scariest action
- `+10 XP` — did what had been procrastinated
- `+25 XP` — weekly boss

## Stack

- Next.js 16.3.8
- React 19.2.8
- TypeScript
- Supabase Auth + PostgreSQL + RLS
- Vercel
- Playwright

## Public routes

- `/` — landing page
- `/demo` — interactive demo without registration
- `/login` — email magic link / Google OAuth
- `/privacy` — privacy notice

Authenticated application routes and account APIs are protected separately.

## Local setup

Copy `.env.example` to `.env.local` and fill the values.

```env
NEXT_PUBLIC_APP_NAME=Life Quest
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
SUPABASE_SECRET_KEY=YOUR_SECRET_KEY
```

`SUPABASE_SECRET_KEY` is server-only. Never expose it with a `NEXT_PUBLIC_` prefix or commit it to Git.

```powershell
npm install
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

## Security

- RLS scopes application data to the authenticated owner.
- Relationship checks prevent cross-owner quest/step and chain/check-in references.
- The account-deletion endpoint authenticates the current user before using a server-only Supabase secret.
- The `handle_new_user()` trigger helper is not directly executable by public API roles.
- Demo Mode is isolated from Supabase writes.
- League score and badge writes are server-controlled; clients cannot directly modify weekly scores or badges.

## Repository

https://github.com/bubaleh1337/life-quest


## Weekly League

League participation is optional. Members choose a public nickname and earn a separate weekly XP score from quest-step and weekly-boss XP. Every Monday the League starts fresh while lifetime XP and level stay untouched. The top three earn permanent gold, silver and bronze badges. Old weekly score rows are deleted after the podium is finalized; badges remain in the winner's Profile and can be shared as vertical branded Life Quest story cards. League nickname editing and trophy history also live in Profile so the League screen stays focused on the current race.

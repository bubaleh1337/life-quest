# Life Quest — portfolio case study source

## One-line description

A bilingual gamified goal-tracking web app that turns real-life goals into quests, XP, levels, weekly bosses, non-resetting chains and personal rewards.

## Problem

Traditional habit trackers often punish missed days and goal apps can become planning-heavy. Life Quest was designed around visible action, low cognitive load and progress that survives imperfect days.

## Product decisions

- A goal becomes a quest with concrete steps.
- XP communicates effort without becoming a spendable currency.
- Weekly Boss highlights one avoided high-impact action.
- Chains show missed days as visible breaks but never erase previous progress.
- Rewards unlock from lifetime XP without spending it.
- Demo Mode lets reviewers experience the product without creating an account.

## Engineering

- Next.js 16 / React 19 / TypeScript
- Supabase Auth + PostgreSQL
- Row Level Security on all application tables
- Server-side account deletion using a protected service-role key
- JSON account export
- Email magic links + Google OAuth-ready flow
- Responsive RU/EN interface
- Vercel deployment
- Playwright launch smoke tests

## QA / reliability work

- explicit confirmation for irreversible actions;
- account menu outside-click and Escape behavior;
- magic-link resend cooldown and rate-limit handling;
- regression coverage for demo, rewards, privacy and account-menu behavior;
- `typecheck`, ESLint, production build and Playwright checks before release.

## Portfolio links to include

- Production: replace with the final stable Life Quest URL
- Demo: `/demo`
- GitHub: replace with `bubaleh1337/life-quest` after repository rename

## Suggested portfolio headline

**Life Quest — gamified goal tracker with Next.js, TypeScript, Supabase and Playwright**

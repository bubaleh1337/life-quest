# Life Quest — product spec 1.0.0

## Product promise

Life Quest turns vague real-life goals into a small, motivating game loop without turning personal development into another complicated management system.

## Product principles

1. **Action over planning.** Reward concrete real-world action.
2. **Progress without punishment.** A missed day must not erase historical progress.
3. **Low cognitive load.** Avoid unnecessary currencies, inventories and formulas.
4. **Fast daily interaction.** Core actions should be completable from Today.
5. **No surprise destructive actions.** Sign-out, deletion and state-changing destructive actions require explicit intent.
6. **Portfolio-friendly access.** A reviewer must be able to understand the product without creating an account.
7. **User control of data.** Users can export and permanently delete their data.

## XP rules

- +1 — regular step
- +5 — kept a promise to oneself
- +7 — hardest/scariest action
- +10 — action that had been procrastinated
- +25 — weekly boss

XP is derived from completed records. Undoing a completion removes the corresponding XP.

## Levels

Level threshold:

```text
25 × (level - 1) × level
```

The level ring changes smoothly through the product progression palette rather than staying one fixed color.

## Chains

Chains are not streak counters:

- several active chains are allowed;
- one check-in per chain per calendar day;
- each completed day adds a visual link;
- missed past days appear as broken links;
- a break never erases old links or resets the total;
- finished chains remain recoverable.

## Rewards

The user chooses how much additional progress a reward should require:

- Small +25 XP
- Regular +50 XP
- Meaningful +100 XP
- Big +200 XP
- custom XP

Selecting a preset fills the XP field. Selecting the same preset again clears it so custom XP can be entered.

## Demo Mode

`/demo` is a public, interactive demonstration with prefilled quests, chains, rewards and a weekly boss.

- no authentication required;
- sample state is kept only in React memory;
- demo changes disappear on refresh;
- no demo mutation writes to Supabase;
- a visible banner explains that behavior;
- the user can move directly from demo to sign-in.

## Authentication

- Email magic-link authentication remains available.
- Google OAuth is enabled in production alongside email magic-link authentication.
- OAuth and magic links use `/auth/callback` for the PKCE session exchange.
- Production redirect behavior is based on the stable `NEXT_PUBLIC_APP_URL`.

## Personal data controls

Authenticated account menu provides:

- JSON export of the current user's Life Quest data;
- public Privacy page;
- permanent account deletion;
- explicit sign-out.

Permanent deletion uses a server-only Supabase secret key. Because the application tables reference `auth.users(id)` with `ON DELETE CASCADE`, deleting the authenticated user also removes associated application rows.

## Glossy Game visual direction

70% Glossy Elegant / 30% Cozy Game:

- pearl/glass surfaces;
- wine, champagne and evolving level-color accents;
- soft multi-tone ambient background;
- polished chain links and visible broken-link history;
- restrained micro-interactions, XP bursts and optional procedural sound;
- reduced-motion support.

## QA baseline

Playwright launch smoke tests cover:

- public landing + Demo CTA;
- populated Demo Mode;
- main demo navigation;
- reward preset fill/clear behavior;
- account-menu outside-click dismissal;
- public Privacy page.

Manual release regression remains required for authenticated Supabase flows, account deletion, Google OAuth and production callback URLs.

# QuestFrame — product spec 0.7.0

## Product promise

QuestFrame turns vague self-improvement goals into a small game loop without turning the user's life into another complicated management system.

## Design principles

1. **Action over planning.** The app rewards concrete real-world actions.
2. **Progress without punishment.** Missed days do not erase historical progress.
3. **Low cognitive load.** No inventories, currencies, skill trees, badges or dozens of score types.
4. **One scary thing at a time.** One weekly boss per user and week.
5. **Several simple routines are allowed.** Multiple chains can run in parallel, each with one daily check-in.
6. **Fast daily interaction.** Quest steps and repeating goals can be checked off from Today.
7. **Transparent XP.** XP comes only from completed quest steps and defeated weekly bosses.
8. **No surprise state changes.** Ambiguous controls never sign the user out, delete data or hide progress. Irreversible actions require confirmation; reversible actions should expose an undo path.
9. **Recoverable organization.** Archived quests and finished chains remain accessible and can be restored.


## Glossy Game art direction

QuestFrame uses a **70% Glossy Elegant / 30% Cozy Game** visual system:

- calm pearl/cream surfaces with wine and champagne accents;
- polished-steel chain links with alternating angles so the chain reads as an actual interlocked object;
- a split-link break illustration with particles rather than a generic gap or warning badge;
- short, restrained micro-interactions for press, completion, XP, chain-link creation, boss victory and rewards;
- optional sound feedback generated locally in the browser;
- no decorative feedback may block, delay or change the underlying action;
- `prefers-reduced-motion` must disable decorative motion without removing functionality.

Sound preference is stored locally in the browser (`questframe-sound`) and is not user-profile data.

## XP rules

- +1 — completed a regular step.
- +5 — kept a promise to oneself.
- +7 — did the hardest or scariest thing.
- +10 — did something that had been procrastinated.
- +25 — defeated the weekly boss.

Undoing a completion removes that XP because total XP is derived from completed records rather than stored as a mutable wallet balance.

## Levels

Level start threshold:

```text
25 × (level - 1) × level
```

Examples:

- Level 1 starts at 0 XP
- Level 2 starts at 50 XP
- Level 3 starts at 150 XP
- Level 4 starts at 300 XP
- Level 5 starts at 500 XP

## Rewards

Rewards unlock at a chosen lifetime-XP threshold. Claiming a reward does not spend XP and therefore cannot reduce level progression.

## Chain semantics

Chains are a first-class visual mechanic, not a renamed streak counter:

- multiple active chains are allowed;
- each chain represents one repeatable action;
- only one check-in per chain per calendar day is allowed;
- every completed day adds a visual link;
- a missed past day is shown as a broken link;
- a break never deletes previous links and never resets the total link count;
- today remains an open/pending link until the user checks in;
- the chain start is always visible, while older history can collapse behind a compact history bridge;
- ending a chain keeps its history and moves it to a finished section where it can be restored;
- today's check-in can be undone without affecting older links.

## Localized dates

Quest target dates are entered by the app rather than the browser-native date control so the displayed input format follows the selected QuestFrame language:

- RU: `ДД.ММ.ГГГГ`
- EN: `MM/DD/YYYY`

Dates are stored in PostgreSQL as normal ISO `date` values.

## Public entry and language

The landing page and login page both support RU/EN before authentication. Russian is the default for a new browser session; the selected language is stored in `localStorage` and reused by the landing page, login and authenticated dashboard.

## Player Guide and contacts

The in-app reference area is called **«Гид игрока» / Player Guide**. It contains the XP rules, chain/no-reset explanation, weekly boss, rewards and only two author-contact actions:

- Email: `ekaterina.pyshkova@gmail.com`
- Telegram: `@kemisayega`

## Data ownership

All product data is private to the authenticated user. RLS is mandatory for every application table.


## Account and destructive-action UX

- The avatar is an account-menu trigger, never a direct sign-out control.
- Sign-out requires an explicit confirmation dialog.
- Deleting a quest step or reward requires confirmation because the deletion is permanent.
- Archiving a quest and finishing a chain require confirmation, and both states remain recoverable from the UI.
- Reward claims can be undone.
- Completed or archived quests are read-only until returned to Active, preventing status/progress contradictions.

## Authentication UX

- Magic-link requests are throttled in the client for at least 60 seconds after a send attempt succeeds.
- The cooldown is stored in browser storage so a refresh does not immediately enable accidental resends.
- Known Supabase `429` / email-rate-limit errors are translated into a user-facing message instead of exposing raw backend text.
- Expired/invalid links are routed back to the login screen with a localized recovery message.
- Public landing-page auth errors are forwarded to `/login` rather than being silently displayed on the landing page.


## Visual system — 0.7.0

QuestFrame uses a **Glossy Game** direction: elegant pearl/glass surfaces with restrained game feedback. The Today page follows a responsive bento hierarchy rather than stacking full-width panels. On desktop, level + weekly boss form the overview row and quick quest actions + chain actions form the interaction row. Typography is modern display sans-serif; large editorial serif headings are intentionally avoided. The app header is visually separated into three floating islands (brand, navigation, controls) so it reads as intentional navigation rather than a rectangular banner.

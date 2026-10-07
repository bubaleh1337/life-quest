# QuestFrame — product spec 0.2

## Product promise

QuestFrame turns vague self-improvement goals into a small game loop without turning the user's life into another complicated management system.

## Design principles

1. **Action over planning.** The app rewards concrete real-world actions.
2. **Progress without punishment.** Missed days do not erase historical progress.
3. **Low cognitive load.** No inventories, currencies, skill trees, badges or dozens of score types.
4. **One scary thing at a time.** One weekly boss per user and week.
5. **Several simple routines are allowed.** Multiple streaks can run in parallel, each with one daily check-in.
6. **Fast daily interaction.** Quest steps and repeating goals can be checked off from Today.
7. **Transparent XP.** XP comes only from completed quest steps and defeated weekly bosses.

## XP rules

- +1 — completed a regular step.
- +7 — did the hardest or scariest thing.
- +5 — kept a promise to oneself.
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

Streaks intentionally are **not** traditional streaks:

- multiple active streaks are allowed;
- each chain represents one repeatable action;
- only one check-in per chain per calendar day is allowed;
- a missed day creates a gap but does not reset the count;
- ending a chain keeps its history and removes it from the active list.

## Localized dates

Quest target dates are entered by the app rather than the browser-native date control so the displayed input format follows the selected QuestFrame language:

- RU: `ДД.ММ.ГГГГ`
- EN: `MM/DD/YYYY`

Dates are stored in PostgreSQL as normal ISO `date` values.

## Data ownership

All product data is private to the authenticated user. RLS is mandatory for every application table.

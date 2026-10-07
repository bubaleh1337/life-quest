# QuestFrame — product spec 0.1

## Product promise

QuestFrame turns vague self-improvement goals into a small game loop without turning the user's life into another complicated management system.

## Design principles

1. **Action over planning.** The app rewards concrete real-world actions.
2. **Progress without punishment.** Missed days do not erase historical progress.
3. **Low cognitive load.** No inventories, currencies, skill trees, badges or dozens of score types in v0.1.
4. **One scary thing at a time.** One weekly boss per user and week.
5. **One chain at a time.** The database enforces one active continuous chain per user.
6. **Transparent XP.** XP comes only from completed quest steps and defeated weekly bosses.

## XP rules

- +1 — completed a regular step.
- +3 — did something hard or scary.
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

The continuous chain intentionally is **not** a traditional streak:

- only one active chain is allowed;
- only one check-in per calendar day is allowed;
- a missed day creates a gap but does not reset the count;
- ending a chain archives its history and allows a new chain to start.

## Data ownership

All product data is private to the authenticated user. RLS is mandatory for every application table.

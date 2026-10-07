# Changelog

## 0.3.0 — 2026-10-07

- Added automatic date masking while typing: `11102026` becomes `11.10.2026` in Russian and `10112026` becomes `10/11/2026` in English.
- Renamed the repeating-action area from Chains / «Цепочки» to Streaks / «Серии».
- Reworked streak management into compact rows instead of one large card per repeating action.
- Localized all visible section eyebrow labels in the authenticated app.
- Moved XP/no-reset explanations off the Today page into a separate Help / «Справка» tab.
- Added Help sections for XP, streaks, weekly boss, rewards and author contacts.
- Explicitly sets the QuestFrame browser title in app metadata and client state to eliminate stale copied project titles.
- Adjusted the mobile navigation for five tabs.
- Fixed the two React lint errors caused by synchronous state updates from effects.
- No Supabase migration is required for this release.

## 0.2.0 — 2026-10-07

- Localized quest category examples for RU/EN.
- Replaced browser-controlled target-date field with app-localized date input:
  - RU: `ДД.ММ.ГГГГ`
  - EN: `MM/DD/YYYY`
- Fixed async form reset bug that left old values in quest-step, chain and reward forms.
- Changed hard/scary action XP from `+3` to `+7`; migration also updates existing hard/scary steps.
- QuestFrame logo now returns to the Today/home page.
- Added quick quest-step check-off directly on the Today page.
- Added repeating-goal check-off directly on the Today page.
- Multiple active continuous chains are now supported instead of only one.
- Added multi-chain management with separate seven-day history and daily check-in for each chain.
- Fixed TypeScript success-message typing errors.
- Pinned ESLint to the maintained ESLint 9 line to avoid the known ESLint 10 / React-plugin incompatibility.
- Upgraded Next.js from 16.3.3 to 16.3.8 security release.
- Added the Next.js smooth-scroll declaration expected by route transitions.

## 0.1.0 — 2026-10-07

- Initial QuestFrame MVP.
- Email magic-link auth with optional Google OAuth.
- RU/EN UI.
- Quest creation and step tracking.
- Four transparent XP categories: +1 / +3 / +5 / +10.
- Level progression from lifetime XP.
- One weekly boss (+25 XP).
- One non-resetting continuous chain.
- XP milestone rewards.
- Responsive desktop/mobile UI.
- Supabase RLS and ownership guards.
- One-project Supabase setup and Vercel/Git instructions.

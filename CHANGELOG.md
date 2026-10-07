# Changelog

## 0.5.0 — 2026-10-07

- Replaced the one-click avatar sign-out with an explicit account menu.
- Added sign-out confirmation so opening the account control can never end a session.
- Added reusable confirmation dialogs for destructive or high-impact actions.
- Quest-step deletion and reward deletion now require confirmation.
- Quest archiving now requires confirmation and archived quests remain visible in a dedicated Archive filter.
- Finished chains remain accessible in a Finished chains section and can be restored.
- Today's chain check-in can be undone from both Today and Chains.
- Reward claims require confirmation and can be undone afterward.
- Completed/archived quests are read-only until restored to Active, preventing progress/status inconsistencies.
- Defeated weekly bosses now show an explicit Undo victory action instead of a misleading clickable status label.
- Added proper Russian singular/plural forms for chain-link counts.
- Added click-outside and Escape handling for the account menu, plus keyboard focus styling and active-nav accessibility state.
- Improved magic-link UX with a persisted 60-second resend cooldown.
- Added friendly handling for Supabase email/request rate limits instead of exposing `email rate limit exceeded`.
- Added success/error styling for authentication notices.
- Landing-page auth errors are forwarded to the login recovery flow.
- Updated Supabase client packages to current stable patch/minor releases (`@supabase/ssr` 0.12.7, `@supabase/supabase-js` 2.117.2).
- No Supabase migration is required for this release.

## 0.4.1 — 2026-10-07

- Sorted XP explanations and selectors consistently as `+1`, `+5`, `+7`, `+10` in both RU and EN.
- Hardened production magic-link redirects: QuestFrame now prefers the configured stable `NEXT_PUBLIC_APP_URL` instead of blindly using a temporary Vercel deployment hostname.
- Added a guard so a mistakenly configured localhost app URL is never forced while running on production.
- Added friendly localized handling for expired/invalid email sign-in links.
- Added explicit production-auth setup instructions for the stable `https://questframe.vercel.app` alias and exact Supabase redirect URLs.
- No database migration is required.

## 0.4.0 — 2026-10-07

- Restored the core **Chains / «Цепочки»** identity instead of generic streak terminology.
- Rebuilt chain history as a visual chain: each completed day is a link, missed days are shown as visibly broken links and today remains an open/pending link until checked in.
- Added a persistent chain start marker and a compact history bridge when the chain began before the visible seven-day window.
- Kept chain history compact and horizontally scrollable instead of returning to oversized cards.
- Renamed Help / «Справка» to **Player Guide / «Гид игрока»**.
- Replaced GitHub/LinkedIn author links with the same direct Email and Telegram contacts used by the other apps.
- Added full RU/EN localization and a language switcher to the public landing page before authentication.
- Login now defaults to Russian, remembers the selected language and localizes its eyebrow/separator as well as the main copy.
- No Supabase migration is required for this release.

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

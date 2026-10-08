## 1.1.2

- Simplified the League page by moving trophies and League-name editing into a dedicated Player Profile opened from the account menu.
- Moved the existing Leave League action into the personal-rank card so the competition page stays focused.
- Replaced abstract top-three symbols with trophy icons across podium, top-10 and trophy cards.
- Rebuilt shared League badge artwork as a vertical 1080×1920 story card with cleaner Life Quest branding and no visible raw URL.
- Kept the production link in the share text so shared trophies can still bring new players to Life Quest.
- Updated Demo/E2E coverage for the new Profile flow.

## 1.1.1

- Fixed the League E2E test to use an unambiguous accessible locator for the demo leaderboard.
- Removed the Next.js lint warning from account export navigation while preserving the JSON download behavior.

## 1.1.0

- Added the optional Life Quest League with weekly XP runs, top-10 ranking and a personal rank card.
- Added permanent gold, silver and bronze podium badges while old weekly score rows are deleted after finalization.
- Added shareable badge cards with Life Quest branding and a production link.
- League scoring is server-side and derived from quest-step and weekly-boss XP; lifetime XP and levels never reset.
- Added League privacy controls, nickname editing, opt-out and demo coverage.

## 1.0.2

- Rebalanced Demo Mode across projects, health, home, learning and leisure instead of overcorrecting into household-only examples.
- Restored neutral project examples such as “Собрать портфолио” and “Опубликовать первый проект”.
- Replaced household-heavy chains, history and rewards with a broader everyday mix.
- Updated landing examples and demo smoke test to match the balanced sample content.

## 1.0.1

- Reworked the demo around ordinary household and everyday-life goals instead of job-search and portfolio examples.
- Replaced career-specific landing examples and boss/category placeholders with neutral household examples.
- Updated the demo smoke test for the new sample content.

## 1.0.0

- First stable public release of Life Quest.
- Google OAuth enabled alongside email magic-link authentication.
- Public interactive Demo Mode, privacy page, account export and permanent account deletion.
- Production database hardened: direct public execution of `handle_new_user()` revoked, RLS policies optimized and ownership indexes added.
- Production brand and URLs finalized for Life Quest.
- Added public SEO metadata, robots rules and sitemap.
- Clarified landing-page chain copy from “не обнуляется” to “прогресс сохраняется”.
- Portfolio and README documentation finalized with production/demo/repository links.

## 0.11.1

- Fixed the account dropdown stacking context so it always renders above dashboard cards.
- Increased dropdown opacity and contrast while retaining the glass look.
- Kept outside-click and Escape closing behaviour.

## 0.11.0 — 2026-10-08

- Added public interactive Demo Mode at `/demo` with realistic in-memory sample data and no registration.
- Added account JSON export, public Privacy page and permanent account deletion.
- Added server-only Supabase secret-key support for account deletion; the secret never reaches browser code.
- Added Google OAuth launch configuration while preserving email magic-link login.
- Added Playwright launch smoke tests for landing/demo, reward presets, outside-click account menu behavior and Privacy.
- Completed code-facing Life Quest rebrand: package name, env examples, docs and portfolio/launch checklists.
- Added portfolio case-study source material and a 1.0 launch checklist.
- No database migration required.

## 0.10.1

- Removed the reward formula block to reduce cognitive load.
- Kept four quick XP presets: +25, +50, +100 and +200.
- Restored the editable XP field beside the Add reward button.
- Clicking a preset fills the XP field; clicking the same preset again clears it for custom input.
- Typing custom XP automatically deselects the preset.

## 0.10.0

- Reworked reward creation so users choose how much *additional progress* a reward should require instead of calculating an absolute lifetime XP threshold manually.
- Added reward presets (+25 / +50 / +100 / +200 XP), a live formula preview, custom XP cost and a clearer “XP remaining” label on reward cards.
- Fixed the flat strip at the very top of the app by preventing the floating header margin from exposing the root canvas.

## 0.9.1

- Make the application background visibly multi-tone with warm peach, berry, blue and champagne ambient zones instead of nearly flat beige.
- Fix the account menu so it closes on any pointer click outside the menu, while preserving Escape and menu-item behavior.

## 0.9.0 — 2026-10-07

- Added a subtle animated ambient background with warm pearl, berry and cool-blue light blooms.
- Added smooth tab/page entrance transitions and richer hover/press feedback across cards, lists and navigation.
- Added subtle glossy delight details to unlocked rewards, empty states, dashboard stat pills and the mobile dock.
- Preserved reduced-motion accessibility by disabling non-essential movement when requested by the OS.
- No database migration required.

## 0.8.1

- Simplified the Life Quest brand icon so the favicon stays clear and readable at tiny browser-tab sizes.
- Replaced the detailed mini mark with a bold quest star symbol and matching in-app brand mark.

## 0.8.0

- Rebrand QuestFrame to Life Quest with a new star-growth brand mark, refreshed favicon and updated window titles.
- Add a layered ambient background and softer glass surfaces so the app no longer feels flat or one-tone.
- Make the level ring shift smoothly through a progression palette as levels rise.

# Changelog

## 0.7.0 — 2026-10-07

- Rebuilt the authenticated Today page into a denser modern bento dashboard to remove large unused horizontal areas.
- Reworked the header into three intentional floating glass islands instead of one visually detached full-width strip.
- Replaced the old serif display treatment with modern variable/system sans typography across the app.
- Added a Today heading, localized date and compact status pills for pending quest steps and today's chains.
- Moved level and weekly boss into a balanced two-card overview row.
- Moved quick quest actions and repeating actions into a responsive two-column action grid.
- Restyled action rows as tactile compact cards instead of legacy table-like separators.
- Reworked the level badge into a circular progress ring.
- Increased active quest density to up to six compact cards and three desktop columns.
- Refined backgrounds, borders, glass surfaces, shadows, buttons and form controls for a more contemporary Glossy Game look.
- Fixed `react-hooks/purity` lint failure in XP burst feedback by replacing `Date.now()` with a stable `useRef` counter.
- No Supabase migration is required for this release.
## 0.6.0 — 2026-10-07

- Introduced the **Glossy Game** art direction: elegant glassy surfaces, wine/champagne accents and restrained game feedback.
- Rebuilt visual chains as overlapping polished-steel SVG links instead of CSS ovals and connector bars.
- Broken days now use a dedicated split-link illustration with separated metal halves, debris particles and sparkles while preserving history.
- Added a jewelry-like Start charm, alternating interlocked link angles, glossy highlights and a softly animated pending-today link.
- Added a snap-in animation and sparkle celebration when today's chain link is created.
- Added subtle press, hover, shimmer, progress and completion micro-interactions across buttons, check controls, cards and progress bars.
- Added floating `+XP` feedback when completing quest steps and defeating the weekly boss.
- Added reward-claim celebration feedback.
- Added optional procedural UI sounds generated in-browser with Web Audio: chain clink, XP success, boss victory, reward sparkle and undo cues. No external audio assets are required.
- Added a persistent Sound on/off setting in the header and Player Guide.
- Added `prefers-reduced-motion` support so motion-sensitive users do not receive decorative animation.
- No Supabase migration is required for this release.

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

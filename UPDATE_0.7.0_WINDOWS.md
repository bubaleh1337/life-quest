# QuestFrame 0.7.0 — Windows update

This update is for an existing QuestFrame 0.6.0 project.

## 1. Stop development server

```powershell
Ctrl + C
```

## 2. Replace project files

Copy the contents of the `questframe` folder from this archive over:

```text
P:\Projects\QuestFrame\questframe
```

Choose **Replace files in the destination**. The archive does not contain `.env.local`.

## 3. Supabase

No SQL migration is required for 0.7.0. Do not rerun bootstrap SQL.

## 4. Install/check

```powershell
cd P:\Projects\QuestFrame\questframe
npm install
npm run typecheck
npm run lint
npm run build
```

Do not run `npm audit fix --force`.

## 5. Visual regression check

```powershell
npm run dev
```

Open `http://localhost:3000` and verify:

1. The header is no longer a full highlighted rectangle: brand, navigation and controls appear as separate floating glass islands.
2. The Today page starts with a modern heading/date/status area.
3. Level and Weekly Boss sit side by side on desktop and stack cleanly on smaller screens.
4. Quick steps and repeating actions sit side by side on desktop; action rows look like compact cards rather than table rows.
5. Level is displayed as a circular progress ring.
6. Active quest cards are denser and up to six can be shown on the Today page.
7. Chains retain the Glossy Game metal-link design from 0.6.0.
8. Sound, XP popups, boss/reward animations and confirmations still work.
9. `npm run lint` must no longer report `Date.now()` / `react-hooks/purity` in `Dashboard.tsx`.

## 6. Git

```powershell
Ctrl + C
git status
git add .
git commit -m "feat: modernize QuestFrame dashboard"
git push
```

## 7. Production

```powershell
npx vercel --prod
```

Production alias remains:

```text
https://questframe.vercel.app
```

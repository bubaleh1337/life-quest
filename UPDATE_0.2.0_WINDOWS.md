# QuestFrame 0.1.0 → 0.2.0 update — Windows 11

These steps are for the existing project and existing Supabase database. Do not create a new Supabase project.

## 1. Stop the local server

In the PowerShell window where `npm run dev` is running:

```powershell
Ctrl + C
```

## 2. Back up the current Git state

```powershell
cd P:\Projects\QuestFrame\questframe
git status
git log --oneline -5
```

The existing `0.1.0` commit is already a rollback point.

## 3. Copy the 0.2.0 archive over the existing project

Extract the ZIP and copy the contents of its `questframe` folder into:

```text
P:\Projects\QuestFrame\questframe
```

Choose **Replace files in the destination** when Windows asks.

Do not delete `.env.local`. It is intentionally not included in the archive.

## 4. Run the Supabase migration

Open:

```text
Supabase → your existing QuestFrame project → SQL Editor
```

Open this local file:

```text
supabase\migrations\202610070002_multi_chains_and_xp.sql
```

Copy all SQL → paste into SQL Editor → **Run**.

This migration:

- removes the one-active-chain limit;
- changes hard/scary actions from +3 XP to +7 XP;
- updates existing hard/scary steps to +7 XP.

## 5. Refresh dependencies

```powershell
cd P:\Projects\QuestFrame\questframe
npm install
```

The update pins ESLint 9.39.5 and upgrades Next.js to 16.3.8.

Do not run `npm audit fix --force` automatically. First check the actual report:

```powershell
npm audit
```

## 6. Run quality checks

```powershell
npm run typecheck
npm run lint
npm run build
```

All three should finish without errors.

## 7. Test locally

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

Test:

1. Create a RU quest and confirm category example is Russian.
2. Confirm target date expects `ДД.ММ.ГГГГ`.
3. Add two quest steps in a row and confirm the step-name field clears after each add.
4. Confirm hardest/scariest action shows `+7 XP`.
5. Click the QuestFrame logo and confirm it opens Today.
6. Mark a quest step directly from Today.
7. Create at least two chains, e.g. `Просыпаться в 5:45` and `Польский каждый день`.
8. Mark both chains for today independently.
9. Add two rewards in a row and confirm both input fields clear.
10. Refresh the browser and confirm all data remains.

## 8. Commit and push

Stop dev server first:

```powershell
Ctrl + C
```

Then:

```powershell
git status
git add .
git commit -m "feat: improve daily flow and multiple chains"
git push
```

## 9. Vercel

If the first Vercel setup was not finished, run:

```powershell
npx vercel
```

When asked:

```text
Connect this Git repository to automatically deploy changes on every push? (y/N)
```

answer:

```text
y
```

Then add the same environment variables from `.env.local` in Vercel project settings, but set `NEXT_PUBLIC_APP_URL` to the production domain.

Production deployment:

```powershell
npx vercel --prod
```

After the final production URL is known, add it in Supabase:

```text
Authentication → URL Configuration
```

Keep local redirect and add production redirect:

```text
http://localhost:3000/auth/callback
https://YOUR-DOMAIN/auth/callback
```

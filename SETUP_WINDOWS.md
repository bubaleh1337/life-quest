# QuestFrame 0.2.0 — Windows 11 setup

These instructions assume PowerShell and a project folder such as `P:\Projects\questframe`.

## 1. Extract the archive

Extract the ZIP so the project looks like:

```text
P:\Projects\questframe\
  package.json
  src\
  supabase\
  public\
```

Then open PowerShell in that folder:

```powershell
cd P:\Projects\questframe
```

## 2. Install dependencies

Recommended: Node.js 22 LTS or newer.

Check:

```powershell
node -v
npm -v
```

Install:

```powershell
npm install
```

## 3. Create ONE Supabase project

Use one normal project for QuestFrame. No `beta`, `dev` or duplicate project is needed.

In Supabase:

1. Create a project, for example `questframe`.
2. Open **SQL Editor**.
3. Open the local file:
   `supabase\bootstrap\questframe_initial.sql`
4. Copy all SQL into SQL Editor.
5. Click **Run**.
6. Confirm the tables exist under **Table Editor**:
   `profiles`, `quests`, `quest_steps`, `weekly_bosses`, `chains`, `chain_checkins`, `rewards`.

## 4. Configure local environment

Create `.env.local`:

```powershell
Copy-Item .env.example .env.local
notepad .env.local
```

Fill it like this:

```dotenv
NEXT_PUBLIC_APP_NAME=QuestFrame
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false
```

Where to get values:

- Supabase → **Project Settings → API** → Project URL
- Supabase → **Project Settings → API** → Publishable key

Use the **publishable** key only. Do not put `service_role` into `.env.local` under a `NEXT_PUBLIC_` name.

## 5. Configure email magic-link login

Supabase → **Authentication → URL Configuration**:

Site URL:

```text
http://localhost:3000
```

Add Redirect URL:

```text
http://localhost:3000/auth/callback
```

Email login is enough for the first launch. Google can be enabled later.

## 6. Run locally

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

Test in this order:

1. Sign in by email magic link.
2. Create one quest.
3. Add four steps using different XP types and confirm the hard/scary option is +7 XP.
4. Complete one step and verify XP changes.
5. Undo it and verify XP goes back.
6. Set the weekly boss and defeat it; verify +25 XP.
7. Create at least two chains, check both in for today and refresh the page; both links must remain.
8. Add a reward with a reachable XP threshold and claim it after it unlocks.
9. Sign out and sign in again; all data must remain.

## 7. Quality checks before Git/Vercel

Stop the dev server with `Ctrl + C`, then run:

```powershell
npm run typecheck
npm run lint
npm run build
```

All three must finish without errors before deployment.

## 8. Git — first repository

Create an empty GitHub repository named `questframe` first. Do not add README or `.gitignore` on GitHub because they already exist locally.

Then:

```powershell
git init
git add .
git commit -m "feat: launch QuestFrame 0.2.0"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/questframe.git
git push -u origin main
```

For later updates:

```powershell
git status
git add .
git commit -m "feat: describe the change"
git push
```

Useful rollback/check commands:

```powershell
git log --oneline -10
git status
git diff
```

## 9. Vercel deployment

Install/login if needed:

```powershell
npx vercel login
```

From the project folder:

```powershell
npx vercel
```

When Vercel creates the project, add these Environment Variables in Vercel → Project → Settings → Environment Variables:

```text
NEXT_PUBLIC_APP_NAME=QuestFrame
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
NEXT_PUBLIC_APP_URL=https://YOUR-PRODUCTION-DOMAIN
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false
```

Deploy production:

```powershell
npx vercel --prod
```

## 10. Add production callback to Supabase

After Vercel gives you the final production domain, Supabase → **Authentication → URL Configuration**.

Change Site URL to the production URL, for example:

```text
https://questframe.vercel.app
```

Keep/add Redirect URLs:

```text
http://localhost:3000/auth/callback
https://questframe.vercel.app/auth/callback
```

Then redeploy if you changed Vercel environment variables:

```powershell
npx vercel --prod
```

## 11. Optional Google sign-in

Do this only after email login works.

1. Configure a Google OAuth app.
2. Enable Google under Supabase → Authentication → Providers → Google.
3. Add the callback URI shown by Supabase to the Google OAuth client.
4. In local `.env.local` and Vercel set:

```dotenv
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
```

5. Restart locally or redeploy production.

Local restart:

```powershell
Ctrl + C
npm run dev
```

Production:

```powershell
npx vercel --prod
```

## 12. Normal daily commands

Start development:

```powershell
cd P:\Projects\questframe
npm run dev
```

Check code:

```powershell
npm run typecheck
npm run lint
npm run build
```

Commit an update:

```powershell
git status
git add .
git commit -m "feat: update QuestFrame"
git push
```

Deploy current source manually:

```powershell
npx vercel --prod
```

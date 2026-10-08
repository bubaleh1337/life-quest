# Life Quest 1.0.0 — Windows 11 setup

These instructions assume PowerShell and one Supabase project.

## 1. Install

```powershell
cd P:\Projects\LifeQuest\life-quest
npm install
```

Recommended: Node.js 22 LTS or newer.

## 2. Supabase

Create one project. In **SQL Editor**, run:

```text
supabase\bootstrap\questframe_initial.sql
```

The existing bootstrap filename is kept for upgrade compatibility; the product is branded **Life Quest**.

Expected tables:

```text
profiles
quests
quest_steps
weekly_bosses
chains
chain_checkins
rewards
```

## 3. Local environment

```powershell
Copy-Item .env.example .env.local
notepad .env.local
```

Fill:

```env
NEXT_PUBLIC_APP_NAME=Life Quest
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
SUPABASE_SECRET_KEY=YOUR_SECRET_KEY
```

The secret key is used only by the server-side account-deletion endpoint. Never give it a `NEXT_PUBLIC_` prefix and never commit `.env.local`.

## 4. Email authentication

Supabase → **Authentication → URL Configuration**:

```text
Site URL:
http://localhost:3000

Redirect URLs:
http://localhost:3000/auth/callback
```

## 5. Run locally

```powershell
npm run dev
```

Public routes:

```text
http://localhost:3000/
http://localhost:3000/demo
http://localhost:3000/privacy
http://localhost:3000/login
```

## 6. Quality checks

```powershell
npm run typecheck
npm run lint
npm run build
```

Install the Playwright Chromium browser once:

```powershell
npx playwright install chromium
```

Then:

```powershell
npm run test:e2e
```

## 7. Production environment in Vercel

Add:

```text
NEXT_PUBLIC_APP_NAME=Life Quest
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
NEXT_PUBLIC_APP_URL=https://lifequest-game.vercel.app
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
SUPABASE_SECRET_KEY=...
```

Do not use a temporary Vercel deployment hostname for `NEXT_PUBLIC_APP_URL`.

Deploy:

```powershell
npx vercel --prod
```

## 8. Production Supabase URLs

Supabase → **Authentication → URL Configuration**:

```text
Site URL:
https://lifequest-game.vercel.app

Redirect URLs:
http://localhost:3000/auth/callback
https://lifequest-game.vercel.app/auth/callback
```

## 9. Google sign-in

The application code already supports Google OAuth.

1. In Google Auth Platform create a Web application OAuth client.
2. Add the stable production origin under Authorized JavaScript origins.
3. Add the Supabase provider callback under Authorized redirect URIs:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

4. Supabase → Authentication → Providers → Google: add the Google Client ID and Client Secret and enable Google.
5. Set locally and in Vercel:

```env
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
```

6. Restart/redeploy and test from a private browser window.

## 10. Account-data test

Use a disposable account, not your main account.

1. Create a quest and a chain.
2. Account menu → **Export data**. Confirm a JSON file downloads and contains only that account's rows.
3. Account menu → **Delete account**. Confirm the destructive dialog.
4. Confirm the account can no longer access `/app` and its rows are gone from Supabase.

## 11. Git + deploy

```powershell
git status
git add .
git commit -m "release: Life Quest 1.0.0"
git push
npx vercel --prod
```


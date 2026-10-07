# QuestFrame 0.4.1 — Windows update

This hotfix is for an existing QuestFrame 0.4.0 project. No Supabase SQL migration is required.

## 1. Replace files

Stop the dev server with `Ctrl + C`, then copy the contents of the `questframe` folder over your existing project and choose **Replace files in the destination**.

## 2. Vercel production URL

Open **Vercel → questframe → Settings → Environment Variables** and make sure this value exists for Production:

```text
NEXT_PUBLIC_APP_URL=https://questframe.vercel.app
```

Keep the existing Supabase URL and publishable key unchanged.

## 3. Supabase Auth URL Configuration — required once

Open **Supabase → Authentication → URL Configuration**.

Set **Site URL** to:

```text
https://questframe.vercel.app
```

Under **Redirect URLs**, keep/add exactly:

```text
http://localhost:3000/auth/callback
https://questframe.vercel.app/auth/callback
```

Save the settings. Do not use a temporary Vercel deployment URL as the permanent Site URL.

## 4. Install and check

```powershell
cd P:\Projects\QuestFrame\questframe
npm install
npm run typecheck
npm run lint
npm run build
```

Do not run `npm audit fix --force`.

## 5. Local check

```powershell
npm run dev
```

Check:

1. XP order is `+1`, `+5`, `+7`, `+10` on the public page, Player Guide and quest-step selector.
2. Local email login still returns to `http://localhost:3000/auth/callback`.
3. Expired/invalid links show a normal QuestFrame message instead of a raw auth error whenever the request reaches QuestFrame.

## 6. Git

```powershell
Ctrl + C
git status
git add .
git commit -m "fix: stabilize auth redirects and XP order"
git push
```

## 7. Production deploy

```powershell
npx vercel --prod
```

Open the stable alias, not the generated deployment URL:

```text
https://questframe.vercel.app
```

Request a **new** magic link after the Supabase URL settings are saved. Old links can remain invalid.

## 8. If localhost still shows an old Shelf Seasons offline page

That is stale browser storage/service-worker data from the old Shelf Seasons localhost development origin, not QuestFrame code. In Edge, open DevTools on the localhost page → **Application → Service Workers → Unregister**, then **Application → Storage → Clear site data**. This is only a local-browser cleanup.

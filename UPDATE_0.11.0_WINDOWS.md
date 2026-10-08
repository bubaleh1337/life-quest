# Life Quest 0.11.0 — Windows update

This release upgrades an existing 0.10.1 project to **Portfolio & Launch Readiness**.

## 1. Replace project files

Stop the dev server, then copy this archive over the existing project folder and replace files.

```text
P:\Projects\QuestFrame\questframe
```

No SQL migration is required.

## 2. Add one server-only environment variable

Open `.env.local` and add:

```env
SUPABASE_SECRET_KEY=YOUR_SECRET_KEY
```

Get the secret key from the existing Supabase project. Keep it only in `.env.local` and Vercel server environment variables. Never expose it as `NEXT_PUBLIC_*`.

Also make sure the existing values remain:

```env
NEXT_PUBLIC_APP_NAME=Life Quest
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false
```

For Vercel Production, `NEXT_PUBLIC_APP_URL` must use the stable production alias, not a one-off deployment hostname.

## 3. Install and validate

```powershell
cd P:\Projects\QuestFrame\questframe
npm install
npm run typecheck
npm run lint
npm run build
```

Do **not** run `npm audit fix --force`.

## 4. Install Playwright browser once

```powershell
npx playwright install chromium
npm run test:e2e
```

## 5. Test locally

```powershell
npm run dev
```

Check:

- `/` has `Посмотреть демо`;
- `/demo` opens without registration and contains realistic sample data;
- changes in Demo Mode work but disappear after refresh;
- account menu closes by clicking outside;
- `/privacy` is public;
- authenticated account menu contains Export, Privacy, Delete account and Sign out;
- JSON export downloads;
- delete-account confirmation opens but do not test on your main account.

## 6. Vercel env

Add the server-only variable to Production:

```text
SUPABASE_SECRET_KEY=<secret key>
```

Keep:

```text
NEXT_PUBLIC_APP_NAME=Life Quest
NEXT_PUBLIC_APP_URL=https://questframe.vercel.app
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false
```

Deploy after env changes.

## 7. Enable Google sign-in

The code is already ready. External provider configuration is still required.

1. In Google Auth Platform create a **Web application** OAuth client.
2. Add the production origin, e.g. `https://questframe.vercel.app`.
3. In Google Authorized redirect URIs add the Supabase Google callback shown in **Supabase → Authentication → Providers → Google**. It has the form:

```text
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

4. Put the Google Client ID and Client Secret into the Google provider settings in Supabase and enable the provider.
5. In **Supabase → Authentication → URL Configuration** keep:

```text
Site URL: https://questframe.vercel.app
Redirect URLs:
http://localhost:3000/auth/callback
https://questframe.vercel.app/auth/callback
```

6. Set in local `.env.local` and Vercel Production:

```env
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true
```

7. Redeploy and test Google sign-in in a private browser window.

## 8. Commit and deploy

```powershell
git status
git add .
git commit -m "feat: prepare Life Quest for public launch"
git push
npx vercel --prod
```

## 9. Branding cleanup after deployment

See `LAUNCH_1.0_CHECKLIST.md` for the optional repository/local-folder/Vercel-alias rename sequence.

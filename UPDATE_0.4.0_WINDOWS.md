# QuestFrame 0.4.0 — Windows update

This update is for an existing QuestFrame 0.3.0 project.

## 1. Stop the dev server

```powershell
Ctrl + C
```

## 2. Replace the project files

Copy the contents of the `questframe` folder from the 0.4.0 archive over your existing folder:

```text
P:\Projects\QuestFrame\questframe
```

Choose **Replace files in the destination** when Windows asks.

The archive does not contain `.env.local`, so the existing Supabase credentials remain untouched.

## 3. Supabase

No SQL migration is required for 0.4.0. Do not create a new Supabase project and do not rerun bootstrap SQL.

## 4. Refresh npm metadata

```powershell
cd P:\Projects\QuestFrame\questframe
npm install
```

Do not run:

```powershell
npm audit fix --force
```

## 5. Quality checks

```powershell
npm run typecheck
npm run lint
npm run build
```

All three commands should finish without errors.

## 6. Run locally

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

Check the following:

1. The public landing page opens in Russian on a new browser session and has an `EN` language button before login.
2. Switching language on the landing page is remembered on `/login` and later inside the app.
3. The login page itself has the language switcher and Russian text by default when there is no saved preference.
4. The navigation uses `Цепочки`, not `Серии`.
5. Each chain shows a start marker, visual links, a broken-link state for missed past days and a pending link for today.
6. A missed day does not reduce the total link count; later completed days continue the same chain.
7. `Справка` is renamed to `Гид игрока`.
8. The Player Guide contains only two author-contact buttons: Email and Telegram.
9. The rest of quest, boss, reward and date-mask behavior still works.

## 7. Git

After the checks pass:

```powershell
Ctrl + C

git status
git add .
git commit -m "feat: restore visual chains and localize entry flow"
git push
```

## 8. Production deploy

Because GitHub auto-deploy is not connected yet, deploy manually:

```powershell
npx vercel --prod
```

Production alias should remain:

```text
https://questframe.vercel.app
```

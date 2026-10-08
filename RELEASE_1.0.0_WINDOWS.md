# Life Quest 1.0.0 — final release

Production: https://lifequest-game.vercel.app
Repository: https://github.com/bubaleh1337/life-quest

## Update

Copy the contents of this archive over the existing project folder. No new Supabase SQL needs to be run: the launch-hardening migration included in the repository has already been applied to production.

```powershell
cd P:\Projects\QuestFrame\questframe
npm install
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

## Git

If the local remote still points to the old repository name:

```powershell
git remote set-url origin https://github.com/bubaleh1337/life-quest.git
git remote -v
```

Then release:

```powershell
git add .
git commit -m "release: Life Quest 1.0.0"
git push
npx vercel --prod
```

## Final smoke test

- landing and RU/EN toggle
- demo without sign-in
- Google sign-in
- email magic-link sign-in
- create/edit/complete/archive/restore quest
- chain check-in, undo and visible break
- weekly boss complete/undo
- reward preset/custom XP and claim/undo
- account menu closes on outside click and Escape
- JSON export
- privacy page
- permanent account deletion using a disposable test account
- old questframe.vercel.app redirects to lifequest-game.vercel.app

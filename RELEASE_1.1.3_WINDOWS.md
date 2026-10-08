# Life Quest 1.1.3 — Windows release

No Supabase migration is required for this release.

## Install

Extract the `questframe` folder over your existing local project, preserving `.env.local`.

```powershell
cd P:\Projects\QuestFrame\questframe
npm install
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

Expected result: no TypeScript/build errors and all Playwright tests pass.

## Release

```powershell
git add .
git commit -m "fix: refine League copy and trophy card"
git push
npx vercel --prod
```

# Life Quest 1.1.4 — Windows release

Cosmetic copy/UI hotfix. No Supabase migration is required.

```powershell
cd P:\Projects\QuestFrame\questframe
npm install
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

If all checks pass:

```powershell
git add .
git commit -m "fix: simplify League copy and reward XP field"
git push
npx vercel --prod
```

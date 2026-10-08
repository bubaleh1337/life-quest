# Life Quest 1.1.0 — League

The production Supabase migration has already been applied through the connected Supabase project. The migration files remain in the repository as source of truth.

## Update

```powershell
cd P:\Projects\QuestFrame\questframe
npm install
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

## Verify

- League tab appears between Rewards and Player Guide.
- League is opt-in and asks for a public nickname.
- Completing a step after joining increases weekly League XP.
- Undoing that step removes the same weekly XP.
- Top 10 and personal rank render correctly.
- League nickname can be changed.
- Leaving the League requires confirmation.
- Demo League can be joined without persistence.
- Badge share action works (native share where supported; otherwise saves a PNG and copies share text).

## Release

```powershell
git add .
git commit -m "feat: add Life Quest weekly League"
git push
npx vercel --prod
```

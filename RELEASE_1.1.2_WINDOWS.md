# Life Quest 1.1.2 — Windows release

No Supabase migration is required for this release. The production League schema from 1.1.0 remains unchanged.

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

## Manual smoke test

1. Open Demo → League and join with any nickname.
2. Confirm the League page ends after **Your place** and the **Leave League** button is inside that card.
3. Confirm top-three rows use trophy icons instead of geometric symbols.
4. Open avatar → **Profile**. Confirm League name editing and **Your trophies** are there.
5. Click **Share badge**. The downloaded image should be portrait 1080×1920, with no raw URL printed on the artwork.
6. Check the Profile sheet and League page on mobile width.

## Release

```powershell
git add .
git commit -m "fix: polish League profile and trophy sharing"
git push
npx vercel --prod
```

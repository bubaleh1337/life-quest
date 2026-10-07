# Life Quest 0.9.0 — visual delight update

This release is UI-only. No Supabase migration is required.

## Update

1. Stop the dev server.
2. Copy the archive files over your existing project.
3. Run:

```powershell
cd P:\Projects\QuestFrame\questframe
npm install
npm run typecheck
npm run lint
npm run build
```

4. Start locally:

```powershell
npm run dev
```

## Check

- ambient non-flat background
- smooth tab transitions
- card hover polish on desktop
- active navigation dot
- unlocked reward shimmer
- mobile dock press feedback
- animations stop when reduced-motion is enabled

## Git + production

```powershell
git add .
git commit -m "feat: add Life Quest delight polish"
git push
npx vercel --prod
```

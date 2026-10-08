# Life Quest 0.11.1 — account menu hotfix

This release only fixes the profile/account dropdown visual layering.

No SQL migration is required. Do not change Supabase.

```powershell
cd P:\Projects\QuestFrame\questframe
npm install
npm run typecheck
npm run lint
npm run build
```

Then test locally:

```powershell
npm run dev
```

Check that the account dropdown is fully opaque/readable, appears above all dashboard cards and closes when clicking outside it.

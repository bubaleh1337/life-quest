# Life Quest 0.9.1 update

Fixes:
- visibly non-monochrome ambient background
- profile menu closes when clicking anywhere outside it

No SQL migration. Supabase is untouched.

```powershell
cd P:\Projects\QuestFrame\questframe
npm install
npm run typecheck
npm run lint
npm run build
```

Then run `npm run dev` and test the profile menu by opening it and clicking the page background, a card and the header.

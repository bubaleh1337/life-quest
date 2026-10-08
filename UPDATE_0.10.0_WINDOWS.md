# Life Quest 0.10.0 update

## What changed
- fixed the flat strip at the top of the page
- added a reward XP planner with presets and live formula
- new rewards are calculated as: current total XP + selected reward cost
- existing rewards remain untouched

## Install
```powershell
cd P:\Projects\QuestFrame\questframe
npm install
npm run typecheck
npm run lint
npm run build
```

No SQL migration is required. Supabase schema is unchanged.

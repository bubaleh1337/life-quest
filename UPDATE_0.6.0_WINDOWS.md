# QuestFrame 0.6.0 — Windows update

This update is for an existing QuestFrame 0.5.0 project.

## 1. Stop the local server

```powershell
Ctrl + C
```

## 2. Replace project files

Copy the contents of the `questframe` folder from the 0.6.0 archive over:

```text
P:\Projects\QuestFrame\questframe
```

Choose **Replace files in the destination**. The archive does not contain `.env.local`, so your Supabase secrets/settings stay untouched.

## 3. Supabase

**No SQL migration is required for 0.6.0.** Do not create a new Supabase project and do not rerun bootstrap SQL.

## 4. Refresh dependencies and run quality checks

```powershell
cd P:\Projects\QuestFrame\questframe
npm install
npm run typecheck
npm run lint
npm run build
```

Do not run `npm audit fix --force`.

## 5. Run locally

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

Regression checklist:

1. Open **Цепочки** and confirm links look like overlapping metallic chain links rather than ovals connected by bars.
2. A missed past day must show two visibly separated broken metal halves with small particles/sparkles.
3. Today's pending link should be a softly animated wine/silver outline.
4. Mark a chain for today: the new link should snap into place and play a short metallic clink when sound is enabled.
5. Complete a quest step: a floating `+XP` pill should appear and a short success cue should play.
6. Defeat the weekly boss: `+25 XP` feedback and the stronger victory cue should play.
7. Claim an unlocked reward: the card should receive a short glossy celebration and reward cue.
8. Use the speaker button in the header to turn sound off; refresh the page and confirm the preference is remembered.
9. In **Гид игрока**, confirm the Sound card can also toggle audio.
10. Turn sound off and repeat chain/XP actions: they must work normally without audio.
11. Existing confirmations, archive/restore, account-menu sign-out protection and auth behavior from 0.5.0 must still work.
12. Check desktop and mobile widths; the chain history must remain horizontally scrollable instead of breaking the layout.

## 6. Git

After checks pass:

```powershell
Ctrl + C
git status
git add .
git commit -m "feat: add Glossy Game interactions and chain redesign"
git push
```

## 7. Production

GitHub auto-deploy is not required; deploy the tested source manually:

```powershell
npx vercel --prod
```

Production alias should remain:

```text
https://questframe.vercel.app
```

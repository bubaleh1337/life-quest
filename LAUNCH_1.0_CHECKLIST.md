# Life Quest — 1.0 launch checklist

## Product

- [x] Core quest → action → XP → level loop
- [x] Weekly boss
- [x] Multiple non-resetting chains
- [x] Rewards with presets + custom XP
- [x] RU/EN
- [x] Responsive desktop/mobile UI
- [x] Public interactive Demo Mode
- [x] Privacy page
- [x] JSON data export
- [x] Permanent account deletion
- [x] Playwright launch smoke tests
- [ ] Google provider configured in Supabase + Google Auth Platform
- [ ] Production account deletion tested with a disposable account
- [ ] Production JSON export tested

## Final brand cleanup

The product already displays **Life Quest**. The remaining legacy names are infrastructure identifiers only.

### GitHub repository

Recommended final name:

```text
bubaleh1337/life-quest
```

Rename in GitHub: **Repository → Settings → General → Repository name**.

Then update local remote:

```powershell
git remote set-url origin https://github.com/bubaleh1337/life-quest.git
git remote -v
```

### Local folder

Optional, but cleaner for portfolio screenshots and terminal logs:

```powershell
cd P:\Projects
Rename-Item QuestFrame LifeQuest
cd P:\Projects\LifeQuest\questframe
```

You can also rename the inner `questframe` folder to `life-quest` after closing editors/terminals that use it.

### Vercel alias

The current `questframe.vercel.app` can remain live during migration. After reserving a Life Quest alias/domain in Vercel, update:

```text
NEXT_PUBLIC_APP_URL=https://YOUR_NEW_STABLE_DOMAIN
```

Then update Supabase **Site URL** and **Redirect URLs** to the same stable domain and redeploy.

Do not switch `NEXT_PUBLIC_APP_URL` to a temporary deployment hostname.

## QA before 1.0.0

Run:

```powershell
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

Manual regression:

- [ ] Email magic-link login
- [ ] Google login
- [ ] Create/edit/complete/archive/restore quest
- [ ] Add/undo step completion and XP
- [ ] Set/defeat/undo weekly boss
- [ ] Create/check/undo/finish/restore chain
- [ ] Add reward via each preset and custom XP
- [ ] Claim/undo/delete reward
- [ ] Sound on/off persists
- [ ] RU/EN persists
- [ ] Export downloads only current user's data
- [ ] Delete account removes access and all app rows
- [ ] Demo never writes to real account data
- [ ] Mobile layout at ~390px
- [ ] Desktop layout at ~1440px

When these are green, bump package version to **1.0.0** and create the release tag.

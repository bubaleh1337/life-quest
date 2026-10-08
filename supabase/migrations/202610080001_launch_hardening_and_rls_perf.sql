-- Life Quest 1.0 launch hardening.
-- Applied to the production Supabase project before the 1.0 release.

revoke execute on function public.handle_new_user() from anon, authenticated, public;

create index if not exists chains_user_id_idx on public.chains(user_id);
create index if not exists chains_quest_id_idx on public.chains(quest_id);
create index if not exists quest_steps_user_id_idx on public.quest_steps(user_id);

drop policy if exists profiles_owner_all on public.profiles;
create policy profiles_owner_all on public.profiles
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists quests_owner_all on public.quests;
create policy quests_owner_all on public.quests
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists quest_steps_owner_select on public.quest_steps;
create policy quest_steps_owner_select on public.quest_steps
for select to authenticated
using (
  (select auth.uid()) = user_id
  and exists (select 1 from public.quests q where q.id = quest_id and q.user_id = (select auth.uid()))
);

drop policy if exists quest_steps_owner_insert on public.quest_steps;
create policy quest_steps_owner_insert on public.quest_steps
for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (select 1 from public.quests q where q.id = quest_id and q.user_id = (select auth.uid()))
);

drop policy if exists quest_steps_owner_update on public.quest_steps;
create policy quest_steps_owner_update on public.quest_steps
for update to authenticated
using (
  (select auth.uid()) = user_id
  and exists (select 1 from public.quests q where q.id = quest_id and q.user_id = (select auth.uid()))
)
with check (
  (select auth.uid()) = user_id
  and exists (select 1 from public.quests q where q.id = quest_id and q.user_id = (select auth.uid()))
);

drop policy if exists quest_steps_owner_delete on public.quest_steps;
create policy quest_steps_owner_delete on public.quest_steps
for delete to authenticated
using (
  (select auth.uid()) = user_id
  and exists (select 1 from public.quests q where q.id = quest_id and q.user_id = (select auth.uid()))
);

drop policy if exists bosses_owner_all on public.weekly_bosses;
create policy bosses_owner_all on public.weekly_bosses
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists chains_owner_select on public.chains;
create policy chains_owner_select on public.chains
for select to authenticated
using (
  (select auth.uid()) = user_id
  and (quest_id is null or exists (select 1 from public.quests q where q.id = quest_id and q.user_id = (select auth.uid())))
);

drop policy if exists chains_owner_insert on public.chains;
create policy chains_owner_insert on public.chains
for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and (quest_id is null or exists (select 1 from public.quests q where q.id = quest_id and q.user_id = (select auth.uid())))
);

drop policy if exists chains_owner_update on public.chains;
create policy chains_owner_update on public.chains
for update to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (quest_id is null or exists (select 1 from public.quests q where q.id = quest_id and q.user_id = (select auth.uid())))
);

drop policy if exists chains_owner_delete on public.chains;
create policy chains_owner_delete on public.chains
for delete to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists checkins_owner_select on public.chain_checkins;
create policy checkins_owner_select on public.chain_checkins
for select to authenticated
using (
  (select auth.uid()) = user_id
  and exists (select 1 from public.chains c where c.id = chain_id and c.user_id = (select auth.uid()))
);

drop policy if exists checkins_owner_insert on public.chain_checkins;
create policy checkins_owner_insert on public.chain_checkins
for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (select 1 from public.chains c where c.id = chain_id and c.user_id = (select auth.uid()))
);

drop policy if exists checkins_owner_update on public.chain_checkins;
create policy checkins_owner_update on public.chain_checkins
for update to authenticated
using (
  (select auth.uid()) = user_id
  and exists (select 1 from public.chains c where c.id = chain_id and c.user_id = (select auth.uid()))
)
with check (
  (select auth.uid()) = user_id
  and exists (select 1 from public.chains c where c.id = chain_id and c.user_id = (select auth.uid()))
);

drop policy if exists checkins_owner_delete on public.chain_checkins;
create policy checkins_owner_delete on public.chain_checkins
for delete to authenticated
using (
  (select auth.uid()) = user_id
  and exists (select 1 from public.chains c where c.id = chain_id and c.user_id = (select auth.uid()))
);

drop policy if exists rewards_owner_all on public.rewards;
create policy rewards_owner_all on public.rewards
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

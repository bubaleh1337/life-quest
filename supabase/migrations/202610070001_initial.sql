-- QuestFrame 0.1.0
-- Initial schema for one Supabase project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text check (description is null or char_length(description) <= 600),
  category text check (category is null or char_length(category) <= 50),
  accent text not null default '#7a3d5c' check (accent ~ '^#[0-9A-Fa-f]{6}$'),
  status text not null default 'active' check (status in ('active','completed','archived')),
  target_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quest_steps (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid not null references public.quests(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 180),
  xp_value integer not null check (xp_value in (1,3,5,10)),
  xp_reason text not null check (xp_reason in ('step','hard','promise','procrastination')),
  sort_order integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_bosses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  title text not null check (char_length(title) between 1 and 180),
  notes text check (notes is null or char_length(notes) <= 600),
  xp_value integer not null default 25 check (xp_value between 1 and 100),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create table if not exists public.chains (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quest_id uuid references public.quests(id) on delete set null,
  title text not null check (char_length(title) between 1 and 180),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists one_active_chain_per_user
  on public.chains(user_id)
  where active = true;

create table if not exists public.chain_checkins (
  id uuid primary key default gen_random_uuid(),
  chain_id uuid not null references public.chains(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null,
  created_at timestamptz not null default now(),
  unique(chain_id, checkin_date)
);

create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 180),
  xp_required integer not null check (xp_required between 1 and 1000000),
  claimed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quests_user_status_idx on public.quests(user_id, status, created_at desc);
create index if not exists quest_steps_quest_idx on public.quest_steps(quest_id, sort_order, created_at);
create index if not exists chain_checkins_user_date_idx on public.chain_checkins(user_id, checkin_date desc);
create index if not exists rewards_user_xp_idx on public.rewards(user_id, xp_required);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles(user_id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1))
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create or replace function public.ensure_step_owner_matches_quest()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.quests q
    where q.id = new.quest_id and q.user_id = new.user_id
  ) then
    raise exception 'Quest step owner must match quest owner';
  end if;
  return new;
end;
$$;

create or replace function public.ensure_chain_owner_matches_quest()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.quest_id is not null and not exists (
    select 1 from public.quests q
    where q.id = new.quest_id and q.user_id = new.user_id
  ) then
    raise exception 'Chain owner must match quest owner';
  end if;
  return new;
end;
$$;

create or replace function public.ensure_checkin_owner_matches_chain()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.chains c
    where c.id = new.chain_id and c.user_id = new.user_id
  ) then
    raise exception 'Chain check-in owner must match chain owner';
  end if;
  return new;
end;
$$;

-- Triggers are dropped first so this migration is safe to re-run during setup.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles
for each row execute procedure public.touch_updated_at();

drop trigger if exists quests_touch_updated_at on public.quests;
create trigger quests_touch_updated_at before update on public.quests
for each row execute procedure public.touch_updated_at();

drop trigger if exists quest_steps_touch_updated_at on public.quest_steps;
create trigger quest_steps_touch_updated_at before update on public.quest_steps
for each row execute procedure public.touch_updated_at();

drop trigger if exists weekly_bosses_touch_updated_at on public.weekly_bosses;
create trigger weekly_bosses_touch_updated_at before update on public.weekly_bosses
for each row execute procedure public.touch_updated_at();

drop trigger if exists chains_touch_updated_at on public.chains;
create trigger chains_touch_updated_at before update on public.chains
for each row execute procedure public.touch_updated_at();

drop trigger if exists rewards_touch_updated_at on public.rewards;
create trigger rewards_touch_updated_at before update on public.rewards
for each row execute procedure public.touch_updated_at();

drop trigger if exists quest_steps_owner_guard on public.quest_steps;
create trigger quest_steps_owner_guard before insert or update on public.quest_steps
for each row execute procedure public.ensure_step_owner_matches_quest();

drop trigger if exists chains_owner_guard on public.chains;
create trigger chains_owner_guard before insert or update on public.chains
for each row execute procedure public.ensure_chain_owner_matches_quest();

drop trigger if exists chain_checkins_owner_guard on public.chain_checkins;
create trigger chain_checkins_owner_guard before insert or update on public.chain_checkins
for each row execute procedure public.ensure_checkin_owner_matches_chain();

alter table public.profiles enable row level security;
alter table public.quests enable row level security;
alter table public.quest_steps enable row level security;
alter table public.weekly_bosses enable row level security;
alter table public.chains enable row level security;
alter table public.chain_checkins enable row level security;
alter table public.rewards enable row level security;

-- Remove old policies when re-running during local setup.
drop policy if exists profiles_owner_all on public.profiles;
drop policy if exists quests_owner_all on public.quests;
drop policy if exists quest_steps_owner_select on public.quest_steps;
drop policy if exists quest_steps_owner_insert on public.quest_steps;
drop policy if exists quest_steps_owner_update on public.quest_steps;
drop policy if exists quest_steps_owner_delete on public.quest_steps;
drop policy if exists bosses_owner_all on public.weekly_bosses;
drop policy if exists chains_owner_select on public.chains;
drop policy if exists chains_owner_insert on public.chains;
drop policy if exists chains_owner_update on public.chains;
drop policy if exists chains_owner_delete on public.chains;
drop policy if exists checkins_owner_select on public.chain_checkins;
drop policy if exists checkins_owner_insert on public.chain_checkins;
drop policy if exists checkins_owner_update on public.chain_checkins;
drop policy if exists checkins_owner_delete on public.chain_checkins;
drop policy if exists rewards_owner_all on public.rewards;

create policy profiles_owner_all on public.profiles
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy quests_owner_all on public.quests
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy quest_steps_owner_select on public.quest_steps
for select using (
  auth.uid() = user_id and exists (
    select 1 from public.quests q where q.id = quest_id and q.user_id = auth.uid()
  )
);
create policy quest_steps_owner_insert on public.quest_steps
for insert with check (
  auth.uid() = user_id and exists (
    select 1 from public.quests q where q.id = quest_id and q.user_id = auth.uid()
  )
);
create policy quest_steps_owner_update on public.quest_steps
for update using (
  auth.uid() = user_id and exists (
    select 1 from public.quests q where q.id = quest_id and q.user_id = auth.uid()
  )
) with check (
  auth.uid() = user_id and exists (
    select 1 from public.quests q where q.id = quest_id and q.user_id = auth.uid()
  )
);
create policy quest_steps_owner_delete on public.quest_steps
for delete using (
  auth.uid() = user_id and exists (
    select 1 from public.quests q where q.id = quest_id and q.user_id = auth.uid()
  )
);

create policy bosses_owner_all on public.weekly_bosses
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy chains_owner_select on public.chains
for select using (
  auth.uid() = user_id and (quest_id is null or exists (
    select 1 from public.quests q where q.id = quest_id and q.user_id = auth.uid()
  ))
);
create policy chains_owner_insert on public.chains
for insert with check (
  auth.uid() = user_id and (quest_id is null or exists (
    select 1 from public.quests q where q.id = quest_id and q.user_id = auth.uid()
  ))
);
create policy chains_owner_update on public.chains
for update using (auth.uid() = user_id)
with check (
  auth.uid() = user_id and (quest_id is null or exists (
    select 1 from public.quests q where q.id = quest_id and q.user_id = auth.uid()
  ))
);
create policy chains_owner_delete on public.chains
for delete using (auth.uid() = user_id);

create policy checkins_owner_select on public.chain_checkins
for select using (
  auth.uid() = user_id and exists (
    select 1 from public.chains c where c.id = chain_id and c.user_id = auth.uid()
  )
);
create policy checkins_owner_insert on public.chain_checkins
for insert with check (
  auth.uid() = user_id and exists (
    select 1 from public.chains c where c.id = chain_id and c.user_id = auth.uid()
  )
);
create policy checkins_owner_update on public.chain_checkins
for update using (
  auth.uid() = user_id and exists (
    select 1 from public.chains c where c.id = chain_id and c.user_id = auth.uid()
  )
) with check (
  auth.uid() = user_id and exists (
    select 1 from public.chains c where c.id = chain_id and c.user_id = auth.uid()
  )
);
create policy checkins_owner_delete on public.chain_checkins
for delete using (
  auth.uid() = user_id and exists (
    select 1 from public.chains c where c.id = chain_id and c.user_id = auth.uid()
  )
);

create policy rewards_owner_all on public.rewards
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Keep privileges explicit; RLS still applies.
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.quests to authenticated;
grant select, insert, update, delete on public.quest_steps to authenticated;
grant select, insert, update, delete on public.weekly_bosses to authenticated;
grant select, insert, update, delete on public.chains to authenticated;
grant select, insert, update, delete on public.chain_checkins to authenticated;
grant select, insert, update, delete on public.rewards to authenticated;

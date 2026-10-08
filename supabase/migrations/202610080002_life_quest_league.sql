-- Life Quest 1.1.0 — voluntary weekly League.
-- Weekly score rows are ephemeral: when a new week is first opened, the previous
-- week is finalized, podium badges are persisted, and old score rows are deleted.

create table if not exists public.league_memberships (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(btrim(nickname)) between 2 and 24),
  active boolean not null default true,
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.league_weekly_scores (
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  xp integer not null default 0 check (xp >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, week_start)
);

create table if not exists public.league_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  place smallint not null check (place between 1 and 3),
  weekly_xp integer not null check (weekly_xp > 0),
  created_at timestamptz not null default now(),
  unique (user_id, week_start),
  unique (week_start, place)
);

create index if not exists league_scores_week_rank_idx
  on public.league_weekly_scores(week_start, xp desc, updated_at asc);
create index if not exists league_badges_user_week_idx
  on public.league_badges(user_id, week_start desc);

alter table public.league_memberships enable row level security;
alter table public.league_weekly_scores enable row level security;
alter table public.league_badges enable row level security;

drop policy if exists league_memberships_owner_select on public.league_memberships;
drop policy if exists league_memberships_owner_insert on public.league_memberships;
drop policy if exists league_memberships_owner_update on public.league_memberships;
drop policy if exists league_memberships_owner_delete on public.league_memberships;
drop policy if exists league_scores_owner_select on public.league_weekly_scores;
drop policy if exists league_badges_owner_select on public.league_badges;

create policy league_memberships_owner_select on public.league_memberships
for select to authenticated
using ((select auth.uid()) = user_id);

create policy league_memberships_owner_insert on public.league_memberships
for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy league_memberships_owner_update on public.league_memberships
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy league_memberships_owner_delete on public.league_memberships
for delete to authenticated
using ((select auth.uid()) = user_id);

create policy league_scores_owner_select on public.league_weekly_scores
for select to authenticated
using ((select auth.uid()) = user_id);

create policy league_badges_owner_select on public.league_badges
for select to authenticated
using ((select auth.uid()) = user_id);

-- Clients may read only their own weekly score/badges through RLS. Score/badge writes
-- are reserved for trusted trigger/RPC functions.
revoke insert, update, delete on public.league_weekly_scores from anon, authenticated;
revoke insert, update, delete on public.league_badges from anon, authenticated;

grant select on public.league_weekly_scores to authenticated;
grant select on public.league_badges to authenticated;
grant select, insert, update, delete on public.league_memberships to authenticated;

create or replace function public.league_current_week()
returns date
language sql
stable
set search_path = public
as $$
  select date_trunc('week', now() at time zone 'UTC')::date;
$$;

create or replace function public.league_adjust_score(
  p_user_id uuid,
  p_delta integer,
  p_completed_at timestamptz,
  p_require_active boolean default true
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_week date := public.league_current_week();
  v_event_week date;
  v_active boolean;
begin
  if p_user_id is null or p_delta = 0 or p_completed_at is null then
    return;
  end if;

  v_event_week := date_trunc('week', p_completed_at at time zone 'UTC')::date;
  if v_event_week <> v_week then
    return;
  end if;

  if p_delta > 0 and p_require_active then
    select active into v_active
    from public.league_memberships
    where user_id = p_user_id;

    if coalesce(v_active, false) is false then
      return;
    end if;
  end if;

  if p_delta > 0 then
    insert into public.league_weekly_scores(user_id, week_start, xp, updated_at)
    values (p_user_id, v_week, p_delta, now())
    on conflict (user_id, week_start)
    do update set
      xp = greatest(0, public.league_weekly_scores.xp + excluded.xp),
      updated_at = now();
  else
    update public.league_weekly_scores
    set xp = greatest(0, xp + p_delta), updated_at = now()
    where user_id = p_user_id and week_start = v_week;
  end if;
end;
$$;

create or replace function public.league_score_step_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.completed_at is not null then
      perform public.league_adjust_score(new.user_id, new.xp_value, new.completed_at, true);
    end if;
    return new;
  end if;

  if tg_op = 'DELETE' then
    if old.completed_at is not null then
      perform public.league_adjust_score(old.user_id, -old.xp_value, old.completed_at, false);
    end if;
    return old;
  end if;

  if old.completed_at is null and new.completed_at is not null then
    perform public.league_adjust_score(new.user_id, new.xp_value, new.completed_at, true);
  elsif old.completed_at is not null and new.completed_at is null then
    perform public.league_adjust_score(old.user_id, -old.xp_value, old.completed_at, false);
  elsif old.completed_at is not null and new.completed_at is not null
        and (old.completed_at is distinct from new.completed_at or old.xp_value is distinct from new.xp_value) then
    perform public.league_adjust_score(old.user_id, -old.xp_value, old.completed_at, false);
    perform public.league_adjust_score(new.user_id, new.xp_value, new.completed_at, false);
  end if;

  return new;
end;
$$;

create or replace function public.league_score_boss_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.completed_at is not null then
      perform public.league_adjust_score(new.user_id, new.xp_value, new.completed_at, true);
    end if;
    return new;
  end if;

  if tg_op = 'DELETE' then
    if old.completed_at is not null then
      perform public.league_adjust_score(old.user_id, -old.xp_value, old.completed_at, false);
    end if;
    return old;
  end if;

  if old.completed_at is null and new.completed_at is not null then
    perform public.league_adjust_score(new.user_id, new.xp_value, new.completed_at, true);
  elsif old.completed_at is not null and new.completed_at is null then
    perform public.league_adjust_score(old.user_id, -old.xp_value, old.completed_at, false);
  elsif old.completed_at is not null and new.completed_at is not null
        and (old.completed_at is distinct from new.completed_at or old.xp_value is distinct from new.xp_value) then
    perform public.league_adjust_score(old.user_id, -old.xp_value, old.completed_at, false);
    perform public.league_adjust_score(new.user_id, new.xp_value, new.completed_at, false);
  end if;

  return new;
end;
$$;

drop trigger if exists league_quest_step_score on public.quest_steps;
create trigger league_quest_step_score
after insert or update or delete on public.quest_steps
for each row execute function public.league_score_step_change();

drop trigger if exists league_boss_score on public.weekly_bosses;
create trigger league_boss_score
after insert or update or delete on public.weekly_bosses
for each row execute function public.league_score_boss_change();

create or replace function public.league_finalize_old_weeks()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_week date := public.league_current_week();
  v_week date;
begin
  for v_week in
    select distinct week_start
    from public.league_weekly_scores
    where week_start < v_current_week
    order by week_start
  loop
    if not exists (select 1 from public.league_badges b where b.week_start = v_week) then
      insert into public.league_badges(user_id, week_start, place, weekly_xp)
      select ranked.user_id, v_week, ranked.place, ranked.xp
      from (
        select
          s.user_id,
          s.xp,
          row_number() over (
            order by s.xp desc, s.updated_at asc, m.joined_at asc, s.user_id
          ) as place
        from public.league_weekly_scores s
        join public.league_memberships m on m.user_id = s.user_id
        where s.week_start = v_week
          and s.xp > 0
          and m.active = true
      ) ranked
      where ranked.place <= 3
      on conflict do nothing;
    end if;

    -- Only podium badges survive. The weekly ranking itself is intentionally ephemeral.
    delete from public.league_weekly_scores where week_start = v_week;
  end loop;
end;
$$;

create or replace function public.league_join(p_nickname text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_nickname text := btrim(coalesce(p_nickname, ''));
begin
  if v_user is null then
    raise exception 'Authentication required';
  end if;
  if char_length(v_nickname) < 2 or char_length(v_nickname) > 24 then
    raise exception 'Nickname must be 2-24 characters';
  end if;
  if v_nickname ~ '[[:cntrl:]]' then
    raise exception 'Nickname contains invalid characters';
  end if;

  perform public.league_finalize_old_weeks();

  insert into public.league_memberships(user_id, nickname, active, joined_at, updated_at)
  values (v_user, v_nickname, true, now(), now())
  on conflict (user_id)
  do update set nickname = excluded.nickname, active = true, updated_at = now();
end;
$$;

create or replace function public.league_update_nickname(p_nickname text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_nickname text := btrim(coalesce(p_nickname, ''));
begin
  if v_user is null then
    raise exception 'Authentication required';
  end if;
  if char_length(v_nickname) < 2 or char_length(v_nickname) > 24 then
    raise exception 'Nickname must be 2-24 characters';
  end if;
  if v_nickname ~ '[[:cntrl:]]' then
    raise exception 'Nickname contains invalid characters';
  end if;

  update public.league_memberships
  set nickname = v_nickname, updated_at = now()
  where user_id = v_user;
end;
$$;

create or replace function public.league_leave()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
begin
  if v_user is null then
    raise exception 'Authentication required';
  end if;

  -- Finalize any completed week before changing eligibility for the current user.
  perform public.league_finalize_old_weeks();

  update public.league_memberships
  set active = false, updated_at = now()
  where user_id = v_user;
end;
$$;

create or replace function public.league_snapshot()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_week date := public.league_current_week();
  v_member jsonb;
  v_top jsonb;
  v_me jsonb;
  v_badges jsonb;
  v_count integer;
begin
  if v_user is null then
    raise exception 'Authentication required';
  end if;

  perform public.league_finalize_old_weeks();

  select jsonb_build_object(
    'active', m.active,
    'nickname', m.nickname,
    'joined_at', m.joined_at
  )
  into v_member
  from public.league_memberships m
  where m.user_id = v_user;

  with participants as (
    select
      m.user_id,
      m.nickname,
      coalesce(s.xp, 0)::integer as weekly_xp,
      m.joined_at,
      s.updated_at
    from public.league_memberships m
    left join public.league_weekly_scores s
      on s.user_id = m.user_id and s.week_start = v_week
    where m.active = true
  ), ranked as (
    select
      user_id,
      nickname,
      weekly_xp,
      row_number() over (
        order by weekly_xp desc, updated_at asc nulls last, joined_at asc, user_id
      )::integer as rank
    from participants
  )
  select
    coalesce(jsonb_agg(jsonb_build_object(
      'rank', rank,
      'nickname', nickname,
      'weekly_xp', weekly_xp,
      'is_me', user_id = v_user
    ) order by rank) filter (where rank <= 10), '[]'::jsonb),
    count(*)::integer
  into v_top, v_count
  from ranked;

  with participants as (
    select
      m.user_id,
      m.nickname,
      coalesce(s.xp, 0)::integer as weekly_xp,
      m.joined_at,
      s.updated_at
    from public.league_memberships m
    left join public.league_weekly_scores s
      on s.user_id = m.user_id and s.week_start = v_week
    where m.active = true
  ), ranked as (
    select
      user_id,
      nickname,
      weekly_xp,
      row_number() over (
        order by weekly_xp desc, updated_at asc nulls last, joined_at asc, user_id
      )::integer as rank
    from participants
  ), me as (
    select * from ranked where user_id = v_user
  )
  select jsonb_build_object(
    'rank', me.rank,
    'nickname', me.nickname,
    'weekly_xp', me.weekly_xp,
    'xp_to_next', case
      when me.rank is null or me.rank = 1 then 0
      else greatest(1, coalesce((select r.weekly_xp from ranked r where r.rank = me.rank - 1), me.weekly_xp) - me.weekly_xp + 1)
    end
  )
  into v_me
  from me;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id,
    'week_start', b.week_start,
    'place', b.place,
    'weekly_xp', b.weekly_xp,
    'created_at', b.created_at
  ) order by b.week_start desc), '[]'::jsonb)
  into v_badges
  from public.league_badges b
  where b.user_id = v_user;

  return jsonb_build_object(
    'week_start', v_week,
    'week_end', v_week + 7,
    'member', v_member,
    'top', coalesce(v_top, '[]'::jsonb),
    'me', v_me,
    'participants', coalesce(v_count, 0),
    'badges', coalesce(v_badges, '[]'::jsonb)
  );
end;
$$;

-- Harden all privileged helpers: only the intended RPCs are callable from clients.
revoke execute on function public.league_current_week() from anon, authenticated, public;
revoke execute on function public.league_adjust_score(uuid, integer, timestamptz, boolean) from anon, authenticated, public;
revoke execute on function public.league_score_step_change() from anon, authenticated, public;
revoke execute on function public.league_score_boss_change() from anon, authenticated, public;
revoke execute on function public.league_finalize_old_weeks() from anon, authenticated, public;
revoke execute on function public.league_join(text) from anon, public;
revoke execute on function public.league_update_nickname(text) from anon, public;
revoke execute on function public.league_leave() from anon, public;
revoke execute on function public.league_snapshot() from anon, public;

grant execute on function public.league_join(text) to authenticated;
grant execute on function public.league_update_nickname(text) to authenticated;
grant execute on function public.league_leave() to authenticated;
grant execute on function public.league_snapshot() to authenticated;

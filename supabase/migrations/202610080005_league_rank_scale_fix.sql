-- Keep ranking scalable: calculate row_number as bigint/integer-compatible and only cast when inserting top 3.
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
          row_number() over (order by s.xp desc, s.updated_at asc, m.joined_at asc, s.user_id) as place
        from public.league_weekly_scores s
        join public.league_memberships m on m.user_id = s.user_id
        where s.week_start = v_week and s.xp > 0 and m.active = true
      ) ranked
      where ranked.place <= 3
      on conflict do nothing;
    end if;

    delete from public.league_weekly_scores where week_start = v_week;
  end loop;
end;
$$;

revoke execute on function public.league_finalize_old_weeks() from anon, authenticated, public;

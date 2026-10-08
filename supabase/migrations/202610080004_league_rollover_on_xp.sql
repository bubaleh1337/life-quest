-- Finalize/purge the previous League week on the first XP activity of a new week.
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

  perform public.league_finalize_old_weeks();

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

revoke execute on function public.league_adjust_score(uuid, integer, timestamptz, boolean)
from anon, authenticated, public;

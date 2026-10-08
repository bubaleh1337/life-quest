-- Only active League participants may read the shared leaderboard.
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
  if v_user is null then raise exception 'Authentication required'; end if;

  perform public.league_finalize_old_weeks();

  select jsonb_build_object('active',m.active,'nickname',m.nickname,'joined_at',m.joined_at)
  into v_member
  from public.league_memberships m
  where m.user_id=v_user;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id',b.id,'week_start',b.week_start,'place',b.place,'weekly_xp',b.weekly_xp,'created_at',b.created_at
  ) order by b.week_start desc),'[]'::jsonb)
  into v_badges
  from public.league_badges b
  where b.user_id=v_user;

  if v_member is null or coalesce((v_member->>'active')::boolean,false) is false then
    return jsonb_build_object(
      'week_start',v_week,
      'week_end',v_week+7,
      'member',v_member,
      'top','[]'::jsonb,
      'me',null,
      'participants',0,
      'badges',coalesce(v_badges,'[]'::jsonb)
    );
  end if;

  with participants as (
    select m.user_id,m.nickname,coalesce(s.xp,0)::integer as weekly_xp,m.joined_at,s.updated_at
    from public.league_memberships m
    left join public.league_weekly_scores s on s.user_id=m.user_id and s.week_start=v_week
    where m.active=true
  ), ranked as (
    select user_id,nickname,weekly_xp,row_number() over(order by weekly_xp desc,updated_at asc nulls last,joined_at asc,user_id)::integer as rank
    from participants
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'rank',rank,'nickname',nickname,'weekly_xp',weekly_xp,'is_me',user_id=v_user
  ) order by rank) filter(where rank<=10),'[]'::jsonb),count(*)::integer
  into v_top,v_count
  from ranked;

  with participants as (
    select m.user_id,m.nickname,coalesce(s.xp,0)::integer as weekly_xp,m.joined_at,s.updated_at
    from public.league_memberships m
    left join public.league_weekly_scores s on s.user_id=m.user_id and s.week_start=v_week
    where m.active=true
  ), ranked as (
    select user_id,nickname,weekly_xp,row_number() over(order by weekly_xp desc,updated_at asc nulls last,joined_at asc,user_id)::integer as rank
    from participants
  ), me as (select * from ranked where user_id=v_user)
  select jsonb_build_object(
    'rank',me.rank,
    'nickname',me.nickname,
    'weekly_xp',me.weekly_xp,
    'xp_to_next',case when me.rank is null or me.rank=1 then 0 else greatest(1,coalesce((select r.weekly_xp from ranked r where r.rank=me.rank-1),me.weekly_xp)-me.weekly_xp+1) end
  )
  into v_me
  from me;

  return jsonb_build_object(
    'week_start',v_week,
    'week_end',v_week+7,
    'member',v_member,
    'top',coalesce(v_top,'[]'::jsonb),
    'me',v_me,
    'participants',coalesce(v_count,0),
    'badges',coalesce(v_badges,'[]'::jsonb)
  );
end;
$$;

revoke execute on function public.league_snapshot() from anon, public;
grant execute on function public.league_snapshot() to authenticated;

-- League membership writes must go through validated RPC functions.
revoke insert, update, delete on public.league_memberships from anon, authenticated;
grant select on public.league_memberships to authenticated;

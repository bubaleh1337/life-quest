-- QuestFrame 0.2.0
-- Allow multiple active chains and change "hard/scary" quest steps from 3 XP to 7 XP.
-- Safe to run once on an existing 0.1.0 database.

-- Multiple recurring goals can now be active at the same time.
drop index if exists public.one_active_chain_per_user;

-- Change the allowed XP values, including already-created "hard" steps.
alter table public.quest_steps
  drop constraint if exists quest_steps_xp_value_check;

update public.quest_steps
set xp_value = 7
where xp_reason = 'hard' and xp_value <> 7;

alter table public.quest_steps
  add constraint quest_steps_xp_value_check
  check (xp_value in (1,5,7,10));

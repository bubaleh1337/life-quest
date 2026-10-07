export type QuestStatus = "active" | "completed" | "archived";

export type Quest = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  accent: string;
  status: QuestStatus;
  target_date: string | null;
  created_at: string;
  completed_at: string | null;
};

export type QuestStep = {
  id: string;
  quest_id: string;
  user_id: string;
  title: string;
  xp_value: number;
  xp_reason: string;
  sort_order: number;
  completed_at: string | null;
  created_at: string;
};

export type WeeklyBoss = {
  id: string;
  user_id: string;
  week_start: string;
  title: string;
  notes: string | null;
  xp_value: number;
  completed_at: string | null;
  created_at: string;
};

export type Chain = {
  id: string;
  user_id: string;
  quest_id: string | null;
  title: string;
  active: boolean;
  created_at: string;
};

export type ChainCheckin = {
  id: string;
  chain_id: string;
  user_id: string;
  checkin_date: string;
  created_at: string;
};

export type Reward = {
  id: string;
  user_id: string;
  title: string;
  xp_required: number;
  claimed_at: string | null;
  created_at: string;
};

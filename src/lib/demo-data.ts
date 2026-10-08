import type { Chain, ChainCheckin, Quest, QuestStep, Reward, WeeklyBoss } from "@/lib/types";
import { isoDateLocal, startOfWeekLocal } from "@/lib/game";

export type DemoData = {
  quests: Quest[];
  steps: QuestStep[];
  bosses: WeeklyBoss[];
  chains: Chain[];
  checkins: ChainCheckin[];
  rewards: Reward[];
};

function isoDateOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return isoDateLocal(date);
}

function isoTimeOffset(days: number, hours = 12) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hours, 0, 0, 0);
  return date.toISOString();
}

export function createDemoData(): DemoData {
  const userId = "demo-user";
  const qCareer = "demo-quest-career";
  const qLanguage = "demo-quest-language";
  const qHealth = "demo-quest-health";

  const quests: Quest[] = [
    {
      id: qCareer,
      user_id: userId,
      title: "Найти работу мечты",
      description: "Собрать сильное портфолио и выйти на работу, которая действительно подходит.",
      category: "Карьера",
      accent: "#8b3e69",
      status: "active",
      target_date: isoDateOffset(45),
      created_at: isoTimeOffset(-34),
      completed_at: null
    },
    {
      id: qLanguage,
      user_id: userId,
      title: "Польский до уверенного A2",
      description: "Немного каждый день вместо редких марафонов.",
      category: "Учёба",
      accent: "#5e7eb8",
      status: "active",
      target_date: isoDateOffset(90),
      created_at: isoTimeOffset(-25),
      completed_at: null
    },
    {
      id: qHealth,
      user_id: userId,
      title: "Вернуть движение в жизнь",
      description: "Йога, прогулки и устойчивый режим без наказаний за пропуски.",
      category: "Здоровье",
      accent: "#5c8b78",
      status: "completed",
      target_date: isoDateOffset(-3),
      created_at: isoTimeOffset(-48),
      completed_at: isoTimeOffset(-2)
    }
  ];

  const step = (
    id: string,
    questId: string,
    title: string,
    xp: 1 | 5 | 7 | 10,
    reason: "step" | "promise" | "hard" | "procrastination",
    order: number,
    completedDaysAgo: number | null
  ): QuestStep => ({
    id,
    quest_id: questId,
    user_id: userId,
    title,
    xp_value: xp,
    xp_reason: reason,
    sort_order: order,
    completed_at: completedDaysAgo === null ? null : isoTimeOffset(-completedDaysAgo, 15),
    created_at: isoTimeOffset(-30 + order)
  });

  const steps: QuestStep[] = [
    step("s1", qCareer, "Обновить QA-портфолио", 10, "procrastination", 0, 18),
    step("s2", qCareer, "Опубликовать pet-проект", 7, "hard", 1, 14),
    step("s3", qCareer, "Откликнуться на 10 подходящих вакансий", 5, "promise", 2, 8),
    step("s4", qCareer, "Написать напрямую рекрутеру", 7, "hard", 3, 4),
    step("s5", qCareer, "Добавить Life Quest в портфолио", 1, "step", 4, null),
    step("s6", qCareer, "Провести тестовое интервью", 10, "procrastination", 5, null),
    step("s7", qLanguage, "Пройти первый модуль", 5, "promise", 0, 20),
    step("s8", qLanguage, "Посмотреть фильм с польскими субтитрами", 1, "step", 1, 11),
    step("s9", qLanguage, "Записать голосовое на польском", 7, "hard", 2, null),
    step("s10", qHealth, "Купить абонемент на йогу", 10, "procrastination", 0, 31),
    step("s11", qHealth, "Сходить на 8 занятий", 5, "promise", 1, 7),
    step("s12", qHealth, "Пройти 50 000 шагов за неделю", 1, "step", 2, 3),
    step("s13", qHealth, "Утренняя прогулка до работы", 5, "promise", 3, 2),
    step("s14", qHealth, "Встать в 5:45 три раза", 7, "hard", 4, 1),
    step("s15", qHealth, "Не откладывать тренировку после плохого дня", 10, "procrastination", 5, 1)
  ];

  // Add a little history so the demo starts on level 3 rather than looking empty.
  const history: QuestStep[] = Array.from({ length: 8 }, (_, index) =>
    step(`history-${index}`, qHealth, `Закрытый этап ${index + 1}`, 10, "procrastination", 20 + index, 18 - index)
  );

  const boss: WeeklyBoss = {
    id: "demo-boss",
    user_id: userId,
    week_start: isoDateLocal(startOfWeekLocal()),
    title: "Отправить портфолио в компанию, которую страшно выбрать",
    notes: "Не ждать идеального момента — отправить текущую сильную версию.",
    xp_value: 25,
    completed_at: null,
    created_at: isoTimeOffset(-2)
  };

  const chains: Chain[] = [
    {
      id: "chain-polish",
      user_id: userId,
      quest_id: qLanguage,
      title: "Польский ежедневно",
      active: true,
      created_at: isoTimeOffset(-12)
    },
    {
      id: "chain-morning",
      user_id: userId,
      quest_id: null,
      title: "Вставать в 5:45 утра",
      active: true,
      created_at: isoTimeOffset(-9)
    }
  ];

  const checkins: ChainCheckin[] = [];
  const addCheckin = (chainId: string, daysAgo: number) => {
    checkins.push({
      id: `${chainId}-${daysAgo}`,
      chain_id: chainId,
      user_id: userId,
      checkin_date: isoDateOffset(-daysAgo),
      created_at: isoTimeOffset(-daysAgo, 7)
    });
  };

  [8, 7, 6, 5, 3, 2, 1].forEach((day) => addCheckin("chain-polish", day));
  [7, 6, 5, 4, 3, 1].forEach((day) => addCheckin("chain-morning", day));

  const rewards: Reward[] = [
    {
      id: "reward-coffee",
      user_id: userId,
      title: "Новый красивый блокнот",
      xp_required: 100,
      claimed_at: isoTimeOffset(-5),
      created_at: isoTimeOffset(-26)
    },
    {
      id: "reward-massage",
      user_id: userId,
      title: "Сходить на массаж",
      xp_required: 250,
      claimed_at: null,
      created_at: isoTimeOffset(-4)
    },
    {
      id: "reward-trip",
      user_id: userId,
      title: "Устроить мини-поездку на выходные",
      xp_required: 350,
      claimed_at: null,
      created_at: isoTimeOffset(-2)
    }
  ];

  return {
    quests,
    steps: [...steps, ...history],
    bosses: [boss],
    chains,
    checkins,
    rewards
  };
}

import type { Chain, ChainCheckin, LeagueSnapshot, Quest, QuestStep, Reward, WeeklyBoss } from "@/lib/types";
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
  const qPortfolio = "demo-quest-portfolio";
  const qMovement = "demo-quest-movement";
  const qHome = "demo-quest-home";

  const quests: Quest[] = [
    {
      id: qPortfolio,
      user_id: userId,
      title: "Собрать портфолио",
      description: "Собрать несколько сильных работ в одном месте и спокойно довести оформление до готового результата.",
      category: "Проекты",
      accent: "#8b3e69",
      status: "active",
      target_date: isoDateOffset(45),
      created_at: isoTimeOffset(-34),
      completed_at: null
    },
    {
      id: qMovement,
      user_id: userId,
      title: "Больше двигаться в течение недели",
      description: "Добавить немного регулярного движения без жёсткого расписания и спортивных рекордов.",
      category: "Здоровье",
      accent: "#5e7eb8",
      status: "active",
      target_date: isoDateOffset(60),
      created_at: isoTimeOffset(-25),
      completed_at: null
    },
    {
      id: qHome,
      user_id: userId,
      title: "Разобрать накопившиеся мелочи дома",
      description: "Закрыть несколько небольших бытовых дел, которые постоянно откладывались на потом.",
      category: "Дом",
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
    step("s1", qPortfolio, "Выбрать 3 работы для портфолио", 1, "step", 0, 18),
    step("s2", qPortfolio, "Сделать аккуратные скриншоты проектов", 5, "promise", 1, 14),
    step("s3", qPortfolio, "Коротко описать свою роль в каждом проекте", 1, "step", 2, 8),
    step("s4", qPortfolio, "Опубликовать первый проект", 7, "hard", 3, 4),
    step("s5", qPortfolio, "Проверить все ссылки и мобильную версию", 1, "step", 4, null),
    step("s6", qPortfolio, "Довести страницу портфолио до финальной версии", 10, "procrastination", 5, null),

    step("s7", qMovement, "Выбрать два удобных дня для активности", 1, "step", 0, 20),
    step("s8", qMovement, "Выйти на прогулку минимум на 30 минут", 5, "promise", 1, 11),
    step("s9", qMovement, "Сделать короткую тренировку дома", 7, "hard", 2, null),
    step("s10", qMovement, "Не откладывать запланированную активность", 10, "procrastination", 3, null),

    step("s11", qHome, "Разобрать ящик с документами", 10, "procrastination", 0, 31),
    step("s12", qHome, "Собрать провода и зарядки в одном месте", 1, "step", 1, 7),
    step("s13", qHome, "Разобрать аптечку", 5, "promise", 2, 3),
    step("s14", qHome, "Разобрать самую захламлённую полку", 7, "hard", 3, 2),
    step("s15", qHome, "Отнести пакет вещей на переработку или отдачу", 1, "step", 4, 1)
  ];

  // A mixed history keeps the demo lively without implying that Life Quest is only for one area of life.
  const historyTitles = [
    "Очистить папку со скриншотами",
    "Обновить список покупок",
    "Ответить на отложенное сообщение",
    "Сохранить документы в облако",
    "Прочитать 20 страниц книги",
    "Пройти один урок языка",
    "Заказать нужный расходник",
    "Разобрать папку Downloads"
  ];
  const history: QuestStep[] = historyTitles.map((title, index) =>
    step(`history-${index}`, qHome, title, 10, "procrastination", 20 + index, 18 - index)
  );

  const boss: WeeklyBoss = {
    id: "demo-boss",
    user_id: userId,
    week_start: isoDateLocal(startOfWeekLocal()),
    title: "Разобрать папку Downloads",
    notes: "Удалить ненужное, разложить важные файлы по папкам и наконец закрыть этот цифровой завал.",
    xp_value: 25,
    completed_at: null,
    created_at: isoTimeOffset(-2)
  };

  const chains: Chain[] = [
    {
      id: "chain-language",
      user_id: userId,
      quest_id: null,
      title: "10 минут иностранного языка",
      active: true,
      created_at: isoTimeOffset(-12)
    },
    {
      id: "chain-walk",
      user_id: userId,
      quest_id: qMovement,
      title: "Короткая прогулка после обеда",
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

  [8, 7, 6, 5, 3, 2, 1].forEach((day) => addCheckin("chain-language", day));
  [7, 6, 5, 4, 3, 1].forEach((day) => addCheckin("chain-walk", day));

  const rewards: Reward[] = [
    {
      id: "reward-small",
      user_id: userId,
      title: "Купить новую книгу или игру",
      xp_required: 100,
      claimed_at: isoTimeOffset(-5),
      created_at: isoTimeOffset(-26)
    },
    {
      id: "reward-cafe",
      user_id: userId,
      title: "Сходить в любимое кафе",
      xp_required: 250,
      claimed_at: null,
      created_at: isoTimeOffset(-4)
    },
    {
      id: "reward-free-evening",
      user_id: userId,
      title: "Устроить вечер без дел и обязательств",
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

export function createDemoLeagueSnapshot(active = false, nickname = "Ты"): LeagueSnapshot {
  const weekStart = isoDateLocal(startOfWeekLocal());
  const weekEndDate = new Date(`${weekStart}T00:00:00`);
  weekEndDate.setDate(weekEndDate.getDate() + 7);
  const weekEnd = isoDateLocal(weekEndDate);
  const top = [
    { rank: 1, nickname: "Luna", weekly_xp: 286, is_me: false },
    { rank: 2, nickname: "Northstar", weekly_xp: 241, is_me: false },
    { rank: 3, nickname: "Mira", weekly_xp: 218, is_me: false },
    { rank: 4, nickname: "PixelFox", weekly_xp: 196, is_me: false },
    { rank: 5, nickname: "Sora", weekly_xp: 181, is_me: false },
    { rank: 6, nickname: "Atlas", weekly_xp: 169, is_me: false },
    { rank: 7, nickname: "Nori", weekly_xp: 154, is_me: false },
    { rank: 8, nickname: "Moss", weekly_xp: 143, is_me: false },
    { rank: 9, nickname: "Nova", weekly_xp: 132, is_me: false },
    { rank: 10, nickname: "Kite", weekly_xp: 121, is_me: false }
  ];

  return {
    week_start: weekStart,
    week_end: weekEnd,
    member: active ? { active: true, nickname, joined_at: new Date().toISOString() } : null,
    top,
    me: active ? { rank: 24, nickname, weekly_xp: 46, xp_to_next: 5 } : null,
    participants: 38,
    badges: active ? [
      { id: "demo-badge-gold", week_start: isoDateOffset(-14), place: 1, weekly_xp: 312, created_at: isoTimeOffset(-7) },
      { id: "demo-badge-bronze", week_start: isoDateOffset(-28), place: 3, weekly_xp: 204, created_at: isoTimeOffset(-21) }
    ] : []
  };
}

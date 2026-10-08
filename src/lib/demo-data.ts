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
  const qHome = "demo-quest-home";
  const qCooking = "demo-quest-cooking";
  const qRoutine = "demo-quest-routine";

  const quests: Quest[] = [
    {
      id: qHome,
      user_id: userId,
      title: "Разобрать квартиру по зонам",
      description: "Не устраивать генеральную уборку за один день, а спокойно пройтись по одной зоне за раз.",
      category: "Дом",
      accent: "#8b3e69",
      status: "active",
      target_date: isoDateOffset(45),
      created_at: isoTimeOffset(-34),
      completed_at: null
    },
    {
      id: qCooking,
      user_id: userId,
      title: "Готовить дома чаще",
      description: "Собрать несколько простых вариантов ужина и меньше зависеть от доставки.",
      category: "Быт",
      accent: "#5e7eb8",
      status: "active",
      target_date: isoDateOffset(90),
      created_at: isoTimeOffset(-25),
      completed_at: null
    },
    {
      id: qRoutine,
      user_id: userId,
      title: "Сделать утро спокойнее",
      description: "Подготовить простую утреннюю рутину, чтобы не начинать день в спешке.",
      category: "Рутина",
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
    step("s1", qHome, "Разобрать ящик с документами", 10, "procrastination", 0, 18),
    step("s2", qHome, "Перебрать полку в ванной", 1, "step", 1, 14),
    step("s3", qHome, "Отдать или выбросить 10 ненужных вещей", 5, "promise", 2, 8),
    step("s4", qHome, "Разобрать самый захламлённый шкаф", 7, "hard", 3, 4),
    step("s5", qHome, "Протереть кухонные полки", 1, "step", 4, null),
    step("s6", qHome, "Помыть холодильник", 10, "procrastination", 5, null),
    step("s7", qCooking, "Составить список из 5 быстрых ужинов", 1, "step", 0, 20),
    step("s8", qCooking, "Купить продукты на три ужина", 5, "promise", 1, 11),
    step("s9", qCooking, "Приготовить новое блюдо с нуля", 7, "hard", 2, null),
    step("s10", qRoutine, "Подготовить одежду с вечера", 5, "promise", 0, 31),
    step("s11", qRoutine, "Собрать простой завтрак заранее", 1, "step", 1, 7),
    step("s12", qRoutine, "Не брать телефон первые 15 минут", 10, "procrastination", 2, 3),
    step("s13", qRoutine, "Заправить кровать сразу после подъёма", 5, "promise", 3, 2),
    step("s14", qRoutine, "Встать без повторного будильника три раза", 7, "hard", 4, 1),
    step("s15", qRoutine, "Убрать чашку и посуду сразу после завтрака", 1, "step", 5, 1)
  ];

  // Add a little ordinary-life history so the demo starts on level 3 rather than looking empty.
  const historyTitles = [
    "Разобрать аптечку",
    "Протереть зеркала",
    "Сложить чистое бельё",
    "Разобрать пакет с пакетами",
    "Полить растения",
    "Протереть рабочий стол",
    "Сменить постельное бельё",
    "Разобрать полку с кружками"
  ];
  const history: QuestStep[] = historyTitles.map((title, index) =>
    step(`history-${index}`, qRoutine, title, 10, "procrastination", 20 + index, 18 - index)
  );

  const boss: WeeklyBoss = {
    id: "demo-boss",
    user_id: userId,
    week_start: isoDateLocal(startOfWeekLocal()),
    title: "Разобрать шкаф под раковиной",
    notes: "Вытащить всё, выбросить лишнее, протереть полку и вернуть только нужное.",
    xp_value: 25,
    completed_at: null,
    created_at: isoTimeOffset(-2)
  };

  const chains: Chain[] = [
    {
      id: "chain-polish",
      user_id: userId,
      quest_id: qCooking,
      title: "Готовить дома",
      active: true,
      created_at: isoTimeOffset(-12)
    },
    {
      id: "chain-morning",
      user_id: userId,
      quest_id: null,
      title: "10 минут уборки вечером",
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
      title: "Купить красивую кружку",
      xp_required: 100,
      claimed_at: isoTimeOffset(-5),
      created_at: isoTimeOffset(-26)
    },
    {
      id: "reward-massage",
      user_id: userId,
      title: "Заказать любимую еду",
      xp_required: 250,
      claimed_at: null,
      created_at: isoTimeOffset(-4)
    },
    {
      id: "reward-trip",
      user_id: userId,
      title: "Устроить ленивый вечер с фильмом",
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

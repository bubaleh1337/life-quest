export const XP_OPTIONS = [
  { value: 1, key: "step" as const },
  { value: 5, key: "promise" as const },
  { value: 7, key: "hard" as const },
  { value: 10, key: "procrastination" as const }
];

export const BOSS_XP = 25;

export function levelStartXp(level: number) {
  if (level <= 1) return 0;
  return 25 * (level - 1) * level;
}

export function getLevelProgress(totalXp: number) {
  let level = 1;
  while (totalXp >= levelStartXp(level + 1)) {
    level += 1;
  }

  const start = levelStartXp(level);
  const next = levelStartXp(level + 1);
  const current = totalXp - start;
  const needed = next - start;

  return {
    level,
    current,
    needed,
    percent: needed === 0 ? 0 : Math.min(100, Math.round((current / needed) * 100)),
    nextAt: next
  };
}

export function startOfWeekLocal(date = new Date()) {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function isoDateLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

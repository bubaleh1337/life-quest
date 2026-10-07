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


const LEVEL_COLOR_STOPS = [
  "#8B3E69",
  "#9360A3",
  "#5678BE",
  "#53A38E",
  "#D2A85A"
];

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((item) => item + item).join("") : value;
  const parsed = Number.parseInt(normalized, 16);
  return { r: (parsed >> 16) & 255, g: (parsed >> 8) & 255, b: parsed & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((value) => Math.round(Math.max(0, Math.min(255, value))).toString(16).padStart(2, "0")).join("")}`;
}

function mixHex(a: string, b: string, ratio: number) {
  const from = hexToRgb(a);
  const to = hexToRgb(b);
  return rgbToHex(
    from.r + (to.r - from.r) * ratio,
    from.g + (to.g - from.g) * ratio,
    from.b + (to.b - from.b) * ratio
  );
}

export function getLevelPalette(level: number) {
  const clampedLevel = Math.max(1, Math.min(level, 20));
  const maxIndex = LEVEL_COLOR_STOPS.length - 1;
  const scaled = ((clampedLevel - 1) / 19) * maxIndex;
  const index = Math.floor(scaled);
  const ratio = Math.min(1, scaled - index);
  const primary = LEVEL_COLOR_STOPS[index] ?? LEVEL_COLOR_STOPS[maxIndex];
  const secondary = LEVEL_COLOR_STOPS[Math.min(index + 1, maxIndex)] ?? primary;

  return {
    primary: mixHex(primary, secondary, ratio),
    secondary: mixHex(primary, secondary, Math.min(1, ratio + 0.22)),
    tertiary: mixHex(primary, "#f5d9a2", 0.4),
    shadow: mixHex(primary, "#27151f", 0.64)
  };
}

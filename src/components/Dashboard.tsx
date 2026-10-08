"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { BOSS_XP, getLevelPalette, getLevelProgress, isoDateLocal, startOfWeekLocal, XP_OPTIONS } from "@/lib/game";
import BrandLockup from "@/components/Brand";
import type { Chain, ChainCheckin, Quest, QuestStep, Reward, WeeklyBoss } from "@/lib/types";
import { playUiSound } from "@/lib/ui-sound";

type Lang = "ru" | "en";
type Tab = "today" | "quests" | "chain" | "rewards" | "help";
type ChainDayState = "hit" | "break" | "today";

type ConfirmAction = {
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  action: () => Promise<void> | void;
};

type DashboardProps = {
  userId: string;
  email: string;
};

const copy = {
  ru: {
    today: "Сегодня",
    quests: "Квесты",
    chain: "Цепочки",
    rewards: "Награды",
    help: "Гид игрока",
    helpShort: "Гид",
    dashboardEyebrow: "ТВОЯ ИГРОВАЯ ПАНЕЛЬ",
    dashboardTitle: "Сегодня",
    dashboardLead: "Небольшие действия складываются в заметный прогресс.",
    pendingActions: "шагов осталось",
    chainsToday: "цепочек сегодня",
    level: "Уровень",
    totalXp: "Всего XP",
    activeQuests: "Активные квесты",
    nextLevel: "до следующего уровня",
    weeklyBoss: "Босс недели",
    bossHint: "Одно дело, которое ты избегаешь больше всего.",
    bossPlaceholder: "Например: отправить портфолио работодателю",
    bossNotes: "Заметка (необязательно)",
    setBoss: "Назначить босса",
    defeatBoss: "Победить босса",
    bossDefeated: "Босс побеждён",
    undoBoss: "Отменить победу",
    replaceBoss: "Изменить босса",
    focus: "Фокус сейчас",
    noQuests: "Пока нет активных квестов.",
    createFirst: "Создать первый квест",
    newQuest: "Новый квест",
    questTitle: "Название квеста",
    questDescription: "Зачем это тебе? (необязательно)",
    questCategory: "Категория (необязательно)",
    questCategoryPlaceholder: "Например: Карьера / Здоровье / Учёба",
    targetDate: "Дата цели (необязательно)",
    targetDatePlaceholder: "ДД.ММ.ГГГГ",
    invalidTargetDate: "Введи дату в формате ДД.ММ.ГГГГ.",
    accent: "Цвет квеста",
    createQuest: "Создать квест",
    cancel: "Отмена",
    progress: "Прогресс",
    step: "шаг",
    steps: "шагов",
    addStep: "Добавить шаг",
    stepPlaceholder: "Конкретное действие",
    xpType: "За что начислить XP",
    xpStep: "Обычный шаг",
    xpHard: "Сделала самое сложное или страшное",
    xpPromise: "Сдержала обещание перед собой",
    xpProcrastination: "Сделала то, что откладывала",
    done: "Готово",
    undo: "Отменить",
    completeQuest: "Завершить квест",
    reopenQuest: "Вернуть в активные",
    completed: "Завершён",
    emptyQuest: "Добавь первый конкретный шаг — без огромного списка дел.",
    questActionsEyebrow: "ДЕЙСТВИЯ КВЕСТОВ",
    dailyLoopEyebrow: "ПОВТОРЯЕМЫЕ ДЕЙСТВИЯ",
    questLogEyebrow: "ЖУРНАЛ КВЕСТОВ",
    chainEyebrow: "БЕЗ ОБНУЛЕНИЯ",
    rewardsEyebrow: "НАГРАДЫ",
    helpEyebrow: "ПРАВИЛА ИГРЫ",
    quickSteps: "Быстрые шаги",
    quickStepsLead: "Отмечай шаги активных квестов прямо с главной страницы.",
    noQuickSteps: "В активных квестах пока нет шагов для отметки.",
    openAllQuests: "Открыть все квесты",
    repeatingGoals: "Повторяемые действия",
    repeatingGoalsLead: "То, что хочется делать регулярно, отмечается одним нажатием.",
    manageChains: "Управлять цепочками",
    noRepeatingGoals: "Пока нет повторяемых действий.",
    chainTitle: "Цепочки",
    chainLead: "Каждое выполнение добавляет новое звено. Пропуск виден как разрыв, но цепочка не обнуляется — следующее звено можно добавить в любой день.",
    chainPlaceholder: "Например: изучать польский каждый день",
    startChain: "Начать цепочку",
    addAnotherChain: "Добавить цепочку",
    linkToday: "Отметить сегодня",
    linkedToday: "Сегодня отмечено",
    links: "звеньев",
    finishChain: "Завершить цепочку",
    restoreChain: "Вернуть цепочку",
    finishedChains: "Завершённые цепочки",
    noFinishedChains: "Завершённых цепочек пока нет.",
    chainEmpty: "Активных цепочек пока нет. Начни первую с повторяемого действия.",
    lastDays: "Последние 7 дней",
    chainStart: "Старт",
    chainBreak: "Разрыв",
    chainToday: "Сегодня",
    chainBeforeStart: "До старта",
    chainBuilt: "Звено добавлено",
    rewardTitle: "Награды за путь",
    rewardLead: "Награда открывается по общему XP и не списывает прогресс.",
    rewardPlaceholder: "Например: сходить на массаж",
    xpNeeded: "Ещё XP",
    rewardPlannerEyebrow: "БЫСТРЫЙ ВЫБОР",
    rewardPlannerTitle: "Выбери масштаб награды",
    rewardPlannerText: "Выбери готовый вариант или укажи своё количество XP при добавлении награды.",
    rewardNow: "Сейчас",
    rewardJourney: "До награды",
    rewardUnlockAt: "Откроется на",
    rewardSmall: "Небольшая",
    rewardRegular: "Обычная",
    rewardMeaningful: "Значимая",
    rewardBig: "Большая",
    rewardRecommended: "Рекомендуем",
    rewardCustom: "Свой XP",
    rewardRemaining: "Осталось",
    addReward: "Добавить награду",
    unlocked: "Открыта",
    locked: "Закрыта",
    claim: "Получить награду",
    claimed: "Получена",
    undoClaim: "Отменить получение",
    rewardEmpty: "Добавь награду, которую действительно хочется заслужить.",
    account: "Аккаунт",
    accountMenu: "Меню аккаунта",
    openGuide: "Открыть гид игрока",
    signOut: "Выйти",
    signOutTitle: "Выйти из аккаунта?",
    signOutText: "Текущая сессия на этом устройстве завершится. Для повторного входа понадобится действующая ссылка из письма или другой настроенный способ входа.",
    staySignedIn: "Остаться",
    loading: "Загрузка приключения…",
    error: "Что-то пошло не так.",
    saved: "Сохранено.",
    deleted: "Удалено.",
    restored: "Восстановлено.",
    chainUnlinked: "Отметка за сегодня отменена.",
    rewardUnclaimed: "Получение награды отменено.",
    xpGuide: "Система XP",
    xpGuideText: "Награждаем не только результат, но и сложность самого действия.",
    noPunishment: "Без наказания за пропуск",
    noPunishmentText: "Пропущенный день отображается как разрыв между звеньями, но уже собранная цепочка не исчезает и счётчик не сбрасывается.",
    helpTitle: "Гид игрока",
    helpLead: "Правила и механики Life Quest в одном месте — чтобы главная оставалась лёгкой.",
    xpHelpTitle: "Как начисляется XP",
    xpRegularHelp: "Обычный шаг",
    xpPromiseHelp: "Сдержала обещание перед собой",
    xpHardHelp: "Сделала самое сложное или страшное",
    xpDelayHelp: "Сделала то, что откладывала",
    bossHelpTitle: "Босс недели",
    bossHelpText: "Выбирай одно дело, которого избегаешь сильнее всего. Победа над боссом даёт +25 XP.",
    rewardHelpTitle: "Награды",
    rewardHelpText: "Награды открываются по общему XP. Получение награды не отнимает XP и не уменьшает уровень.",
    contactsEyebrow: "КОНТАКТЫ",
    contactsTitle: "Связаться с автором",
    emailContact: "Email",
    telegramContact: "Telegram",
    contactsLead: "Вопросы, идеи и сообщения об ошибках можно отправить мне напрямую.",
    archive: "Архивировать",
    archived: "Квест архивирован.",
    archivedTab: "Архив",
    noArchived: "Архивных квестов пока нет.",
    active: "Активные",
    finished: "Завершённые",
    noFinished: "Завершённых квестов пока нет.",
    confirmArchiveTitle: "Архивировать квест?",
    confirmArchiveText: "Квест исчезнет из активных, но останется в разделе «Архив», откуда его можно вернуть.",
    confirmFinishChainTitle: "Завершить цепочку?",
    confirmFinishChainText: "Цепочка перейдёт в завершённые. Все звенья сохранятся, и её можно будет восстановить.",
    confirmDeleteStepTitle: "Удалить шаг?",
    confirmDeleteStepText: "Шаг и начисленный за него XP будут удалены. Это действие нельзя отменить.",
    confirmDeleteRewardTitle: "Удалить награду?",
    confirmDeleteRewardText: "Награда будет удалена без возможности восстановления.",
    confirmClaimRewardTitle: "Отметить награду полученной?",
    confirmClaimRewardText: "Она останется в списке и её отметку можно будет отменить.",
    confirm: "Подтвердить",
    due: "до",
    remove: "Удалить",
    home: "На главную",
    sound: "Звук",
    soundOn: "Звук включён",
    soundOff: "Звук выключен",
    soundHelpTitle: "Звуки и отклик",
    soundHelpText: "Металлический щелчок цепи, короткие сигналы XP и наград делают действия ощутимыми. Звук можно отключить в любой момент.",
    glossyChainHint: "Собирай звено за звеном. Разрыв остаётся частью истории, а не стирает её."
  },
  en: {
    today: "Today",
    quests: "Quests",
    chain: "Chains",
    rewards: "Rewards",
    help: "Player Guide",
    helpShort: "Guide",
    dashboardEyebrow: "YOUR GAME BOARD",
    dashboardTitle: "Today",
    dashboardLead: "Small actions add up to visible progress.",
    pendingActions: "steps left",
    chainsToday: "chains today",
    level: "Level",
    totalXp: "Total XP",
    activeQuests: "Active quests",
    nextLevel: "to next level",
    weeklyBoss: "Weekly boss",
    bossHint: "One thing you are avoiding more than anything else.",
    bossPlaceholder: "For example: send my portfolio to an employer",
    bossNotes: "Note (optional)",
    setBoss: "Set boss",
    defeatBoss: "Defeat boss",
    bossDefeated: "Boss defeated",
    undoBoss: "Undo victory",
    replaceBoss: "Edit boss",
    focus: "Focus now",
    noQuests: "No active quests yet.",
    createFirst: "Create your first quest",
    newQuest: "New quest",
    questTitle: "Quest title",
    questDescription: "Why does this matter? (optional)",
    questCategory: "Category (optional)",
    questCategoryPlaceholder: "For example: Career / Health / Learning",
    targetDate: "Target date (optional)",
    targetDatePlaceholder: "MM/DD/YYYY",
    invalidTargetDate: "Enter the date as MM/DD/YYYY.",
    accent: "Quest color",
    createQuest: "Create quest",
    cancel: "Cancel",
    progress: "Progress",
    step: "step",
    steps: "steps",
    addStep: "Add step",
    stepPlaceholder: "One concrete action",
    xpType: "Why this XP is earned",
    xpStep: "Regular step",
    xpHard: "Did the hardest or scariest thing",
    xpPromise: "Kept a promise to myself",
    xpProcrastination: "Did what I was putting off",
    done: "Done",
    undo: "Undo",
    completeQuest: "Complete quest",
    reopenQuest: "Reopen quest",
    completed: "Completed",
    emptyQuest: "Add the first concrete step — not a giant to-do list.",
    questActionsEyebrow: "QUEST ACTIONS",
    dailyLoopEyebrow: "REPEATING ACTIONS",
    questLogEyebrow: "QUEST LOG",
    chainEyebrow: "NO RESET",
    rewardsEyebrow: "REWARDS",
    helpEyebrow: "GAME RULES",
    quickSteps: "Quick steps",
    quickStepsLead: "Check off active quest steps directly from your home page.",
    noQuickSteps: "There are no active quest steps to check off yet.",
    openAllQuests: "Open all quests",
    repeatingGoals: "Repeating actions",
    repeatingGoalsLead: "Anything you want to do regularly can be checked off in one tap.",
    manageChains: "Manage chains",
    noRepeatingGoals: "No repeating actions yet.",
    chainTitle: "Chains",
    chainLead: "Each completion adds a new link. A missed day appears as a break, but your chain never resets — add the next link whenever you continue.",
    chainPlaceholder: "For example: practice Polish every day",
    startChain: "Start chain",
    addAnotherChain: "Add chain",
    linkToday: "Mark today",
    linkedToday: "Marked today",
    links: "links",
    finishChain: "Finish chain",
    restoreChain: "Restore chain",
    finishedChains: "Finished chains",
    noFinishedChains: "No finished chains yet.",
    chainEmpty: "No active chains yet. Start the first one with a repeating action.",
    lastDays: "Last 7 days",
    chainStart: "Start",
    chainBreak: "Break",
    chainToday: "Today",
    chainBeforeStart: "Before start",
    chainBuilt: "Link added",
    rewardTitle: "Rewards for the path",
    rewardLead: "A reward unlocks at total XP and never spends your progress.",
    rewardPlaceholder: "For example: book a massage",
    xpNeeded: "More XP",
    rewardPlannerEyebrow: "QUICK PICK",
    rewardPlannerTitle: "Choose the reward size",
    rewardPlannerText: "Pick a preset or enter your own XP amount when adding the reward.",
    rewardNow: "Now",
    rewardJourney: "To reward",
    rewardUnlockAt: "Unlocks at",
    rewardSmall: "Small",
    rewardRegular: "Regular",
    rewardMeaningful: "Meaningful",
    rewardBig: "Big",
    rewardRecommended: "Recommended",
    rewardCustom: "Custom XP",
    rewardRemaining: "Remaining",
    addReward: "Add reward",
    unlocked: "Unlocked",
    locked: "Locked",
    claim: "Claim reward",
    claimed: "Claimed",
    undoClaim: "Undo claim",
    rewardEmpty: "Add something you would genuinely enjoy earning.",
    account: "Account",
    accountMenu: "Account menu",
    openGuide: "Open Player Guide",
    signOut: "Sign out",
    signOutTitle: "Sign out of your account?",
    signOutText: "The current session on this device will end. Signing in again will require a valid email link or another configured sign-in method.",
    staySignedIn: "Stay signed in",
    loading: "Loading your adventure…",
    error: "Something went wrong.",
    saved: "Saved.",
    deleted: "Deleted.",
    restored: "Restored.",
    chainUnlinked: "Today’s check-in was undone.",
    rewardUnclaimed: "Reward claim was undone.",
    xpGuide: "XP system",
    xpGuideText: "Reward the difficulty of the action, not only the final result.",
    noPunishment: "No punishment for a missed day",
    noPunishmentText: "A missed day appears as a break between links, but the chain you already built remains and the count never resets.",
    helpTitle: "Player Guide",
    helpLead: "Life Quest rules and mechanics in one place so the home screen stays light.",
    xpHelpTitle: "How XP works",
    xpRegularHelp: "Regular step",
    xpPromiseHelp: "Kept a promise to myself",
    xpHardHelp: "Did the hardest or scariest thing",
    xpDelayHelp: "Did what I was putting off",
    bossHelpTitle: "Weekly boss",
    bossHelpText: "Choose one task you are avoiding the most. Defeating the boss earns +25 XP.",
    rewardHelpTitle: "Rewards",
    rewardHelpText: "Rewards unlock from total XP. Claiming one never spends XP or lowers your level.",
    contactsEyebrow: "CONTACTS",
    contactsTitle: "Contact the author",
    emailContact: "Email",
    telegramContact: "Telegram",
    contactsLead: "Send questions, ideas and bug reports to me directly.",
    archive: "Archive",
    archived: "Quest archived.",
    archivedTab: "Archive",
    noArchived: "No archived quests yet.",
    active: "Active",
    finished: "Completed",
    noFinished: "No completed quests yet.",
    confirmArchiveTitle: "Archive this quest?",
    confirmArchiveText: "It will leave Active quests but remain in Archive, where you can restore it.",
    confirmFinishChainTitle: "Finish this chain?",
    confirmFinishChainText: "The chain will move to Finished chains. All links stay saved and the chain can be restored.",
    confirmDeleteStepTitle: "Delete this step?",
    confirmDeleteStepText: "The step and any XP earned from it will be deleted. This cannot be undone.",
    confirmDeleteRewardTitle: "Delete this reward?",
    confirmDeleteRewardText: "The reward will be permanently deleted.",
    confirmClaimRewardTitle: "Mark this reward as claimed?",
    confirmClaimRewardText: "It will stay in the list and you can undo the claim later.",
    confirm: "Confirm",
    due: "due",
    remove: "Delete",
    home: "Home",
    sound: "Sound",
    soundOn: "Sound on",
    soundOff: "Sound off",
    soundHelpTitle: "Sound & feedback",
    soundHelpText: "A metallic chain click plus short XP and reward cues make actions feel tangible. Sound can be switched off at any time.",
    glossyChainHint: "Build it link by link. A break stays part of the story instead of erasing it."
  }
} as const;

const xpLabelKey: Record<string, "xpStep" | "xpHard" | "xpPromise" | "xpProcrastination"> = {
  step: "xpStep",
  hard: "xpHard",
  promise: "xpPromise",
  procrastination: "xpProcrastination"
};

export default function Dashboard({ userId, email }: DashboardProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [lang, setLang] = useState<Lang>("ru");
  const [tab, setTab] = useState<Tab>("today");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [notice, setNotice] = useState("");
  const [showQuestForm, setShowQuestForm] = useState(false);
  const [showBossForm, setShowBossForm] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [xpBurst, setXpBurst] = useState<{ id: number; amount: number } | null>(null);
  const xpBurstCounter = useRef(0);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const [chainCelebration, setChainCelebration] = useState<string | null>(null);
  const [rewardCelebration, setRewardCelebration] = useState<string | null>(null);
  const [rewardCost, setRewardCost] = useState("");
  const [selectedRewardPreset, setSelectedRewardPreset] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [questFilter, setQuestFilter] = useState<"active" | "completed" | "archived">("active");

  const [quests, setQuests] = useState<Quest[]>([]);
  const [steps, setSteps] = useState<QuestStep[]>([]);
  const [bosses, setBosses] = useState<WeeklyBoss[]>([]);
  const [chains, setChains] = useState<Chain[]>([]);
  const [checkins, setCheckins] = useState<ChainCheckin[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);

  const t = copy[lang];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("questframe-lang");
      if (saved === "en" || saved === "ru") setLang(saved);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("questframe-sound");
      if (saved === "off") setSoundEnabled(false);
      if (saved === "on") setSoundEnabled(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "ru" ? "Life Quest — квесты и прогресс" : "Life Quest — quests and progress";
  }, [lang]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setConfirmAction(null);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!accountMenuRef.current?.contains(target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [profileOpen]);

  function toggleLanguage() {
    const next: Lang = lang === "ru" ? "en" : "ru";
    setLang(next);
    window.localStorage.setItem("questframe-lang", next);
  }

  function toggleSound() {
    const next = !soundEnabled;
    setSoundEnabled(next);
    window.localStorage.setItem("questframe-sound", next ? "on" : "off");
    if (next) playUiSound("tap", true);
  }

  function showXpBurst(amount: number) {
    xpBurstCounter.current += 1;
    const id = xpBurstCounter.current;
    setXpBurst({ id, amount });
    window.setTimeout(() => {
      setXpBurst((current) => current?.id === id ? null : current);
    }, 1100);
  }

  const loadData = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setNotice("");

    const [questRes, stepRes, bossRes, chainRes, checkinRes, rewardRes] = await Promise.all([
      supabase.from("quests").select("*").order("created_at", { ascending: false }),
      supabase.from("quest_steps").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
      supabase.from("weekly_bosses").select("*").order("week_start", { ascending: false }),
      supabase.from("chains").select("*").order("created_at", { ascending: false }),
      supabase.from("chain_checkins").select("*").order("checkin_date", { ascending: false }),
      supabase.from("rewards").select("*").order("xp_required", { ascending: true })
    ]);

    const firstError = [questRes.error, stepRes.error, bossRes.error, chainRes.error, checkinRes.error, rewardRes.error].find(Boolean);
    if (firstError) {
      setNotice(`${t.error} ${firstError.message}`);
    } else {
      setQuests((questRes.data ?? []) as Quest[]);
      setSteps((stepRes.data ?? []) as QuestStep[]);
      setBosses((bossRes.data ?? []) as WeeklyBoss[]);
      setChains((chainRes.data ?? []) as Chain[]);
      setCheckins((checkinRes.data ?? []) as ChainCheckin[]);
      setRewards((rewardRes.data ?? []) as Reward[]);
    }
    if (showSpinner) setLoading(false);
  }, [supabase, t.error]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const weekStart = isoDateLocal(startOfWeekLocal());
  const currentBoss = bosses.find((boss) => boss.week_start === weekStart) ?? null;
  const today = isoDateLocal(new Date());
  const activeChains = chains.filter((chain) => chain.active);
  const finishedChains = chains.filter((chain) => !chain.active);

  const totalXp = useMemo(() => {
    const stepXp = steps.filter((step) => step.completed_at).reduce((sum, step) => sum + step.xp_value, 0);
    const bossXp = bosses.filter((boss) => boss.completed_at).reduce((sum, boss) => sum + boss.xp_value, 0);
    return stepXp + bossXp;
  }, [steps, bosses]);

  const level = getLevelProgress(totalXp);
  const levelPalette = getLevelPalette(level.level);
  const activeQuests = quests.filter((quest) => quest.status === "active");
  const completedQuests = quests.filter((quest) => quest.status === "completed");
  const archivedQuests = quests.filter((quest) => quest.status === "archived");
  const activeQuestIds = useMemo(() => new Set(activeQuests.map((quest) => quest.id)), [activeQuests]);
  const quickSteps = useMemo(() => {
    return steps
      .filter((step) => activeQuestIds.has(step.quest_id))
      .sort((a, b) => Number(Boolean(a.completed_at)) - Number(Boolean(b.completed_at)))
      .slice(0, 8);
  }, [steps, activeQuestIds]);

  const pendingQuickSteps = quickSteps.filter((step) => !step.completed_at).length;
  const checkedChainsToday = activeChains.filter((chain) => isChainCheckedToday(chain.id)).length;
  const todayLabel = new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", {
    weekday: "long", day: "numeric", month: "long"
  }).format(new Date());

  const visibleQuests = questFilter === "active" ? activeQuests : questFilter === "completed" ? completedQuests : archivedQuests;
  const emptyQuestFilterMessage = questFilter === "active" ? t.noQuests : questFilter === "completed" ? t.noFinished : t.noArchived;

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  function askForConfirmation(action: ConfirmAction) {
    setProfileOpen(false);
    setConfirmAction(action);
  }

  async function runConfirmedAction() {
    const pending = confirmAction;
    if (!pending) return;
    setConfirmAction(null);
    await pending.action();
  }

  async function withWork(action: () => Promise<{ error: { message: string } | null } | void>, success: string = t.saved) {
    setWorking(true);
    try {
      const result = await action();
      if (result && result.error) {
        flash(`${t.error} ${result.error.message}`);
        return false;
      }
      await loadData(false);
      flash(success);
      return true;
    } catch (error) {
      flash(`${t.error} ${error instanceof Error ? error.message : ""}`);
      return false;
    } finally {
      setWorking(false);
    }
  }

  async function createQuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const title = String(form.get("title") ?? "").trim();
    if (!title) return;

    const rawTargetDate = String(form.get("target_date") ?? "").trim();
    const targetDate = rawTargetDate ? parseLocalizedDate(rawTargetDate, lang) : null;
    if (rawTargetDate && !targetDate) {
      flash(t.invalidTargetDate);
      return;
    }

    const ok = await withWork(async () => {
      const { error } = await supabase.from("quests").insert({
        user_id: userId,
        title,
        description: String(form.get("description") ?? "").trim() || null,
        category: String(form.get("category") ?? "").trim() || null,
        target_date: targetDate,
        accent: String(form.get("accent") ?? "#7a3d5c")
      });
      return { error };
    });
    if (ok) {
      formElement.reset();
      setShowQuestForm(false);
    }
  }

  async function addStep(event: FormEvent<HTMLFormElement>, questId: string) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const title = String(form.get("title") ?? "").trim();
    const reason = String(form.get("xp_reason") ?? "step");
    const option = XP_OPTIONS.find((item) => item.key === reason) ?? XP_OPTIONS[0];
    if (!title) return;

    const ok = await withWork(async () => {
      const questSteps = steps.filter((step) => step.quest_id === questId);
      const { error } = await supabase.from("quest_steps").insert({
        user_id: userId,
        quest_id: questId,
        title,
        xp_reason: option.key,
        xp_value: option.value,
        sort_order: questSteps.length
      });
      return { error };
    });
    if (ok) formElement.reset();
  }

  async function toggleStep(step: QuestStep) {
    const completing = !step.completed_at;
    const ok = await withWork(async () => {
      const { error } = await supabase.from("quest_steps").update({
        completed_at: step.completed_at ? null : new Date().toISOString()
      }).eq("id", step.id);
      return { error };
    });
    if (!ok) return;
    if (completing) {
      playUiSound("success", soundEnabled);
      showXpBurst(step.xp_value);
    } else {
      playUiSound("undo", soundEnabled);
    }
  }

  async function deleteStep(stepId: string) {
    await withWork(async () => {
      const { error } = await supabase.from("quest_steps").delete().eq("id", stepId);
      return { error };
    }, t.deleted);
  }

  function requestDeleteStep(stepId: string) {
    askForConfirmation({
      title: t.confirmDeleteStepTitle,
      message: t.confirmDeleteStepText,
      confirmLabel: t.remove,
      danger: true,
      action: () => deleteStep(stepId)
    });
  }

  async function setQuestStatus(quest: Quest, status: "active" | "completed" | "archived") {
    await withWork(async () => {
      const { error } = await supabase.from("quests").update({
        status,
        completed_at: status === "completed" ? new Date().toISOString() : null
      }).eq("id", quest.id);
      return { error };
    }, status === "archived" ? t.archived : status === "active" ? t.restored : t.saved);
  }

  function requestArchiveQuest(quest: Quest) {
    askForConfirmation({
      title: t.confirmArchiveTitle,
      message: t.confirmArchiveText,
      confirmLabel: t.archive,
      action: () => setQuestStatus(quest, "archived")
    });
  }

  async function saveBoss(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    if (!title) return;

    const ok = await withWork(async () => {
      const { error } = await supabase.from("weekly_bosses").upsert({
        user_id: userId,
        week_start: weekStart,
        title,
        notes: String(form.get("notes") ?? "").trim() || null,
        xp_value: BOSS_XP,
        completed_at: currentBoss?.completed_at ?? null
      }, { onConflict: "user_id,week_start" });
      return { error };
    });
    if (ok) setShowBossForm(false);
  }

  async function toggleBoss() {
    if (!currentBoss) return;
    const defeating = !currentBoss.completed_at;
    const ok = await withWork(async () => {
      const { error } = await supabase.from("weekly_bosses").update({
        completed_at: currentBoss.completed_at ? null : new Date().toISOString()
      }).eq("id", currentBoss.id);
      return { error };
    });
    if (!ok) return;
    if (defeating) {
      playUiSound("boss", soundEnabled);
      showXpBurst(BOSS_XP);
    } else {
      playUiSound("undo", soundEnabled);
    }
  }

  async function createChain(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const title = String(form.get("title") ?? "").trim();
    if (!title) return;

    const ok = await withWork(async () => {
      const { error } = await supabase.from("chains").insert({
        user_id: userId,
        title,
        active: true
      });
      return { error };
    });
    if (ok) formElement.reset();
  }

  function isChainCheckedToday(chainId: string) {
    return checkins.some((checkin) => checkin.chain_id === chainId && checkin.checkin_date === today);
  }

  function chainLinks(chainId: string) {
    return checkins.filter((checkin) => checkin.chain_id === chainId).length;
  }

  async function checkInChain(chain: Chain) {
    if (isChainCheckedToday(chain.id)) return;
    const ok = await withWork(async () => {
      const { error } = await supabase.from("chain_checkins").insert({
        chain_id: chain.id,
        user_id: userId,
        checkin_date: today
      });
      return { error };
    });
    if (!ok) return;
    setChainCelebration(chain.id);
    playUiSound("chain", soundEnabled);
    window.setTimeout(() => setChainCelebration((current) => current === chain.id ? null : current), 1250);
  }

  async function undoChainCheckIn(chain: Chain) {
    const todayCheckin = checkins.find((checkin) => checkin.chain_id === chain.id && checkin.checkin_date === today);
    if (!todayCheckin) return;
    const ok = await withWork(async () => {
      const { error } = await supabase.from("chain_checkins").delete().eq("id", todayCheckin.id);
      return { error };
    }, t.chainUnlinked);
    if (ok) playUiSound("undo", soundEnabled);
  }

  async function finishChain(chain: Chain) {
    await withWork(async () => {
      const { error } = await supabase.from("chains").update({ active: false }).eq("id", chain.id);
      return { error };
    });
  }

  async function restoreChain(chain: Chain) {
    await withWork(async () => {
      const { error } = await supabase.from("chains").update({ active: true }).eq("id", chain.id);
      return { error };
    }, t.restored);
  }

  function requestFinishChain(chain: Chain) {
    askForConfirmation({
      title: t.confirmFinishChainTitle,
      message: t.confirmFinishChainText,
      confirmLabel: t.finishChain,
      action: () => finishChain(chain)
    });
  }

  async function addReward(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const title = String(form.get("title") ?? "").trim();
    const cost = Math.round(Number(rewardCost));
    if (!title || rewardCost.trim() === "" || !Number.isFinite(cost) || cost < 1) return;

    const xpRequired = totalXp + cost;
    const ok = await withWork(async () => {
      const { error } = await supabase.from("rewards").insert({
        user_id: userId,
        title,
        xp_required: xpRequired
      });
      return { error };
    });
    if (ok) {
      formElement.reset();
      setRewardCost("");
      setSelectedRewardPreset(null);
    }
  }

  async function claimReward(reward: Reward) {
    if (reward.claimed_at || totalXp < reward.xp_required) return;
    const ok = await withWork(async () => {
      const { error } = await supabase.from("rewards").update({ claimed_at: new Date().toISOString() }).eq("id", reward.id);
      return { error };
    });
    if (!ok) return;
    setRewardCelebration(reward.id);
    playUiSound("reward", soundEnabled);
    window.setTimeout(() => setRewardCelebration((current) => current === reward.id ? null : current), 1400);
  }

  async function undoRewardClaim(reward: Reward) {
    if (!reward.claimed_at) return;
    const ok = await withWork(async () => {
      const { error } = await supabase.from("rewards").update({ claimed_at: null }).eq("id", reward.id);
      return { error };
    }, t.rewardUnclaimed);
    if (ok) playUiSound("undo", soundEnabled);
  }

  function requestClaimReward(reward: Reward) {
    askForConfirmation({
      title: t.confirmClaimRewardTitle,
      message: t.confirmClaimRewardText,
      confirmLabel: t.claim,
      action: () => claimReward(reward)
    });
  }

  async function deleteReward(rewardId: string) {
    await withWork(async () => {
      const { error } = await supabase.from("rewards").delete().eq("id", rewardId);
      return { error };
    }, t.deleted);
  }

  function requestDeleteReward(rewardId: string) {
    askForConfirmation({
      title: t.confirmDeleteRewardTitle,
      message: t.confirmDeleteRewardText,
      confirmLabel: t.remove,
      danger: true,
      action: () => deleteReward(rewardId)
    });
  }

  async function signOut() {
    setWorking(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        flash(`${t.error} ${error.message}`);
        return;
      }
      router.push("/");
      router.refresh();
    } finally {
      setWorking(false);
    }
  }

  function requestSignOut() {
    askForConfirmation({
      title: t.signOutTitle,
      message: t.signOutText,
      confirmLabel: t.signOut,
      danger: true,
      action: signOut
    });
  }

  function chainWindow(chain: Chain) {
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const createdDate = new Date(chain.created_at);
    createdDate.setHours(0, 0, 0, 0);

    const sevenDayWindow = new Date(todayDate);
    sevenDayWindow.setDate(sevenDayWindow.getDate() - 6);

    const windowStart = createdDate.getTime() > sevenDayWindow.getTime() ? createdDate : sevenDayWindow;
    const truncated = createdDate.getTime() < sevenDayWindow.getTime();
    const days: { iso: string; label: string; dayNumber: string; state: ChainDayState }[] = [];

    for (const cursor = new Date(windowStart); cursor.getTime() <= todayDate.getTime(); cursor.setDate(cursor.getDate() + 1)) {
      const date = new Date(cursor);
      const iso = isoDateLocal(date);
      const hit = checkins.some((item) => item.chain_id === chain.id && item.checkin_date === iso);
      const state: ChainDayState = hit ? "hit" : iso === today ? "today" : "break";
      days.push({
        iso,
        label: new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", { weekday: "short" }).format(date).replace(".", ""),
        dayNumber: new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", { day: "numeric" }).format(date),
        state
      });
    }

    return {
      days,
      truncated,
      started: new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "short" }).format(createdDate)
    };
  }

  if (loading) {
    return <main className="loading-screen"><div className="spinner" /><p>{t.loading}</p></main>;
  }

  return (
    <main className="app-shell">
      <ChainMetalDefs />
      {xpBurst && <div className="xp-burst" key={xpBurst.id} aria-live="polite"><span>+{xpBurst.amount} XP</span><i>✦</i><i>✧</i></div>}
      <header className="app-header">
        <button className="brand-home-button" type="button" onClick={() => setTab("today")} aria-label={t.home} title={t.home}>
          <BrandLockup compact />
        </button>
        <nav className="desktop-tabs" aria-label="Main navigation">
          {(["today", "quests", "chain", "rewards", "help"] as Tab[]).map((item) => (
            <button
              key={item}
              type="button"
              className={tab === item ? "nav-tab active" : "nav-tab"}
              aria-current={tab === item ? "page" : undefined}
              onClick={() => { setTab(item); setProfileOpen(false); }}
            >
              {t[item]}
            </button>
          ))}
        </nav>
        <div className="header-actions">
          <button className={soundEnabled ? "sound-button active" : "sound-button"} type="button" onClick={toggleSound} aria-pressed={soundEnabled} aria-label={soundEnabled ? t.soundOn : t.soundOff} title={soundEnabled ? t.soundOn : t.soundOff}><SoundIcon enabled={soundEnabled} /></button>
          <button className="lang-button" type="button" onClick={toggleLanguage}>{lang === "ru" ? "EN" : "RU"}</button>
          <div className="account-menu-wrap" ref={accountMenuRef}>
            <button
              className="avatar-button"
              type="button"
              title={`${email} · ${t.account}`}
              aria-label={t.accountMenu}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((value) => !value)}
              disabled={working}
            >
              {email.slice(0, 1).toUpperCase() || "Q"}
            </button>
            {profileOpen && (
              <div className="account-menu" role="menu" aria-label={t.accountMenu}>
                <div className="account-menu-head">
                  <span className="account-menu-avatar" aria-hidden="true">{email.slice(0, 1).toUpperCase() || "Q"}</span>
                  <div><strong>{t.account}</strong><span>{email}</span></div>
                </div>
                <button type="button" role="menuitem" onClick={() => { setTab("help"); setProfileOpen(false); }}>{t.openGuide}</button>
                <button type="button" role="menuitem" className="danger-text" onClick={requestSignOut}>{t.signOut}</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {notice && <div className="toast" role="status">{notice}</div>}

      <section className="content-shell">
        {tab === "today" && (
          <div className="page-stack today-page">
            <section className="today-heading">
              <div>
                <p className="eyebrow">{t.dashboardEyebrow}</p>
                <h1>{t.dashboardTitle}</h1>
                <p>{t.dashboardLead}</p>
              </div>
              <div className="today-status">
                <span className="today-date">{todayLabel}</span>
                <div className="today-stat-pills">
                  <span><strong>{pendingQuickSteps}</strong>{t.pendingActions}</span>
                  <span><strong>{checkedChainsToday}/{activeChains.length}</strong>{t.chainsToday}</span>
                </div>
              </div>
            </section>

            <div className="today-overview-grid">
              <section className="hero-panel compact-hero" style={{ "--level-primary": levelPalette.primary, "--level-secondary": levelPalette.secondary, "--level-tertiary": levelPalette.tertiary, "--level-shadow": levelPalette.shadow } as React.CSSProperties}>
                <div className="level-orb" style={{ "--level-progress": `${level.percent}%` } as React.CSSProperties}><span>{t.level}</span><strong>{level.level}</strong></div>
                <div className="level-main">
                  <div className="level-row"><strong>{totalXp} XP</strong><span>{level.current} / {level.needed} XP {t.nextLevel}</span></div>
                  <div className="progress-track large"><span style={{ width: `${level.percent}%` }} /></div>
                  <div className="hero-stats">
                    <div><span>{t.activeQuests}</span><strong>{activeQuests.length}</strong></div>
                    <div><span>{t.totalXp}</span><strong>{totalXp}</strong></div>
                  </div>
                </div>
              </section>

              <section className={currentBoss?.completed_at ? "boss-card defeated" : "boss-card"}>
                <div className="boss-icon" aria-hidden="true">◆</div>
                <div className="boss-copy">
                  <div className="card-heading-row">
                    <div><p className="eyebrow">{t.weeklyBoss} · +{BOSS_XP} XP</p><h2>{currentBoss?.title ?? t.weeklyBoss}</h2></div>
                    {currentBoss && <button className="text-button" type="button" onClick={() => setShowBossForm((value) => !value)}>{t.replaceBoss}</button>}
                  </div>
                  {currentBoss ? (
                    <>
                      {currentBoss.notes && <p>{currentBoss.notes}</p>}
                      <button className={currentBoss.completed_at ? "button button-ghost" : "button button-primary"} type="button" onClick={toggleBoss} disabled={working}>
                        {currentBoss.completed_at ? t.undoBoss : t.defeatBoss}
                      </button>
                    </>
                  ) : (
                    <>
                      <p>{t.bossHint}</p>
                      <button className="button button-primary" type="button" onClick={() => setShowBossForm(true)}>{t.setBoss}</button>
                    </>
                  )}
                  {showBossForm && (
                    <form className="inline-form boss-form" onSubmit={saveBoss}>
                      <input name="title" required maxLength={180} defaultValue={currentBoss?.title ?? ""} placeholder={t.bossPlaceholder} />
                      <textarea name="notes" maxLength={600} defaultValue={currentBoss?.notes ?? ""} placeholder={t.bossNotes} rows={2} />
                      <div className="form-actions"><button className="button button-primary" disabled={working} type="submit">{t.setBoss}</button><button className="button button-ghost" type="button" onClick={() => setShowBossForm(false)}>{t.cancel}</button></div>
                    </form>
                  )}
                </div>
              </section>
            </div>

            <div className="today-action-grid">
              <section className="quick-panel action-panel">
                <div className="section-heading compact-heading">
                  <div><p className="eyebrow">{t.questActionsEyebrow}</p><h2>{t.quickSteps}</h2><p>{t.quickStepsLead}</p></div>
                  <button className="text-button" type="button" onClick={() => setTab("quests")}>{t.openAllQuests}</button>
                </div>
                {quickSteps.length === 0 ? <p className="empty-inline">{t.noQuickSteps}</p> : (
                  <div className="quick-step-list">
                    {quickSteps.map((step) => {
                      const quest = activeQuests.find((item) => item.id === step.quest_id);
                      return (
                        <div key={step.id} className={step.completed_at ? "quick-step-row completed" : "quick-step-row"}>
                          <button className="check-button" type="button" onClick={() => toggleStep(step)} disabled={working} aria-label={step.completed_at ? t.undo : t.done}>{step.completed_at ? "✓" : ""}</button>
                          <div className="quick-step-copy"><strong>{step.title}</strong><span>{quest?.title ?? t.quests} · +{step.xp_value} XP</span></div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="quick-panel action-panel">
                <div className="section-heading compact-heading">
                  <div><p className="eyebrow">{t.dailyLoopEyebrow}</p><h2>{t.repeatingGoals}</h2><p>{t.repeatingGoalsLead}</p></div>
                  <button className="text-button" type="button" onClick={() => setTab("chain")}>{t.manageChains}</button>
                </div>
                {activeChains.length === 0 ? <p className="empty-inline">{t.noRepeatingGoals}</p> : (
                  <div className="daily-chain-list">
                    {activeChains.map((chain) => {
                      const checked = isChainCheckedToday(chain.id);
                      return (
                        <div key={chain.id} className={checked ? "daily-chain-row completed" : "daily-chain-row"}>
                          <button className="check-button" type="button" onClick={() => checked ? undoChainCheckIn(chain) : checkInChain(chain)} disabled={working} aria-label={checked ? t.undo : t.linkToday}>{checked ? "✓" : ""}</button>
                          <div><strong>{chain.title}</strong><span>{formatLinkCount(chainLinks(chain.id), lang)}</span></div>
                          <span className="daily-status">{checked ? t.undo : t.linkToday}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <section className="focus-section">
              <div className="section-heading"><div><p className="eyebrow">{t.focus}</p><h2>{t.activeQuests}</h2></div><button className="button button-secondary" type="button" onClick={() => { setTab("quests"); setShowQuestForm(true); }}>+ {t.newQuest}</button></div>
              {activeQuests.length === 0 ? (
                <div className="empty-card"><p>{t.noQuests}</p><button className="button button-primary" type="button" onClick={() => { setTab("quests"); setShowQuestForm(true); }}>{t.createFirst}</button></div>
              ) : (
                <div className="quest-grid compact-grid">{activeQuests.slice(0, 6).map((quest) => <QuestSummary key={quest.id} quest={quest} steps={steps} lang={lang} onOpen={() => setTab("quests")} />)}</div>
              )}
            </section>
          </div>
        )}

        {tab === "quests" && (
          <div className="page-stack">
            <div className="section-heading"><div><p className="eyebrow">{t.questLogEyebrow}</p><h1>{t.quests}</h1></div><button className="button button-primary" type="button" onClick={() => setShowQuestForm((value) => !value)}>+ {t.newQuest}</button></div>

            {showQuestForm && (
              <form className="create-panel" onSubmit={createQuest}>
                <div className="form-grid two-cols">
                  <label className="wide"><span>{t.questTitle}</span><input required maxLength={120} name="title" placeholder={t.questTitle} /></label>
                  <label className="wide"><span>{t.questDescription}</span><textarea maxLength={600} name="description" rows={2} placeholder={t.questDescription} /></label>
                  <label><span>{t.questCategory}</span><input maxLength={50} name="category" placeholder={t.questCategoryPlaceholder} /></label>
                  <label><span>{t.targetDate}</span><input type="text" inputMode="numeric" autoComplete="off" maxLength={10} name="target_date" placeholder={t.targetDatePlaceholder} onInput={(event) => { event.currentTarget.value = maskLocalizedDate(event.currentTarget.value, lang); }} /></label>
                  <label><span>{t.accent}</span><input className="color-input" type="color" name="accent" defaultValue="#7a3d5c" /></label>
                </div>
                <div className="form-actions"><button className="button button-primary" disabled={working} type="submit">{t.createQuest}</button><button type="button" className="button button-ghost" onClick={() => setShowQuestForm(false)}>{t.cancel}</button></div>
              </form>
            )}

            <div className="segmented quest-filters">
              <button type="button" className={questFilter === "active" ? "active" : ""} aria-pressed={questFilter === "active"} onClick={() => setQuestFilter("active")}>{t.active} · {activeQuests.length}</button>
              <button type="button" className={questFilter === "completed" ? "active" : ""} aria-pressed={questFilter === "completed"} onClick={() => setQuestFilter("completed")}>{t.finished} · {completedQuests.length}</button>
              <button type="button" className={questFilter === "archived" ? "active" : ""} aria-pressed={questFilter === "archived"} onClick={() => setQuestFilter("archived")}>{t.archivedTab} · {archivedQuests.length}</button>
            </div>

            {visibleQuests.length === 0 ? (
              <div className="empty-card"><p>{emptyQuestFilterMessage}</p></div>
            ) : (
              <div className="quest-list">
                {visibleQuests.map((quest) => {
                  const questSteps = steps.filter((step) => step.quest_id === quest.id);
                  const completedCount = questSteps.filter((step) => step.completed_at).length;
                  const percent = questSteps.length ? Math.round((completedCount / questSteps.length) * 100) : 0;
                  const allDone = questSteps.length > 0 && completedCount === questSteps.length;
                  return (
                    <article key={quest.id} className="quest-card" style={{ "--quest-accent": quest.accent } as React.CSSProperties}>
                      <div className="quest-accent" />
                      <div className="quest-card-body">
                        <div className="quest-head">
                          <div>
                            <div className="quest-meta">{quest.category && <span>{quest.category}</span>}{quest.target_date && <span>{t.due} {formatDate(quest.target_date, lang)}</span>}{quest.status === "completed" && <span className="complete-pill">{t.completed}</span>}{quest.status === "archived" && <span>{t.archivedTab}</span>}</div>
                            <h2>{quest.title}</h2>
                            {quest.description && <p>{quest.description}</p>}
                          </div>
                          <div className="quest-percent"><strong>{percent}%</strong><span>{completedCount}/{questSteps.length}</span></div>
                        </div>
                        <div className="progress-track"><span style={{ width: `${percent}%`, background: quest.accent }} /></div>

                        <div className="step-list">
                          {questSteps.length === 0 && <p className="empty-inline">{t.emptyQuest}</p>}
                          {questSteps.map((step) => (
                            <div key={step.id} className={step.completed_at ? "step-row completed" : "step-row"}>
                              <button className="check-button" type="button" onClick={() => toggleStep(step)} disabled={working || quest.status !== "active"} aria-label={step.completed_at ? t.undo : t.done}>{step.completed_at ? "✓" : ""}</button>
                              <div className="step-main"><span>{step.title}</span><small>+{step.xp_value} XP · {t[xpLabelKey[step.xp_reason] ?? "xpStep"]}</small></div>
                              {quest.status === "active" ? <button className="icon-button danger" type="button" title={t.remove} aria-label={t.remove} onClick={() => requestDeleteStep(step.id)} disabled={working}>×</button> : <span aria-hidden="true" />}
                            </div>
                          ))}
                        </div>

                        {quest.status === "active" && (
                          <form className="step-form" onSubmit={(event) => addStep(event, quest.id)}>
                            <input name="title" required maxLength={180} placeholder={t.stepPlaceholder} />
                            <select name="xp_reason" defaultValue="step" aria-label={t.xpType}>
                              {XP_OPTIONS.map((option) => <option key={option.key} value={option.key}>+{option.value} XP — {t[xpLabelKey[option.key]]}</option>)}
                            </select>
                            <button className="button button-secondary" type="submit" disabled={working}>{t.addStep}</button>
                          </form>
                        )}

                        <div className="quest-footer">
                          {quest.status === "active" ? (
                            <><button className="button button-ghost" type="button" disabled={!allDone || working} onClick={() => setQuestStatus(quest, "completed")}>{t.completeQuest}</button><button className="text-button danger-text" type="button" disabled={working} onClick={() => requestArchiveQuest(quest)}>{t.archive}</button></>
                          ) : (
                            <button className="button button-ghost" type="button" disabled={working} onClick={() => setQuestStatus(quest, "active")}>{t.reopenQuest}</button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "chain" && (
          <div className="page-stack narrow-stack">
            <div className="section-heading"><div><p className="eyebrow">{t.chainEyebrow}</p><h1>{t.chainTitle}</h1><p>{t.chainLead}</p></div></div>
            <section className="create-panel chain-create-panel">
              <form className="chain-create-form" onSubmit={createChain}>
                <input name="title" required maxLength={180} placeholder={t.chainPlaceholder} />
                <button className="button button-primary" disabled={working} type="submit">{activeChains.length ? t.addAnotherChain : t.startChain}</button>
              </form>
            </section>

            {activeChains.length === 0 ? <div className="empty-card"><p>{t.chainEmpty}</p></div> : (
              <div className="chain-list">
                {activeChains.map((chain) => {
                  const checked = isChainCheckedToday(chain.id);
                  const links = chainLinks(chain.id);
                  const history = chainWindow(chain);
                  return (
                    <article className={`${checked ? "chain-row checked" : "chain-row"}${chainCelebration === chain.id ? " chain-celebrating" : ""}`} key={chain.id}>
                      <div className="chain-row-main">
                        <div className="chain-title-row">
                          <div><h2>{chain.title}</h2><span>{formatLinkCount(links, lang)}</span></div>
                          <span className="chain-start-date">{t.chainStart}: {history.started}</span>
                        </div>
                        <p className="chain-soft-hint">{t.glossyChainHint}</p>
                        <div className="chain-track-scroll" aria-label={t.lastDays}>
                          <div className="chain-track glossy-chain-track">
                            <ChainStartCharm label={t.chainStart} />
                            {history.truncated && <div className="chain-history-gap glossy-gap" aria-hidden="true"><span>•••</span></div>}
                            {history.days.map((day, index) => {
                              const stateLabel = day.state === "hit" ? t.chainBuilt : day.state === "break" ? t.chainBreak : t.chainToday;
                              const celebrate = chainCelebration === chain.id && day.iso === today && day.state === "hit";
                              return (
                                <div key={day.iso} className={`chain-day chain-day-${day.state}${celebrate ? " is-new-link" : ""}`} title={`${day.iso} · ${stateLabel}`}>
                                  <span className="chain-day-label">{day.label} {day.dayNumber}</span>
                                  <ChainLinkGlyph state={day.state} index={index} celebrate={celebrate} />
                                  <small>{stateLabel}</small>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="chain-actions">
                        <button className={checked ? "button button-ghost" : "button button-secondary chain-action-primary"} type="button" onClick={() => checked ? undoChainCheckIn(chain) : checkInChain(chain)} disabled={working}>{checked ? t.undo : t.linkToday}</button>
                        <button className="text-button danger-text" type="button" onClick={() => requestFinishChain(chain)} disabled={working}>{t.finishChain}</button>
                      </div>
                      {chainCelebration === chain.id && <div className="chain-sparkles" aria-hidden="true"><i>✦</i><i>✧</i><i>✦</i></div>}
                    </article>
                  );
                })}
              </div>
            )}

            <section className="finished-chain-section">
              <div className="subsection-heading">
                <h2>{t.finishedChains}</h2>
                <span>{finishedChains.length}</span>
              </div>
              {finishedChains.length === 0 ? (
                <p className="empty-inline">{t.noFinishedChains}</p>
              ) : (
                <div className="finished-chain-list">
                  {finishedChains.map((chain) => {
                    const history = chainWindow(chain);
                    return (
                      <article className="finished-chain-row" key={chain.id}>
                        <div>
                          <strong>{chain.title}</strong>
                          <span>{formatLinkCount(chainLinks(chain.id), lang)} · {t.chainStart}: {history.started}</span>
                        </div>
                        <button className="button button-ghost" type="button" onClick={() => restoreChain(chain)} disabled={working}>{t.restoreChain}</button>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {tab === "rewards" && (
          <div className="page-stack narrow-stack">
            <div className="section-heading"><div><p className="eyebrow">{t.rewardsEyebrow}</p><h1>{t.rewardTitle}</h1><p>{t.rewardLead}</p></div></div>
            <section className="reward-planner" aria-labelledby="reward-planner-title">
              <div className="reward-planner-copy">
                <p className="eyebrow">{t.rewardPlannerEyebrow}</p>
                <h2 id="reward-planner-title">{t.rewardPlannerTitle}</h2>
                <p>{t.rewardPlannerText}</p>
              </div>
              <div className="reward-presets" role="group" aria-label={t.rewardPlannerTitle}>
                {[
                  { value: 25, label: t.rewardSmall },
                  { value: 50, label: t.rewardRegular, recommended: true },
                  { value: 100, label: t.rewardMeaningful },
                  { value: 200, label: t.rewardBig }
                ].map((option) => {
                  const active = selectedRewardPreset === option.value;
                  return (
                    <button
                      key={option.value}
                      className={active ? "reward-preset active" : "reward-preset"}
                      type="button"
                      onClick={() => {
                        if (active) {
                          setSelectedRewardPreset(null);
                          setRewardCost("");
                        } else {
                          setSelectedRewardPreset(option.value);
                          setRewardCost(String(option.value));
                        }
                      }}
                      aria-pressed={active}
                    >
                      <span>{option.label}{option.recommended ? <small>{t.rewardRecommended}</small> : null}</span>
                      <strong>+{option.value} XP</strong>
                    </button>
                  );
                })}
              </div>
            </section>
            <form className="create-panel reward-form reward-form-simple" onSubmit={addReward}>
              <input name="title" required maxLength={180} placeholder={t.rewardPlaceholder} />
              <label className="reward-inline-xp">
                <span>{t.xpNeeded}</span>
                <div>
                  <input
                    value={rewardCost}
                    onChange={(event) => {
                      setSelectedRewardPreset(null);
                      setRewardCost(event.target.value.replace(/\D/g, "").slice(0, 7));
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="XP"
                    aria-label={t.xpNeeded}
                    required
                  />
                  <span>XP</span>
                </div>
              </label>
              <button className="button button-primary" disabled={working || rewardCost.trim() === "" || Number(rewardCost) < 1} type="submit">{t.addReward}</button>
            </form>
            {rewards.length === 0 ? <div className="empty-card"><p>{t.rewardEmpty}</p></div> : (
              <div className="reward-list">
                {rewards.map((reward) => {
                  const unlocked = totalXp >= reward.xp_required;
                  const percent = Math.min(100, Math.round((totalXp / reward.xp_required) * 100));
                  return (
                    <article key={reward.id} className={`${reward.claimed_at ? "reward-card claimed" : "reward-card"}${rewardCelebration === reward.id ? " reward-celebrating" : ""}`}>
                      <div className="reward-head"><div><span className={unlocked ? "status-pill unlocked" : "status-pill"}>{reward.claimed_at ? t.claimed : unlocked ? t.unlocked : t.locked}</span><h2>{reward.title}</h2></div><strong>{reward.xp_required} XP</strong></div>
                      <div className="progress-track"><span style={{ width: `${percent}%` }} /></div>
                      <div className="reward-actions"><span>{unlocked ? `${reward.xp_required} / ${reward.xp_required} XP` : `${t.rewardRemaining}: ${Math.max(0, reward.xp_required - totalXp)} XP · ${totalXp} / ${reward.xp_required} XP`}</span><div><button className="button button-secondary" type="button" disabled={!unlocked || working} onClick={() => reward.claimed_at ? undoRewardClaim(reward) : requestClaimReward(reward)}>{reward.claimed_at ? t.undoClaim : t.claim}</button><button className="icon-button danger" type="button" title={t.remove} aria-label={t.remove} onClick={() => requestDeleteReward(reward.id)} disabled={working}>×</button></div></div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "help" && (
          <div className="page-stack narrow-stack">
            <div className="section-heading"><div><p className="eyebrow">{t.helpEyebrow}</p><h1>{t.helpTitle}</h1><p>{t.helpLead}</p></div></div>
            <div className="help-grid">
              <article className="help-card xp-help-card">
                <span className="principle-number">XP</span>
                <h2>{t.xpHelpTitle}</h2>
                <div className="xp-help-list">
                  <div><strong>+1 XP</strong><span>{t.xpRegularHelp}</span></div>
                  <div><strong>+5 XP</strong><span>{t.xpPromiseHelp}</span></div>
                  <div><strong>+7 XP</strong><span>{t.xpHardHelp}</span></div>
                  <div><strong>+10 XP</strong><span>{t.xpDelayHelp}</span></div>
                </div>
              </article>
              <article className="help-card"><span className="principle-number">⛓</span><h2>{t.noPunishment}</h2><p>{t.noPunishmentText}</p></article>
              <article className="help-card"><span className="principle-number">◆</span><h2>{t.bossHelpTitle}</h2><p>{t.bossHelpText}</p></article>
              <article className="help-card"><span className="principle-number">☆</span><h2>{t.rewardHelpTitle}</h2><p>{t.rewardHelpText}</p></article>
              <article className="help-card sound-help-card"><span className="principle-number sound-principle"><SoundIcon enabled={soundEnabled} /></span><h2>{t.soundHelpTitle}</h2><p>{t.soundHelpText}</p><button className={soundEnabled ? "sound-setting active" : "sound-setting"} type="button" onClick={toggleSound} aria-pressed={soundEnabled}><span>{soundEnabled ? t.soundOn : t.soundOff}</span><i aria-hidden="true" /></button></article>
              <article className="help-card contacts-card">
                <div><p className="eyebrow">{t.contactsEyebrow}</p><h2>{t.contactsTitle}</h2><p>{t.contactsLead}</p></div>
                <div className="contact-links">
                  <a className="contact-button" href="mailto:ekaterina.pyshkova@gmail.com">
                    <span className="contact-icon" aria-hidden="true">✉</span>
                    <span><small>{t.emailContact}</small><strong>ekaterina.pyshkova@gmail.com</strong></span>
                  </a>
                  <a className="contact-button" href="https://t.me/kemisayega" target="_blank" rel="noreferrer">
                    <span className="contact-icon telegram-icon" aria-hidden="true">↗</span>
                    <span><small>{t.telegramContact}</small><strong>@kemisayega</strong></span>
                  </a>
                </div>
              </article>
            </div>
          </div>
        )}
      </section>

      <nav className="mobile-tabs" aria-label="Mobile navigation">
        {(["today", "quests", "chain", "rewards", "help"] as Tab[]).map((item) => (
          <button
            key={item}
            type="button"
            className={tab === item ? "active" : ""}
            aria-current={tab === item ? "page" : undefined}
            onClick={() => { setTab(item); setProfileOpen(false); }}
          >
            <span>{item === "today" ? "⌂" : item === "quests" ? "◇" : item === "chain" ? "⛓" : item === "rewards" ? "☆" : "?"}</span>
            {item === "help" ? t.helpShort : t[item]}
          </button>
        ))}
      </nav>

      {confirmAction && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !working) setConfirmAction(null); }}>
          <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
            <div className={confirmAction.danger ? "confirm-icon danger" : "confirm-icon"} aria-hidden="true">{confirmAction.danger ? "!" : "?"}</div>
            <div>
              <h2 id="confirm-dialog-title">{confirmAction.title}</h2>
              <p>{confirmAction.message}</p>
            </div>
            <div className="confirm-actions">
              <button className="button button-ghost" type="button" onClick={() => setConfirmAction(null)} disabled={working}>{t.cancel}</button>
              <button className={confirmAction.danger ? "button button-danger" : "button button-primary"} type="button" onClick={runConfirmedAction} disabled={working}>{confirmAction.confirmLabel}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function ChainMetalDefs() {
  return (
    <svg className="chain-svg-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="qf-steel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.16" stopColor="#b9bec8" />
          <stop offset="0.42" stopColor="#f7f8fb" />
          <stop offset="0.62" stopColor="#7f8794" />
          <stop offset="0.82" stopColor="#e9ecf2" />
          <stop offset="1" stopColor="#a0a6b0" />
        </linearGradient>
        <linearGradient id="qf-steel-dim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5f0ef" />
          <stop offset="0.5" stopColor="#bdb5b7" />
          <stop offset="1" stopColor="#80797e" />
        </linearGradient>
        <linearGradient id="qf-rose-steel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff9fb" />
          <stop offset="0.34" stopColor="#d7a9bb" />
          <stop offset="0.7" stopColor="#8f526b" />
          <stop offset="1" stopColor="#edd4de" />
        </linearGradient>
        <linearGradient id="qf-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3c9" />
          <stop offset="0.42" stopColor="#d7b06b" />
          <stop offset="0.7" stopColor="#a97736" />
          <stop offset="1" stopColor="#f4dda8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ChainStartCharm({ label }: { label: string }) {
  return (
    <div className="chain-origin glossy-origin" title={label}>
      <span className="start-charm" aria-hidden="true">
        <svg viewBox="0 0 62 62">
          <circle cx="31" cy="31" r="20" fill="rgba(255,255,255,.74)" stroke="url(#qf-gold)" strokeWidth="6" />
          <path d="M31 18 L34 27 L43 31 L34 35 L31 44 L28 35 L19 31 L28 27 Z" fill="#fff8e4" stroke="#b98950" strokeWidth="1.5" />
          <circle cx="49" cy="18" r="4" fill="#fff7de" stroke="#b98950" strokeWidth="2" />
        </svg>
      </span>
      <small>{label}</small>
    </div>
  );
}

function ChainLinkGlyph({ state, index, celebrate = false }: { state: ChainDayState; index: number; celebrate?: boolean }) {
  const rotation = index % 2 === 0 ? -24 : 24;
  if (state === "break") {
    return (
      <span className="chain-link-glyph-svg broken" aria-hidden="true">
        <svg viewBox="0 0 86 58">
          <path className="broken-link-half broken-link-left" d="M8 34 C9 19 24 11 37 17 C42 19 46 23 49 28" />
          <path className="broken-link-half broken-link-right" d="M78 24 C75 39 60 47 48 41 C43 39 39 35 36 30" />
          <path className="metal-highlight broken-highlight-left" d="M13 30 C17 20 28 16 37 20" />
          <path className="metal-highlight broken-highlight-right" d="M73 28 C69 38 59 42 50 39" />
          <circle className="break-particle p1" cx="42" cy="11" r="2" />
          <circle className="break-particle p2" cx="48" cy="49" r="1.7" />
          <path className="break-spark" d="M57 8 L59 13 L64 15 L59 17 L57 22 L55 17 L50 15 L55 13 Z" />
          <path className="break-spark small" d="M30 42 L31.5 46 L35 47.5 L31.5 49 L30 53 L28.5 49 L25 47.5 L28.5 46 Z" />
        </svg>
      </span>
    );
  }

  return (
    <span className={`chain-link-glyph-svg ${state}${celebrate ? " celebrate" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 86 58">
        <g transform={`rotate(${rotation} 43 29)`}>
          <rect className="metal-link-shadow" x="13" y="16" width="60" height="27" rx="13.5" />
          <rect className="metal-link" x="13" y="16" width="60" height="27" rx="13.5" />
          <path className="metal-highlight" d="M24 20 C36 15 55 16 65 22" />
          {state === "hit" && <path className="link-glint" d="M60 13 L62 19 L68 21 L62 23 L60 29 L58 23 L52 21 L58 19 Z" />}
        </g>
      </svg>
    </span>
  );
}

function SoundIcon({ enabled }: { enabled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 10v4h3l4 3V7l-4 3H5Z" fill="currentColor" />
      {enabled ? <><path d="M15 9.4a4 4 0 0 1 0 5.2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M17.6 7a7.2 7.2 0 0 1 0 10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></> : <path d="M15.5 9.5l5 5m0-5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  );
}

function QuestSummary({ quest, steps, lang, onOpen }: { quest: Quest; steps: QuestStep[]; lang: Lang; onOpen: () => void }) {
  const questSteps = steps.filter((step) => step.quest_id === quest.id);
  const done = questSteps.filter((step) => step.completed_at).length;
  const percent = questSteps.length ? Math.round((done / questSteps.length) * 100) : 0;
  return (
    <button className="quest-summary" type="button" onClick={onOpen} style={{ "--quest-accent": quest.accent } as React.CSSProperties}>
      <span className="summary-accent" />
      <span className="quest-meta">{quest.category || (lang === "ru" ? "Квест" : "Quest")}</span>
      <strong>{quest.title}</strong>
      <span className="summary-progress"><span><i style={{ width: `${percent}%`, background: quest.accent }} /></span><b>{percent}%</b></span>
    </button>
  );
}

function formatLinkCount(count: number, lang: Lang) {
  if (lang === "en") return `${count} ${count === 1 ? "link" : "links"}`;
  const mod10 = count % 10;
  const mod100 = count % 100;
  const word = mod10 === 1 && mod100 !== 11 ? "звено" : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? "звена" : "звеньев";
  return `${count} ${word}`;
}

function maskLocalizedDate(value: string, lang: Lang) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const separator = lang === "ru" ? "." : "/";
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}${separator}${digits.slice(2)}`;
  return `${digits.slice(0, 2)}${separator}${digits.slice(2, 4)}${separator}${digits.slice(4)}`;
}

function parseLocalizedDate(value: string, lang: Lang) {
  const normalized = value.trim();
  const match = lang === "ru"
    ? normalized.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
    : normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (!match) return null;
  const day = lang === "ru" ? Number(match[1]) : Number(match[2]);
  const month = lang === "ru" ? Number(match[2]) : Number(match[1]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDate(value: string, lang: Lang) {
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

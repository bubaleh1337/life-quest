"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { BOSS_XP, getLevelProgress, isoDateLocal, startOfWeekLocal, XP_OPTIONS } from "@/lib/game";
import type { Chain, ChainCheckin, Quest, QuestStep, Reward, WeeklyBoss } from "@/lib/types";

type Lang = "ru" | "en";
type Tab = "today" | "quests" | "chain" | "rewards";

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
    quickSteps: "Быстрые шаги",
    quickStepsLead: "Отмечай шаги активных квестов прямо с главной страницы.",
    noQuickSteps: "В активных квестах пока нет шагов для отметки.",
    openAllQuests: "Открыть все квесты",
    repeatingGoals: "Повторяемые цели",
    repeatingGoalsLead: "Ежедневные действия можно отмечать одним нажатием.",
    manageChains: "Управлять цепочками",
    noRepeatingGoals: "Пока нет повторяемых целей.",
    chainTitle: "Непрерывные цепочки",
    chainLead: "Добавляй несколько повторяемых действий. Пропуск не обнуляет прогресс — на следующий день просто продолжаешь.",
    chainPlaceholder: "Например: просыпаться в 5:45",
    startChain: "Добавить цепочку",
    addAnotherChain: "Добавить повторяемую цель",
    linkToday: "Выполнено сегодня",
    linkedToday: "Сегодня уже выполнено",
    links: "звеньев",
    finishChain: "Завершить цепочку",
    chainEmpty: "Активных цепочек пока нет. Добавь первую повторяемую цель.",
    lastDays: "Последние 7 дней",
    rewardTitle: "Награды за путь",
    rewardLead: "Награда открывается по общему XP и не списывает прогресс.",
    rewardPlaceholder: "Например: сходить на массаж",
    xpNeeded: "Нужно XP",
    addReward: "Добавить награду",
    unlocked: "Открыта",
    locked: "Закрыта",
    claim: "Получить награду",
    claimed: "Получена",
    rewardEmpty: "Добавь награду, которую действительно хочется заслужить.",
    signOut: "Выйти",
    loading: "Загрузка приключения…",
    error: "Что-то пошло не так.",
    saved: "Сохранено.",
    deleted: "Изменение сохранено.",
    xpGuide: "Система XP",
    xpGuideText: "Награждаем не только результат, но и сложность самого действия.",
    noPunishment: "Без наказания за пропуск",
    noPunishmentText: "Каждая цепочка считает выполненные дни, но никогда не сбрасывается в ноль.",
    archive: "Архивировать",
    archived: "Квест архивирован.",
    active: "Активные",
    finished: "Завершённые",
    noFinished: "Завершённых квестов пока нет.",
    due: "до",
    remove: "Удалить",
    home: "На главную"
  },
  en: {
    today: "Today",
    quests: "Quests",
    chain: "Chains",
    rewards: "Rewards",
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
    quickSteps: "Quick steps",
    quickStepsLead: "Check off active quest steps directly from your home page.",
    noQuickSteps: "There are no active quest steps to check off yet.",
    openAllQuests: "Open all quests",
    repeatingGoals: "Repeating goals",
    repeatingGoalsLead: "Check off daily actions in one tap.",
    manageChains: "Manage chains",
    noRepeatingGoals: "No repeating goals yet.",
    chainTitle: "Continuous chains",
    chainLead: "Add several repeating actions. Missing a day never resets progress — just continue tomorrow.",
    chainPlaceholder: "For example: wake up at 5:45",
    startChain: "Add chain",
    addAnotherChain: "Add repeating goal",
    linkToday: "Done today",
    linkedToday: "Done for today",
    links: "links",
    finishChain: "Finish chain",
    chainEmpty: "No active chains yet. Add your first repeating goal.",
    lastDays: "Last 7 days",
    rewardTitle: "Rewards for the path",
    rewardLead: "A reward unlocks at total XP and never spends your progress.",
    rewardPlaceholder: "For example: book a massage",
    xpNeeded: "XP required",
    addReward: "Add reward",
    unlocked: "Unlocked",
    locked: "Locked",
    claim: "Claim reward",
    claimed: "Claimed",
    rewardEmpty: "Add something you would genuinely enjoy earning.",
    signOut: "Sign out",
    loading: "Loading your adventure…",
    error: "Something went wrong.",
    saved: "Saved.",
    deleted: "Change saved.",
    xpGuide: "XP system",
    xpGuideText: "Reward the difficulty of the action, not only the final result.",
    noPunishment: "No punishment for a missed day",
    noPunishmentText: "Each chain counts completed days and never resets to zero.",
    archive: "Archive",
    archived: "Quest archived.",
    active: "Active",
    finished: "Completed",
    noFinished: "No completed quests yet.",
    due: "due",
    remove: "Delete",
    home: "Home"
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
  const [questFilter, setQuestFilter] = useState<"active" | "completed">("active");

  const [quests, setQuests] = useState<Quest[]>([]);
  const [steps, setSteps] = useState<QuestStep[]>([]);
  const [bosses, setBosses] = useState<WeeklyBoss[]>([]);
  const [chains, setChains] = useState<Chain[]>([]);
  const [checkins, setCheckins] = useState<ChainCheckin[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);

  const t = copy[lang];

  useEffect(() => {
    const saved = window.localStorage.getItem("questframe-lang");
    if (saved === "en" || saved === "ru") setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function toggleLanguage() {
    const next: Lang = lang === "ru" ? "en" : "ru";
    setLang(next);
    window.localStorage.setItem("questframe-lang", next);
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
    void loadData(true);
  }, [loadData]);

  const weekStart = isoDateLocal(startOfWeekLocal());
  const currentBoss = bosses.find((boss) => boss.week_start === weekStart) ?? null;
  const today = isoDateLocal(new Date());
  const activeChains = chains.filter((chain) => chain.active);

  const totalXp = useMemo(() => {
    const stepXp = steps.filter((step) => step.completed_at).reduce((sum, step) => sum + step.xp_value, 0);
    const bossXp = bosses.filter((boss) => boss.completed_at).reduce((sum, boss) => sum + boss.xp_value, 0);
    return stepXp + bossXp;
  }, [steps, bosses]);

  const level = getLevelProgress(totalXp);
  const activeQuests = quests.filter((quest) => quest.status === "active");
  const completedQuests = quests.filter((quest) => quest.status === "completed");
  const activeQuestIds = useMemo(() => new Set(activeQuests.map((quest) => quest.id)), [activeQuests]);
  const quickSteps = useMemo(() => {
    return steps
      .filter((step) => activeQuestIds.has(step.quest_id))
      .sort((a, b) => Number(Boolean(a.completed_at)) - Number(Boolean(b.completed_at)))
      .slice(0, 8);
  }, [steps, activeQuestIds]);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
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
    await withWork(async () => {
      const { error } = await supabase.from("quest_steps").update({
        completed_at: step.completed_at ? null : new Date().toISOString()
      }).eq("id", step.id);
      return { error };
    });
  }

  async function deleteStep(stepId: string) {
    await withWork(async () => {
      const { error } = await supabase.from("quest_steps").delete().eq("id", stepId);
      return { error };
    }, t.deleted);
  }

  async function setQuestStatus(quest: Quest, status: "active" | "completed" | "archived") {
    await withWork(async () => {
      const { error } = await supabase.from("quests").update({
        status,
        completed_at: status === "completed" ? new Date().toISOString() : null
      }).eq("id", quest.id);
      return { error };
    }, status === "archived" ? t.archived : t.saved);
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
    await withWork(async () => {
      const { error } = await supabase.from("weekly_bosses").update({
        completed_at: currentBoss.completed_at ? null : new Date().toISOString()
      }).eq("id", currentBoss.id);
      return { error };
    });
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
    await withWork(async () => {
      const { error } = await supabase.from("chain_checkins").insert({
        chain_id: chain.id,
        user_id: userId,
        checkin_date: today
      });
      return { error };
    });
  }

  async function finishChain(chain: Chain) {
    await withWork(async () => {
      const { error } = await supabase.from("chains").update({ active: false }).eq("id", chain.id);
      return { error };
    });
  }

  async function addReward(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const title = String(form.get("title") ?? "").trim();
    const xpRequired = Number(form.get("xp_required") ?? 0);
    if (!title || !Number.isFinite(xpRequired) || xpRequired < 1) return;

    const ok = await withWork(async () => {
      const { error } = await supabase.from("rewards").insert({
        user_id: userId,
        title,
        xp_required: Math.round(xpRequired)
      });
      return { error };
    });
    if (ok) formElement.reset();
  }

  async function claimReward(reward: Reward) {
    if (reward.claimed_at || totalXp < reward.xp_required) return;
    await withWork(async () => {
      const { error } = await supabase.from("rewards").update({ claimed_at: new Date().toISOString() }).eq("id", reward.id);
      return { error };
    });
  }

  async function deleteReward(rewardId: string) {
    await withWork(async () => {
      const { error } = await supabase.from("rewards").delete().eq("id", rewardId);
      return { error };
    }, t.deleted);
  }

  async function signOut() {
    setWorking(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function lastSevenDaysForChain(chainId: string) {
    const days: { iso: string; label: string; hit: boolean }[] = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - offset);
      const iso = isoDateLocal(date);
      days.push({
        iso,
        label: new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", { weekday: "short" }).format(date).replace(".", ""),
        hit: checkins.some((item) => item.chain_id === chainId && item.checkin_date === iso)
      });
    }
    return days;
  }

  if (loading) {
    return <main className="loading-screen"><div className="spinner" /><p>{t.loading}</p></main>;
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <button className="brand-home-button" type="button" onClick={() => setTab("today")} aria-label={t.home} title={t.home}>
          <span className="brand-lockup compact"><span className="brand-mark">QF</span><span>QuestFrame</span></span>
        </button>
        <nav className="desktop-tabs" aria-label="Main navigation">
          {(["today", "quests", "chain", "rewards"] as Tab[]).map((item) => (
            <button key={item} className={tab === item ? "nav-tab active" : "nav-tab"} onClick={() => setTab(item)}>{t[item]}</button>
          ))}
        </nav>
        <div className="header-actions">
          <button className="lang-button" onClick={toggleLanguage}>{lang === "ru" ? "EN" : "RU"}</button>
          <button className="avatar-button" title={`${email} · ${t.signOut}`} onClick={signOut} disabled={working}>{email.slice(0, 1).toUpperCase() || "Q"}</button>
        </div>
      </header>

      {notice && <div className="toast" role="status">{notice}</div>}

      <section className="content-shell">
        {tab === "today" && (
          <div className="page-stack">
            <section className="hero-panel">
              <div className="level-orb"><span>{t.level}</span><strong>{level.level}</strong></div>
              <div className="level-main">
                <div className="level-row"><strong>{totalXp} XP</strong><span>{level.current} / {level.needed} XP {t.nextLevel}</span></div>
                <div className="progress-track large"><span style={{ width: `${level.percent}%` }} /></div>
              </div>
              <div className="hero-stats">
                <div><span>{t.activeQuests}</span><strong>{activeQuests.length}</strong></div>
                <div><span>{t.totalXp}</span><strong>{totalXp}</strong></div>
              </div>
            </section>

            <section className={currentBoss?.completed_at ? "boss-card defeated" : "boss-card"}>
              <div className="boss-icon" aria-hidden="true">◆</div>
              <div className="boss-copy">
                <div className="card-heading-row">
                  <div><p className="eyebrow">{t.weeklyBoss} · +{BOSS_XP} XP</p><h2>{currentBoss?.title ?? t.weeklyBoss}</h2></div>
                  {currentBoss && <button className="text-button" onClick={() => setShowBossForm((value) => !value)}>{t.replaceBoss}</button>}
                </div>
                {currentBoss ? (
                  <>
                    {currentBoss.notes && <p>{currentBoss.notes}</p>}
                    <button className={currentBoss.completed_at ? "button button-ghost" : "button button-primary"} onClick={toggleBoss} disabled={working}>
                      {currentBoss.completed_at ? t.bossDefeated : t.defeatBoss}
                    </button>
                  </>
                ) : (
                  <>
                    <p>{t.bossHint}</p>
                    <button className="button button-primary" onClick={() => setShowBossForm(true)}>{t.setBoss}</button>
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

            <section className="quick-panel">
              <div className="section-heading compact-heading">
                <div><p className="eyebrow">QUEST ACTIONS</p><h2>{t.quickSteps}</h2><p>{t.quickStepsLead}</p></div>
                <button className="text-button" onClick={() => setTab("quests")}>{t.openAllQuests}</button>
              </div>
              {quickSteps.length === 0 ? <p className="empty-inline">{t.noQuickSteps}</p> : (
                <div className="quick-step-list">
                  {quickSteps.map((step) => {
                    const quest = activeQuests.find((item) => item.id === step.quest_id);
                    return (
                      <div key={step.id} className={step.completed_at ? "quick-step-row completed" : "quick-step-row"}>
                        <button className="check-button" onClick={() => toggleStep(step)} disabled={working} aria-label={step.completed_at ? t.undo : t.done}>{step.completed_at ? "✓" : ""}</button>
                        <div className="quick-step-copy"><strong>{step.title}</strong><span>{quest?.title ?? t.quests} · +{step.xp_value} XP</span></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="quick-panel">
              <div className="section-heading compact-heading">
                <div><p className="eyebrow">DAILY LOOP</p><h2>{t.repeatingGoals}</h2><p>{t.repeatingGoalsLead}</p></div>
                <button className="text-button" onClick={() => setTab("chain")}>{t.manageChains}</button>
              </div>
              {activeChains.length === 0 ? <p className="empty-inline">{t.noRepeatingGoals}</p> : (
                <div className="daily-chain-list">
                  {activeChains.map((chain) => {
                    const checked = isChainCheckedToday(chain.id);
                    return (
                      <div key={chain.id} className={checked ? "daily-chain-row completed" : "daily-chain-row"}>
                        <button className="check-button" onClick={() => checkInChain(chain)} disabled={working || checked} aria-label={checked ? t.linkedToday : t.linkToday}>{checked ? "✓" : ""}</button>
                        <div><strong>{chain.title}</strong><span>{chainLinks(chain.id)} {t.links}</span></div>
                        <span className="daily-status">{checked ? t.linkedToday : t.linkToday}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section>
              <div className="section-heading"><div><p className="eyebrow">{t.focus}</p><h2>{t.activeQuests}</h2></div><button className="button button-secondary" onClick={() => { setTab("quests"); setShowQuestForm(true); }}>+ {t.newQuest}</button></div>
              {activeQuests.length === 0 ? (
                <div className="empty-card"><p>{t.noQuests}</p><button className="button button-primary" onClick={() => { setTab("quests"); setShowQuestForm(true); }}>{t.createFirst}</button></div>
              ) : (
                <div className="quest-grid compact-grid">{activeQuests.slice(0, 4).map((quest) => <QuestSummary key={quest.id} quest={quest} steps={steps} lang={lang} onOpen={() => setTab("quests")} />)}</div>
              )}
            </section>

            <section className="principles-grid">
              <article><span className="principle-number">+10</span><h3>{t.xpGuide}</h3><p>{t.xpGuideText}</p></article>
              <article><span className="principle-number">∞</span><h3>{t.noPunishment}</h3><p>{t.noPunishmentText}</p></article>
            </section>
          </div>
        )}

        {tab === "quests" && (
          <div className="page-stack">
            <div className="section-heading"><div><p className="eyebrow">QUEST LOG</p><h1>{t.quests}</h1></div><button className="button button-primary" onClick={() => setShowQuestForm((value) => !value)}>+ {t.newQuest}</button></div>

            {showQuestForm && (
              <form className="create-panel" onSubmit={createQuest}>
                <div className="form-grid two-cols">
                  <label className="wide"><span>{t.questTitle}</span><input required maxLength={120} name="title" placeholder={t.questTitle} /></label>
                  <label className="wide"><span>{t.questDescription}</span><textarea maxLength={600} name="description" rows={2} placeholder={t.questDescription} /></label>
                  <label><span>{t.questCategory}</span><input maxLength={50} name="category" placeholder={t.questCategoryPlaceholder} /></label>
                  <label><span>{t.targetDate}</span><input type="text" inputMode="numeric" autoComplete="off" maxLength={10} name="target_date" placeholder={t.targetDatePlaceholder} /></label>
                  <label><span>{t.accent}</span><input className="color-input" type="color" name="accent" defaultValue="#7a3d5c" /></label>
                </div>
                <div className="form-actions"><button className="button button-primary" disabled={working} type="submit">{t.createQuest}</button><button type="button" className="button button-ghost" onClick={() => setShowQuestForm(false)}>{t.cancel}</button></div>
              </form>
            )}

            <div className="segmented"><button className={questFilter === "active" ? "active" : ""} onClick={() => setQuestFilter("active")}>{t.active} · {activeQuests.length}</button><button className={questFilter === "completed" ? "active" : ""} onClick={() => setQuestFilter("completed")}>{t.finished} · {completedQuests.length}</button></div>

            {(questFilter === "active" ? activeQuests : completedQuests).length === 0 ? (
              <div className="empty-card"><p>{questFilter === "active" ? t.noQuests : t.noFinished}</p></div>
            ) : (
              <div className="quest-list">
                {(questFilter === "active" ? activeQuests : completedQuests).map((quest) => {
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
                            <div className="quest-meta">{quest.category && <span>{quest.category}</span>}{quest.target_date && <span>{t.due} {formatDate(quest.target_date, lang)}</span>}{quest.status === "completed" && <span className="complete-pill">{t.completed}</span>}</div>
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
                              <button className="check-button" onClick={() => toggleStep(step)} disabled={working} aria-label={step.completed_at ? t.undo : t.done}>{step.completed_at ? "✓" : ""}</button>
                              <div className="step-main"><span>{step.title}</span><small>+{step.xp_value} XP · {t[xpLabelKey[step.xp_reason] ?? "xpStep"]}</small></div>
                              <button className="icon-button danger" title={t.remove} onClick={() => deleteStep(step.id)} disabled={working}>×</button>
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
                            <><button className="button button-ghost" disabled={!allDone || working} onClick={() => setQuestStatus(quest, "completed")}>{t.completeQuest}</button><button className="text-button danger-text" disabled={working} onClick={() => setQuestStatus(quest, "archived")}>{t.archive}</button></>
                          ) : (
                            <button className="button button-ghost" disabled={working} onClick={() => setQuestStatus(quest, "active")}>{t.reopenQuest}</button>
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
            <div className="section-heading"><div><p className="eyebrow">NO RESET</p><h1>{t.chainTitle}</h1><p>{t.chainLead}</p></div></div>
            <section className="create-panel chain-create">
              <form className="stacked-form" onSubmit={createChain}><input name="title" required maxLength={180} placeholder={t.chainPlaceholder} /><button className="button button-primary" disabled={working} type="submit">{activeChains.length ? t.addAnotherChain : t.startChain}</button></form>
            </section>

            {activeChains.length === 0 ? <div className="empty-card"><p>{t.chainEmpty}</p></div> : (
              <div className="chain-grid">
                {activeChains.map((chain) => {
                  const checked = isChainCheckedToday(chain.id);
                  const links = chainLinks(chain.id);
                  return (
                    <section className="chain-card" key={chain.id}>
                      <div className="chain-count"><strong>{links}</strong><span>{t.links}</span></div>
                      <h2>{chain.title}</h2>
                      <div className="week-strip" aria-label={t.lastDays}>
                        {lastSevenDaysForChain(chain.id).map((day) => <div key={day.iso} className={day.hit ? "day-dot hit" : "day-dot"}><span>{day.label}</span><b>{day.hit ? "✓" : "·"}</b></div>)}
                      </div>
                      <button className={checked ? "button button-ghost full-width" : "button button-primary full-width"} onClick={() => checkInChain(chain)} disabled={working || checked}>{checked ? t.linkedToday : t.linkToday}</button>
                      <button className="text-button danger-text centered" onClick={() => finishChain(chain)} disabled={working}>{t.finishChain}</button>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "rewards" && (
          <div className="page-stack narrow-stack">
            <div className="section-heading"><div><p className="eyebrow">MILESTONES</p><h1>{t.rewardTitle}</h1><p>{t.rewardLead}</p></div></div>
            <form className="create-panel reward-form" onSubmit={addReward}>
              <input name="title" required maxLength={180} placeholder={t.rewardPlaceholder} />
              <input name="xp_required" required type="number" min={1} max={1000000} placeholder={t.xpNeeded} />
              <button className="button button-primary" disabled={working} type="submit">{t.addReward}</button>
            </form>
            {rewards.length === 0 ? <div className="empty-card"><p>{t.rewardEmpty}</p></div> : (
              <div className="reward-list">
                {rewards.map((reward) => {
                  const unlocked = totalXp >= reward.xp_required;
                  const percent = Math.min(100, Math.round((totalXp / reward.xp_required) * 100));
                  return (
                    <article key={reward.id} className={reward.claimed_at ? "reward-card claimed" : "reward-card"}>
                      <div className="reward-head"><div><span className={unlocked ? "status-pill unlocked" : "status-pill"}>{reward.claimed_at ? t.claimed : unlocked ? t.unlocked : t.locked}</span><h2>{reward.title}</h2></div><strong>{reward.xp_required} XP</strong></div>
                      <div className="progress-track"><span style={{ width: `${percent}%` }} /></div>
                      <div className="reward-actions"><span>{Math.min(totalXp, reward.xp_required)} / {reward.xp_required} XP</span><div><button className="button button-secondary" disabled={!unlocked || Boolean(reward.claimed_at) || working} onClick={() => claimReward(reward)}>{reward.claimed_at ? t.claimed : t.claim}</button><button className="icon-button danger" title={t.remove} onClick={() => deleteReward(reward.id)} disabled={working}>×</button></div></div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      <nav className="mobile-tabs" aria-label="Mobile navigation">
        {(["today", "quests", "chain", "rewards"] as Tab[]).map((item) => (
          <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}><span>{item === "today" ? "⌂" : item === "quests" ? "◇" : item === "chain" ? "∞" : "☆"}</span>{t[item]}</button>
        ))}
      </nav>
    </main>
  );
}

function QuestSummary({ quest, steps, lang, onOpen }: { quest: Quest; steps: QuestStep[]; lang: Lang; onOpen: () => void }) {
  const questSteps = steps.filter((step) => step.quest_id === quest.id);
  const done = questSteps.filter((step) => step.completed_at).length;
  const percent = questSteps.length ? Math.round((done / questSteps.length) * 100) : 0;
  return (
    <button className="quest-summary" onClick={onOpen} style={{ "--quest-accent": quest.accent } as React.CSSProperties}>
      <span className="summary-accent" />
      <span className="quest-meta">{quest.category || (lang === "ru" ? "Квест" : "Quest")}</span>
      <strong>{quest.title}</strong>
      <span className="summary-progress"><span><i style={{ width: `${percent}%`, background: quest.accent }} /></span><b>{percent}%</b></span>
    </button>
  );
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

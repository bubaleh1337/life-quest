"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BrandLockup from "@/components/Brand";

type Lang = "ru" | "en";

const copy = {
  ru: {
    eyebrow: "РЕАЛЬНАЯ ЖИЗНЬ, ИГРОВАЯ ЛОГИКА",
    title: "Преврати цель в квест, который хочется продолжать.",
    lead: "Получай XP за реальные действия, побеждай одного босса недели, собирай цепочки из повторяемых действий без обнуления и открывай награды по мере прогресса.",
    start: "Начать первый квест",
    demo: "Посмотреть демо",
    demoHint: "Без регистрации · данные не сохраняются",
    privacy: "Конфиденциальность",
    how: "Как это работает",
    quest: "Квест",
    questExample: "Собрать портфолио",
    questMeta: "3 / 5 шагов",
    boss: "Босс",
    bossExample: "Разобрать папку Downloads",
    chain: "Цепочка",
    chainExample: "10 минут языка",
    chainMeta: "12 звеньев · прогресс сохраняется",
    rule1Title: "Квест вместо размытой цели",
    rule1Text: "Большая цель превращается в понятные шаги, которые можно проходить один за другим.",
    rule2Title: "XP за усилие",
    rule2Text: "Обычный шаг +1, обещание себе +5, самое сложное или страшное +7, победа над откладыванием +10.",
    rule3Title: "Цепочка без наказания",
    rule3Text: "Пропуск создаёт видимый разрыв, но не стирает уже собранные звенья. Просто продолжай с нового звена."
  },
  en: {
    eyebrow: "REAL LIFE, GAME LOGIC",
    title: "Turn a goal into a quest you actually want to continue.",
    lead: "Earn XP for real actions, beat one weekly boss, build chains from repeating actions without resets and unlock rewards as your progress grows.",
    start: "Start your first quest",
    demo: "View demo",
    demoHint: "No sign-up · changes are not saved",
    privacy: "Privacy",
    how: "How it works",
    quest: "Quest",
    questExample: "Build a portfolio",
    questMeta: "3 / 5 steps",
    boss: "Boss",
    bossExample: "Clean up the Downloads folder",
    chain: "Chain",
    chainExample: "10 min of language practice",
    chainMeta: "12 links · progress stays",
    rule1Title: "Quest, not vague intention",
    rule1Text: "Break a large goal into visible steps that can be completed one by one.",
    rule2Title: "XP rewards effort",
    rule2Text: "Regular step +1, kept promise +5, hardest/scariest action +7, beat procrastination +10.",
    rule3Title: "A chain without punishment",
    rule3Text: "A missed day creates a visible break but never erases the links you already built. Just continue with a new link."
  }
} as const;

export default function LandingClient() {
  const [lang, setLang] = useState<Lang>("ru");
  const t = copy[lang];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("lifequest-lang") ?? window.localStorage.getItem("questframe-lang");
      if (saved === "ru" || saved === "en") setLang(saved);

      const query = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const errorCode = query.get("error_code") ?? query.get("error") ?? hash.get("error_code") ?? hash.get("error");
      const errorDescription = query.get("error_description") ?? hash.get("error_description");
      if (errorCode) {
        const login = new URL("/login", window.location.origin);
        login.searchParams.set("error_code", errorCode);
        if (errorDescription) login.searchParams.set("error_description", errorDescription);
        window.location.replace(login.toString());
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "ru" ? "Life Quest — преврати жизнь в квест" : "Life Quest — turn life into a quest";
  }, [lang]);

  function toggleLanguage() {
    const next: Lang = lang === "ru" ? "en" : "ru";
    setLang(next);
    window.localStorage.setItem("lifequest-lang", next);
  }

  return (
    <main className="landing-shell">
      <section className="landing-card">
        <div className="landing-topline">
          <BrandLockup />
          <div className="landing-top-actions">
            <Link className="text-link landing-privacy-link" href="/privacy">{t.privacy}</Link>
            <button className="lang-button" type="button" onClick={toggleLanguage} aria-label={lang === "ru" ? "Switch to English" : "Переключить на русский"}>{lang === "ru" ? "EN" : "RU"}</button>
          </div>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="hero-lead">{t.lead}</p>
        </div>

        <div className="landing-actions landing-actions-main">
          <Link className="button button-primary" href="/login">{t.start}</Link>
          <Link className="button button-demo" href="/demo">{t.demo}<span aria-hidden="true">→</span></Link>
          <a className="button button-ghost" href="#rules">{t.how}</a>
        </div>
        <p className="demo-hint">{t.demoHint}</p>

        <div className="mini-board" aria-label={t.how}>
          <div>
            <span className="mini-label">{t.quest}</span>
            <strong>{t.questExample}</strong>
            <span>{t.questMeta}</span>
          </div>
          <div>
            <span className="mini-label">{t.boss}</span>
            <strong>{t.bossExample}</strong>
            <span>+25 XP</span>
          </div>
          <div>
            <span className="mini-label">{t.chain}</span>
            <strong>{t.chainExample}</strong>
            <span>{t.chainMeta}</span>
          </div>
        </div>
      </section>

      <section className="landing-rules" id="rules">
        <article>
          <span>01</span>
          <h2>{t.rule1Title}</h2>
          <p>{t.rule1Text}</p>
        </article>
        <article>
          <span>02</span>
          <h2>{t.rule2Title}</h2>
          <p>{t.rule2Text}</p>
        </article>
        <article>
          <span>03</span>
          <h2>{t.rule3Title}</h2>
          <p>{t.rule3Text}</p>
        </article>
      </section>
    </main>
  );
}

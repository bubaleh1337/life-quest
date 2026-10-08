"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BrandLockup from "@/components/Brand";

type Lang = "ru" | "en";

const copy = {
  ru: {
    title: "Конфиденциальность",
    updated: "Обновлено: 8 октября 2026",
    intro: "Life Quest хранит только данные, которые нужны для работы приложения. Мы не продаём пользовательские данные и не используем их для рекламы.",
    collectedTitle: "Какие данные хранятся",
    collected: "Email для входа, профиль, квесты, шаги, XP-связанные действия, боссы недели, цепочки и отметки, награды, а при добровольном вступлении в Лигу — выбранное публичное имя, XP текущей недели и заработанные бейджи.",
    whyTitle: "Зачем они нужны",
    why: "Чтобы авторизовать пользователя, сохранять его прогресс, показывать историю и синхронизировать данные между сессиями. Данные Лиги используются только для добровольного недельного рейтинга и выдачи бейджей.",
    leagueTitle: "Добровольная Лига",
    league: "Лига включается только по желанию. Другие участники видят выбранное тобой имя в Лиге, место и XP текущей недели. Email, названия квестов и другие личные данные в рейтинге не показываются. Старые недельные рейтинги удаляются после выдачи бейджей топ-3; сами бейджи сохраняются в аккаунте.",
    providersTitle: "Сервисы",
    providers: "Авторизация и база данных работают через Supabase. Приложение размещено на Vercel. Эти сервисы могут обрабатывать технические данные в соответствии со своими политиками.",
    cookiesTitle: "Cookies и локальные настройки",
    cookies: "Для сессии используются технические auth cookies. Язык и настройка звука сохраняются локально в браузере. В текущей версии нет рекламных трекеров.",
    controlTitle: "Контроль данных",
    control: "В меню аккаунта можно скачать JSON-экспорт своих данных. Там же можно удалить аккаунт и все связанные данные без возможности восстановления.",
    contactTitle: "Контакт",
    contact: "По вопросам конфиденциальности: ekaterina.pyshkova@gmail.com",
    back: "Вернуться в Life Quest",
    demo: "Посмотреть демо"
  },
  en: {
    title: "Privacy",
    updated: "Updated: October 8, 2026",
    intro: "Life Quest stores only the data needed to operate the product. We do not sell user data or use it for advertising.",
    collectedTitle: "Data we store",
    collected: "Email for sign-in, profile, quests, steps, XP-related actions, weekly bosses, chains and check-ins, rewards and, if you voluntarily join the League, your chosen public name, current weekly XP and earned badges.",
    whyTitle: "Why it is used",
    why: "To authenticate the user, save progress, show history and keep data available between sessions. League data is used only for the optional weekly leaderboard and badge awards.",
    leagueTitle: "Optional League",
    league: "The League is opt-in. Other participants can see your chosen League name, rank and current weekly XP. Your email, quest titles and other private data are never shown in the leaderboard. Old weekly rankings are deleted after top-three badges are awarded; earned badges remain in your account.",
    providersTitle: "Service providers",
    providers: "Authentication and the database are provided by Supabase. The application is hosted on Vercel. These providers may process technical data under their own policies.",
    cookiesTitle: "Cookies and local settings",
    cookies: "Technical auth cookies are used for the session. Language and sound preferences are stored locally in the browser. The current version has no advertising trackers.",
    controlTitle: "Your controls",
    control: "The account menu lets you download a JSON export of your data. You can also permanently delete your account and all associated data there.",
    contactTitle: "Contact",
    contact: "Privacy questions: ekaterina.pyshkova@gmail.com",
    back: "Back to Life Quest",
    demo: "View demo"
  }
} as const;

export default function PrivacyClient() {
  const [lang, setLang] = useState<Lang>("ru");
  const t = copy[lang];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("lifequest-lang") ?? window.localStorage.getItem("questframe-lang");
      if (saved === "ru" || saved === "en") setLang(saved);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "ru" ? "Life Quest — конфиденциальность" : "Life Quest — privacy";
  }, [lang]);

  function toggleLanguage() {
    const next: Lang = lang === "ru" ? "en" : "ru";
    setLang(next);
    window.localStorage.setItem("lifequest-lang", next);
  }

  return (
    <main className="privacy-shell">
      <header className="privacy-header">
        <Link href="/" className="brand-link" aria-label="Life Quest"><BrandLockup /></Link>
        <button className="lang-button" type="button" onClick={toggleLanguage}>{lang === "ru" ? "EN" : "RU"}</button>
      </header>

      <article className="privacy-card">
        <p className="eyebrow">LIFE QUEST</p>
        <h1>{t.title}</h1>
        <p className="privacy-updated">{t.updated}</p>
        <p className="privacy-intro">{t.intro}</p>

        <section><h2>{t.collectedTitle}</h2><p>{t.collected}</p></section>
        <section><h2>{t.whyTitle}</h2><p>{t.why}</p></section>
        <section><h2>{t.leagueTitle}</h2><p>{t.league}</p></section>
        <section><h2>{t.providersTitle}</h2><p>{t.providers}</p></section>
        <section><h2>{t.cookiesTitle}</h2><p>{t.cookies}</p></section>
        <section><h2>{t.controlTitle}</h2><p>{t.control}</p></section>
        <section><h2>{t.contactTitle}</h2><p><a href="mailto:ekaterina.pyshkova@gmail.com">{t.contact}</a></p></section>

        <div className="privacy-actions">
          <Link className="button button-primary" href="/">{t.back}</Link>
          <Link className="button button-ghost" href="/demo">{t.demo}</Link>
        </div>
      </article>
    </main>
  );
}

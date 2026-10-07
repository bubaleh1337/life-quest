"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<"expired" | "generic" | null>(null);
  const [lang, setLang] = useState<"en" | "ru">("ru");

  const t = useMemo(() => ({
    title: lang === "ru" ? "Войти в QuestFrame" : "Sign in to QuestFrame",
    text: lang === "ru" ? "Без пароля: получи безопасную ссылку на email." : "No password: get a secure sign-in link by email.",
    email: lang === "ru" ? "Email" : "Email",
    send: lang === "ru" ? "Отправить ссылку" : "Send sign-in link",
    google: lang === "ru" ? "Продолжить с Google" : "Continue with Google",
    back: lang === "ru" ? "На главную" : "Back to home",
    sent: lang === "ru" ? "Ссылка отправлена. Проверь почту." : "Link sent. Check your inbox.",
    expired: lang === "ru" ? "Ссылка для входа недействительна или уже истекла. Запроси новую ссылку ниже." : "This sign-in link is invalid or has expired. Request a new link below.",
    authFailed: lang === "ru" ? "Авторизация не завершена. Запроси новую ссылку и попробуй ещё раз." : "Sign-in was not completed. Request a new link and try again.",
    missing: lang === "ru" ? "Сначала добавь Supabase URL и publishable key в .env.local." : "Add your Supabase URL and publishable key to .env.local first.",
    error: lang === "ru" ? "Не удалось войти. Проверь настройки Supabase." : "Sign-in failed. Check your Supabase settings.",
    eyebrow: lang === "ru" ? "ВХОД В ИГРУ" : "READY PLAYER ONE",
    or: lang === "ru" ? "или" : "or",
    switchLanguage: lang === "ru" ? "Switch to English" : "Переключить на русский"
  }), [lang]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("questframe-lang");
      if (saved === "ru" || saved === "en") setLang(saved);

      const query = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const errorCode = query.get("error_code") ?? query.get("error") ?? hash.get("error_code") ?? hash.get("error");
      const description = query.get("error_description") ?? hash.get("error_description") ?? "";
      if (errorCode || description) {
        const expired = errorCode === "otp_expired" || /expired|invalid/i.test(description);
        setAuthError(expired ? "expired" : "generic");
        window.history.replaceState({}, "", "/login");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "ru" ? "QuestFrame — вход" : "QuestFrame — sign in";
  }, [lang]);

  function toggleLanguage() {
    const next = lang === "ru" ? "en" : "ru";
    setLang(next);
    window.localStorage.setItem("questframe-lang", next);
  }

  function getAuthCallbackUrl() {
    const runtimeOrigin = window.location.origin;
    const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();

    if (configured) {
      try {
        const configuredUrl = new URL(configured);
        const runtimeUrl = new URL(runtimeOrigin);
        const configuredIsLocal = configuredUrl.hostname === "localhost" || configuredUrl.hostname === "127.0.0.1";
        const runtimeIsLocal = runtimeUrl.hostname === "localhost" || runtimeUrl.hostname === "127.0.0.1";

        // Local development may use localhost. Production must never be forced back to localhost.
        if (runtimeIsLocal || !configuredIsLocal) {
          return `${configuredUrl.origin}/auth/callback?next=/app`;
        }
      } catch {
        // Fall back to the actual browser origin if the configured URL is malformed.
      }
    }

    return `${runtimeOrigin}/auth/callback?next=/app`;
  }

  async function signInWithEmail(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setAuthError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: getAuthCallbackUrl() }
      });
      setMessage(error ? `${t.error} ${error.message}` : t.sent);
    } catch {
      setMessage(t.missing);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setLoading(true);
    setMessage("");
    setAuthError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: getAuthCallbackUrl() }
      });
      if (error) setMessage(`${t.error} ${error.message}`);
    } catch {
      setMessage(t.missing);
      setLoading(false);
    }
  }

  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-topline">
          <div className="brand-lockup"><div className="brand-mark">QF</div><span>QuestFrame</span></div>
          <button className="lang-button" type="button" onClick={toggleLanguage} aria-label={t.switchLanguage}>{lang === "ru" ? "EN" : "RU"}</button>
        </div>
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="muted">{t.text}</p>
        </div>

        <form className="auth-form" onSubmit={signInWithEmail}>
          <label>
            <span>{t.email}</span>
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <button className="button button-primary" disabled={loading} type="submit">{t.send}</button>
        </form>

        {googleEnabled && (<>
          <div className="separator"><span>{t.or}</span></div>
          <button className="button button-ghost full-width" disabled={loading} onClick={signInWithGoogle}>{t.google}</button>
        </>)}
        {(message || authError) && <p className="notice" role="status">{message || (authError === "expired" ? t.expired : t.authFailed)}</p>}
        <Link href="/" className="text-link">← {t.back}</Link>
      </section>
    </main>
  );
}

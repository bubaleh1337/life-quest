"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import BrandLockup from "@/components/Brand";

type Lang = "en" | "ru";
type MessageKind = "success" | "error" | "info";
type AuthLikeError = { message?: string; status?: number; code?: string };

const COOLDOWN_KEY = "questframe-auth-cooldown-until";
const RESEND_COOLDOWN_MS = 60_000;

function isRateLimitError(error: AuthLikeError) {
  const code = error.code ?? "";
  const message = error.message ?? "";
  return error.status === 429 || code === "over_email_send_rate_limit" || code === "over_request_rate_limit" || /rate limit|too many/i.test(message);
}

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<MessageKind>("info");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Lang>("ru");
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [clock, setClock] = useState(() => Date.now());
  const submittingRef = useRef(false);

  const t = useMemo(() => ({
    title: lang === "ru" ? "Войти в Life Quest" : "Sign in to Life Quest",
    text: lang === "ru" ? "Без пароля: получи одноразовую безопасную ссылку на email." : "No password: get a one-time secure sign-in link by email.",
    email: "Email",
    send: lang === "ru" ? "Отправить ссылку" : "Send sign-in link",
    sending: lang === "ru" ? "Отправляем…" : "Sending…",
    resendIn: lang === "ru" ? "Повторить через" : "Resend in",
    secondsShort: lang === "ru" ? "с" : "s",
    google: lang === "ru" ? "Продолжить с Google" : "Continue with Google",
    back: lang === "ru" ? "На главную" : "Back to home",
    sent: lang === "ru" ? "Ссылка отправлена. Проверь последнее письмо и не запрашивай новую ссылку, пока не попробуешь эту." : "Link sent. Check the newest email and use that link before requesting another one.",
    rateLimited: lang === "ru" ? "Слишком много писем для входа отправлено за короткое время. Используй последнее письмо, если оно уже пришло, или попробуй отправить ссылку позже." : "Too many sign-in emails were sent in a short time. Use the newest email if you already received one, or try again later.",
    missing: lang === "ru" ? "Life Quest не может подключиться к авторизации: проверь переменные Supabase в окружении приложения." : "Life Quest cannot connect to authentication. Check the Supabase environment variables.",
    sendFailed: lang === "ru" ? "Не удалось отправить ссылку для входа. Попробуй ещё раз позже." : "Could not send the sign-in link. Please try again later.",
    eyebrow: lang === "ru" ? "ВХОД В ИГРУ" : "READY PLAYER ONE",
    or: lang === "ru" ? "или" : "or",
    switchLanguage: lang === "ru" ? "Switch to English" : "Переключить на русский"
  }), [lang]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("questframe-lang");
      if (saved === "ru" || saved === "en") setLang(saved);

      const savedCooldown = Number(window.localStorage.getItem(COOLDOWN_KEY) ?? 0);
      if (Number.isFinite(savedCooldown) && savedCooldown > Date.now()) setCooldownUntil(savedCooldown);

      const query = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const errorCode = query.get("error_code") ?? query.get("error") ?? hash.get("error_code") ?? hash.get("error");
      const description = query.get("error_description") ?? hash.get("error_description") ?? "";
      if (errorCode || description) {
        const expired = errorCode === "otp_expired" || /expired|invalid/i.test(description);
        setMessage(expired ? (saved === "en" ? "This sign-in link is invalid or has expired. Request a new link below." : "Ссылка для входа недействительна или уже истекла. Запроси новую ссылку ниже.") : (saved === "en" ? "Sign-in was not completed. Request a new link and try again." : "Авторизация не завершена. Запроси новую ссылку и попробуй ещё раз."));
        setMessageKind("error");
        window.history.replaceState({}, "", "/login");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === "ru" ? "Life Quest — вход" : "Life Quest — sign in";
  }, [lang]);

  useEffect(() => {
    if (!cooldownUntil || cooldownUntil <= Date.now()) return;
    const interval = window.setInterval(() => {
      const now = Date.now();
      setClock(now);
      if (now >= cooldownUntil) {
        window.localStorage.removeItem(COOLDOWN_KEY);
        setCooldownUntil(0);
        window.clearInterval(interval);
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [cooldownUntil]);

  const cooldownSeconds = Math.max(0, Math.ceil((cooldownUntil - clock) / 1000));

  function toggleLanguage() {
    const next: Lang = lang === "ru" ? "en" : "ru";
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

        if (runtimeIsLocal || !configuredIsLocal) {
          return `${configuredUrl.origin}/auth/callback?next=/app`;
        }
      } catch {
        // Fall back to the actual browser origin if the configured URL is malformed.
      }
    }

    return `${runtimeOrigin}/auth/callback?next=/app`;
  }

  function startCooldown() {
    const until = Date.now() + RESEND_COOLDOWN_MS;
    setClock(Date.now());
    setCooldownUntil(until);
    window.localStorage.setItem(COOLDOWN_KEY, String(until));
  }

  async function signInWithEmail(event: FormEvent) {
    event.preventDefault();
    if (submittingRef.current || loading || cooldownSeconds > 0) return;

    submittingRef.current = true;
    setLoading(true);
    setMessage("");
    setMessageKind("info");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: getAuthCallbackUrl() }
      });

      if (error) {
        const authError = error as AuthLikeError;
        setMessage(isRateLimitError(authError) ? t.rateLimited : t.sendFailed);
        setMessageKind("error");
        if (isRateLimitError(authError)) startCooldown();
        return;
      }

      startCooldown();
      setMessage(t.sent);
      setMessageKind("success");
    } catch {
      setMessage(t.missing);
      setMessageKind("error");
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    if (submittingRef.current || loading) return;
    submittingRef.current = true;
    setLoading(true);
    setMessage("");
    setMessageKind("info");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: getAuthCallbackUrl() }
      });
      if (error) {
        setMessage(t.sendFailed);
        setMessageKind("error");
        submittingRef.current = false;
        setLoading(false);
      }
    } catch {
      setMessage(t.missing);
      setMessageKind("error");
      submittingRef.current = false;
      setLoading(false);
    }
  }

  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
  const sendLabel = loading ? t.sending : cooldownSeconds > 0 ? `${t.resendIn} ${cooldownSeconds} ${t.secondsShort}` : t.send;

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-topline">
          <BrandLockup />
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
            <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" disabled={loading} />
          </label>
          <button className="button button-primary" disabled={loading || cooldownSeconds > 0} type="submit">{sendLabel}</button>
        </form>

        {googleEnabled && (<>
          <div className="separator"><span>{t.or}</span></div>
          <button className="button button-ghost full-width" type="button" disabled={loading} onClick={signInWithGoogle}>{t.google}</button>
        </>)}
        {message && <p className={`notice notice-${messageKind}`} role={messageKind === "error" ? "alert" : "status"} aria-live="polite">{message}</p>}
        <Link href="/" className="text-link">← {t.back}</Link>
      </section>
    </main>
  );
}

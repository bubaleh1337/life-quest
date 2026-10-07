"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<"en" | "ru">("en");

  const t = useMemo(() => ({
    title: lang === "ru" ? "Войти в QuestFrame" : "Sign in to QuestFrame",
    text: lang === "ru" ? "Без пароля: получи безопасную ссылку на email." : "No password: get a secure sign-in link by email.",
    email: lang === "ru" ? "Email" : "Email",
    send: lang === "ru" ? "Отправить ссылку" : "Send sign-in link",
    google: lang === "ru" ? "Продолжить с Google" : "Continue with Google",
    back: lang === "ru" ? "На главную" : "Back to home",
    sent: lang === "ru" ? "Ссылка отправлена. Проверь почту." : "Link sent. Check your inbox.",
    missing: lang === "ru" ? "Сначала добавь Supabase URL и publishable key в .env.local." : "Add your Supabase URL and publishable key to .env.local first.",
    error: lang === "ru" ? "Не удалось войти. Проверь настройки Supabase." : "Sign-in failed. Check your Supabase settings."
  }), [lang]);

  async function signInWithEmail(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${origin}/auth/callback?next=/app` }
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
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${origin}/auth/callback?next=/app` }
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
          <button className="lang-button" onClick={() => setLang(lang === "en" ? "ru" : "en")}>{lang === "en" ? "RU" : "EN"}</button>
        </div>
        <div>
          <p className="eyebrow">READY PLAYER ONE</p>
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
          <div className="separator"><span>or</span></div>
          <button className="button button-ghost full-width" disabled={loading} onClick={signInWithGoogle}>{t.google}</button>
        </>)}
        {message && <p className="notice" role="status">{message}</p>}
        <Link href="/" className="text-link">← {t.back}</Link>
      </section>
    </main>
  );
}

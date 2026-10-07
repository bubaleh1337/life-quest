import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  let signedIn = false;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    signedIn = Boolean(data.user);
  } catch {
    // The landing page is still useful before environment setup.
  }

  if (signedIn) redirect("/app");

  return (
    <main className="landing-shell">
      <section className="landing-card">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">QF</div>
          <span>QuestFrame</span>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">REAL LIFE, GAME LOGIC</p>
          <h1>Turn a goal into a quest you actually want to continue.</h1>
          <p className="hero-lead">
            Earn XP for real actions, beat one weekly boss, keep a chain without punishment for missed days and unlock rewards as your progress grows.
          </p>
        </div>

        <div className="landing-actions">
          <Link className="button button-primary" href="/login">Start your first quest</Link>
          <a className="button button-ghost" href="#rules">How it works</a>
        </div>

        <div className="mini-board" aria-label="Example game loop">
          <div>
            <span className="mini-label">Quest</span>
            <strong>Build my portfolio</strong>
            <span>3 / 5 steps</span>
          </div>
          <div>
            <span className="mini-label">Boss</span>
            <strong>Publish the first project</strong>
            <span>+25 XP</span>
          </div>
          <div>
            <span className="mini-label">Chain</span>
            <strong>30 min of practice</strong>
            <span>12 links · never resets</span>
          </div>
        </div>
      </section>

      <section className="landing-rules" id="rules">
        <article>
          <span>01</span>
          <h2>Quest, not vague intention</h2>
          <p>Break a large goal into visible steps that can be completed one by one.</p>
        </article>
        <article>
          <span>02</span>
          <h2>XP rewards effort</h2>
          <p>Normal step +1, something hard +3, kept a promise +5, beat procrastination +10.</p>
        </article>
        <article>
          <span>03</span>
          <h2>No punishment loop</h2>
          <p>A missed day does not erase your chain. You simply continue with the next link.</p>
        </article>
      </section>
    </main>
  );
}

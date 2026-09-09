import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "You’re offline | Nomad Yoga",
  description: "Reconnect to continue your Nomad Yoga experience.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="offline-page">
      <style>{`
        .offline-page {
          --offline-cream: #f8f5ef;
          --offline-paper: #fffdf9;
          --offline-sage: #51614d;
          --offline-forest: #31402e;
          --offline-ink: #1c211d;
          --offline-muted: #626961;
          position: fixed;
          inset: 0;
          min-height: 100dvh;
          overflow: auto;
          display: grid;
          place-items: center;
          padding: max(28px, env(safe-area-inset-top))
            max(20px, env(safe-area-inset-right))
            max(28px, env(safe-area-inset-bottom))
            max(20px, env(safe-area-inset-left));
          background:
            radial-gradient(circle at 50% 22%, rgba(220, 229, 215, .72), transparent 34%),
            var(--offline-cream);
          color: var(--offline-ink);
          font-family: Arial, sans-serif;
        }
        .offline-card {
          width: min(560px, 100%);
          padding: clamp(32px, 7vw, 56px);
          border: 1px solid rgba(49, 64, 46, .14);
          border-radius: 32px;
          background: rgba(255, 253, 249, .94);
          box-shadow: 0 28px 80px rgba(39, 48, 37, .12);
          text-align: center;
        }
        .offline-mark {
          width: 92px;
          height: 92px;
          margin: 0 auto 26px;
          border-radius: 25px;
          box-shadow: 0 14px 34px rgba(49, 64, 46, .13);
        }
        .offline-brand {
          margin: 0 0 20px;
          color: var(--offline-sage);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .2em;
          text-transform: uppercase;
        }
        .offline-card h1 {
          margin: 0 0 18px;
          color: var(--offline-forest);
          font-family: Georgia, serif;
          font-size: clamp(44px, 10vw, 68px);
          font-weight: 500;
          letter-spacing: -.045em;
          line-height: 1;
        }
        .offline-promise {
          margin: 0 auto 18px;
          color: var(--offline-ink);
          font-family: Georgia, serif;
          font-size: clamp(20px, 4.8vw, 25px);
          line-height: 1.45;
        }
        .offline-copy {
          max-width: 410px;
          margin: 0 auto;
          color: var(--offline-muted);
          font-size: 14px;
          line-height: 1.75;
        }
        .offline-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 30px;
        }
        .offline-actions form { margin: 0; }
        .offline-action {
          min-height: 48px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 22px;
          border: 1px solid var(--offline-sage);
          border-radius: 999px;
          background: var(--offline-sage);
          color: white;
          cursor: pointer;
          font: 700 13px/1 Arial, sans-serif;
          text-decoration: none;
        }
        .offline-action-secondary {
          background: transparent;
          color: var(--offline-forest);
        }
        .offline-action:hover { background: var(--offline-forest); }
        .offline-action-secondary:hover { color: white; }
        .offline-action:focus-visible {
          outline: 3px solid rgba(167, 94, 67, .52);
          outline-offset: 3px;
        }
        @media (max-width: 440px) {
          .offline-card { border-radius: 26px; }
          .offline-actions { flex-direction: column; }
          .offline-actions form, .offline-action { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .offline-action { scroll-behavior: auto; }
        }
      `}</style>

      <section className="offline-card" aria-labelledby="offline-title">
        <img
          className="offline-mark"
          src="/icons/icon-192x192.png"
          width="92"
          height="92"
          alt=""
        />
        <p className="offline-brand">Nomad Yoga</p>
        <h1 id="offline-title">You’re offline</h1>
        <p className="offline-promise">
          Your practice can pause.
          <br />
          Your progress doesn’t have to.
        </p>
        <p className="offline-copy">
          Reconnect to continue exploring classes, bookings and your Nomad Yoga experience.
        </p>

        <div className="offline-actions">
          <form action="" method="get">
            <button className="offline-action" type="submit">
              Try Again
            </button>
          </form>
          <a className="offline-action offline-action-secondary" href="/">
            Go Home
          </a>
        </div>
      </section>
    </main>
  );
}

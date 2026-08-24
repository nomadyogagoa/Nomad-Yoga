import Link from "next/link";
import { siteConfig } from "@/config/site";

export function AuthShell({
  eyebrow,
  title,
  copy,
  children,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Link href="/" className="brand auth-brand">
          <span className="brand-mark">✦</span>
          <span>{siteConfig.name}</span>
        </Link>
        <div>
          <p className="eyebrow eyebrow-light">A mindful member experience</p>
          <blockquote>
            Move with intention.
            <br />
            Rest without guilt.
            <br />
            Return to yourself.
          </blockquote>
        </div>
        <span className="auth-credit">{siteConfig.name} · Member Space</span>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{copy}</p>
          {children}
        </div>
      </section>
    </main>
  );
}

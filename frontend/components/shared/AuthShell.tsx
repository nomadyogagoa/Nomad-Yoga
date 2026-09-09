import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";

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
        <div className="auth-visual-media" aria-hidden="true">
          <Image
            src="https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1600&q=88"
            alt=""
            fill
            sizes="(max-width: 760px) 0px, 50vw"
          />
        </div>
        <div className="auth-visual-shade" aria-hidden="true" />
        <div className="auth-visual-content">
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
        </div>
      </section>
      <section className="auth-panel">
        <Reveal as="div" className="auth-card">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{copy}</p>
          {children}
        </Reveal>
      </section>
    </main>
  );
}

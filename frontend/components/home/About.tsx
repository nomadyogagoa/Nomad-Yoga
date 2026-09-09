import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section className="section section-muted" id="instructors">
      <div className="container about-grid">
        <Reveal className="about-copy">
          <p className="eyebrow">OUR PHILOSOPHY</p>
          <h2>Practice beyond the pose.</h2>
          <p className="lead">We believe yoga is not about perfect shapes. It is about creating enough space to notice, breathe and reconnect.</p>
          <p>Our approach blends traditional foundations with thoughtful modern teaching, so every student can build a practice that feels grounded, safe and genuinely useful in everyday life.</p>
          <a className="text-link" href="#programs">Discover our approach <span>↗</span></a>
        </Reveal>
        <Reveal className="about-image-wrap" delay={0.15}>
          <div className="about-image" aria-hidden="true">
            <Image
              src="https://images.unsplash.com/photo-1510894347712-4b1780c0f3d8?auto=format&fit=crop&w=1400&q=88"
              alt=""
              fill
              sizes="(max-width: 860px) 100vw, 50vw"
            />
          </div>
          <div className="quote-card"><span>“</span><p>Yoga is the quiet art of returning to yourself.</p></div>
        </Reveal>
      </div>
    </section>
  );
}

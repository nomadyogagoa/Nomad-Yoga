import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/shared/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import Image from 'next/image';
import Link from 'next/link';

const values = [
  ['01', 'Practice with purpose', 'We teach yoga as a sustainable practice for real life, not a performance.'],
  ['02', 'Personal attention', 'Thoughtful class sizes and skilled teachers create space for individual progress.'],
  ['03', 'Tradition, made relevant', 'We respect yogaâ€™s roots while teaching in a clear, accessible and contemporary way.'],
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero eyebrow="Our Story" title="A quieter way to become stronger." copy="A modern practice space rooted in mindful movement, breath and a deeply human approach to practice." image="https://images.unsplash.com/photo-1510894347712-4b1780c0f3d8?auto=format&fit=crop&w=2000&q=88" />
        <section className="section">
          <div className="container story-grid">
            <Reveal as="div">
              <p className="eyebrow">Why we exist</p>
              <h2>Yoga that meets you <em>where you are.</em></h2>
            </Reveal>
            <Reveal as="div" className="rich-copy" delay={0.12}>
              <p className="lead">We created this studio for people who want depth without pressure, and progress without comparison.</p>
              <p>Our classes combine traditional yoga principles with modern teaching, thoughtful sequencing and practical guidance. Whether someone is stepping onto the mat for the first time or returning after years of practice, the experience should feel personal, clear and grounded.</p>
              <p>Beyond postures, we create room for breath, attention and community â€” the parts of yoga that continue long after class ends.</p>
            </Reveal>
          </div>
        </section>
        <section className="section section-muted">
          <div className="container">
            <Reveal as="div" className="section-heading">
              <p className="eyebrow">Our values</p>
              <h2>What shapes every <em>class and conversation.</em></h2>
            </Reveal>
            <div className="value-grid">
              {values.map(([n, t, c], i) => (
                <Reveal as="article" className="value-card" key={n} delay={i * 0.08}>
                  <span>{n}</span>
                  <h3>{t}</h3>
                  <p>{c}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container founder-grid">
            <Reveal as="div" className="founder-image" aria-hidden="true">
              <Image
                src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1400&q=88"
                alt=""
                fill
                sizes="(max-width: 860px) 100vw, 50vw"
              />
            </Reveal>
            <Reveal as="div" delay={0.15}>
              <p className="eyebrow">Founderâ€™s note</p>
              <h2>Practice should feel like <em>coming home.</em></h2>
              <p className="lead">â€œMy intention was never to build the busiest studio. It was to build a place people could trust.â€</p>
              <p className="body-copy">The studio began with a simple belief: yoga is most powerful when it feels sincere, safe and consistent. That philosophy still guides how we choose teachers, design programs and welcome every student.</p>
              <p className="signature">Anjali Sharma</p>
              <span className="muted-small">Founder & Lead Teacher</span>
            </Reveal>
          </div>
        </section>
        <section className="section">
          <Reveal as="div" className="container small-cta">
            <Image
              src="https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1800&q=85"
              alt=""
              fill
              sizes="100vw"
              aria-hidden="true"
            />
            <div className="small-cta-shade" aria-hidden="true" />
            <div className="small-cta-content">
              <div>
                <p className="eyebrow eyebrow-light">Begin gently</p>
                <h2>Find a practice that feels right.</h2>
              </div>
              <Link className="button button-light" href="/programs">Explore Programs â†’</Link>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}

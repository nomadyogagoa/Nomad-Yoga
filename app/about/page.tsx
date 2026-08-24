import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/shared/PageHero';
import Link from 'next/link';

const values = [
  ['01', 'Practice with purpose', 'We teach yoga as a sustainable practice for real life, not a performance.'],
  ['02', 'Personal attention', 'Thoughtful class sizes and skilled teachers create space for individual progress.'],
  ['03', 'Tradition, made relevant', 'We respect yoga’s roots while teaching in a clear, accessible and contemporary way.'],
];

export default function AboutPage() {
  return <><Header /><main>
    <PageHero eyebrow="Our Story" title="A quieter way to become stronger." copy="A modern yoga school rooted in mindful movement, breath and a deeply human approach to practice." image="https://images.unsplash.com/photo-1510894347712-4b1780c0f3d8?auto=format&fit=crop&w=2000&q=88" />
    <section className="section"><div className="container story-grid">
      <div><p className="eyebrow">Why we exist</p><h2>Yoga that meets you <em>where you are.</em></h2></div>
      <div className="rich-copy"><p className="lead">We created this school for people who want depth without pressure, and progress without comparison.</p><p>Our classes combine traditional yoga principles with modern teaching, thoughtful sequencing and practical guidance. Whether someone is stepping onto the mat for the first time or returning after years of practice, the experience should feel personal, clear and grounded.</p><p>Beyond postures, we create room for breath, attention and community — the parts of yoga that continue long after class ends.</p></div>
    </div></section>
    <section className="section section-muted"><div className="container"><div className="section-heading"><p className="eyebrow">Our values</p><h2>What shapes every <em>class and conversation.</em></h2></div><div className="value-grid">{values.map(([n,t,c])=><article className="value-card" key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></article>)}</div></div></section>
    <section className="section"><div className="container founder-grid"><div className="founder-image"/><div><p className="eyebrow">Founder’s note</p><h2>Practice should feel like <em>coming home.</em></h2><p className="lead">“My intention was never to build the busiest studio. It was to build a place people could trust.”</p><p className="body-copy">The school began with a simple belief: yoga is most powerful when it feels sincere, safe and consistent. That philosophy still guides how we choose teachers, design programs and welcome every student.</p><p className="signature">Anjali Sharma</p><span className="muted-small">Founder & Lead Teacher</span></div></div></section>
    <section className="section"><div className="container small-cta"><div><p className="eyebrow eyebrow-light">Begin gently</p><h2>Find a practice that feels right.</h2></div><Link className="button button-light" href="/programs">Explore Programs →</Link></div></section>
  </main><Footer /></>;
}

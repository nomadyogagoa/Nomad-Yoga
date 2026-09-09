import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Reveal } from '@/components/ui/Reveal';
import { getProgram, programs } from '@/data/programs';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export function generateStaticParams(){ return programs.map(p=>({slug:p.slug})); }

export default async function ProgramDetailPage({params}:{params:Promise<{slug:string}>}) {
  const { slug } = await params; const p = getProgram(slug); if(!p) notFound();
  return <><Header /><main>
    <section className="detail-hero"><div className="detail-hero-image"><Image src={p.image} alt="" fill priority sizes="100vw" /></div><div className="detail-hero-shade"/><Reveal as="div" className="container detail-hero-content"><Link className="back-link" href="/programs">← All Programs</Link><p className="eyebrow eyebrow-light">{p.level} · {p.duration}</p><h1>{p.title}</h1><p>{p.summary}</p><div className="detail-actions"><Link className="button button-light" href="/#trial">Book a Trial Class</Link><strong>{p.price}</strong></div></Reveal></section>
    <section className="section"><div className="container detail-grid"><Reveal as="div"><p className="eyebrow">The practice</p><h2>Move with clarity. <em>Breathe with intention.</em></h2><p className="lead">{p.description}</p></Reveal><Reveal as="aside" className="detail-card" delay={0.12}><span className="detail-label">Led by</span><strong>{p.instructor}</strong><span>{p.level}</span><span>{p.duration} sessions</span><Link href="/schedule">See class schedule →</Link></Reveal></div></section>
    <section className="section section-muted"><div className="container two-col"><Reveal as="div"><p className="eyebrow">What you’ll gain</p><h2>Benefits that travel <em>beyond the mat.</em></h2></Reveal><div className="check-list">{p.benefits.map((x,i)=><Reveal as="div" key={x} delay={i*0.06}><span>✓</span>{x}</Reveal>)}</div></div></section>
    <section className="section"><div className="container"><Reveal as="div" className="section-heading"><p className="eyebrow">Practice focus</p><h2>What we’ll explore <em>together.</em></h2></Reveal><div className="focus-grid">{p.focus.map((x,i)=><Reveal as="article" key={x} delay={i*0.08}><span>0{i+1}</span><h3>{x}</h3></Reveal>)}</div></div></section>
  </main><Footer /></>;
}

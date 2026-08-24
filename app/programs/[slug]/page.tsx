import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getProgram, programs } from '@/data/programs';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export function generateStaticParams(){ return programs.map(p=>({slug:p.slug})); }

export default async function ProgramDetailPage({params}:{params:Promise<{slug:string}>}) {
  const { slug } = await params; const p = getProgram(slug); if(!p) notFound();
  return <><Header /><main>
    <section className="detail-hero"><div className="detail-hero-image" style={{backgroundImage:`url(${p.image})`}}/><div className="detail-hero-shade"/><div className="container detail-hero-content"><Link className="back-link" href="/programs">← All Programs</Link><p className="eyebrow eyebrow-light">{p.level} · {p.duration}</p><h1>{p.title}</h1><p>{p.summary}</p><div className="detail-actions"><Link className="button button-light" href="/#trial">Book a Trial Class</Link><strong>{p.price}</strong></div></div></section>
    <section className="section"><div className="container detail-grid"><div><p className="eyebrow">The practice</p><h2>Move with clarity. <em>Breathe with intention.</em></h2><p className="lead">{p.description}</p></div><aside className="detail-card"><span className="detail-label">Led by</span><strong>{p.instructor}</strong><span>{p.level}</span><span>{p.duration} sessions</span><Link href="/schedule">See class schedule →</Link></aside></div></section>
    <section className="section section-muted"><div className="container two-col"><div><p className="eyebrow">What you’ll gain</p><h2>Benefits that travel <em>beyond the mat.</em></h2></div><div className="check-list">{p.benefits.map(x=><div key={x}><span>✓</span>{x}</div>)}</div></div></section>
    <section className="section"><div className="container"><div className="section-heading"><p className="eyebrow">Practice focus</p><h2>What we’ll explore <em>together.</em></h2></div><div className="focus-grid">{p.focus.map((x,i)=><article key={x}><span>0{i+1}</span><h3>{x}</h3></article>)}</div></div></section>
  </main><Footer /></>;
}

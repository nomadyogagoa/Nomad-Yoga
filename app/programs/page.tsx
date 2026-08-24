import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/shared/PageHero';
import { programs } from '@/data/programs';
import Link from 'next/link';

export default function ProgramsPage() {
  return <><Header /><main>
    <PageHero eyebrow="Programs" title="Choose the practice your body is asking for." copy="From steady foundations to energising flow and quiet breathwork, every program is designed with clear intent." image="https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=2000&q=88" />
    <section className="section"><div className="container"><div className="program-list">{programs.map((p,i)=><article className="program-row" key={p.slug}><div className="program-photo" style={{backgroundImage:`url(${p.image})`}}><span>{String(i+1).padStart(2,'0')}</span></div><div className="program-info"><div><p className="eyebrow">{p.level} · {p.duration}</p><h2>{p.title}</h2><p>{p.summary}</p></div><div className="program-meta"><strong>{p.price}</strong><Link className="button button-outline" href={`/programs/${p.slug}`}>View Program →</Link></div></div></article>)}</div></div></section>
  </main><Footer /></>;
}

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/shared/PageHero';
import { instructors } from '@/data/instructors';
import Link from 'next/link';

export default function InstructorsPage(){return <><Header/><main>
<PageHero eyebrow="Our Teachers" title="Learn from people who teach with presence." copy="Experienced, thoughtful instructors with distinct specialties and one shared goal: helping you build a practice that lasts." image="https://images.unsplash.com/photo-1524863479829-916d8e77f114?auto=format&fit=crop&w=2000&q=88" />
<section className="section"><div className="container instructor-grid">{instructors.map((x,i)=><Link href={`/instructors/${x.slug}`} className={`instructor-card ${i%2?'instructor-offset':''}`} key={x.slug}><div className="instructor-photo" style={{backgroundImage:`url(${x.image})`}}/><div><p className="eyebrow">{x.experience} experience</p><h2>{x.name}</h2><p>{x.role}</p><span className="text-link">Meet {x.name.split(' ')[0]} →</span></div></Link>)}</div></section>
</main><Footer/></>}

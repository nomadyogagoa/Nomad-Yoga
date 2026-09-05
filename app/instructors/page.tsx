import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/shared/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { instructors } from '@/data/instructors';
import Image from 'next/image';
import Link from 'next/link';

export default function InstructorsPage(){return <><Header/><main>
<PageHero eyebrow="Our Teachers" title="Learn from people who teach with presence." copy="Experienced, thoughtful instructors with distinct specialties and one shared goal: helping you build a practice that lasts." image="https://images.unsplash.com/photo-1524863479829-916d8e77f114?auto=format&fit=crop&w=2000&q=88" />
<section className="section"><div className="container instructor-grid">{instructors.map((x,i)=><Reveal as="div" className={i%2?'instructor-offset':''} key={x.slug} delay={(i%2)*0.1}><Link href={`/instructors/${x.slug}`} className="instructor-card"><div className="instructor-photo"><Image src={x.image} alt="" fill sizes="(max-width: 860px) 100vw, 45vw" /></div><div><p className="eyebrow">{x.experience} experience</p><h2>{x.name}</h2><p>{x.role}</p><span className="text-link">Meet {x.name.split(' ')[0]} →</span></div></Link></Reveal>)}</div></section>
</main><Footer/></>}

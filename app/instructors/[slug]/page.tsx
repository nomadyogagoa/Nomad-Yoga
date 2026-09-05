import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Reveal } from '@/components/ui/Reveal';
import { getInstructor, instructors } from '@/data/instructors';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export function generateStaticParams(){return instructors.map(x=>({slug:x.slug}));}
export default async function InstructorPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const x=getInstructor(slug);if(!x)notFound();return <><Header/><main>
<section className="teacher-hero"><div className="container teacher-hero-grid"><Reveal as="div" className="teacher-portrait"><Image src={x.image} alt="" fill priority sizes="(max-width: 860px) 100vw, 50vw" /></Reveal><Reveal as="div" delay={0.12}><Link className="back-link dark" href="/instructors">← All Instructors</Link><p className="eyebrow">{x.experience} experience</p><h1>{x.name}</h1><p className="teacher-role">{x.role}</p><p className="lead">{x.bio}</p><Link className="button" href="/schedule">View Schedule</Link></Reveal></div></section>
<section className="section section-muted"><div className="container two-col"><Reveal as="div"><p className="eyebrow">Teaching philosophy</p><blockquote className="teacher-quote">“{x.quote}”</blockquote></Reveal><Reveal as="div" delay={0.12}><p className="eyebrow">Specialties</p><div className="specialty-list">{x.specialties.map((s,i)=><div key={s}><span>0{i+1}</span><strong>{s}</strong></div>)}</div></Reveal></div></section>
</main><Footer/></>}

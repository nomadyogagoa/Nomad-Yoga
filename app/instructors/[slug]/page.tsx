import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getInstructor, instructors } from '@/data/instructors';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export function generateStaticParams(){return instructors.map(x=>({slug:x.slug}));}
export default async function InstructorPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const x=getInstructor(slug);if(!x)notFound();return <><Header/><main>
<section className="teacher-hero"><div className="container teacher-hero-grid"><div className="teacher-portrait" style={{backgroundImage:`url(${x.image})`}}/><div><Link className="back-link dark" href="/instructors">← All Instructors</Link><p className="eyebrow">{x.experience} experience</p><h1>{x.name}</h1><p className="teacher-role">{x.role}</p><p className="lead">{x.bio}</p><Link className="button" href="/schedule">View Schedule</Link></div></div></section>
<section className="section section-muted"><div className="container two-col"><div><p className="eyebrow">Teaching philosophy</p><blockquote className="teacher-quote">“{x.quote}”</blockquote></div><div><p className="eyebrow">Specialties</p><div className="specialty-list">{x.specialties.map((s,i)=><div key={s}><span>0{i+1}</span><strong>{s}</strong></div>)}</div></div></div></section>
</main><Footer/></>}

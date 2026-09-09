import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/shared/SiteShell";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { reikiContent } from "@/data/reiki";

export const metadata: Metadata = {
  title: "Reiki Courses | Nomad Yoga",
  description: "Explore Nomad Yoga’s small-group Usui Shiki Ryoho Reiki Level 1 and Level 2 courses.",
  openGraph: { title: "Reiki Courses | Nomad Yoga", description: "Hands-on Reiki practice, small-group trainings and attunements.", images: ["/images/reiki/reiki-hands.jpg"] },
};

export default function ReikiPage() {
  return <SiteShell><PageHero eyebrow="Reiki courses" title={<>Reiki</>} copy={reikiContent.hero} image="/images/reiki/reiki-hands.jpg" />
    <section className="section"><div className="container reiki-about"><Reveal as="div"><p className="eyebrow">About Reiki</p><h2>Hands, energy and <em>intention.</em></h2></Reveal><Reveal as="div" className="rich-copy" delay={0.12}>{reikiContent.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</Reveal></div></section>
    <section className="section section-muted"><div className="container"><Reveal as="div" className="section-heading"><p className="eyebrow">Reiki courses available</p><h2>Learn in a small, <em>attentive group.</em></h2><p>No dates or payment are shown here. Enquire to express your interest in a future course.</p></Reveal><div className="reiki-course-grid">{reikiContent.courses.map((course, index) => <Reveal as="article" className="reiki-course-card" key={course.level} delay={index * 0.1}><div className="reiki-course-image"><Image src={course.image} alt={`Nomad Yoga Reiki ${course.level} course`} fill sizes="(max-width: 860px) 100vw, 50vw" /><span>{course.level}</span></div><div className="reiki-course-copy"><p className="eyebrow">{course.price} · 2 days</p><h3>{course.title}</h3><p>{course.summary}</p><ul>{course.details.map((detail) => <li key={detail}>{detail}</li>)}</ul><Link className="button button-outline" href={`/contact?interest=reiki-${course.level.replace(" ", "-").toLowerCase()}`}>Enquire About {course.level}</Link></div></Reveal>)}</div></div></section>
    <section className="section"><Reveal as="div" className="container small-cta reiki-contact-cta"><Image src="/images/reiki/reiki-hands.jpg" alt="" fill sizes="100vw" aria-hidden="true" /><div className="small-cta-shade" /><div className="small-cta-content"><div><p className="eyebrow eyebrow-light">Questions or sign-ups</p><h2>Begin your Reiki journey with a conversation.</h2></div><Link className="button button-light" href="/contact?interest=reiki">Contact Nomad Yoga</Link></div></Reveal></section>
  </SiteShell>;
}

import type { Metadata } from "next";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { aboutContent, nomadTeam } from "@/data/about";

export const metadata: Metadata = {
  title: "About Nomad Yoga | Learn, Practice, Explore",
  description: "Discover Nomad Yoga’s Kraków beginnings, Andrew Garrett’s path, and its global community of teachers and travellers.",
  openGraph: { title: "About Nomad Yoga", description: "From Kraków and the Wisła to a global yoga community.", images: ["/images/about/nomad-story.jpg"] }
};

export default function AboutPage() {
  return <><Header /><main>
    <PageHero eyebrow="Get to know Nomad Yoga" title={<>About <em>Nomad Yoga</em></>} copy="A community born beside the Wisła in Kraków, now moving, learning and exploring together around the world." image="/images/about/nomad-story.jpg" />
    <section className="section"><div className="container story-grid"><Reveal as="div"><p className="eyebrow">About Nomad Yoga</p><h2>From one room to a <em>global community.</em></h2></Reveal><Reveal as="div" className="rich-copy" delay={0.12}>{aboutContent.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</Reveal></div></section>
    <section className="section section-muted"><div className="container"><Reveal as="div" className="section-heading"><p className="eyebrow">Andrew Garrett</p><h2>A life shaped by <em>movement, mentorship and practice.</em></h2><p>Andrew’s story, in the order it unfolded—from childhood gymnastics to teaching and building Nomad Yoga.</p></Reveal><div className="founder-story"><Reveal as="div" className="founder-image"><Image src="/images/team/andrew-garrett.jpeg" alt="Andrew Garrett, founder of Nomad Yoga" fill sizes="(max-width: 860px) 100vw, 42vw" /></Reveal><div className="chapter-list">{aboutContent.andrewTimeline.map((chapter, index) => <Reveal as="article" key={chapter.number} delay={index * 0.05}><span>{chapter.number}</span><div><h3>{chapter.title}</h3>{chapter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{chapter.pullQuote && <blockquote className="chapter-quote">“{chapter.pullQuote}”</blockquote>}</div></Reveal>)}</div></div></div></section>
    <section className="section"><div className="container"><Reveal as="div" className="section-heading"><p className="eyebrow">Our places</p><h2>Homes shaped by <em>nature and connection.</em></h2></Reveal><div className="location-grid">{aboutContent.locations.map((location, index) => <Reveal as="article" className="location-card" key={location.label} delay={index * 0.1}><div className="location-image"><Image src={location.image} alt={`${location.label}, a Nomad Yoga home`} fill sizes="(max-width: 860px) 100vw, 50vw" /></div><div><p className="eyebrow">{location.label}</p><h3>{location.title}</h3>{location.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></Reveal>)}</div></div></section>
    <section className="section section-muted"><div className="container"><Reveal as="div" className="section-heading"><p className="eyebrow">Our people</p><h2>A team with depth, <em>care and perspective.</em></h2></Reveal><div className="nomad-team-grid">{nomadTeam.map((member, index) => <Reveal as="article" className="nomad-team-card" key={member.slug} delay={index * 0.08}>{member.image ? <div className="nomad-team-image"><Image src={member.image} alt={member.name} fill sizes="(max-width: 760px) 100vw, 33vw" /></div> : <div className="nomad-team-image nomad-team-monogram" aria-hidden="true">JH</div>}<p className="eyebrow">{member.role}</p><h3>{member.name}</h3><p>{member.bio}</p></Reveal>)}</div></div></section>
    <section className="section"><Reveal as="div" className="container hostel-teaser"><Image src="/images/about/hostel-logo.jpeg" alt="Nomad Yoga – The Hostel" fill sizes="100vw" /><div className="hostel-shade" /><div className="hostel-content"><p className="eyebrow eyebrow-light">Nomad Yoga – The Hostel</p><h2>Come as a Nomad,<br /><em>leave with a Tribe.</em></h2>{aboutContent.hostel.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<span className="button button-light" aria-label="Hostel experience coming soon">More information coming soon</span></div></Reveal></section>
  </main><Footer /></>;
}

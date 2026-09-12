import Link from "next/link";
import { SiteShell } from "@/components/shared/SiteShell";
import { PageHero } from "@/components/shared/PageHero";
import { NewsletterSubscribe } from "@/components/content/NewsletterSubscribe";
import { listPublishedCampaigns, thumbnail, formatPublishedDate } from "@/lib/content-public-api";

export const dynamic = "force-dynamic";

export const metadata = { title: "Newsletter | Nomad Yoga", description: "Thoughtful updates, practice notes and community news from Nomad Yoga." };
export default async function Newsletter() { const result = await listPublishedCampaigns(); return <SiteShell><PageHero eyebrow="Newsletter" title={<>A little more <em>presence</em> in your inbox.</>} copy="Thoughtful updates, practice notes and community news from Nomad Yoga." image="/images/about/nomad-story.jpg" /><section className="section"><div className="container content-list"><div className="section-heading"><p className="eyebrow">From the community</p><h2>Letters for living with attention.</h2><p>Explore published notes from our teachers and community. Subscribe when you are ready.</p></div>{result.items.length ? <div className="newsletter-grid">{result.items.map((campaign) => <Link className="newsletter-card" key={campaign.id} href={`/newsletter/${campaign.slug}`}><div className="blog-image"><img src={thumbnail(campaign.media)} alt="" /></div><div><p className="eyebrow">{campaign.publishedAt ? formatPublishedDate(campaign.publishedAt) : "Newsletter"}</p><h2>{campaign.title || campaign.subject}</h2><p>{campaign.summary || "A note from Nomad Yoga."}</p><span className="text-link">Read the letter →</span></div></Link>)}</div> : <div className="content-empty"><h2>No published letters yet.</h2><p>Join the list and we will let you know when the next one arrives.</p></div>}<div className="content-subscribe"><p className="eyebrow">Stay in the rhythm</p><h2>Receive the next letter.</h2><NewsletterSubscribe /></div></div></section></SiteShell>; }

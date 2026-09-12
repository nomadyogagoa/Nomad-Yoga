import Link from "next/link";
import { SiteShell } from "@/components/shared/SiteShell";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { listPublishedPosts, thumbnail, formatPublishedDate } from "@/lib/content-public-api";

export const dynamic = "force-dynamic";

export default async function Blog() {
  const result = await listPublishedPosts();
  return <SiteShell><PageHero eyebrow="Newsletter" title={<>Notes for a more <em>intentional life.</em></>} copy="Practice notes, teacher reflections and simple ideas to carry beyond the mat." image="/images/about/nomad-story.jpg" /><section className="section"><div className="container blog-grid">{result.items.length ? result.items.map((post, i) => <Reveal as="div" key={post.id} delay={i * 0.05}><Link href={`/blog/${post.slug}`} className="blog-card"><div className="blog-image"><img src={thumbnail(post.media)} alt="" /></div><div><p className="eyebrow">{post.category?.name ?? "Newsletter"}{post.publishedAt ? ` · ${formatPublishedDate(post.publishedAt)}` : ""}</p><h2>{post.title}</h2><p>{post.excerpt ?? "A thoughtful note from Nomad Yoga."}</p><span className="text-link">Read newsletter →</span></div></Link></Reveal>) : <div className="content-empty"><h2>The newsletter is taking shape.</h2><p>New reflections will be shared here soon.</p></div>}</div></section></SiteShell>;
}

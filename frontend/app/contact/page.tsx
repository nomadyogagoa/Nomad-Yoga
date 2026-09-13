import { ContactForm } from "@/components/content/ContactForm";
import { SiteShell } from "@/components/shared/SiteShell";
import { PageHero } from "@/components/shared/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";

export default function Contact() {
  const contactMethods = [{ label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` }, { label: "Call / WhatsApp", value: siteConfig.phone, href: "https://wa.me/918010810332" }, { label: "Studio hours", value: "Mon–Sat · 6:00–20:30" }];
  return <SiteShell><PageHero eyebrow="Contact" title={<>A calm space to <em>begin.</em></>} copy="Questions about classes, memberships or your first visit? We would love to hear from you." image="https://images.unsplash.com/photo-1510894347712-4b1780c0f3d8?auto=format&fit=crop&w=2000&q=88" /><section className="section"><div className="container contact-grid"><Reveal as="div"><p className="eyebrow">Visit the studio</p><h2>Let&apos;s connect.</h2><p className="body-copy">{siteConfig.address}</p><div className="contact-cards">{contactMethods.map((method, index) => <Reveal as="article" key={method.label} delay={index * 0.08}><span>{method.label}</span>{method.href ? <a href={method.href} target={method.href.startsWith("https") ? "_blank" : undefined} rel={method.href.startsWith("https") ? "noopener noreferrer" : undefined}><strong>{method.value}</strong></a> : <strong>{method.value}</strong>}</Reveal>)}</div></Reveal><Reveal as="div" delay={0.15}><ContactForm /></Reveal></div></section></SiteShell>;
}

import Link from "next/link";
import { featureFlags, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand"><div className="brand brand-footer"><span className="brand-mark">✦</span>{siteConfig.name}</div><p>{siteConfig.tagline}</p></div>
        <div><h4>Explore</h4><Link href="/programs">Programs</Link>{featureFlags.schedule && <Link href="/schedule">Schedule</Link>}<Link href="/instructors">Instructors</Link><Link href="/pricing">Pricing</Link></div>
        <div><h4>Connect</h4><a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>{siteConfig.phone}</a><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a><Link href="/contact">Contact</Link><Link href="/register">Join us</Link></div>
        <div><h4>Updates</h4><p>New classes, workshops and practical wellbeing notes.</p><form className="newsletter"><input aria-label="Email address" type="email" placeholder="Email address"/><button type="button" aria-label="Subscribe">→</button></form></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 {siteConfig.name}</span><span>Privacy · Terms</span></div>
    </footer>
  );
}

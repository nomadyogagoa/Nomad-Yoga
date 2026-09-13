import { socialLinks } from "@/config/social-links";
import { Icon } from "@/components/ui/Icon";

export function SocialLinks({ className = "" }: { className?: string }) {
  return <div className={`social-links ${className}`.trim()} aria-label="Social media">
    {socialLinks.map((social) => social.href ? (
      <a key={social.name} className="social-link" href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}><Icon name={social.icon} size={18} /></a>
    ) : (
      <span key={social.name} className="social-link is-disabled" role="img" aria-label={`${social.name} link coming soon`}><Icon name={social.icon} size={18} /></span>
    ))}
  </div>;
}

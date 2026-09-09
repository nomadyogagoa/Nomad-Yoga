"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePWAInstallability } from "@/components/pwa/PWAInstallabilityProvider";
import { Icon } from "@/components/ui/Icon";
import { memberProfile } from "@/data/member";
import { MemberNotificationProvider, useMemberNotifications } from "@/components/member/MemberNotificationState";

const memberNavigation = [
  { label: "Home", href: "/dashboard", icon: "home" },
  { label: "Classes", href: "/classes", icon: "sparkles" },
  { label: "Bookings", href: "/bookings", icon: "calendar" },
  { label: "Progress", href: "/progress", icon: "chart" },
  { label: "Profile", href: "/profile", icon: "users" },
] as const;

function MemberNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  return <nav className={mobile ? "member-bottom-nav" : "member-side-nav"} aria-label="Member navigation">
    {memberNavigation.map((item) => {
      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
      return <Link key={item.href} href={item.href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>
        <Icon name={item.icon} size={mobile ? 21 : 18} /><span>{item.label}</span>
      </Link>;
    })}
  </nav>;
}

function MemberShellContent({ title, subtitle, children }: Readonly<{ title: string; subtitle: string; children: React.ReactNode }>) {
  const { isStandalone } = usePWAInstallability();
  const { unreadCount } = useMemberNotifications();
  return <div className="member-app" data-standalone={isStandalone || undefined}>
    <aside className="member-sidebar">
      <Link className="member-brand" href="/dashboard" aria-label="Nomad Yoga member home"><span className="member-brand-mark">✦</span><span>Nomad Yoga</span></Link>
      <MemberNavigation />
      <Link className="member-exit" href="/"><Icon name="logout" /><span>Visit website</span></Link>
    </aside>
    <div className="member-frame">
      <header className="member-header"><div><p className="member-kicker">Member space</p><h1>{title}</h1><p>{subtitle}</p></div>
        <div className="member-header-actions"><Link className="member-notification-action" href="/notifications" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}><Icon name="bell" size={19} />{unreadCount ? <span aria-hidden="true">{unreadCount}</span> : null}</Link>
          <Link className="member-avatar" href="/profile" aria-label={`Open ${memberProfile.name}'s profile`}>{memberProfile.initials}</Link></div>
      </header>
      <main className="member-content">{children}</main>
    </div>
    <MemberNavigation mobile />
  </div>;
}

export function MemberShell(props: Readonly<{ title: string; subtitle: string; children: React.ReactNode }>) {
  return <MemberNotificationProvider><MemberShellContent {...props} /></MemberNotificationProvider>;
}

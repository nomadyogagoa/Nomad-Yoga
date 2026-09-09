import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

const channels = [
  ["Email", "Connected", "mail"],
  ["WhatsApp", "Ready to connect", "bell"],
  ["SMS", "Ready to connect", "bell"],
] as const;

const automations = [
  "Welcome after registration",
  "Class reminder · 2 hours before",
  "Payment success receipt",
  "Membership renewal reminder",
  "Birthday greeting",
];

export default function Notifications() {
  return (
    <AdminShell active="Notifications" title="Notifications" subtitle="Prepare member communication across email, SMS and WhatsApp." action={<button className="button button-small"><Icon name="plus" /> New campaign</button>}>
      <Link className="admin-notification-settings-link" href="/admin/settings/pwa"><Icon name="settings" /> PWA & notification settings</Link>
      <div className="notification-grid">
        <Reveal as="section" className="admin-card">
          <p className="eyebrow">Channels</p><h2>Communication health</h2>
          {channels.map(([name, state, icon]) => <div className="channel-row" key={name}>
            <span className="channel-icon"><Icon name={icon} /></span>
            <div><strong>{name}</strong><small>{state}</small></div>
            <span className={state === "Connected" ? "connected" : "pending"}>{state === "Connected" ? "Live" : "Setup"}</span>
          </div>)}
        </Reveal>
        <Reveal as="section" className="admin-card" delay={0.1}>
          <p className="eyebrow">Automations</p><h2>Member journeys</h2>
          {automations.map((automation, index) => <div className="automation-row" key={automation}>
            <div><strong>{automation}</strong><small>{index < 3 ? "Email · WhatsApp" : "Email"}</small></div>
            <label className="switch"><span className="sr-only">Enable {automation}</span><input type="checkbox" defaultChecked={index < 3} /><i /></label>
          </div>)}
        </Reveal>
      </div>
    </AdminShell>
  );
}

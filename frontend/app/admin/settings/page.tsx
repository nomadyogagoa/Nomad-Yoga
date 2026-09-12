import { AdminShell } from "@/components/admin/AdminShell";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";

const features = ['Programs', 'Schedule', 'Instructors', 'Pricing', 'Gallery', 'Newsletter', 'Trial booking', 'Member login', 'Student dashboard'];

export default function Settings() {
  return (
    <AdminShell active="Settings" title="Settings" subtitle="Control branding, feature visibility and general studio preferences.">
      <div className="settings-grid">
        <Reveal as="section" className="admin-card settings-form">
          <p className="eyebrow">Brand</p>
          <h2>Studio identity</h2>
          <label>Website name<input defaultValue="Nomad Yoga" /></label>
          <label>Tagline<input defaultValue="Modern Yoga & Wellness" /></label>
          <div className="form-row">
            <label>Primary email<input defaultValue="hello@nomadyoga.example" /></label>
            <label>Phone<input defaultValue="+91 98765 43210" /></label>
          </div>
          <button className="button">Save brand settings</button>
        </Reveal>
        <Reveal as="section" className="admin-card" delay={0.1}>
          <p className="eyebrow">Feature visibility</p>
          <h2>Show or hide modules</h2>
          <p className="body-copy">Turn undecided sections off without deleting their content.</p>
          <div className="feature-toggle-list">
            {features.map((f, i) => (
              <div key={f}>
                <strong>{f}</strong>
                <label className="switch">
                  <input type="checkbox" defaultChecked={i !== 5} />
                  <i />
                </label>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal as="section" className="admin-card admin-settings-pwa-link">
          <div>
            <p className="eyebrow">App experience</p>
            <h2>PWA & Notifications</h2>
            <p className="body-copy">Review install, update, offline and member notification defaults in one frontend configuration area.</p>
          </div>
          <Link className="button button-small" href="/admin/settings/pwa">Open settings</Link>
        </Reveal>
      </div>
    </AdminShell>
  );
}

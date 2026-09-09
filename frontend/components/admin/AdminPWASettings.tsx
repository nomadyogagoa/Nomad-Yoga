"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  adminNotificationCategories,
  classReminderTimings,
  deliveryChannelStatuses,
  initialAdminPWAConfiguration,
  installCooldownOptions,
  installDelayOptions,
  notificationTemplatePreviews,
  pwaConfigurationStatus,
  type AdminPWAConfiguration,
  type InstallCooldown,
  type InstallDelay,
  type ReminderTiming,
} from "@/data/pwa-admin";
import type { ReminderPreferenceKey } from "@/data/member";

function SettingsToggle({ label, description, checked, onChange }: {
  label: string;
  description?: string;
  checked: boolean;
  onChange(checked: boolean): void;
}) {
  return (
    <label className="admin-pwa-toggle-row">
      <span><strong>{label}</strong>{description ? <small>{description}</small> : null}</span>
      <span className="admin-pwa-switch">
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
        <i aria-hidden="true" />
      </span>
    </label>
  );
}

export function AdminPWASettings() {
  const [settings, setSettings] = useState<AdminPWAConfiguration>(initialAdminPWAConfiguration);
  const [saveMessage, setSaveMessage] = useState("");

  const setInstall = <Key extends keyof AdminPWAConfiguration["installPromotion"]>(key: Key, value: AdminPWAConfiguration["installPromotion"][Key]) =>
    setSettings((current) => ({ ...current, installPromotion: { ...current.installPromotion, [key]: value } }));
  const setUpdate = <Key extends keyof AdminPWAConfiguration["updates"]>(key: Key, value: AdminPWAConfiguration["updates"][Key]) =>
    setSettings((current) => ({ ...current, updates: { ...current.updates, [key]: value } }));
  const setOffline = <Key extends keyof AdminPWAConfiguration["offline"]>(key: Key, value: AdminPWAConfiguration["offline"][Key]) =>
    setSettings((current) => ({ ...current, offline: { ...current.offline, [key]: value } }));
  const setCategory = (key: ReminderPreferenceKey, checked: boolean) =>
    setSettings((current) => ({ ...current, notificationCategories: { ...current.notificationCategories, [key]: checked } }));

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveMessage("Preview settings updated for this session. Nothing was saved to the server.");
  };

  return (
    <form className="admin-pwa-form" onSubmit={handleSave} onChange={() => setSaveMessage("")}>
      <section className="admin-card admin-pwa-intro" aria-labelledby="pwa-status-title">
        <div className="admin-pwa-section-head">
          <div><p className="eyebrow">Configuration snapshot</p><h2 id="pwa-status-title">PWA status</h2></div>
          <span className="admin-pwa-badge">Frontend status</span>
        </div>
        <p className="admin-pwa-note">This reflects the application configuration in this project. It is not a live production-health check.</p>
        <div className="admin-pwa-status-grid">
          {pwaConfigurationStatus.map((item) => <article key={item.label}><span>{item.label}</span><strong>{item.status}</strong><small>{item.detail}</small></article>)}
        </div>
      </section>

      <div className="admin-pwa-grid">
        <fieldset className="admin-card admin-pwa-fieldset">
          <legend>Install promotion</legend>
          <p className="admin-pwa-note">Controls for a future shared configuration. Current install behavior is unchanged.</p>
          <div className="admin-pwa-toggle-list">
            <SettingsToggle label="Enable install promotion" checked={settings.installPromotion.enabled} onChange={(value) => setInstall("enabled", value)} />
            <SettingsToggle label="Desktop install prompt" checked={settings.installPromotion.desktop} onChange={(value) => setInstall("desktop", value)} />
            <SettingsToggle label="Android install prompt" checked={settings.installPromotion.android} onChange={(value) => setInstall("android", value)} />
            <SettingsToggle label="iOS Add to Home Screen guidance" checked={settings.installPromotion.iosGuidance} onChange={(value) => setInstall("iosGuidance", value)} />
          </div>
          <div className="admin-pwa-select-grid">
            <label htmlFor="install-cooldown">Dismissal cooldown<select id="install-cooldown" value={settings.installPromotion.dismissalCooldown} onChange={(event) => setInstall("dismissalCooldown", event.target.value as InstallCooldown)}>{installCooldownOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label htmlFor="install-delay">Display delay<select id="install-delay" value={settings.installPromotion.displayDelay} onChange={(event) => setInstall("displayDelay", event.target.value as InstallDelay)}>{installDelayOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          </div>
        </fieldset>

        <fieldset className="admin-card admin-pwa-fieldset">
          <legend>Update experience</legend>
          <p className="admin-pwa-note">Updates remain user controlled. Installed sessions are never automatically reloaded.</p>
          <div className="admin-pwa-toggle-list">
            <SettingsToggle label="Show update banner" checked={settings.updates.showBanner} onChange={(value) => setUpdate("showBanner", value)} />
            <SettingsToggle label="Allow “Later”" checked={settings.updates.allowLater} onChange={(value) => setUpdate("allowLater", value)} />
            <SettingsToggle label="Foreground update checks" checked={settings.updates.foregroundChecks} onChange={(value) => setUpdate("foregroundChecks", value)} />
          </div>
        </fieldset>

        <fieldset className="admin-card admin-pwa-fieldset">
          <legend>Offline experience</legend>
          <p className="admin-pwa-note">Preview-only values. They do not change the current offline route.</p>
          <div className="admin-pwa-toggle-list">
            <SettingsToggle label="Offline fallback enabled" checked={settings.offline.enabled} onChange={(value) => setOffline("enabled", value)} />
          </div>
          <div className="admin-pwa-fields">
            <label htmlFor="offline-headline">Offline headline<input id="offline-headline" value={settings.offline.headline} onChange={(event) => setOffline("headline", event.target.value)} /></label>
            <label htmlFor="offline-message">Offline message<textarea id="offline-message" rows={3} value={settings.offline.message} onChange={(event) => setOffline("message", event.target.value)} /></label>
          </div>
          <div className="admin-pwa-toggle-list compact">
            <SettingsToggle label="Show Try Again" checked={settings.offline.showTryAgain} onChange={(value) => setOffline("showTryAgain", value)} />
            <SettingsToggle label="Show Go Home" checked={settings.offline.showGoHome} onChange={(value) => setOffline("showGoHome", value)} />
          </div>
        </fieldset>

        <fieldset className="admin-card admin-pwa-fieldset">
          <legend>Member notification categories</legend>
          <p className="admin-pwa-note">Shared with the member preference taxonomy. Delivery is not connected.</p>
          <div className="admin-pwa-toggle-list">
            {adminNotificationCategories.map((category) => <SettingsToggle key={category.key} label={category.label} description={category.description} checked={settings.notificationCategories[category.key]} onChange={(value) => setCategory(category.key, value)} />)}
          </div>
        </fieldset>

        <section className="admin-card admin-pwa-section" aria-labelledby="delivery-title">
          <div className="admin-pwa-section-head"><div><p className="eyebrow">Future connections</p><h2 id="delivery-title">Delivery channels</h2></div><span className="admin-pwa-badge muted">Not operational</span></div>
          <p className="admin-pwa-note">No providers, credentials, subscriptions, or delivery services are connected.</p>
          <div className="admin-pwa-channel-list">
            {deliveryChannelStatuses.map((channel) => <div key={channel.key} aria-disabled="true"><span><strong>{channel.label}</strong><small>{channel.status}</small></span><span className="admin-pwa-unavailable">Unavailable</span></div>)}
          </div>
        </section>

        <fieldset className="admin-card admin-pwa-fieldset admin-pwa-reminder">
          <legend>Reminder defaults</legend>
          <p className="admin-pwa-note">Choose the future default shown to members. This does not schedule a reminder.</p>
          <label htmlFor="default-reminder">Default class-reminder timing<select id="default-reminder" value={settings.defaultReminderTiming} onChange={(event) => setSettings((current) => ({ ...current, defaultReminderTiming: event.target.value as ReminderTiming }))}>{classReminderTimings.map((timing) => <option key={timing}>{timing}</option>)}</select></label>
        </fieldset>
      </div>

      <section className="admin-card admin-pwa-templates" aria-labelledby="templates-title">
        <div className="admin-pwa-section-head"><div><p className="eyebrow">Content preview</p><h2 id="templates-title">Notification templates</h2></div><span className="admin-pwa-badge muted">Preview only</span></div>
        <div className="admin-pwa-template-grid">
          {notificationTemplatePreviews.map((template) => <article key={template.id}><span>{template.name}</span><h3>{template.title}</h3><p>{template.message}</p><div aria-label={`${template.name} preview channels`}>{template.channels.map((channel) => <span key={channel}>{channel}</span>)}</div></article>)}
        </div>
      </section>

      <div className="admin-pwa-savebar">
        <div><strong>Frontend preview only</strong><span>Changes last for this browser session and are not persisted.</span></div>
        <div><span className="admin-pwa-save-message" role="status" aria-live="polite">{saveMessage}</span><button className="button" type="submit">Save changes</button></div>
      </div>
      <p className="admin-pwa-related">Campaigns and communication history remain separate. <Link href="/admin/notifications">Open admin notifications</Link>.</p>
    </form>
  );
}

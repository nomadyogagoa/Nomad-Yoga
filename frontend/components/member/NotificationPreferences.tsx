"use client";

import { useState } from "react";
import { classReminderTimings, notificationChannels, reminderPreferences, type NotificationChannelKey, type ReminderPreferenceKey } from "@/data/member";

export function NotificationPreferences() {
  const [channels, setChannels] = useState(() => Object.fromEntries(notificationChannels.map((channel) => [channel.key, channel.enabled])) as Record<NotificationChannelKey, boolean>);
  const [preferences, setPreferences] = useState(() => Object.fromEntries(reminderPreferences.map((preference) => [preference.key, preference.enabled])) as Record<ReminderPreferenceKey, boolean>);
  const [reminderTiming, setReminderTiming] = useState<(typeof classReminderTimings)[number]>(classReminderTimings[0]);

  return <div className="notification-settings-grid">
    <section className="notification-settings-card" aria-labelledby="channels-title">
      <div className="member-section-heading"><div><p className="member-kicker">Delivery</p><h2 id="channels-title">Channels</h2></div></div>
      <p className="notification-settings-note">These controls are a frontend preview. No messages are being sent.</p>
      <div className="notification-toggle-list">{notificationChannels.map((channel) => <div key={channel.key} className={!channel.available ? "is-disabled" : undefined}>
        <div><strong>{channel.label}</strong><span>{channel.description}</span></div>
        {!channel.available ? <span className="notification-coming-soon">Coming soon</span> : null}
        <label className="member-toggle"><span className="sr-only">{channel.label} notifications</span><input type="checkbox" checked={channels[channel.key]} disabled={!channel.available} onChange={(event) => setChannels((current) => ({ ...current, [channel.key]: event.target.checked }))} /><i /></label>
      </div>)}</div>
    </section>

    <section className="notification-settings-card" aria-labelledby="preferences-title">
      <div className="member-section-heading"><div><p className="member-kicker">Reminders</p><h2 id="preferences-title">What you receive</h2></div></div>
      <div className="notification-toggle-list">{reminderPreferences.map((preference) => <div key={preference.key}>
        <div><strong>{preference.label}</strong><span>{preference.description}</span></div>
        <label className="member-toggle"><span className="sr-only">{preference.label}</span><input type="checkbox" checked={preferences[preference.key]} onChange={(event) => setPreferences((current) => ({ ...current, [preference.key]: event.target.checked }))} /><i /></label>
      </div>)}</div>
    </section>

    <section className="notification-settings-card notification-timing-card" aria-labelledby="timing-title">
      <div><p className="member-kicker">Timing</p><h2 id="timing-title">Class reminder</h2><p>Choose how early you would like your class reminder.</p></div>
      <label>Reminder time<select value={reminderTiming} onChange={(event) => setReminderTiming(event.target.value as (typeof classReminderTimings)[number])}>{classReminderTimings.map((timing) => <option key={timing}>{timing}</option>)}</select></label>
    </section>
  </div>;
}

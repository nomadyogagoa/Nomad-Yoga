import { AdminPWASettings } from "@/components/admin/AdminPWASettings";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminPWASettingsPage() {
  return (
    <AdminShell active="PWA & Notifications" title="PWA & Notifications" subtitle="Preview install, offline, update and member communication defaults.">
      <AdminPWASettings />
    </AdminShell>
  );
}

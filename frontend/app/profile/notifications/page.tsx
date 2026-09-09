import Link from "next/link";
import { MemberShell } from "@/components/member/MemberShell";
import { NotificationPreferences } from "@/components/member/NotificationPreferences";

export default function NotificationSettingsPage() {
  return <MemberShell title="Reminder settings" subtitle="Choose the updates that feel useful to you."><Link className="member-back-link" href="/profile">← Back to profile</Link><NotificationPreferences /></MemberShell>;
}

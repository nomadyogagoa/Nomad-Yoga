import { MemberShell } from "@/components/member/MemberShell";
import { NotificationCenter } from "@/components/member/NotificationCenter";

export default function NotificationsPage() {
  return <MemberShell title="Notifications" subtitle="The updates that help you stay close to your practice."><NotificationCenter /></MemberShell>;
}

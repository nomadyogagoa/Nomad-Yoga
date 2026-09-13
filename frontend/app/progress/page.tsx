import { MemberShell } from "@/components/member/MemberShell";
import { MemberProgress } from "@/components/member/MemberProgress";

export default function ProgressPage() {
  return <MemberShell title="Your progress" subtitle="Small, consistent returns become a lasting practice.">
    <MemberProgress />
  </MemberShell>;
}

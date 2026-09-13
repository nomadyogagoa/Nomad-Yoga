import { ClassesView } from "@/components/member/ClassesView";
import { MemberShell } from "@/components/member/MemberShell";

export default function ClassesPage() {
  return <MemberShell title="Classes" subtitle="Choose the practice that meets you where you are."><ClassesView /></MemberShell>;
}

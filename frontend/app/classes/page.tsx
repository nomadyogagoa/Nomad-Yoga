import { ClassesView } from "@/components/member/ClassesView";
import { MemberShell } from "@/components/member/MemberShell";
import { memberClasses } from "@/data/member";

export default function ClassesPage() {
  return <MemberShell title="Classes" subtitle="Choose the practice that meets you where you are."><ClassesView classes={memberClasses} /></MemberShell>;
}

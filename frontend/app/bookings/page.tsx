import { CourseBookingList } from "@/components/member/CourseBookingList";
import { HostelBookingList } from "@/components/member/HostelBookingList";
import { MemberShell } from "@/components/member/MemberShell";

export default function BookingsPage() {
  return <MemberShell title="My bookings" subtitle="Your practices, thoughtfully kept in one place."><CourseBookingList /><HostelBookingList /></MemberShell>;
}

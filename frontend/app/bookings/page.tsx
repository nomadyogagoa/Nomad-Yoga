import { BookingList } from "@/components/member/BookingList";
import { MemberShell } from "@/components/member/MemberShell";
import { memberBookings } from "@/data/member";

export default function BookingsPage() {
  return <MemberShell title="My bookings" subtitle="Your practices, thoughtfully kept in one place."><div className="member-bookings-grid">
    <BookingList title="Upcoming" status="Upcoming" bookings={memberBookings} />
    <BookingList title="Completed" status="Completed" bookings={memberBookings} />
    <BookingList title="Cancelled" status="Cancelled" bookings={memberBookings} />
  </div></MemberShell>;
}

import type { Booking, BookingStatus } from "@/data/member";

export function BookingList({ title, status, bookings }: { title: string; status: BookingStatus; bookings: Booking[] }) {
  const matchingBookings = bookings.filter((booking) => booking.status === status);
  return <section className="member-list-card" aria-labelledby={`bookings-${status.toLowerCase()}`}>
    <div className="member-section-heading"><h2 id={`bookings-${status.toLowerCase()}`}>{title}</h2><span>{matchingBookings.length}</span></div>
    <div className="member-booking-list">{matchingBookings.map((booking) => <article key={booking.id} className="member-booking-row">
      <div><span>{booking.date} · {booking.time}</span><h3>{booking.className}</h3><p>{booking.instructor}</p></div>
      <span className={`member-status status-${booking.status.toLowerCase()}`}>{booking.status}</span>
    </article>)}</div>
  </section>;
}

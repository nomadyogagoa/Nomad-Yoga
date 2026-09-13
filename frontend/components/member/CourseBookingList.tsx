"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { cancelCourseBooking, getCourseBookings, sessionDateLabel, sessionTimeLabel, type CourseBooking } from "@/lib/course-booking-api";

type BookingGroup = "upcoming" | "completed" | "cancelled";

function group(booking: CourseBooking): BookingGroup {
  if (booking.status === "CANCELLED") return "cancelled";
  if (booking.status === "ATTENDED" || booking.status === "NO_SHOW" || new Date(booking.programSession.startAt) < new Date()) return "completed";
  return "upcoming";
}

function canCancel(booking: CourseBooking): boolean {
  return (booking.status === "PENDING" || booking.status === "CONFIRMED") && new Date(booking.programSession.startAt) > new Date();
}

export function CourseBookingList() {
  const [bookings, setBookings] = useState<CourseBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getCourseBookings();
      setBookings(result.items);
      setError(null);
    } catch {
      setError("We couldn’t load your course bookings. Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function cancel(booking: CourseBooking) {
    if (!window.confirm(`Cancel your booking for ${booking.programSession.title}?`)) return;
    setCancellingId(booking.id);
    try {
      const updated = await cancelCourseBooking(booking.id);
      setBookings((current) => current.map((item) => item.id === updated.id ? { ...item, ...updated } : item));
      setError(null);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "We couldn’t cancel this booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  }

  const sections: { title: string; value: BookingGroup }[] = [{ title: "Upcoming", value: "upcoming" }, { title: "Completed", value: "completed" }, { title: "Cancelled", value: "cancelled" }];
  if (isLoading) return <p className="member-list-card" aria-live="polite">Loading your course bookings…</p>;

  return <div className="member-bookings-grid">
    {error ? <p className="auth-message is-error" role="alert">{error}</p> : null}
    {sections.map(({ title, value }) => {
      const items = bookings.filter((booking) => group(booking) === value);
      return <section className="member-list-card" key={value} aria-labelledby={`course-bookings-${value}`}>
        <div className="member-section-heading"><h2 id={`course-bookings-${value}`}>{title}</h2><span>{items.length}</span></div>
        <div className="member-booking-list">
          {items.length ? items.map((booking) => <article key={booking.id} className="member-booking-row">
            <div><span>{sessionDateLabel(booking.programSession)} · {sessionTimeLabel(booking.programSession)}</span><h3>{booking.programSession.title}</h3><p>{booking.programSession.instructor?.displayName ?? booking.programSession.program.title}</p></div>
            <div>{<span className={`member-status status-${booking.status.toLowerCase()}`}>{booking.status.replace("_", " ")}</span>}{canCancel(booking) ? <button type="button" className="member-row-action" onClick={() => void cancel(booking)} disabled={cancellingId === booking.id}>{cancellingId === booking.id ? "Cancelling…" : "Cancel"}</button> : null}</div>
          </article>) : <p className="member-empty-copy">No {title.toLowerCase()} course bookings.</p>}
        </div>
      </section>;
    })}
  </div>;
}

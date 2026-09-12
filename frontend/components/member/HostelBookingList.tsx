"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cancelHostelBooking, getHostelBookings, type HostelBooking } from "@/lib/hostel-api";

const currency = (value: string, code: string) => new Intl.NumberFormat("en-IN", { style: "currency", currency: code, maximumFractionDigits: 0 }).format(Number(value));
const date = (value: string) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value));

export function HostelBookingList() {
  const [bookings, setBookings] = useState<HostelBooking[] | null>(null);
  const [error, setError] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const canCancel = (status: HostelBooking["status"]) => status === "PENDING" || status === "CONFIRMED";
  useEffect(() => { void getHostelBookings().then((result) => setBookings(result.items)).catch(() => setError(true)); }, []);
  async function cancel(id: string) { setIsCancelling(true); setCancelError(null); try { const saved = await cancelHostelBooking(id); setBookings((items) => items?.map((item) => item.id === id ? saved : item) ?? null); setConfirmingId(null); } catch { setCancelError("We couldn’t cancel this stay right now. Please try again."); } finally { setIsCancelling(false); } }
  return <section className="member-hostel-bookings" aria-labelledby="hostel-stays-title"><div className="member-hostel-bookings-copy"><p className="member-kicker">Hostel stays</p><h2 id="hostel-stays-title">Stay with Nomad</h2>{bookings === null && !error && <p aria-live="polite">Loading your hostel stays…</p>}{error && <p role="alert">We couldn’t load your hostel stays right now.</p>}{bookings?.length === 0 && <p>No hostel stays yet.</p>}{bookings?.map((booking) => <article className="member-hostel-booking" key={booking.id}><div><span>{booking.status.replace("_", " ")}</span><h3>{booking.hostel.name} · {booking.units[0]?.room.roomType.name ?? "Hostel stay"}</h3><p>{date(booking.checkInDate)} – {date(booking.checkOutDate)} · {booking.adults} adults{booking.children ? ` · ${booking.children} children` : ""}</p></div><div><strong>{currency(booking.totalAmount, booking.currency)}</strong>{canCancel(booking.status) && <button className="member-row-action" type="button" onClick={() => setConfirmingId(booking.id)}>Cancel stay</button>}</div>{confirmingId === booking.id && <div className="member-hostel-cancel" role="status"><p>Cancel this stay? This cannot be undone.</p>{cancelError && <p role="alert">{cancelError}</p>}<button className="member-row-action" type="button" onClick={() => void cancel(booking.id)} disabled={isCancelling}>{isCancelling ? "Cancelling…" : "Confirm cancellation"}</button><button className="member-row-action" type="button" onClick={() => setConfirmingId(null)} disabled={isCancelling}>Keep stay</button></div>}</article>)}</div><Link className="member-button member-button-outline" href="/hostel">Explore Hostel</Link></section>;
}

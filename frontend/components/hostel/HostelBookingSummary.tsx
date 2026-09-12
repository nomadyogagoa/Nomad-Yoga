"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ApiError } from "@/lib/api-client";
import { createHostelBooking, type HostelBooking, type StaySearchParams } from "@/lib/hostel-api";
import type { LiveStayOption } from "@/components/hostel/HostelStayOptions";

type Guest = { firstName: string; lastName: string };
const currency = (value: string, code: string) => new Intl.NumberFormat("en-IN", { style: "currency", currency: code, maximumFractionDigits: 0 }).format(Number(value));

export function HostelBookingSummary({ hostel, option, search }: { hostel: { id: string; name: string } | null; option: LiveStayOption | null; search: StaySearchParams | null }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const guestCount = search ? search.adults + search.children : 0;
  const initialGuests = useMemo<Guest[]>(() => Array.from({ length: guestCount }, (_, index) => ({ firstName: index === 0 ? user?.profile?.firstName ?? "" : "", lastName: index === 0 ? user?.profile?.lastName ?? "" : "" })), [guestCount, user]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [booking, setBooking] = useState<HostelBooking | null>(null);
  const activeGuests = guests.length === guestCount ? guests : initialGuests;
  const nights = search ? Math.round((Date.parse(`${search.checkOut}T00:00:00`) - Date.parse(`${search.checkIn}T00:00:00`)) / 86_400_000) : 0;

  if (!hostel || !option || !search) return null;
  const selectedHostel = hostel;
  const selectedOption = option;
  const selectedSearch = search;
  if (booking) return <section className="hostel-booking-summary" aria-live="polite"><p className="eyebrow">Booking created</p><h2>Your stay request is on its way.</h2><p><strong>{booking.bookingNumber}</strong> · {booking.hostel.name} · {option.name}</p><p>{search.checkIn} to {search.checkOut} · {currency(booking.totalAmount, booking.currency)} · {booking.status}</p>{booking.status === "PENDING" && <p>Booking created. Confirmation/payment may still be required.</p>}<Link className="button" href="/bookings">View my bookings</Link></section>;

  function updateGuest(index: number, field: keyof Guest, value: string) { const next = [...activeGuests]; next[index] = { ...next[index], [field]: value }; setGuests(next); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null);
    const email = contactEmail || user?.email || "";
    const phone = contactPhone || user?.profile?.phone || "";
    if (!email || !phone || activeGuests.some((guest) => !guest.firstName.trim() || !guest.lastName.trim())) { setError("Add contact details and a first and last name for every guest."); return; }
    if (!confirmed) { setError("Please confirm the stay details before submitting."); return; }
    setIsSubmitting(true);
    try { setBooking(await createHostelBooking({ hostelId: selectedHostel.id, roomTypeId: selectedOption.roomTypeId, quantity: 1, ...selectedSearch, contactEmail: email, contactPhone: phone, guests: activeGuests.map(({ firstName, lastName }) => ({ firstName, lastName })) })); }
    catch (caught) { setError(caught instanceof ApiError && caught.status === 401 ? "Please sign in again before booking." : "We couldn’t create this booking. Check your stay details and try again."); }
    finally { setIsSubmitting(false); }
  }
  if (isLoading) return <section className="hostel-booking-summary" aria-live="polite">Checking your member session…</section>;
  if (!isAuthenticated) return <section className="hostel-booking-summary"><p className="eyebrow">Your selected stay</p><h2>{option.name}</h2><p>Sign in to add guest details and create your stay request.</p><Link className="button" href="/login?returnTo=%2Fhostel">Sign in to book</Link></section>;
  return <section className="hostel-booking-summary" aria-labelledby="hostel-booking-summary-title"><p className="eyebrow">Your selected stay</p><h2 id="hostel-booking-summary-title">Complete your stay request.</h2><div className="hostel-booking-overview"><p><strong>{hostel.name}</strong><br />{option.name} · {search.checkIn} to {search.checkOut} · {nights} nights</p><p>{search.adults} adults{search.children ? ` · ${search.children} children` : ""} · {option.availableUnits} units available<br /><strong>{currency(option.totalPrice, option.currency)} total</strong></p></div><form className="hostel-booking-form" onSubmit={submit} noValidate><fieldset><legend>Contact details</legend><label>Email<input type="email" value={contactEmail || user?.email || ""} onChange={(event) => setContactEmail(event.target.value)} autoComplete="email" required /></label><label>Phone<input type="tel" value={contactPhone || user?.profile?.phone || ""} onChange={(event) => setContactPhone(event.target.value)} autoComplete="tel" required /></label></fieldset><fieldset><legend>Guest details</legend>{activeGuests.map((guest, index) => <div className="hostel-guest-details" key={index}><p>{index < search.adults ? `Adult ${index + 1}` : `Child ${index - search.adults + 1}`}</p><label>First name<input value={guest.firstName} onChange={(event) => updateGuest(index, "firstName", event.target.value)} autoComplete="given-name" required /></label><label>Last name<input value={guest.lastName} onChange={(event) => updateGuest(index, "lastName", event.target.value)} autoComplete="family-name" required /></label></div>)}</fieldset><label className="hostel-booking-confirm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /> <span>I confirm these stay dates, guest details and contact information are correct.</span></label>{error && <p className="hostel-field-error" role="alert">{error}</p>}<button className="button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating booking…" : "Confirm stay request"}</button></form></section>;
}

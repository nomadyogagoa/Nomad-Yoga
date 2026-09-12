"use client";

import { useEffect, useState } from "react";
import { HostelAvailabilitySearch } from "@/components/hostel/HostelAvailabilitySearch";
import { HostelStayOptions, type LiveStayOption } from "@/components/hostel/HostelStayOptions";
import { HostelBookingSummary } from "@/components/hostel/HostelBookingSummary";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { getAvailability, getPublicHostel, getQuote, type PublicHostel, type StaySearchParams } from "@/lib/hostel-api";

export function HostelBookingExperience() {
  const [hostel, setHostel] = useState<PublicHostel | null>(null);
  const [options, setOptions] = useState<LiveStayOption[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<StaySearchParams | null>(null);
  const [selectedOption, setSelectedOption] = useState<LiveStayOption | null>(null);
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => { void getPublicHostel().then(setHostel).catch(() => undefined); }, []);

  async function search(params: StaySearchParams) {
    if (!hostel) { setSearchError("Live availability is not connected right now. Please try again later."); return; }
    setIsLoading(true); setSearchError(null); setOptions(null); setSelectedOption(null); setSearchParams(params);
    try {
      const availability = await getAvailability(hostel.id, params);
      const availableTypes = availability.roomTypes.filter((room) => room.availableUnits > 0 && room.capacity >= params.adults + params.children);
      const quotes = await Promise.all(availableTypes.map(async (room) => ({ room, quote: await getQuote(hostel.id, room.roomTypeId, params) })));
      setOptions(quotes.map(({ room, quote }, index) => {
        const detail = hostel.roomTypes.find((item) => item.id === room.roomTypeId);
        return { roomTypeId: room.roomTypeId, name: room.name, description: detail?.description || (room.isPrivate ? "A quieter space to settle into your stay." : "A shared space for travellers and connection."), capacity: room.capacity, availableUnits: room.availableUnits, amenities: detail?.amenities.map((item) => item.amenity.name) ?? [], currency: quote.currency, nightlyRate: quote.nightlyBreakdown[0]?.nightlyRate ?? null, totalPrice: quote.total, imageIndex: index };
      }));
    } catch { setSearchError("We couldn’t check live availability right now. Please try again shortly."); }
    finally { setIsLoading(false); }
  }

  function select(option: LiveStayOption) { if (isAuthLoading) return; if (!isAuthenticated) { sessionStorage.setItem("hostel-booking-intent", JSON.stringify({ search: searchParams, roomTypeId: option.roomTypeId })); router.push("/login?returnTo=%2Fhostel"); return; } setSelectedOption(option); }
  useEffect(() => { if (!isAuthenticated || !hostel || options || !sessionStorage.getItem("hostel-booking-intent")) return; const raw = sessionStorage.getItem("hostel-booking-intent"); try { const intent = raw ? JSON.parse(raw) as { search: StaySearchParams; roomTypeId: string } : null; if (intent?.search) void search(intent.search); } catch { sessionStorage.removeItem("hostel-booking-intent"); } }, [hostel, isAuthenticated, options]);
  useEffect(() => { const raw = sessionStorage.getItem("hostel-booking-intent"); if (!raw || !options) return; try { const intent = JSON.parse(raw) as { roomTypeId: string }; const match = options.find((option) => option.roomTypeId === intent.roomTypeId); if (match) { setSelectedOption(match); sessionStorage.removeItem("hostel-booking-intent"); } } catch { sessionStorage.removeItem("hostel-booking-intent"); } }, [options]);
  return <><section className="hostel-availability" id="hostel-availability" aria-labelledby="hostel-availability-title"><div className="hostel-availability-heading"><p className="eyebrow">Plan Your Stay</p><h2 id="hostel-availability-title">Find your space at Nomad.</h2><p>Choose your dates and guests to explore available rooms and estimated stay options.</p></div><HostelAvailabilitySearch isLoading={isLoading} onSearch={search} /></section><HostelStayOptions isLoading={isLoading} options={options} error={searchError} selectedRoomTypeId={selectedOption?.roomTypeId ?? null} onSelect={select} /><HostelBookingSummary hostel={hostel} option={selectedOption} search={searchParams} /></>;
}

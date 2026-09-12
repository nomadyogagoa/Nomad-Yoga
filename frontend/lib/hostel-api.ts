export type HostelRoomType = {
  id: string;
  name: string;
  description: string | null;
  isPrivate: boolean;
  capacity: number;
  basePrice: string;
  currency: string;
  amenities: { amenity: { id: string; name: string } }[];
  rooms: { images: { url: string; altText: string | null; sortOrder: number }[] }[];
};

export type PublicHostel = {
  id: string;
  slug: string;
  name: string;
  roomTypes: HostelRoomType[];
};

export type AvailabilityResult = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomTypes: { roomTypeId: string; name: string; isPrivate: boolean; capacity: number; availableUnits: number; nights: number; currency: string }[];
};

export type QuoteResult = {
  roomType: { id: string; name: string; isPrivate: boolean };
  quantity: number;
  nights: number;
  nightlyBreakdown: { date: string; nightlyRate: string; rule: { id: string; name: string } | null }[];
  subtotal: string;
  total: string;
  currency: string;
};

export type StaySearchParams = { checkIn: string; checkOut: string; adults: number; children: number };
export type BookingGuestInput = { firstName: string; lastName: string; email?: string; phone?: string };
export type CreateHostelBookingInput = StaySearchParams & { hostelId: string; roomTypeId: string; quantity: number; contactEmail: string; contactPhone: string; guests: BookingGuestInput[]; specialRequests?: string };
export type HostelBooking = { id: string; bookingNumber: string; checkInDate: string; checkOutDate: string; adults: number; children: number; subtotal: string; totalAmount: string; currency: string; status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED"; hostel: { id: string; name: string; slug: string; city: string | null; country: string | null }; units: { room: { name: string; roomNumber: string; roomType: { name: string; isPrivate: boolean } }; bed: { label: string } | null }[]; guests: BookingGuestInput[] };
export type HostelBookingPage = { items: HostelBooking[]; pagination: { page: number; limit: number; total: number; totalPages: number } };

function apiUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!baseUrl) throw new Error("HOSTEL_API_NOT_CONFIGURED");
  const apiBaseUrl = baseUrl.endsWith("/api/v1") ? baseUrl : `${baseUrl}/api/v1`;
  return `${apiBaseUrl}${path.replace(/^\/api\/v1/, "")}`;
}

async function publicRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  if (!response.ok) throw new Error("HOSTEL_API_REQUEST_FAILED");
  return response.json() as Promise<T>;
}

export async function getPublicHostel(): Promise<PublicHostel> {
  const hostels = await publicRequest<PublicHostel[]>("/api/v1/hostels");
  const configuredId = process.env.NEXT_PUBLIC_HOSTEL_ID;
  const hostel = hostels.find((item) => item.id === configuredId)
    ?? hostels.find((item) => item.slug === "nomad-yoga-the-hostel")
    ?? hostels[0];
  if (!hostel) throw new Error("HOSTEL_NOT_FOUND");
  return publicRequest<PublicHostel>(`/api/v1/hostels/${encodeURIComponent(hostel.id)}`);
}

export function getAvailability(hostelId: string, params: StaySearchParams) {
  const query = new URLSearchParams({ checkIn: params.checkIn, checkOut: params.checkOut, adults: String(params.adults), children: String(params.children) });
  return publicRequest<AvailabilityResult>(`/api/v1/hostels/${encodeURIComponent(hostelId)}/availability?${query}`);
}

export function getQuote(hostelId: string, roomTypeId: string, params: StaySearchParams) {
  return publicRequest<QuoteResult>(`/api/v1/hostels/${encodeURIComponent(hostelId)}/quote`, {
    method: "POST",
    body: JSON.stringify({ ...params, roomTypeId, quantity: 1 }),
  });
}

export async function createHostelBooking(input: CreateHostelBookingInput) {
  const { apiRequest } = await import("@/lib/api-client");
  return apiRequest<HostelBooking>("/hostel-bookings", { method: "POST", body: JSON.stringify(input) });
}

export async function getHostelBookings() {
  const { apiRequest } = await import("@/lib/api-client");
  return apiRequest<HostelBookingPage>("/hostel-bookings?limit=50");
}

export async function cancelHostelBooking(id: string) {
  const { apiRequest } = await import("@/lib/api-client");
  return apiRequest<HostelBooking>(`/hostel-bookings/${encodeURIComponent(id)}/cancel`, { method: "POST", body: JSON.stringify({}) });
}

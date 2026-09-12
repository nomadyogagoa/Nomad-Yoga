"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getPublicHostel, type HostelRoomType } from "@/lib/hostel-api";

const imageFallbacks = [
  { src: "/images/about/hostel-logo.jpeg", alt: "Nomad Yoga – The Hostel beneath coconut palms" },
  { src: "/images/about/nomad-story.jpg", alt: "Open-air practice space at Nomad Yoga" },
  { src: "/images/about/agonda.jpg", alt: "Sunset on Agonda Beach near Nomad Yoga" },
] as const;

const fallbackRoomTypes = [
  { id: "shared-dorm", name: "Shared Dorm", description: "For social travellers", capacity: 6, basePrice: null, currency: "INR", amenities: ["Shared bathroom", "Locker / storage"] },
  { id: "twin-shared-room", name: "Twin / Shared Room", description: "For friends or travel partners", capacity: 2, basePrice: null, currency: "INR", amenities: ["Shared or private bathroom", "Comfortable twin beds"] },
  { id: "private-room", name: "Private Room", description: "For more privacy and quiet", capacity: 2, basePrice: null, currency: "INR", amenities: ["Private room", "Storage / work corner"] },
] as const;

function formatCurrency(value: string, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(value));
}

export function HostelRoomTypes() {
  const [roomTypes, setRoomTypes] = useState<HostelRoomType[] | null>(null);

  useEffect(() => {
    void getPublicHostel().then((hostel) => setRoomTypes(hostel.roomTypes)).catch(() => setRoomTypes([]));
  }, []);

  const entries = roomTypes?.length
    ? roomTypes.map((room, index) => ({
      id: room.id,
      name: room.name,
      description: room.description || (room.isPrivate ? "For more privacy and quiet" : "For social travellers"),
      capacity: room.capacity,
      amenities: room.amenities.map((item) => item.amenity.name),
      basePrice: room.basePrice,
      currency: room.currency,
      image: imageFallbacks[index % imageFallbacks.length],
    }))
    : fallbackRoomTypes.map((room, index) => ({ ...room, image: imageFallbacks[index % imageFallbacks.length] }));

  return <div className="hostel-room-grid">
    {entries.map((room) => <article className="hostel-room-card" key={room.id}>
      <div className="hostel-room-image"><Image src={room.image.src} alt={room.image.alt} fill sizes="(max-width: 640px) calc(100vw - 48px), (max-width: 1000px) calc(50vw - 28px), 33vw" /></div>
      <div className="hostel-room-content">
        <p className="hostel-room-kicker">{room.description}</p><h3>{room.name}</h3>
        <ul className="hostel-room-meta"><li>Up to {room.capacity} guests</li>{room.amenities.slice(0, 2).map((amenity) => <li key={amenity}>{amenity}</li>)}</ul>
        <div className="hostel-room-footer"><strong>{room.basePrice ? `From ${formatCurrency(room.basePrice, room.currency)} / night` : "Rates shown with availability"}</strong><Link href="#hostel-availability">Check availability</Link></div>
      </div>
    </article>)}
  </div>;
}

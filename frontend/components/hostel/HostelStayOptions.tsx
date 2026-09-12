"use client";

import Image from "next/image";
import { useState } from "react";

export type LiveStayOption = { roomTypeId: string; name: string; description: string; capacity: number; availableUnits: number; amenities: string[]; currency: string; nightlyRate: string | null; totalPrice: string; imageIndex: number };

const imageFallbacks = [
  { src: "/images/about/hostel-logo.jpeg", alt: "Nomad Yoga – The Hostel beneath coconut palms" },
  { src: "/images/about/nomad-story.jpg", alt: "Open-air practice space at Nomad Yoga" },
  { src: "/images/about/agonda.jpg", alt: "Sunset on Agonda Beach near Nomad Yoga" },
] as const;

function formatCurrency(value: string, currency: string) { return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(value)); }

export function HostelStayOptions({ options, isLoading, error, selectedRoomTypeId, onSelect }: { options: LiveStayOption[] | null; isLoading: boolean; error: string | null; selectedRoomTypeId: string | null; onSelect: (option: LiveStayOption) => void }) {
  return <section className="hostel-stay-options" aria-labelledby="hostel-stay-options-title">
    <div className="hostel-stay-options-heading"><p className="eyebrow">Stay Options</p><h2 id="hostel-stay-options-title">Choose the rhythm that suits your stay.</h2><p>Choose your dates above to see live availability and final pricing.</p></div>
    {isLoading && <p className="hostel-stay-state" role="status">Checking live room availability and prices…</p>}
    {!isLoading && error && <p className="hostel-stay-state is-error" role="alert">{error}</p>}
    {!isLoading && !error && options === null && <p className="hostel-stay-state">Choose your dates to see live availability.</p>}
    {!isLoading && !error && options?.length === 0 && <p className="hostel-stay-state">No rooms are available for these dates. Try different dates or guest numbers.</p>}
    {options && options.length > 0 && <div className="hostel-stay-option-list">{options.map((option) => {
      const isSelected = selectedRoomTypeId === option.roomTypeId;
      const image = imageFallbacks[option.imageIndex % imageFallbacks.length];
      return <article className={`hostel-stay-option${isSelected ? " is-selected" : ""}`} key={option.roomTypeId}>
        <div className="hostel-stay-option-image"><Image src={image.src} alt={image.alt} fill sizes="(max-width: 860px) calc(100vw - 56px), 33vw" /></div>
        <div className="hostel-stay-option-details"><h3>{option.name}</h3><p>{option.description}</p><dl className="hostel-stay-option-meta"><div><dt>Capacity</dt><dd>Up to {option.capacity} guests</dd></div><div><dt>Available</dt><dd>{option.availableUnits} {option.availableUnits === 1 ? "unit" : "units"}</dd></div></dl><ul className="hostel-stay-option-amenities" aria-label={`${option.name} amenities`}>{option.amenities.map((amenity) => <li key={amenity}>{amenity}</li>)}</ul></div>
        <div className="hostel-stay-option-pricing"><span>Live price</span><strong>{option.nightlyRate ? `${formatCurrency(option.nightlyRate, option.currency)} / night` : "Rate shown for your stay"}</strong><p>{formatCurrency(option.totalPrice, option.currency)} total</p><small>Calculated for your selected dates.</small><button aria-pressed={isSelected} type="button" className="button" onClick={() => onSelect(option)}>{isSelected ? "Selected" : "Select stay"}</button></div>
        {isSelected && <p className="hostel-stay-option-selected" role="status">Stay selected. Complete your details below to request this stay.</p>}
      </article>;
    })}</div>}
  </section>;
}

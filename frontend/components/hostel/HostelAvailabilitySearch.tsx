"use client";

import { useMemo, useState } from "react";
import type { StaySearchParams } from "@/lib/hostel-api";

type FieldErrors = {
  checkIn?: string;
  checkOut?: string;
};

const today = new Date().toISOString().slice(0, 10);

export function HostelAvailabilitySearch({ isLoading, onSearch }: { isLoading: boolean; onSearch: (params: StaySearchParams) => Promise<void> }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});

  const nights = useMemo(() => {
    if (!checkIn || !checkOut || checkOut <= checkIn) return 0;
    return Math.round((Date.parse(`${checkOut}T00:00:00`) - Date.parse(`${checkIn}T00:00:00`)) / 86_400_000);
  }, [checkIn, checkOut]);

  function validate() {
    const nextErrors: FieldErrors = {};
    if (!checkIn) nextErrors.checkIn = "Choose a check-in date.";
    else if (checkIn < today) nextErrors.checkIn = "Check-in cannot be before today.";
    if (!checkOut) nextErrors.checkOut = "Choose a check-out date.";
    else if (checkIn && checkOut <= checkIn) nextErrors.checkOut = "Check-out must be after check-in.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validate()) await onSearch({ checkIn, checkOut, adults, children });
  }

  return (
    <form className="hostel-availability-form" onSubmit={handleSubmit} noValidate>
      <div className="hostel-date-field">
        <label htmlFor="hostel-check-in">Check-in</label>
        <input
          id="hostel-check-in"
          name="checkIn"
          type="date"
          min={today}
          value={checkIn}
          aria-describedby={errors.checkIn ? "hostel-check-in-error" : undefined}
          aria-invalid={Boolean(errors.checkIn)}
          onChange={(event) => setCheckIn(event.target.value)}
        />
        {errors.checkIn && <p className="hostel-field-error" id="hostel-check-in-error">{errors.checkIn}</p>}
      </div>
      <div className="hostel-date-field">
        <label htmlFor="hostel-check-out">Check-out</label>
        <input
          id="hostel-check-out"
          name="checkOut"
          type="date"
          min={checkIn || today}
          value={checkOut}
          aria-describedby={errors.checkOut ? "hostel-check-out-error" : undefined}
          aria-invalid={Boolean(errors.checkOut)}
          onChange={(event) => setCheckOut(event.target.value)}
        />
        {errors.checkOut && <p className="hostel-field-error" id="hostel-check-out-error">{errors.checkOut}</p>}
      </div>
      <GuestControl label="Adults" value={adults} min={1} max={10} onChange={setAdults} />
      <GuestControl label="Children" value={children} min={0} max={8} onChange={setChildren} />
      <button className="button hostel-availability-submit" type="submit" disabled={isLoading}>{isLoading ? "Checking availability…" : "Search availability"}</button>
      <div className="hostel-availability-summary" aria-live="polite">
        {nights > 0 && <span>{nights} {nights === 1 ? "night" : "nights"}</span>}
        <span>{adults} {adults === 1 ? "adult" : "adults"}{children > 0 ? ` · ${children} ${children === 1 ? "child" : "children"}` : ""}</span>
      </div>
    </form>
  );
}

function GuestControl({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <div className="hostel-guest-field">
      <span id={`hostel-${label.toLowerCase()}-label`}>{label}</span>
      <div aria-labelledby={`hostel-${label.toLowerCase()}-label`} className="hostel-stepper">
        <button type="button" aria-label={`Decrease ${label.toLowerCase()}`} disabled={value === min} onClick={() => onChange(value - 1)}>−</button>
        <output aria-label={`${value} ${label.toLowerCase()}`}>{value}</output>
        <button type="button" aria-label={`Increase ${label.toLowerCase()}`} disabled={value === max} onClick={() => onChange(value + 1)}>+</button>
      </div>
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { ApiError, apiRequest } from "@/lib/api-client";

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    const interest = String(form.get("interest") ?? "");
    try {
      await apiRequest("/contact", { method: "POST", body: JSON.stringify({ name: String(form.get("name") ?? "").trim(), phone: String(form.get("phone") ?? "").trim() || undefined, email: String(form.get("email") ?? "").trim(), subject: `Website enquiry: ${interest}`, message: String(form.get("message") ?? "").trim(), interestType: interest }) }, false);
      event.currentTarget.reset();
      setMessage("Thank you. Your enquiry has been sent.");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "We couldn’t send your enquiry. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="premium-form" onSubmit={submit} noValidate><div className="form-row"><label>Name<input name="name" placeholder="Your name" required /></label><label>Phone<input name="phone" type="tel" placeholder="+91" /></label></div><label>Email<input name="email" type="email" placeholder="you@example.com" required /></label><label>What can we help with?<select name="interest" defaultValue="" required><option value="" disabled>Select an option</option><option>First class</option><option>Membership</option><option>Teacher training</option><option>Private session</option></select></label><label>Message<textarea name="message" rows={5} placeholder="Tell us a little about what you are looking for..." required /></label>{message && <p role="status">{message}</p>}{error && <p role="alert">{error}</p>}<button className="button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send enquiry"}</button></form>;
}

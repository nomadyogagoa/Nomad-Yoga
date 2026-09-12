"use client";
import { FormEvent, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { subscribeNewsletter } from "@/lib/content-public-api";

export function NewsletterSubscribe() {
  const [email, setEmail] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); setMessage(""); setError(""); try { await subscribeNewsletter(email.trim()); setMessage("You are on the list. Thank you."); setEmail(""); } catch (e) { setError(e instanceof ApiError ? "We could not subscribe you right now." : "Please try again shortly."); } finally { setBusy(false); } }
  return <div><form className="newsletter" onSubmit={submit}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" autoComplete="email"/><button type="submit" disabled={busy} aria-label="Subscribe">→</button></form>{message && <p className="newsletter-feedback" role="status">{message}</p>}{error && <p className="newsletter-feedback newsletter-error" role="alert">{error}</p>}</div>;
}

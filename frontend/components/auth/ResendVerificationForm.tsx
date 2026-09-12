"use client";

import { FormEvent, useState } from "react";
import { resendVerification } from "@/lib/auth-api";

export function ResendVerificationForm({ initialEmail = "" }: { initialEmail?: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    try {
      const result = await resendVerification(email);
      setMessage(result.message || "If an account needs verification, instructions have been sent.");
    } catch {
      setError("We couldn’t send that request right now. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="auth-form auth-resend-form" onSubmit={submit} noValidate>
    <label>Email<input name="email" type="email" autoComplete="email" defaultValue={initialEmail} placeholder="you@example.com" required /></label>
    {error ? <p className="auth-message is-error" role="alert">{error}</p> : null}
    {message ? <p className="auth-message is-success" role="status">{message}</p> : null}
    <button className="button button-outline auth-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Resend verification email"}</button>
  </form>;
}

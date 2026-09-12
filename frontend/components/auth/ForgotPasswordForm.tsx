"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { forgotPassword } from "@/lib/auth-api";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    try {
      const email = String(new FormData(event.currentTarget).get("email") ?? "");
      await forgotPassword(email);
      setMessage("If an account exists for this email, password reset instructions have been sent.");
    } catch {
      setError("We couldn’t send that request right now. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="auth-form" onSubmit={submit} noValidate>
    <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
    {error ? <p className="auth-message is-error" role="alert">{error}</p> : null}
    {message ? <p className="auth-message is-success" role="status">{message}</p> : null}
    <button className="button auth-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send reset instructions"}</button>
    <p className="auth-switch"><Link href="/login">Return to sign in</Link></p>
  </form>;
}

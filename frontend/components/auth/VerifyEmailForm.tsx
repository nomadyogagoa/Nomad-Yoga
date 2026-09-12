"use client";

import Link from "next/link";
import { useState } from "react";
import { verifyEmail } from "@/lib/auth-api";
import { ResendVerificationForm } from "@/components/auth/ResendVerificationForm";

export function VerifyEmailForm({ token }: { token?: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(token ? null : "This verification link is incomplete or has expired.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit() {
    if (!token) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await verifyEmail(token);
      setMessage(result.message || "Your email is verified. You can now sign in.");
    } catch {
      setError("We couldn’t verify this link. Please request a new verification email.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <div className="auth-form">
    <p className="auth-form-note">Verify your email before signing in to your member space.</p>
    {error ? <p className="auth-message is-error" role="alert">{error}</p> : null}
    {message ? <p className="auth-message is-success" role="status">{message}</p> : null}
    {!message ? <button className="button auth-button" type="button" onClick={submit} disabled={!token || isSubmitting}>{isSubmitting ? "Verifying…" : "Verify email"}</button> : <Link className="button auth-button" href="/login">Sign in</Link>}
    {!message ? <ResendVerificationForm /> : null}
  </div>;
}

"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { resetPassword } from "@/lib/auth-api";

const passwordPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

export function ResetPasswordForm({ token }: { token?: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(token ? null : "This password reset link is incomplete or has expired.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const form = new FormData(event.currentTarget);
    const newPassword = String(form.get("newPassword") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    if (newPassword !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    if (newPassword.length < 8 || !passwordPattern.test(newPassword)) {
      setError("Use at least 8 characters with uppercase, lowercase and a number.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await resetPassword(token, newPassword);
      setMessage(result.message || "Your password has been reset. You can now sign in.");
      event.currentTarget.reset();
    } catch {
      setError("We couldn’t reset this password. The link may be invalid or expired.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="auth-form" onSubmit={submit} noValidate>
    <label>New password<input name="newPassword" type="password" autoComplete="new-password" minLength={8} required /></label>
    <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required /></label>
    <p className="auth-form-note">Use at least 8 characters with uppercase, lowercase and a number.</p>
    {error ? <p className="auth-message is-error" role="alert">{error}</p> : null}
    {message ? <p className="auth-message is-success" role="status">{message}</p> : null}
    {!message ? <button className="button auth-button" type="submit" disabled={!token || isSubmitting}>{isSubmitting ? "Resetting…" : "Reset password"}</button> : <Link className="button auth-button" href="/login">Back to sign in</Link>}
  </form>;
}

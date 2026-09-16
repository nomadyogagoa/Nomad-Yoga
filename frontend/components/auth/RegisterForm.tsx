"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { register } from "@/lib/auth-api";
import { ApiError } from "@/lib/api-client";
import { ResendVerificationForm } from "@/components/auth/ResendVerificationForm";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setErrorCode(null);
    setSuccess(null);
    const form = new FormData(event.currentTarget);
    setIsSubmitting(true);
    try {
      const result = await register({ firstName: String(form.get("firstName") ?? ""), lastName: String(form.get("lastName") ?? ""), email: String(form.get("email") ?? ""), password: String(form.get("password") ?? "") });
      const email = String(form.get("email") ?? "");
      setSuccess(result.message || "Please check your email to verify your account before signing in.");
      setRegisteredEmail(email);
      event.currentTarget.reset();
    } catch (caught) {
      setErrorCode(caught instanceof ApiError ? caught.code ?? null : null);
      if (caught instanceof ApiError && (caught.code === "EMAIL_ALREADY_REGISTERED" || caught.status === 409)) {
        setError("An account with this email already exists. Try signing in instead.");
      } else {
        setError("We couldn't create your account. Please check the details and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return <><form className="auth-form" onSubmit={submit} noValidate>
    <div className="form-row"><label>First name<input name="firstName" autoComplete="given-name" placeholder="First name" required /></label><label>Last name<input name="lastName" autoComplete="family-name" placeholder="Last name" required /></label></div>
    <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
    <label>Password<input name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={8} placeholder="Create a password" required /></label>
    <label className="checkbox"><input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} />Show password</label>
    <p className="auth-form-note">Use at least 8 characters with uppercase, lowercase and a number.</p>
    {error ? <p className="auth-message is-error" role="alert" data-error-code={errorCode ?? undefined}>{error}{error.includes("already exists") ? <> <Link href="/login">Sign in</Link></> : null}</p> : null}
    {success ? <p className="auth-message is-success" role="status">{success}</p> : null}
    <button className="button auth-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account…" : "Create account"}</button>
    <p className="auth-switch">Already a member? <Link href="/login">Sign in</Link></p>
  </form>{registeredEmail ? <ResendVerificationForm initialEmail={registeredEmail} /> : null}</>;
}

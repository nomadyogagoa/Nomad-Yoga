"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

function safeReturnTo(value: string | undefined): string {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export function LoginForm({ returnTo }: { returnTo?: string }) {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await login({ email: String(form.get("email") ?? ""), password: String(form.get("password") ?? "") });
      router.replace(safeReturnTo(returnTo));
    } catch {
      setError("We couldn’t sign you in with those details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className="auth-form" onSubmit={submit} noValidate>
    <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
    <label>Password<input name="password" type="password" autoComplete="current-password" placeholder="••••••••" required /></label>
    <div className="form-between"><span>Use the email linked to your membership.</span><Link href="/forgot-password">Forgot password?</Link></div>
    {error ? <p className="auth-message is-error" role="alert">{error}</p> : null}
    <button className="button auth-button" type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in…" : "Sign in"}</button>
    <p className="auth-switch">New here? <Link href="/register">Create your account</Link><br />Need a new verification link? <Link href="/verify-email">Resend email</Link></p>
  </form>;
}

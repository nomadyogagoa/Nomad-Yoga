import { LoginForm } from "@/components/auth/LoginForm";
import { AuthShell } from "@/components/shared/AuthShell";

export default async function Login({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const { returnTo } = await searchParams;
  return <AuthShell eyebrow="Welcome back" title="Return to your practice" copy="Your classes, bookings and progress are waiting for you."><LoginForm returnTo={returnTo} /></AuthShell>;
}

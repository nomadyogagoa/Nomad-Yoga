import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { AuthShell } from "@/components/shared/AuthShell";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <AuthShell eyebrow="One last step" title="Verify your email" copy="Confirm your email to activate your Nomad Yoga member space."><VerifyEmailForm token={token} /></AuthShell>;
}

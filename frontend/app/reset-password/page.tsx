import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { AuthShell } from "@/components/shared/AuthShell";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <AuthShell eyebrow="Account support" title="Choose a new password" copy="Set a new password to return to your member space."><ResetPasswordForm token={token} /></AuthShell>;
}

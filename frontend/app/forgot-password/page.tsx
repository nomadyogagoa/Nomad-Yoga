import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { AuthShell } from "@/components/shared/AuthShell";

export default function ForgotPasswordPage() {
  return <AuthShell eyebrow="Account support" title="Reset your password" copy="Enter your email and we’ll send password reset instructions if an account exists."><ForgotPasswordForm /></AuthShell>;
}

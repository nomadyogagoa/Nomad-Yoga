import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthShell } from "@/components/shared/AuthShell";

export default function Register() {
  return <AuthShell eyebrow="Begin here" title="Create your member space" copy="Book classes, manage your membership and receive thoughtful reminders in one place."><RegisterForm /></AuthShell>;
}

import { apiRequest, apiUrl, ApiError, setAccessToken } from "@/lib/api-client";

export type MemberUser = {
  id: string;
  email: string;
  emailVerifiedAt: string | null;
  status: string;
  roles: string[];
  profile: {
    firstName: string;
    lastName: string;
    phone: string | null;
    avatarUrl: string | null;
  } | null;
};

export type LoginInput = { email: string; password: string };
export type RegisterInput = LoginInput & { firstName: string; lastName: string };

export async function login(input: LoginInput): Promise<void> {
  const response = await fetch(apiUrl("/auth/login"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const result = await response.json().catch(() => undefined) as { accessToken?: string; message?: string | string[] } | undefined;
  if (!response.ok || !result?.accessToken) {
    const message = typeof result?.message === "string" ? result.message : "Unable to sign in with those details.";
    throw new ApiError(message, response.status);
  }
  setAccessToken(result.accessToken);
}

export async function register(input: RegisterInput): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/auth/register", { method: "POST", body: JSON.stringify(input) }, false);
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) }, false);
}

export async function resendVerification(email: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/auth/resend-verification", { method: "POST", body: JSON.stringify({ email }) }, false);
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }, false);
}

export async function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, newPassword }) }, false);
}

export async function loadCurrentUser(): Promise<MemberUser> {
  return apiRequest<MemberUser>("/users/me");
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<{ message: string }>("/auth/logout", { method: "POST", body: JSON.stringify({}) });
  } finally {
    setAccessToken(null);
  }
}

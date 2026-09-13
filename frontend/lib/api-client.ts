import { ApiBaseConfigurationError, publicApiUrl } from "@/lib/api-url";

export class ApiError extends Error {
  constructor(message: string, public readonly status: number, public readonly code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

function codeFrom(response: unknown): string | undefined {
  return response && typeof response === "object" && "code" in response && typeof response.code === "string" ? response.code : undefined;
}

let accessToken: string | null = null;

function apiUrl(path: string): string {
  try {
    return publicApiUrl(path);
  } catch (error) {
    if (error instanceof ApiBaseConfigurationError) {
      throw new ApiError(error.message, 503, "API_URL_NOT_CONFIGURED");
    }
    throw error;
  }
}

function messageFrom(response: unknown): string {
  if (response && typeof response === "object" && "message" in response) {
    const message = response.message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message[0] ?? "The request could not be completed.";
  }
  return "The request could not be completed.";
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body: unknown = await response.json().catch(() => undefined);
  if (!response.ok) throw new ApiError(messageFrom(body), response.status, codeFrom(body));
  return body as T;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(apiUrl("/auth/refresh"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const result = await parseResponse<{ accessToken: string }>(response);
    setAccessToken(result.accessToken);
    return result.accessToken;
  } catch {
    setAccessToken(null);
    return null;
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, retryOnUnauthorized = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(apiUrl(path), { ...init, headers, credentials: "include" });
  if (response.status === 401 && retryOnUnauthorized && !path.endsWith("/auth/refresh")) {
    const token = await refreshAccessToken();
    if (token) return apiRequest<T>(path, init, false);
  }
  return parseResponse<T>(response);
}

export { apiUrl };

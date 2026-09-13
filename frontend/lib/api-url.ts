/**
 * This direct reference is intentionally kept at module scope so Next.js can
 * replace it in browser bundles when `next build` runs.
 */
const configuredPublicApiUrl = process.env.NEXT_PUBLIC_API_URL;

export class ApiBaseConfigurationError extends Error {
  constructor() {
    super("NEXT_PUBLIC_API_URL is not configured for this deployment.");
    this.name = "ApiBaseConfigurationError";
  }
}

export function normalizeApiBase(value: string | undefined): string | null {
  const configuredUrl = value?.trim().replace(/\/+$/, "");
  if (!configuredUrl) return null;
  return configuredUrl.endsWith("/api/v1") ? configuredUrl : `${configuredUrl}/api/v1`;
}

export function getPublicApiBase(): string {
  const baseUrl = normalizeApiBase(configuredPublicApiUrl);
  if (!baseUrl) throw new ApiBaseConfigurationError();
  return baseUrl;
}

export function publicApiUrl(path: string): string {
  return `${getPublicApiBase()}${path.replace(/^\/api\/v1/, "")}`;
}

/** Build-time guard for both supported deployment values. */
export function assertApiBaseNormalization(): void {
  const expected = "https://example.com/api/v1";
  if (normalizeApiBase("https://example.com") !== expected || normalizeApiBase("https://example.com/api/v1") !== expected) {
    throw new Error("API base URL normalization assertion failed.");
  }
}

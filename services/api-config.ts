const DEFAULT_API_URL = "http://localhost:3001/api/v1";
const DEFAULT_API_TIMEOUT_MS = 10_000;

const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

/** Shared API configuration for regular requests and direct uploads. */
export const API_URL = rawApiUrl.replace(/([^:]\/)\/+/g, "$1").replace(/\/+$/, "");

const configuredTimeoutMs = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS);
export const API_TIMEOUT_MS =
  Number.isFinite(configuredTimeoutMs) && configuredTimeoutMs > 0
    ? configuredTimeoutMs
    : DEFAULT_API_TIMEOUT_MS;

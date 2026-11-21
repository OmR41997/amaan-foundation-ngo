import { apiFetch } from "@/services/api-client";

export interface HealthVisitorData {
  source: string;
  viewCount: number;
}

export interface BackendHealthResult {
  online: boolean;
  data?: HealthVisitorData;
  source?: string;
  checkedAt: string;
}

/**
 * Resolves the client domain/origin to pass as source query parameter.
 * Prefers window.location.host (includes port in dev, e.g. localhost:3002 or amaanngo.vercel.app in prod).
 */
export function getClientSource(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.host || window.location.hostname || "";
}

/**
 * Checks backend health route and records visitor source domain.
 * Calls /api/v1/health?source=<domain>
 */
export async function checkBackendHealth(
  customSource?: string,
): Promise<BackendHealthResult> {
  const source = customSource ?? getClientSource();
  const query = source ? `?source=${encodeURIComponent(source)}` : "";

  try {
    const res = await apiFetch<HealthVisitorData>(
      `/health${query}`,
      {
        // 6 second timeout to avoid long hanging states if backend is unreachable
        signal: typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
          ? AbortSignal.timeout(6000)
          : undefined,
      },
      false, // public route: no auth token required
    );

    const isOnline = Boolean(res && res.success);
    return {
      online: isOnline,
      data: res.data,
      source: res.data?.source || source,
      checkedAt: new Date().toISOString(),
    };
  } catch {
    return {
      online: false,
      source,
      checkedAt: new Date().toISOString(),
    };
  }
}

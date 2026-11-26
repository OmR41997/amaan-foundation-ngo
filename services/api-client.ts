import { getToken } from "@/lib/auth/storage";
import type { ApiResponse } from "@/lib/api/types";
import { ApiError } from "./api-error";
import { API_TIMEOUT_MS, API_URL } from "./api-config";

export { API_URL } from "./api-config";
export const DEFAULT_API_TIMEOUT_MS = API_TIMEOUT_MS;

export interface ApiFetchOptions extends RequestInit {
  timeoutMs?: number;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
  auth = true,
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const timeoutMs = options.timeoutMs ?? DEFAULT_API_TIMEOUT_MS;

  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort(new Error(`Timeout: Backend did not respond within ${timeoutMs / 1000}s`));
  }, timeoutMs);

  // Link external signal if provided
  if (options.signal) {
    if (options.signal.aborted) {
      controller.abort(options.signal.reason);
    } else {
      options.signal.addEventListener("abort", () => {
        controller.abort(options.signal?.reason);
      });
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${cleanPath}`, {
      ...options,
      signal: controller.signal,
      cache: "no-store",
      headers,
    });
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === "AbortError" || controller.signal.aborted) {
      throw new ApiError(
        `Backend request timed out after ${timeoutMs / 1000} seconds on ${cleanPath}`,
        504,
      );
    }
    throw new ApiError(
      err.message || `Failed to connect to backend at ${API_URL}`,
      503,
    );
  } finally {
    clearTimeout(timer);
  }

  let payload: (ApiResponse<T> & { message?: string }) | null = null;
  try {
    payload = await response.json();
  } catch {
    // Backend returned non-JSON (e.g. 502/504 gateway timeout HTML or empty body)
    throw new ApiError(
      `Backend returned non-JSON response (${response.status} ${response.statusText})`,
      response.status || 502,
    );
  }

  if (!response.ok || !payload) {
    throw new ApiError(
      payload?.message ?? `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return payload;
}

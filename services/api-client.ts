import { getToken } from "@/lib/auth/storage";
import type { ApiResponse } from "@/lib/api/types";
import { ApiError } from "./api-error";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
// Sanitize potential duplicate slashes in the base url while keeping the protocol (http:// or https://)
export const API_URL = rawBaseUrl.replace(/([^:]\/)\/+/g, "$1").replace(/\/+$/, "");

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
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
  const response = await fetch(`${API_URL}${cleanPath}`, {
    ...options,
    cache: "no-store",
    headers,
  });

  const payload = (await response.json()) as ApiResponse<T> & { message?: string };

  if (!response.ok) {
    throw new ApiError(payload.message ?? "Request failed", response.status);
  }

  return payload;
}

import { apiFetch } from "./client";
import type { AuthUser, LoginResponse } from "./types";

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export async function loginAdmin(email: string, password: string) {
  return apiFetch<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    false,
  );
}

export async function fetchProfile() {
  return apiFetch<AuthUser>("/auth/profile");
}

export async function changePassword(payload: ChangePasswordPayload) {
  return apiFetch<{ message: string }>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


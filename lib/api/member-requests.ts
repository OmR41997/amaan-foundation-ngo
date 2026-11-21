import { apiFetch, ApiError } from "./client";
import type {
  DashboardStats,
  MemberRequest,
  MembershipType,
  RequestStatus,
} from "./types";

export interface MemberRequestQuery {
  page?: number;
  limit?: number;
  status?: RequestStatus;
  membershipType?: MembershipType;
  search?: string;
}

export async function submitMemberRequest(data: Record<string, unknown>) {
  return apiFetch<MemberRequest>(
    "/member-requests",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    false,
  );
}

export async function fetchMemberRequests(query: MemberRequestQuery = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return apiFetch<MemberRequest[]>(`/member-requests${qs ? `?${qs}` : ""}`);
}

export async function fetchDashboardStats() {
  return apiFetch<DashboardStats>("/member-requests/stats");
}

export async function approveMemberRequest(id: string) {
  return apiFetch<MemberRequest>(`/member-requests/${id}/approve`, {
    method: "PATCH",
  });
}

export async function rejectMemberRequest(id: string, reason?: string) {
  return apiFetch<MemberRequest>(`/member-requests/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });
}

export async function deleteMemberRequest(id: string) {
  return apiFetch<MemberRequest>(`/member-requests/${id}`, {
    method: "DELETE",
  });
}

export async function updateMemberRequest(
  id: string,
  data: Record<string, unknown>,
) {
  const body = JSON.stringify(data);
  const opts = { method: "PATCH" as const, body };

  try {
    return await apiFetch<MemberRequest>(`/member-requests/${id}/update`, opts);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return apiFetch<MemberRequest>(`/member-requests/${id}`, opts);
    }
    throw err;
  }
}

import { apiFetch } from "./client";
import type {
  CreateTeamMemberDto,
  TeamMember,
  UpdateTeamMemberDto,
} from "./types";

export interface TeamMemberQuery {
  page?: number;
  limit?: number;
  role?: string;
  district?: string;
  state?: string;
  country?: string;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export async function fetchTeamMembers(query: TeamMemberQuery = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return apiFetch<TeamMember[]>(`/teams${qs ? `?${qs}` : ""}`);
}

export async function fetchTeamMemberById(id: string) {
  return apiFetch<TeamMember>(`/teams/${id}`);
}

export async function createTeamMember(data: CreateTeamMemberDto) {
  return apiFetch<TeamMember>("/teams", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTeamMember(id: string, data: UpdateTeamMemberDto) {
  return apiFetch<TeamMember>(`/teams/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTeamMember(id: string) {
  return apiFetch<TeamMember>(`/teams/${id}`, {
    method: "DELETE",
  });
}

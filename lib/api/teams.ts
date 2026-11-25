import { apiFetch } from "./client";
import type {
  CreateTeamMemberDto,
  TeamMember,
  UpdateTeamMemberDto,
} from "./types";
import {
  teamMembers as staticTeamMembers,
  DEFAULT_FOUNDER_IMAGE,
  DEFAULT_FOUNDER_ROLE,
} from "@/data/team";

export { DEFAULT_FOUNDER_IMAGE, DEFAULT_FOUNDER_ROLE };

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
  return apiFetch<TeamMember[]>(`/teams${qs ? `?${qs}` : ""}`, {}, false);
}

export async function fetchTeamMemberById(id: string) {
  return apiFetch<TeamMember>(`/teams/${id}`, {}, false);
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

export function resolveFounderImageFromMembers(
  members: Array<{ role?: string; photoUrl?: string; imageFile?: string }>
): string | null {
  if (!Array.isArray(members) || members.length === 0) return null;

  // Filter members matching default founder role
  const exactFounders = members.filter((m) => {
    const role = (m.role || "").trim().toLowerCase();
    return (
      role === DEFAULT_FOUNDER_ROLE.toLowerCase() ||
      (role.includes("founder") && role.includes("president"))
    );
  });

  const candidates =
    exactFounders.length > 0
      ? exactFounders
      : members.filter((m) => {
          const role = (m.role || "").trim().toLowerCase();
          return role.includes("founder");
        });

  if (candidates.length === 0) return null;

  // Ensure "last one image" of Founder & President is used
  const lastFounder = candidates[candidates.length - 1];

  if (lastFounder.photoUrl && lastFounder.photoUrl.trim()) {
    const url = lastFounder.photoUrl.trim();
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/images/team/")) return url;
    if (url.startsWith("/team/")) return `/images${url}`;
    if (url.startsWith("/")) return url;
    return `/images/team/${url}`;
  }

  if (lastFounder.imageFile && lastFounder.imageFile.trim()) {
    const file = lastFounder.imageFile.trim();
    if (file.startsWith("http://") || file.startsWith("https://")) return file;
    if (file.startsWith("/")) return file;
    return `/images/team/${file}`;
  }

  return null;
}

export async function getFounderPresidentImage(): Promise<string> {
  try {
    const res = await fetchTeamMembers({ limit: 100 });
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      const resolved = resolveFounderImageFromMembers(res.data);
      if (resolved) {
        return resolved;
      }
    }
  } catch (err: any) {
    // Backend is offline or unreachable - gracefully fall back without noisy stack trace
    console.warn(`[Backend Offline] Using default founder image (${err?.message || "unreachable"})`);
  }

  // Fallback to static team definitions in data/team.ts (last one image of Founder & President)
  const staticResolved = resolveFounderImageFromMembers(staticTeamMembers);
  if (staticResolved) {
    return staticResolved;
  }

  return DEFAULT_FOUNDER_IMAGE;
}

import { apiFetch } from "./client";
import type {
  CreateInitiativesProgramDto,
  InitiativesProgram,
  QueryInitiativesProgramsDto,
  UpdateInitiativesProgramDto,
} from "./types";

export async function fetchInitiativesPrograms(
  query: QueryInitiativesProgramsDto = {},
) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return apiFetch<InitiativesProgram[]>(
    `/initiatives-programs${qs ? `?${qs}` : ""}`,
    {},
    false,
  );
}

export async function fetchInitiativeProgramById(id: string) {
  return apiFetch<InitiativesProgram>(`/initiatives-programs/${id}`, {}, false);
}

export async function createInitiativeProgram(
  data: CreateInitiativesProgramDto,
) {
  return apiFetch<InitiativesProgram>("/initiatives-programs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateInitiativeProgram(
  id: string,
  data: UpdateInitiativesProgramDto,
) {
  return apiFetch<InitiativesProgram>(`/initiatives-programs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteInitiativeProgram(id: string) {
  return apiFetch<InitiativesProgram>(`/initiatives-programs/${id}`, {
    method: "DELETE",
  });
}

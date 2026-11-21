import { apiFetch } from "./client";
import type {
  CreateGalleryDto,
  GalleryItem,
  UpdateGalleryDto,
} from "./types";

export interface GalleryQuery {
  page?: number;
  limit?: number;
  eventType?: string;
  excludeEventType?: string;
  eventName?: string;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  source?: "local" | "cloud";
  isPublished?: boolean | "true" | "false";
}

export async function fetchGalleryItems(query: GalleryQuery = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return apiFetch<GalleryItem[]>(`/gallery${qs ? `?${qs}` : ""}`);
}

export async function fetchGalleryItemById(id: string) {
  return apiFetch<GalleryItem>(`/gallery/${id}`);
}

export async function createGalleryItem(data: CreateGalleryDto) {
  return apiFetch<GalleryItem>("/gallery", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateGalleryItem(id: string, data: UpdateGalleryDto) {
  return apiFetch<GalleryItem>(`/gallery/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteGalleryItem(id: string) {
  return apiFetch<GalleryItem>(`/gallery/${id}`, {
    method: "DELETE",
  });
}

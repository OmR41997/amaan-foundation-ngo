import { getToken } from "@/lib/auth/storage";
import { compressImageFile, ImageCompressionOptions } from "../image-compressor";
import { ApiError } from "./client";
import type { ApiResponse, UploadMediaRecord } from "./types";
import { API_URL } from "@/services/api-config";

export interface DirectUploadOptions {
  category?: string;
  title?: string;
  altText?: string;
  compress?: boolean;
  compressionOptions?: ImageCompressionOptions;
  onProgress?: (message: string) => void;
}

/**
 * Returns raw file URL directly as provided by backend without frontend domain wrapping.
 */
export function resolveMediaUrl(rawUrl: string): string {
  return rawUrl || "";
}

/**
 * Centralized direct API upload handler:
 * 1. Automatically compresses image files client-side before sending.
 * 2. Uploads directly to backend API (/uploads) without client-side Cloudinary dependencies.
 * 3. Returns the complete URL directly provided by backend without frontend wrapping.
 */
export async function uploadFileToApi(
  file: File,
  options: DirectUploadOptions = {},
): Promise<string> {
  const {
    category = "general",
    title,
    altText,
    compress = true,
    compressionOptions,
    onProgress,
  } = options;

  let fileToUpload = file;

  // 1. Ensure file is compressed before upload if it is an image
  if (compress && file.type.startsWith("image/")) {
    onProgress?.("Compressing image...");
    try {
      fileToUpload = await compressImageFile(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.8,
        maxSizeMB: 2,
        ...compressionOptions,
      });
    } catch (compressErr) {
      console.warn("Image compression failed, using original file:", compressErr);
    }
  }

  onProgress?.("Uploading file to server...");

  const formData = new FormData();
  formData.append("file", fileToUpload);
  formData.append("category", category);
  if (title) formData.append("title", title);
  if (altText) formData.append("altText", altText);

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/uploads`, {
    method: "POST",
    headers,
    body: formData,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      payload?.message ||
      payload?.error ||
      `Upload failed with status ${response.status}`;
    throw new ApiError(errorMsg, response.status);
  }

  // Handle both standard wrapped response and direct response object
  const data = payload?.data || payload;
  const rawUrl = data?.fileUrl || data?.url || data?.secure_url;

  if (!rawUrl || typeof rawUrl !== "string") {
    throw new ApiError("Upload completed but server did not return a valid URL", 500);
  }

  // Use URL directly from backend response as-is (no frontend wrapping)
  return rawUrl;
}

/**
 * Uploads a single file to backend and returns full API response record.
 */
export async function uploadSingleFileToBackend(
  file: File,
  category = "general",
  title?: string,
  altText?: string,
): Promise<ApiResponse<UploadMediaRecord>> {
  // Always compress before upload
  const fileToUpload = await compressImageFile(file, {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.8,
    maxSizeMB: 2,
  });

  const formData = new FormData();
  formData.append("file", fileToUpload);
  formData.append("category", category);
  if (title) formData.append("title", title);
  if (altText) formData.append("altText", altText);

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/uploads`, {
    method: "POST",
    headers,
    body: formData,
  });

  const payload = (await response.json()) as ApiResponse<UploadMediaRecord> & {
    message?: string;
  };

  if (!response.ok) {
    throw new ApiError(payload?.message ?? "File upload failed", response.status);
  }

  return payload;
}

/**
 * Deletes an uploaded media asset from Cloudinary via the backend API.
 * Accepts a Cloudinary URL or public ID.
 */
export async function deleteUploadedMedia(urlOrPublicId: string): Promise<boolean> {
  if (!urlOrPublicId || !urlOrPublicId.trim()) return false;

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
      `${API_URL}/uploads?url=${encodeURIComponent(urlOrPublicId.trim())}`,
      {
        method: "DELETE",
        headers,
      },
    );

    return res.ok;
  } catch (err) {
    console.warn("Failed to delete media asset from Cloudinary:", err);
    return false;
  }
}

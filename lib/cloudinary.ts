import { uploadFileToApi } from "./api/uploads";

/**
 * Direct client-side Cloudinary uploads have been retired.
 * All uploads now route directly through the backend upload API with automatic client-side compression.
 * Kept for backwards compatibility with any legacy callers.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  return uploadFileToApi(file, { category: "general" });
}

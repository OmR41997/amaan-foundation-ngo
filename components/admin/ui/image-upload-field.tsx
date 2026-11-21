"use client";

import { FileUploader, type FileUploaderProps } from "@/components/ui/file-uploader";

export interface ImageUploadFieldProps extends Omit<FileUploaderProps, "variant"> {
  variant?: "admin" | "card" | "compact";
}

/**
 * Standard ImageUploadField used across Admin modals and management panels.
 * Powered by the centralized FileUploader component with direct API uploading & prior image compression.
 */
export function ImageUploadField({
  label = "Photo / Image",
  helpText = "Upload an image to backend storage",
  category = "general",
  variant = "admin",
  ...props
}: ImageUploadFieldProps) {
  return (
    <FileUploader
      label={label}
      helpText={helpText}
      category={category}
      variant={variant}
      {...props}
    />
  );
}

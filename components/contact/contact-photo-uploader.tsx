"use client";

import { FileUploader } from "@/components/ui/file-uploader";
import { AppLocale } from "@/i18n/routing";

export interface ContactPhotoUploaderProps {
  value?: string;
  onChange?: (url: string) => void;
  photo?: File | null;
  onPhotoSelect?: (file: File | null) => void;
  locale: AppLocale;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Public photo uploader component for member requests.
 * Powered by the centralized FileUploader with prior image compression and direct API upload.
 */
export function ContactPhotoUploader({
  value = "",
  onChange,
  onPhotoSelect,
  locale,
  required = true,
  disabled = false,
}: ContactPhotoUploaderProps) {
  return (
    <FileUploader
      label={locale === "hi" ? "पासपोर्ट साइज़ फोटो" : "Passport Size Photo"}
      value={value}
      onChange={(url) => {
        onChange?.(url);
      }}
      onFileSelect={onPhotoSelect}
      locale={locale}
      variant="card"
      category="members"
      required={required}
      maxSizeMB={5}
      disabled={disabled}
    />
  );
}

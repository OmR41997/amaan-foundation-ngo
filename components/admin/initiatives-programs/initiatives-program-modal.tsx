"use client";

import { ImageUploadField } from "@/components/admin/ui/image-upload-field";
import type {
  CreateInitiativesProgramDto,
  InitiativesProgram,
  UpdateInitiativesProgramDto,
} from "@/lib/api/types";
import { deleteUploadedMedia } from "@/lib/api/uploads";
import { useEffect, useRef, useState } from "react";

interface InitiativesProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: CreateInitiativesProgramDto | UpdateInitiativesProgramDto,
  ) => Promise<void>;
  item?: InitiativesProgram | null;
}

export function InitiativesProgramModal({
  isOpen,
  onClose,
  onSave,
  item,
}: InitiativesProgramModalProps) {
  if (!isOpen) return null;

  return (
    <InitiativesProgramModalForm
      key={item?.id ?? "new"}
      item={item}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function InitiativesProgramModalForm({
  item,
  onClose,
  onSave,
}: {
  item?: InitiativesProgram | null;
  onClose: () => void;
  onSave: (
    data: CreateInitiativesProgramDto | UpdateInitiativesProgramDto,
  ) => Promise<void>;
}) {
  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [photoUrl, setPhotoUrl] = useState(item?.photoUrl || "");
  const [isPublished, setIsPublished] = useState(item?.isPublished ?? true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track any image URLs that were uploaded during this session but not yet saved
  const unsavedUploadedUrlsRef = useRef<string[]>([]);
  const isSavedRef = useRef(false);

  // Helper to cleanup unsaved uploaded media from Cloudinary
  const cleanupUnsavedUploads = () => {
    if (isSavedRef.current) return;
    while (unsavedUploadedUrlsRef.current.length > 0) {
      const urlToDelete = unsavedUploadedUrlsRef.current.pop();
      if (urlToDelete && urlToDelete !== item?.photoUrl) {
        deleteUploadedMedia(urlToDelete);
      }
    }
  };

  // Safe dismiss handler: cleans up unsaved Cloudinary uploads before closing
  const handleDismiss = () => {
    cleanupUnsavedUploads();
    onClose();
  };

  // On unmount (e.g. navigation or component unmount without saving)
  useEffect(() => {
    return () => {
      cleanupUnsavedUploads();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.photoUrl]);

  const handlePhotoChange = (newUrl: string) => {
    // If an image was previously uploaded in this session and is now replaced or cleared,
    // immediately delete the previous unsaved image from Cloudinary
    if (newUrl !== photoUrl) {
      const prevUnsaved = unsavedUploadedUrlsRef.current.pop();
      if (prevUnsaved && prevUnsaved !== item?.photoUrl) {
        deleteUploadedMedia(prevUnsaved);
      }

      if (newUrl && newUrl !== item?.photoUrl) {
        unsavedUploadedUrlsRef.current.push(newUrl);
      }
    }

    setPhotoUrl(newUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!photoUrl.trim()) {
      setError("Photo / Image is required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      isSavedRef.current = true;
      await onSave({
        title: title.trim(),
        description: description.trim(),
        photoUrl: photoUrl.trim(),
        isPublished,
      });
      // Saved successfully, empty tracking array
      unsavedUploadedUrlsRef.current = [];
      onClose();
    } catch (err: unknown) {
      isSavedRef.current = false;
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to save initiative / program.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white p-5 sm:p-6 shadow-2xl transition-all">
        <div className="flex shrink-0 items-center justify-between border-b border-[#e2e8f0] pb-3 sm:pb-4">
          <h2 className="text-base sm:text-lg font-bold text-[#0f172a]">
            {item ? "Edit Initiative / Program" : "Add Initiative / Program"}
          </h2>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-full p-1 text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-4">
            {error ? (
              <div className="rounded-lg bg-[#fef2f2] p-3 text-xs font-semibold text-[#b91c1c]">
                {error}
              </div>
            ) : null}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Title <span className="text-[#dc2626]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Community Healthcare Initiatives"
                className="w-full rounded-xl border border-[#cbd5e1] px-3.5 py-2.5 text-sm text-[#0f172a] outline-none transition focus:border-[#1f6fa8] focus:ring-2 focus:ring-[#1f6fa8]/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Description <span className="text-[#dc2626]">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe the goals, impact, or activities of this initiative..."
                className="w-full rounded-xl border border-[#cbd5e1] px-3.5 py-2.5 text-sm text-[#0f172a] outline-none transition focus:border-[#1f6fa8] focus:ring-2 focus:ring-[#1f6fa8]/20"
                required
              />
            </div>

            <ImageUploadField
              label="Initiative Cover Photo"
              helpText="Upload a high-quality cover photo (JPG, PNG, WEBP). Unsaved uploads are automatically purged from Cloudinary."
              value={photoUrl}
              onChange={handlePhotoChange}
              category="initiatives"
              required
            />

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-[#cbd5e1] text-[#1f6fa8] focus:ring-[#1f6fa8]"
              />
              <label
                htmlFor="isPublished"
                className="text-sm font-medium text-[#334155] cursor-pointer"
              >
                Publish immediately to web portal
              </label>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#e2e8f0] pt-4">
            <button
              type="button"
              onClick={handleDismiss}
              disabled={submitting}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-xl bg-[#1f6fa8] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#185886] transition disabled:opacity-50"
            >
              {submitting ? "Saving..." : item ? "Update Initiative" : "Save Initiative"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { ImageUploadField } from "@/components/admin/ui/image-upload-field";
import type { CreateGalleryDto, GalleryItem, UpdateGalleryDto } from "@/lib/api/types";
import { useState } from "react";

interface GalleryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateGalleryDto | UpdateGalleryDto) => Promise<void>;
  item?: GalleryItem | null;
}

export function GalleryItemModal({
  isOpen,
  onClose,
  onSave,
  item,
}: GalleryItemModalProps) {
  if (!isOpen) return null;

  return (
    <GalleryItemModalForm
      key={item?.id ?? "new"}
      item={item}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function GalleryItemModalForm({
  item,
  onClose,
  onSave,
}: {
  item?: GalleryItem | null;
  onClose: () => void;
  onSave: (data: CreateGalleryDto | UpdateGalleryDto) => Promise<void>;
}) {
  const [eventName, setEventName] = useState(item?.eventName || "");
  const [eventType, setEventType] = useState(item?.eventType || (item ? "" : "General"));
  const [photoUrl, setPhotoUrl] = useState(item?.photoUrl || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) {
      setError("Event Name is required.");
      return;
    }
    if (!photoUrl.trim()) {
      setError("Photo / Image is required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSave({
        eventName: eventName.trim(),
        eventType: eventType.trim() || "General",
        photoUrl: photoUrl.trim(),
        source: item?.source || "cloud",
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save gallery item.";
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
            {item ? "Edit Gallery Item" : "Add Gallery Image"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-4">
            {error ? (
              <div className="rounded-lg bg-[#fef2f2] p-3 text-xs font-semibold text-[#b91c1c]">
                {error}
              </div>
            ) : null}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
                Event Name / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Annual Ration & Food Drive 2026"
                className="mt-1 w-full rounded-lg border border-[#cbd5e1] px-3 py-2 text-sm text-[#0f172a] focus:border-[#1f6fa8] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
                Event Type / Category
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#cbd5e1] px-3 py-2 text-sm text-[#0f172a] uppercase focus:border-[#1f6fa8] focus:outline-none"
              >
                <option value="General">GENERAL</option>
                <option value="Distribution">DISTRIBUTION</option>
                <option value="Education">EDUCATION</option>
                <option value="Healthcare">HEALTHCARE</option>
                <option value="Awareness">AWARENESS</option>
                <option value="Event">EVENT / PROGRAM</option>
              </select>
            </div>

            {/* Integrated Image Upload Field */}
            <ImageUploadField
              label="Gallery Photo / Media"
              value={photoUrl}
              onChange={(url) => setPhotoUrl(url)}
              category="gallery"
              helpText="Upload an image to backend storage"
            />
          </div>

          <div className="flex shrink-0 justify-end gap-3 pt-3 sm:pt-4 border-t border-[#e2e8f0]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#cbd5e1] px-4 py-2 text-xs font-semibold text-[#475569] hover:bg-[#f1f5f9]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#1f6fa8] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#185887] disabled:opacity-50"
            >
              {submitting ? "Saving..." : item ? "Update Gallery Image" : "Add Image"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

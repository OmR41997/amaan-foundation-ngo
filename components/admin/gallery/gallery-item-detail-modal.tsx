"use client";

import type { GalleryItem } from "@/lib/api/types";
import { useState } from "react";

interface GalleryItemDetailModalProps {
  item: GalleryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (item: GalleryItem) => void;
}

export function GalleryItemDetailModal({
  item,
  isOpen,
  onClose,
  onEdit,
}: GalleryItemDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const handleCopyUrl = () => {
    if (item.photoUrl) {
      navigator.clipboard.writeText(item.photoUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in duration-200 uppercase">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#e2e8f0] px-5 py-4 bg-[#0f2235] text-white">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#1f6fa8] px-2.5 py-0.5 text-xs font-semibold">
              {item.eventType || "General"}
            </span>
            <h2 className="text-base font-bold truncate max-w-md">{item.eventName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Media Preview Box */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="relative flex min-h-[300px] max-h-[450px] w-full items-center justify-center rounded-xl bg-black overflow-hidden shadow-inner border border-[#cbd5e1]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.photoUrl}
              alt={item.eventName}
              className="max-h-[450px] w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
              }}
            />
          </div>

          {/* Details & Info */}
          <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-[#64748b] block">Event Title / Program Name</span>
                <span className="font-bold text-[#0f172a] text-sm">{item.eventName}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#64748b] block">Category / Type</span>
                <span className="font-semibold text-[#1f6fa8]">{item.eventType || "General"}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#64748b] block">Storage Source</span>
                <span className="font-semibold uppercase text-[#334155]">{item.source || "cloud"}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-[#64748b] block">Visibility Status</span>
                <span
                  className={`font-semibold uppercase ${
                    item.isPublished ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {item.isPublished ? "Published (Live)" : "Draft (Hidden)"}
                </span>
              </div>
            </div>

            <div className="border-t border-[#e2e8f0] pt-3 text-xs">
              <span className="text-[11px] font-semibold text-[#64748b] block">Image CDN URL</span>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  readOnly
                  value={item.photoUrl}
                  className="flex-1 rounded-lg border border-[#cbd5e1] bg-white px-3 py-1.5 font-mono text-[11px] text-[#334155] normal-case focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="rounded-lg border border-[#cbd5e1] bg-white px-3 py-1.5 text-xs font-semibold text-[#1f6fa8] hover:bg-[#f0f7fc] transition shrink-0"
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

            {item.createdAt && (
              <div className="border-t border-[#e2e8f0] pt-2 flex items-center justify-end text-[11px] text-[#64748b]">
                <span>Uploaded: {formatDate(item.createdAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-[#e2e8f0] bg-[#f8fafc] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-xs font-semibold text-[#475569] hover:bg-[#f1f5f9] transition"
          >
            Close
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f6fa8] px-4 py-2 text-xs font-semibold text-white shadow hover:bg-[#185887] transition"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Gallery Media
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import type { InitiativesProgram } from "@/lib/api/types";
import Image from "next/image";
import { useState } from "react";

interface InitiativesProgramDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InitiativesProgram | null;
}

export function InitiativesProgramDetailModal({
  isOpen,
  onClose,
  item,
}: InitiativesProgramDetailModalProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-white p-5 sm:p-6 shadow-2xl transition-all">
        <div className="flex shrink-0 items-center justify-between border-b border-[#e2e8f0] pb-3 sm:pb-4">
          <h2 className="text-base sm:text-lg font-bold text-[#0f172a]">
            Initiative Details
          </h2>
          <button
            type="button"
            onClick={onClose}
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

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {item.photoUrl ? (
            <div
              onClick={() => setLightboxOpen(true)}
              className="group relative h-48 sm:h-56 w-full cursor-pointer overflow-hidden rounded-xl border border-[#e2e8f0] bg-[#f8fafc]"
            >
              <Image
                src={item.photoUrl}
                alt={item.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                <span className="rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white">
                  Click to Expand
                </span>
              </div>
            </div>
          ) : null}

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  item.isPublished
                    ? "bg-[#ecfdf5] text-[#047857]"
                    : "bg-[#f1f5f9] text-[#64748b]"
                }`}
              >
                {item.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-[#0f172a]">{item.title}</h3>
          </div>

          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-[#64748b] mb-1">
              Description
            </span>
            <p className="text-sm leading-relaxed text-[#334155] whitespace-pre-line">
              {item.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#64748b] border-t border-[#f1f5f9]">
            <div>
              <span className="block font-semibold">Created</span>
              <span>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="block font-semibold">Updated</span>
              <span>
                {item.updatedAt
                  ? new Date(item.updatedAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end border-t border-[#e2e8f0] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#f1f5f9] px-4 py-2 text-xs font-bold text-[#475569] hover:bg-[#e2e8f0] transition"
          >
            Close
          </button>
        </div>
      </div>

      {lightboxOpen ? (
        <div
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4"
        >
          <div className="relative max-h-[90vh] max-w-4xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.photoUrl}
              alt={item.title}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

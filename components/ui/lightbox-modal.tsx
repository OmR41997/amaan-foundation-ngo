"use client";

import Image from "next/image";

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title?: string;
  category?: string;
}

export function LightboxModal({ isOpen, onClose, imageSrc, title, category }: LightboxModalProps) {
  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        type="button"
        className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
        aria-label="Close lightbox"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className="relative max-h-[88vh] max-w-4xl w-full overflow-hidden rounded-2xl bg-black/60 shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[60vh] sm:h-[72vh] w-full">
          <Image
            src={imageSrc}
            alt={title || "Gallery photo"}
            fill
            className="object-contain p-2"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
        {(title || category) && (
          <div className="bg-black/80 px-5 sm:px-6 py-3.5 sm:py-4 text-white border-t border-white/10 backdrop-blur-md">
            {category && <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">{category}</span>}
            {title && <h4 className="text-sm sm:text-base font-semibold mt-0.5">{title}</h4>}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";

type ImageGridLightboxProps = {
  images: readonly string[];
  alts: readonly string[];
  /** Thumbnail preset: taller cells for portraits (default `"tall"`), or `"aspect"` for aspect-ratio based */
  thumbnailHeight?: "tall" | "medium" | "aspect";
  /** Optional custom aspect ratio for thumbnails, e.g. "aspect-[3/4]" */
  aspectRatio?: string;
  /** Image object-fit mode on thumbnails: default "cover" */
  fitMode?: "cover" | "contain";
  /** Custom grid CSS classes */
  gridClassName?: string;
  /** Initial count of thumbnails to display before expanding (default undefined = show all) */
  initialLimit?: number;
  /** Number of initial thumbnails to load eagerly with high priority for LCP optimization (default 4) */
  priorityCount?: number;
  showMoreLabel?: string;
  showLessLabel?: string;
  closeLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
};

export function ImageGridLightbox({
  images,
  alts,
  thumbnailHeight = "aspect",
  aspectRatio = "aspect-[3/4]",
  fitMode = "cover",
  gridClassName = "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4 lg:gap-5",
  initialLimit,
  priorityCount = 4,
  showMoreLabel = "View all photos",
  showLessLabel = "Show fewer",
  closeLabel = "Close",
  prevLabel = "Previous image",
  nextLabel = "Next image",
}: ImageGridLightboxProps) {
  const uid = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(!initialLimit);

  const close = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex === null) return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" && openIndex < images.length - 1) setOpenIndex(openIndex + 1);
      if (e.key === "ArrowLeft" && openIndex > 0) setOpenIndex(openIndex - 1);
    };
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [close, openIndex, images.length]);

  const displayImages = expanded || !initialLimit ? images : images.slice(0, initialLimit);

  const heightClass =
    thumbnailHeight === "aspect"
      ? `${aspectRatio} w-full`
      : thumbnailHeight === "tall"
      ? "min-h-[260px] h-[clamp(260px,48vw,380px)] sm:min-h-[280px] sm:h-[clamp(280px,36vw,400px)] w-full"
      : "min-h-[180px] h-[clamp(180px,32vw,260px)] w-full";

  const fitClass =
    fitMode === "contain"
      ? "object-contain p-2"
      : "object-cover object-top sm:object-center";

  return (
    <>
      <div className={gridClassName}>
        {displayImages.map((src, index) => {
          const alt = alts[index] ?? `Image ${index + 1}`;
          return (
            <button
              key={src}
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-haspopup="dialog"
              aria-expanded={openIndex === index}
              aria-controls={`${uid}-dialog`}
              aria-label={`View full image: ${alt}`}
              className={`group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-left shadow-sm transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${heightClass}`}
            >
              <Image
                src={src}
                alt={alt}
                fill
                priority={index < priorityCount}
                loading={index < priorityCount ? "eager" : "lazy"}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`${fitClass} transition duration-300 group-hover:scale-[1.03]`}
              />
              <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10 pointer-events-none" />
            </button>
          );
        })}
      </div>

      {initialLimit && images.length > initialLimit && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)] bg-transparent px-6 py-2.5 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
          >
            {expanded ? showLessLabel : `${showMoreLabel} (${images.length})`}
          </button>
        </div>
      )}

      {openIndex !== null && images[openIndex] ? (
        <div
          id={`${uid}-dialog`}
          role="dialog"
          aria-modal="true"
          aria-label={alts[openIndex] ?? `Image ${openIndex + 1}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-sm"
          onClick={close}
        >
          <div className="absolute top-4 right-4 z-[102] flex items-center gap-3">
            <span className="text-xs sm:text-sm font-medium text-white/70">
              {openIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label={closeLabel}
              className="rounded-full border border-white/30 bg-black/50 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-white hover:text-black"
            >
              {closeLabel} ✕
            </button>
          </div>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label={prevLabel}
                disabled={openIndex <= 0}
                onClick={(e) => {
                  e.stopPropagation();
                  if (openIndex > 0) setOpenIndex(openIndex - 1);
                }}
                className="absolute left-2 top-1/2 z-[102] -translate-y-1/2 rounded-full bg-black/50 p-2.5 sm:p-3 text-white transition hover:bg-white/90 hover:text-black disabled:opacity-20 disabled:pointer-events-none sm:left-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                aria-label={nextLabel}
                disabled={openIndex >= images.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  if (openIndex < images.length - 1) setOpenIndex(openIndex + 1);
                }}
                className="absolute right-2 top-1/2 z-[102] -translate-y-1/2 rounded-full bg-black/50 p-2.5 sm:p-3 text-white transition hover:bg-white/90 hover:text-black disabled:opacity-20 disabled:pointer-events-none sm:right-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          ) : null}

          <figure
            className="relative z-[101] mx-auto flex max-h-[90vh] max-w-[96vw] flex-col items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[openIndex]!}
              alt={alts[openIndex] ?? `Image ${openIndex + 1}`}
              className="max-h-[82vh] max-w-[92vw] w-auto h-auto rounded-lg object-contain shadow-2xl"
            />
            <figcaption className="mt-3 max-w-2xl text-center text-xs text-white/90 sm:text-sm font-medium">
              {alts[openIndex]}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}

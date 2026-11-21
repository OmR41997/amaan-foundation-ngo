"use client";

import { fetchGalleryItems } from "@/lib/api/gallery";
import { AppLocale } from "@/i18n/routing";
import type { PaginationMeta } from "@/lib/api/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pagination } from "@/components/admin/ui/pagination";

export interface GalleryImage {
  src: string;
  eventName: string;
  eventType?: string;
}

export interface GalleryCategoryOption {
  id: string;
  title: string;
}

/**
 * Optimizes Cloudinary URLs on the fly to drastically reduce bandwidth and prevent extra costs:
 * - f_auto: Modern format (WebP/AVIF)
 * - q_auto: Intelligent compression without visible quality loss
 * - w_{width},c_limit: Downscales high-res camera photos to the viewport display size
 */
export function getOptimizedImageUrl(url: string, width = 750): string {
  if (!url || typeof url !== "string") return "";
  if (!url.includes("res.cloudinary.com")) return url;
  if (
    url.includes("/image/upload/f_") ||
    url.includes("/image/upload/w_") ||
    url.includes("/image/upload/q_")
  ) {
    return url;
  }
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,w_${width},c_limit/`);
}

/**
 * Automatically determine the optimal limit of images to load per screen based on viewport width:
 * - Mobile (< 640px): 6 images (1 column x 6 rows) - Fast loading on mobile data
 * - Tablet (640px - 1024px): 8 images (2 columns x 4 rows)
 * - Laptop (1024px - 1280px): 9 images (3 columns x 3 rows)
 * - Desktop (>= 1280px): 12 images (4 columns x 3 rows)
 * This prevents over-fetching and extra Cloudinary bandwidth costs while ensuring a complete grid.
 */
function getAutoScreenLimit(): number {
  if (typeof window === "undefined") return 12;
  const w = window.innerWidth;
  if (w < 640) return 6;
  if (w < 1024) return 8;
  if (w < 1280) return 9;
  return 12;
}

// Default categories (nostalgia is explicitly excluded as it is dedicated to Amaan's Story)
const DEFAULT_CATEGORIES: GalleryCategoryOption[] = [
  { id: "all", title: "All categories" },
  { id: "Education", title: "Education Support" },
  { id: "Healthcare", title: "Healthcare" },
  { id: "Distribution", title: "Ration & Relief" },
  { id: "Awareness", title: "Awareness & Press" },
  { id: "Event", title: "Community Events" },
  { id: "gullak", title: "Project Gullak" },
  { id: "General", title: "General" },
];

export interface GalleryLightboxProps {
  locale: AppLocale;
  initialCategory?: string;
  hideFilters?: boolean;
  limit?: number;
  className?: string;
  columnsClassName?: string;
  disableScroll?: boolean;
}

export function GalleryLightbox({
  locale,
  initialCategory = "all",
  hideFilters = false,
  limit: customLimit,
  className = "",
  columnsClassName,
  disableScroll = false,
}: GalleryLightboxProps) {
  const [categories, setCategories] = useState<GalleryCategoryOption[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(customLimit ?? 12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync category if initialCategory changes
  useEffect(() => {
    setSelectedCategory(initialCategory);
    setPage(1);
    setActive(null);
  }, [initialCategory]);

  // Automatically update the screen limit based on device screen width
  useEffect(() => {
    if (customLimit) {
      setLimit(customLimit);
      return;
    }
    const handleResize = () => {
      const autoLimit = getAutoScreenLimit();
      setLimit((prev) => (prev !== autoLimit ? autoLimit : prev));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [customLimit]);

  // Discover distinct categories, strictly filtering out "nostalgia"
  useEffect(() => {
    let isMounted = true;
    import("@/public/collections/gallery.json")
      .then((mod) => {
        if (!isMounted) return;
        const data = mod.default as Record<string, Array<{ eventType?: string }>>;
        const typeSet = new Set<string>();

        Object.values(data).forEach((group) => {
          if (Array.isArray(group)) {
            group.forEach((item) => {
              const type = item.eventType?.trim();
              // Strictly exclude nostalgia from the public gallery web portal
              if (type && type.toLowerCase() !== "nostalgia") {
                typeSet.add(type);
              }
            });
          }
        });

        if (typeSet.size > 0) {
          const dynamicCats: GalleryCategoryOption[] = [
            { id: "all", title: locale === "hi" ? "सभी श्रेणियां" : "All categories" },
            ...Array.from(typeSet).map((cat) => ({
              id: cat,
              title: cat.charAt(0).toUpperCase() + cat.slice(1),
            })),
          ];
          setCategories(dynamicCats);
        }
      })
      .catch(() => {
        // Keep DEFAULT_CATEGORIES
      });

    return () => {
      isMounted = false;
    };
  }, [locale]);

  // Load paginated images for the active screen
  const loadPageData = useCallback(async () => {
    setLoading(true);
    try {
      const isFiltered = selectedCategory !== "all";
      const res = await fetchGalleryItems({
        page,
        limit,
        eventType: isFiltered ? selectedCategory : undefined,
        excludeEventType: isFiltered ? undefined : "nostalgia",
        isPublished: "true",
      });

      if (Array.isArray(res?.data) && res.data.length > 0) {
        // Enforce exclusion of nostalgia items
        const mapped: GalleryImage[] = res.data
          .filter((item) => Boolean(item.photoUrl) && item.eventType?.toLowerCase() !== "nostalgia")
          .map((item) => ({
            src: item.photoUrl,
            eventName: item.eventName || "Gallery Image",
            eventType: item.eventType || "General",
          }));

        setImages(mapped);
        setMeta(res.meta);
        setTotalPages(res.meta?.totalPages ?? Math.max(1, Math.ceil((res.meta?.total ?? mapped.length) / limit)));
        setTotalImages(res.meta?.total ?? mapped.length);
        return;
      }
    } catch (err) {
      console.warn("Gallery API fetch failed, falling back to local collection:", err);
    }

    // Fallback to local collections/gallery.json if API is unreachable
    try {
      const mod = await import("@/public/collections/gallery.json");
      const data = mod.default as Record<
        string,
        Array<{ photoUrl: string; eventName?: string; eventType?: string; isPublished?: boolean }>
      >;

      const allItems: GalleryImage[] = [];
      Object.values(data).forEach((group) => {
        if (Array.isArray(group)) {
          group.forEach((it) => {
            // Strictly exclude nostalgia from the public gallery web portal
            if (it.photoUrl && it.eventType?.toLowerCase() !== "nostalgia") {
              if (it.isPublished === undefined || it.isPublished === true) {
                if (selectedCategory === "all" || it.eventType?.toLowerCase() === selectedCategory.toLowerCase()) {
                  allItems.push({
                    src: it.photoUrl,
                    eventName: it.eventName || "Gallery Image",
                    eventType: it.eventType || "General",
                  });
                }
              }
            }
          });
        }
      });

      const totalCount = allItems.length;
      const computedTotalPages = Math.max(1, Math.ceil(totalCount / limit));
      const paged = allItems.slice((page - 1) * limit, page * limit);

      setImages(paged);
      setTotalPages(computedTotalPages);
      setTotalImages(totalCount);
    } catch {
      setImages([]);
      setTotalPages(1);
      setTotalImages(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, selectedCategory]);

  useEffect(() => {
    let isMounted = true;
    loadPageData().then(() => {
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [loadPageData]);

  return (
    <div ref={containerRef} className={className}>
      {/* Category Controls & Screen Info */}
      {!hideFilters && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-white dark:bg-[var(--card)] p-4 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {locale === "hi" ? "सेवा के स्मृति क्षण" : "Moments of service"}
            </p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {totalImages > 0
                ? locale === "hi"
                  ? `कुल ${totalImages} चित्रों में से दृश्य`
                  : `Showing ${images.length} of ${totalImages} moments`
                : locale === "hi"
                ? "हमारे कार्यों की झलकियां देखें।"
                : "Browse stories from our community work."}
            </p>
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-64">
            <label htmlFor="gallery-category-select" className="sr-only">
              Choose gallery category
            </label>
            <select
              id="gallery-category-select"
              value={selectedCategory}
              onChange={(event) => {
                setSelectedCategory(event.target.value);
                setActive(null);
                setPage(1);
              }}
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[var(--mint)] px-3 text-sm text-slate-800 dark:text-[var(--ink)] outline-none transition focus:border-[var(--primary)] focus:bg-white dark:focus:bg-[var(--card)] focus:ring-2 focus:ring-[var(--primary)]/15"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Grid Images */}
      {loading ? (
        <div className="flex items-center justify-center p-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 dark:border-white/10 border-t-[var(--primary)]" />
        </div>
      ) : images.length === 0 ? (
        <p className="rounded-2xl border border-[var(--line)] bg-white dark:bg-[var(--card)] p-10 text-center text-slate-500 dark:text-slate-400">
          {locale === "hi" ? "इस श्रेणी में कोई चित्र उपलब्ध नहीं है।" : "No gallery images found in this category."}
        </p>
      ) : (
        <div className={columnsClassName ?? "columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4"}>
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className="group relative mb-5 block w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-[var(--card)] border border-[var(--line)] text-left shadow-sm transition hover:shadow-xl"
            >
              <div className="flex min-h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-[#10231a] dark:via-[#142d21] dark:to-[#10231a]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getOptimizedImageUrl(image.src, 750)}
                  alt={image.eventName}
                  className="h-auto max-h-[28rem] w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                  onError={(event) => {
                    (event.target as HTMLImageElement).src =
                      "https://via.placeholder.com/800x600?text=Gallery+Image";
                  }}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 via-black/50 to-transparent px-4 pb-4 pt-10 text-left transition-transform duration-300 group-hover:translate-y-0">
                <p className="line-clamp-2 text-sm font-semibold text-white">{image.eventName}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 ? (
        <div className="mt-8 rounded-2xl border border-[var(--line)] bg-white dark:bg-[var(--card)]">
          <Pagination
            meta={meta}
            page={page}
            totalPages={totalPages}
            className="border-t-0 rounded-2xl"
            onPageChange={(nextPage) => {
              setPage(nextPage);
              setActive(null);
              if (!disableScroll) {
                if (containerRef.current) {
                  containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  window.scrollTo({ top: 200, behavior: "smooth" });
                }
              }
            }}
          />
        </div>
      ) : null}

      {/* Lightbox Modal */}
      {active !== null && images[active] ? (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f2235]/80 p-5 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[90vh] max-w-5xl items-center justify-center overflow-hidden rounded-2xl bg-white dark:bg-[var(--card)] border border-[var(--line)] p-3 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black transition"
              aria-label="Close lightbox"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getOptimizedImageUrl(images[active].src, 1600)}
              alt={images[active].eventName}
              className="max-h-[85vh] w-auto max-w-full object-contain"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

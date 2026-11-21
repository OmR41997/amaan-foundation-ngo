"use client";

import { useEffect, useState } from "react";
import { AppLocale } from "@/i18n/routing";

interface ContactMapProps {
  locale: AppLocale;
  mapSearchQuery: string;
  mapTitle: string;
  viewMapLabel: string;
}

export function ContactMap({
  locale,
  mapSearchQuery,
  mapTitle,
  viewMapLabel,
}: ContactMapProps) {
  const [mapType, setMapType] = useState<"k" | "m">("m");

  useEffect(() => {
    const updateTheme = () => {
      const isDark =
        document.documentElement.dataset.theme === "dark" ||
        (!document.documentElement.dataset.theme &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      // In dark mode case, use Satellite imagery ("k") as default!
      setMapType(isDark ? "k" : "m");
    };

    updateTheme();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          updateTheme();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", updateTheme);

    return () => {
      observer.disconnect();
      mql.removeEventListener("change", updateTheme);
    };
  }, []);

  const mapEmbedUrl = `https://www.google.com/maps?q=${mapSearchQuery}&t=${mapType}&z=17&output=embed`;
  const mapExternalUrl = `https://www.google.com/maps?q=${mapSearchQuery}&t=${mapType}`;

  return (
    <div className="h-64 sm:h-72 md:h-auto md:flex-1 min-h-[220px] flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-xs">
      <div className="flex shrink-0 items-center justify-between border-b border-[var(--line)] px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#fafcf9] dark:bg-[var(--surface)] gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--green)] shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-xs font-bold text-[var(--ink)]">
            {mapTitle}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Satellite / Map View Switcher */}
          <div className="inline-flex items-center rounded-lg border border-[var(--line)] bg-[var(--bg)] p-0.5 text-[10px] font-semibold">
            <button
              type="button"
              onClick={() => setMapType("m")}
              className={`rounded-md px-2 py-0.5 transition ${
                mapType === "m"
                  ? "bg-[var(--green)] text-white shadow-xs font-bold"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {locale === "hi" ? "नक्शा" : "Map"}
            </button>
            <button
              type="button"
              onClick={() => setMapType("k")}
              className={`rounded-md px-2 py-0.5 transition ${
                mapType === "k"
                  ? "bg-[var(--green)] text-white shadow-xs font-bold"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {locale === "hi" ? "सैटेलाइट" : "Satellite"}
            </button>
          </div>

          <a
            href={mapExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[var(--green)] hover:underline whitespace-nowrap"
          >
            {viewMapLabel} →
          </a>
        </div>
      </div>

      <iframe
        key={mapEmbedUrl}
        src={mapEmbedUrl}
        title="Amaan Ansari Welfare Foundation location map"
        className="w-full flex-1 min-h-[170px] border-0 bg-neutral-900"
        loading="lazy"
      />
    </div>
  );
}

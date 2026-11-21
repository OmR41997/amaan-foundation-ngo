"use client";

import { useState } from "react";
import { AppLocale } from "@/i18n/routing";

export interface ContactItem {
  number: string;
  designationEn: string;
  designationHi: string;
  category: "leadership" | "legal" | "core" | "medical";
}

interface ContactDirectoryProps {
  contactList: ContactItem[];
  locale: AppLocale;
  title: string;
}

export function ContactDirectory({ contactList, locale, title }: ContactDirectoryProps) {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const t = locale === "hi"
    ? {
        copied: "कॉपी किया गया!",
        copyTooltip: "नंबर कॉपी करें",
        callNow: "कॉल करें",
        emergencyBadge: "आपातकालीन",
      }
    : {
        copied: "Copied!",
        copyTooltip: "Copy number",
        callNow: "Call now",
        emergencyBadge: "Emergency",
      };

  const handleCopy = (number: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(number);
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(null), 2000);
    }
  };

  const formatNumber = (num: string) => {
    if (num.length === 10) {
      return `${num.slice(0, 5)} ${num.slice(5)}`;
    }
    return num;
  };

  const getRoleStyle = (category: ContactItem["category"]) => {
    switch (category) {
      case "leadership":
        return {
          badge: "bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-200/90 dark:border-amber-700/50",
        };
      case "medical":
        return {
          badge: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 border-emerald-200/90 dark:border-emerald-700/50",
        };
      case "legal":
        return {
          badge: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-300 border-indigo-200/90 dark:border-indigo-700/50",
        };
      default:
        return {
          badge: "bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-300 border-slate-200/90 dark:border-slate-700/60",
        };
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Directory Title */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--green)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </span>
          <h3 className="text-sm font-bold tracking-tight text-[var(--ink)]">{title}</h3>
        </div>
        <span className="rounded-full bg-gray-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]">
          {contactList.length}
        </span>
      </div>

      {/* Clean Contact Cards List with Custom Sleek Scrollbar */}
      <div className="custom-scrollbar max-h-[250px] space-y-1.5 overflow-y-auto pr-2.5">
        {contactList.map((contact) => {
          const roleStyle = getRoleStyle(contact.category);
          const designation =
            locale === "hi" ? contact.designationHi : contact.designationEn;
          const isCopied = copiedNumber === contact.number;

          return (
            <div
              key={contact.number}
              className="group relative flex items-center justify-between rounded-xl border border-[var(--line)] bg-[var(--card)] p-2.5 shadow-xs transition-all duration-200 hover:border-[var(--green)]/40 hover:shadow-sm"
            >
              <div className="min-w-0 flex-1 pr-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${roleStyle.badge}`}
                  >
                    {designation}
                  </span>
                  {contact.category === "medical" && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-700/50">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                      {t.emergencyBadge}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-1.5 sm:gap-2">
                  <a
                    href={`tel:+91${contact.number}`}
                    className="font-mono text-xs sm:text-sm font-bold tracking-tight text-[var(--ink)] transition-colors hover:text-[var(--green)]"
                  >
                    +91 {formatNumber(contact.number)}
                  </a>
                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleCopy(contact.number)}
                    className="flex h-5 w-5 items-center justify-center rounded text-[var(--muted)] transition-colors hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[var(--ink)]"
                    title={isCopied ? t.copied : t.copyTooltip}
                    aria-label={t.copyTooltip}
                  >
                    {isCopied ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 text-emerald-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </button>
                  {isCopied && (
                    <span className="text-[10px] font-semibold text-emerald-600 animate-fade-in">
                      {t.copied}
                    </span>
                  )}
                </div>
              </div>

              {/* High-Contrast Crisp White Phone Call Button */}
              <a
                href={`tel:+91${contact.number}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm transition-all duration-200 hover:scale-108 hover:shadow-md active:scale-95"
                style={{ backgroundColor: "#17653a", color: "#ffffff" }}
                title={`${t.callNow}: +91 ${contact.number}`}
                aria-label={`${t.callNow} ${designation}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#ffffff"
                  strokeWidth={2.2}
                  style={{ stroke: "#ffffff" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

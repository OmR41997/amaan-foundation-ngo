"use client";

import { useEffect, useState } from "react";
import type { PaginationMeta } from "@/lib/api/types";

export interface PaginationProps {
  meta?: PaginationMeta; // Direct from backend response (contains total, from, to, page, totalPages, hasPrevPage, hasNextPage)
  onPageChange: (page: number) => void;
  className?: string;
  showJumpInput?: boolean;
  page?: number;
  totalPages?: number;
}

export function Pagination({
  meta,
  onPageChange,
  page,
  totalPages,
  className = "",
  showJumpInput = true,
}: PaginationProps) {
  // Directly use backend meta properties
  const currentPage = meta?.page ?? page ?? 1;
  const totalPagesCount = meta?.totalPages ?? totalPages ?? 1;

  const [jumpPage, setJumpPage] = useState<string>(String(currentPage));

  useEffect(() => {
    setJumpPage(String(currentPage));
  }, [currentPage]);

  const handleJump = () => {
    const parsed = parseInt(jumpPage.trim(), 10);
    if (!isNaN(parsed)) {
      const target = Math.min(Math.max(1, parsed), totalPagesCount);
      setJumpPage(String(target));
      if (target !== currentPage) {
        onPageChange(target);
      }
    } else {
      setJumpPage(String(currentPage));
    }
  };

  const hasPrev = meta?.hasPrevPage ?? currentPage > 1;
  const hasNext = meta?.hasNextPage ?? currentPage < totalPagesCount;

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-[#d7e4ef] px-4 py-3 text-sm text-[#64748b] bg-white ${className}`}
    >
      {/* Record Overview & Page Status directly from backend meta */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm font-medium text-[#64748b]">
        {meta && typeof meta.total === "number" && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#f1f5f9] px-2.5 py-0.5 text-xs font-bold text-[#0f172a] border border-[#e2e8f0]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1f6fa8]" />
            Total: {meta.total} records
          </span>
        )}

        {meta && typeof meta.from === "number" && typeof meta.to === "number" && (
          <>
            <span>
              Showing{" "}
              <span className="font-semibold text-[#0a2540]">{meta.from}–{meta.to}</span> of{" "}
              <span className="font-semibold text-[#0a2540]">{meta.total}</span> records
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
          </>
        )}

        <p>
          Page <span className="font-semibold text-[#0a2540]">{currentPage}</span> of{" "}
          <span className="font-semibold text-[#0a2540]">{totalPagesCount}</span>
        </p>
      </div>

      {/* Navigation Buttons & Direct Page Shifting Input */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {showJumpInput && totalPagesCount > 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleJump();
            }}
            className="flex items-center gap-1.5"
          >
            <span className="text-xs font-medium text-[#64748b]">Go to:</span>
            <input
              type="number"
              min={1}
              max={totalPagesCount}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onBlur={handleJump}
              className="h-8 w-14 rounded-lg border border-[#cbd5e1] bg-white px-1.5 text-center text-xs font-semibold text-[#0a2540] shadow-2xs outline-none transition focus:border-[#1f6fa8] focus:ring-1 focus:ring-[#1f6fa8]"
              aria-label="Direct page shift input"
              title={`Page 1 to ${totalPagesCount}`}
            />
            <button
              type="submit"
              className="h-8 rounded-lg bg-[#1f6fa8] px-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-[#185887] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              title="Shift to page"
            >
              Shift
            </button>
          </form>
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={!hasPrev}
            onClick={() => onPageChange(1)}
            title="First Page"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-[#cbd5e1] bg-white px-2 text-xs font-semibold text-[#0a2540] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:opacity-50"
          >
            «
          </button>
          <button
            type="button"
            disabled={!hasPrev}
            onClick={() => onPageChange(currentPage - 1)}
            className="inline-flex h-8 items-center rounded-lg border border-[#cbd5e1] bg-white px-3 text-xs font-semibold text-[#0a2540] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={!hasNext}
            onClick={() => onPageChange(currentPage + 1)}
            className="inline-flex h-8 items-center rounded-lg border border-[#cbd5e1] bg-white px-3 text-xs font-semibold text-[#0a2540] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:opacity-50"
          >
            Next
          </button>
          <button
            type="button"
            disabled={!hasNext}
            onClick={() => onPageChange(totalPagesCount)}
            title="Last Page"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-[#cbd5e1] bg-white px-2 text-xs font-semibold text-[#0a2540] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:opacity-50"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}

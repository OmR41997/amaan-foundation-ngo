"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log error securely without leaking sensitive credentials
    console.error("Application error boundary triggered:", error.message);
  }, [error]);

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full rounded-3xl border border-red-200/60 dark:border-red-900/40 bg-[var(--card)] p-8 shadow-lg sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--disp)" }}>
          Something went wrong
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          An unexpected error occurred. Please try reloading the page or return home.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="btn fill sm"
          >
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}

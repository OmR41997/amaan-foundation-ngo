import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-8 shadow-lg sm:p-12 max-w-md w-full">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--mint)] text-[var(--green)] shadow-inner">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="mt-4 text-xs font-bold tracking-widest text-[var(--primary)] uppercase">
          404 &bull; Page Not Found
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--ink)] sm:text-3xl" style={{ fontFamily: "var(--disp)" }}>
          Lost in Service
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          The page you are looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="btn fill sm"
          >
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

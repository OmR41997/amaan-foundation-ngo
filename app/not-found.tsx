import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-3xl border border-[var(--line)] bg-white p-8 shadow-sm sm:p-12 max-w-md w-full">
        <p className="text-sm font-semibold tracking-widest text-[var(--primary)] uppercase">
          404 &bull; Page Not Found
        </p>
        <h1 className="mt-4 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-[#185887]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

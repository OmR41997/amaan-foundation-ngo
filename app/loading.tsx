export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--line)] border-t-[var(--primary)]" />
        <p className="text-xs font-medium tracking-wider text-[var(--muted)] uppercase">
          Loading...
        </p>
      </div>
    </div>
  );
}

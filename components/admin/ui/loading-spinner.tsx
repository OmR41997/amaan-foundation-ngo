export function LoadingSpinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#d7e4ef] border-t-[#1f6fa8]" />
      <p className="text-sm text-[#6b7c8f]">{label}</p>
    </div>
  );
}

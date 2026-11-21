import type { MembershipType, RequestStatus } from "@/lib/api/types";

const statusStyles: Record<RequestStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-rose-100 text-rose-800 border-rose-200",
};

const membershipStyles: Record<MembershipType, string> = {
  temporary: "bg-sky-100 text-sky-800 border-sky-200",
  lifetime: "bg-violet-100 text-violet-800 border-violet-200",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export function MembershipBadge({ type }: { type: MembershipType }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase ${membershipStyles[type]}`}
    >
      {type}
    </span>
  );
}

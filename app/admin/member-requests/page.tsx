"use client";

import { MemberRequestsTable } from "@/components/admin/member-requests/member-requests-table";
import { AdminShell } from "@/components/admin/layout/admin-shell";
import type { RequestStatus } from "@/lib/api/types";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function MemberRequestsContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") as RequestStatus | null;

  return (
    <MemberRequestsTable
      title=""
      initialStatus={status && ["pending", "approved", "rejected"].includes(status) ? status : undefined}
    />
  );
}

export default function MemberRequestsPage() {
  return (
    <AdminShell title="All Requests" showSidebarToggle={false}>
      <Suspense fallback={<div className="py-10 text-center text-sm text-[#6b7c8f]">Loading...</div>}>
        <MemberRequestsContent />
      </Suspense>
    </AdminShell>
  );
}

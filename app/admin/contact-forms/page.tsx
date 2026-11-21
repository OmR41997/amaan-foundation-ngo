"use client";

import { MemberRequestsTable } from "@/components/admin/member-requests/member-requests-table";
import { AdminShell } from "@/components/admin/layout/admin-shell";

export default function ContactFormsPage() {
  return (
    <AdminShell title="Contact Forms">
      <MemberRequestsTable title="Contact Form Submissions" />
    </AdminShell>
  );
}

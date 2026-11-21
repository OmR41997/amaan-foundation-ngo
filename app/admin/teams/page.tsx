"use client";

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { TeamsTable } from "@/components/admin/teams/teams-table";

export default function TeamsPage() {
  return (
    <AdminShell title="Teams Management">
      <TeamsTable />
    </AdminShell>
  );
}

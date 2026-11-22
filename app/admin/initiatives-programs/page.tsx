"use client";

import { InitiativesProgramsTable } from "@/components/admin/initiatives-programs/initiatives-programs-table";
import { AdminShell } from "@/components/admin/layout/admin-shell";

export default function InitiativesProgramsPage() {
  return (
    <AdminShell title="Initiatives & Programs Management">
      <InitiativesProgramsTable />
    </AdminShell>
  );
}

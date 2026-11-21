"use client";

import { DashboardOverview } from "@/components/admin/dashboard/dashboard-overview";
import { AdminShell } from "@/components/admin/layout/admin-shell";
import { Suspense } from "react";

export default function AdminDashboardExplicitPage() {
  return (
    <AdminShell title="Dashboard Overview" showSidebarToggle={false}>
      <Suspense
        fallback={
          <div className="py-12 text-center text-sm text-[#6b7c8f]">
            Loading dashboard...
          </div>
        }
      >
        <DashboardOverview />
      </Suspense>
    </AdminShell>
  );
}

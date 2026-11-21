"use client";

import { AdminBreadcrumbs } from "@/components/admin/layout/admin-breadcrumbs";
import { AdminHeader } from "@/components/admin/layout/admin-header";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";
import { ToastContainer } from "@/components/admin/ui/toast-container";
import { useAuth } from "@/contexts/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard Overview",
  "/admin/dashboard": "Dashboard Overview",
  "/admin/member-requests": "Member Requests",
  "/admin/teams": "Teams Management",
  "/admin/gallery": "Gallery Management",
  "/admin/change-password": "Change Password",
};

export function AdminShell({
  children,
  title,
  showSidebarToggle = false,
}: {
  children: React.ReactNode;
  title?: string;
  showSidebarToggle?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const resolvedTitle = title ?? pageTitles[pathname] ?? "Admin Panel";

  useEffect(() => {
    document.documentElement.dataset.theme = "light";
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7fbff]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#d7e4ef] border-t-[#1f6fa8]" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-[#f7fbff]">
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition md:hidden ${
          mobileOpen ? "visible" : "invisible opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-20 transition-transform md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Suspense fallback={<div className="w-52 bg-[#0f2235]" />}>
          <AdminSidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
            onCloseMobile={() => setMobileOpen(false)}
          />
        </Suspense>
      </div>

      <div className={`flex min-w-0 flex-1 flex-col md:transition-all ${sidebarCollapsed ? "md:ml-16" : "md:ml-52"}`}>
        <AdminHeader
          title={resolvedTitle}
          onMenuClick={() => setMobileOpen((v) => !v)}
          onToggleSidebar={showSidebarToggle ? () => setSidebarCollapsed((v) => !v) : undefined}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 p-3 sm:p-4 md:p-4">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <AdminBreadcrumbs />
          </div>
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}

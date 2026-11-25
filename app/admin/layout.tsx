import { AuthProvider } from "@/contexts/auth-context";
import { ToastProvider } from "@/contexts/toast-context";
import { AdminOfflineGuard } from "@/components/admin/admin-offline-guard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="light" data-admin-panel className="admin-scope admin-theme min-h-screen text-[#0f172a] bg-[#f7fbff]">
      <AdminOfflineGuard>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </AdminOfflineGuard>
    </div>
  );
}

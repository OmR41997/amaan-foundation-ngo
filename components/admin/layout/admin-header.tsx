"use client";

import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

interface AdminHeaderProps {
  onMenuClick: () => void;
  title: string;
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

export function AdminHeader({
  onMenuClick,
  title,
  onToggleSidebar,
  sidebarCollapsed,
}: AdminHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#d7e4ef] bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-[#d7e4ef] bg-white p-2 text-[#526477] shadow-xs transition hover:border-[#1f6fa8]/30 hover:bg-[#f0f6fb] hover:text-[#1f6fa8] active:scale-95 md:hidden"
          aria-label="Open sidebar menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        {/* Desktop sidebar toggle button */}
        {onToggleSidebar ? (
          <button
            type="button"
            onClick={onToggleSidebar}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="group hidden h-9 w-9 items-center justify-center rounded-lg border border-[#d7e4ef] bg-white text-[#526477] shadow-xs transition-all duration-150 hover:border-[#1f6fa8]/40 hover:bg-[#f0f6fb] hover:text-[#1f6fa8] active:scale-95 md:inline-flex"
          >
            <svg
              className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-105"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              {sidebarCollapsed ? (
                <polyline points="13 9 16 12 13 15" />
              ) : (
                <polyline points="16 9 13 12 16 15" />
              )}
            </svg>
          </button>
        ) : null}

        <h1 className="text-lg font-bold text-[#143046] md:text-xl truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-[#143046]">{user?.email}</p>
          <p className="text-[11px] capitalize text-[#6b7c8f]">{user?.role ?? "admin"}</p>
        </div>
        <Link
          href="/admin/change-password"
          className="rounded-lg border border-[#d7e4ef] bg-white px-3 py-2 text-xs font-semibold text-[#143046] transition hover:bg-[#f0f6fb] hover:text-[#1f6fa8] flex items-center gap-1.5"
          title="Change Password"
        >
          <svg className="h-4 w-4 text-[#1f6fa8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span className="hidden md:inline">Password</span>
        </Link>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg bg-[#143046] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#1f6fa8] shadow-xs"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

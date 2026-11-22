"use client";

import { adminNavSections } from "@/components/admin/config/sidebar-nav";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function NavIcon({ name }: { name?: string }) {
  const common = "h-4 w-4 shrink-0";
  switch (name) {
    case "dashboard":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "requests":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case "teams":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case "gallery":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case "initiatives":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "settings":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

function isActive(pathname: string, href?: string, searchParams?: URLSearchParams) {
  if (!href) return false;
  const [path, query] = href.split("?");

  if (path === "/admin") {
    return pathname === "/admin" || pathname === "/admin/dashboard";
  }

  if (pathname !== path && !pathname.startsWith(path + "/")) {
    return false;
  }

  if (query && searchParams) {
    const expected = new URLSearchParams(query);
    for (const [key, value] of expected.entries()) {
      if (searchParams.get(key) !== value) return false;
    }
    return pathname === path || pathname.startsWith(path);
  }

  if (href.includes("?")) return false;
  return pathname === path || pathname.startsWith(path + "/");
}

export interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
  onRefresh?: () => void;
}

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  onCloseMobile,
  onRefresh,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    if (onRefresh) {
      try {
        onRefresh();
      } catch (err) {
        console.error("Refresh error:", err);
      }
      setTimeout(() => setIsRefreshing(false), 600);
      return;
    }

    try {
      router.refresh();
      window.dispatchEvent(new CustomEvent("admin-refresh"));
    } catch {
      // ignore
    }

    setTimeout(() => {
      window.location.reload();
    }, 250);
  };

  return (
    <aside
      className={`flex h-screen flex-col border-r border-white/10 bg-gradient-to-b from-[#091a2a] via-[#0f2235] to-[#0a1622] text-white shadow-2xl transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-52"
      }`}
    >
      {/* Brand Header */}
      <div className={`border-b border-white/10 px-3 py-3.5 ${collapsed ? "px-2" : "px-3.5"}`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`flex shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white shadow-xs ${
                collapsed ? "h-9 w-9 p-0.5" : "h-10 w-10 p-1"
              }`}
            >
              <Image
                src="/images/logo/TransparentLogo.png"
                alt="Amaan Ansari Welfare Foundation logo"
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="font-bold tracking-tight text-sm text-white truncate">Amid Admin</p>
                <p className="text-[10px] font-medium text-white/50 truncate">NGO Management</p>
              </div>
            ) : null}
          </div>

          {!collapsed ? (
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh Admin Panel"
              aria-label="Refresh admin panel"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition active:scale-95 disabled:opacity-50"
            >
              <svg
                className={`h-4 w-4 ${isRefreshing ? "animate-spin text-sky-400" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {adminNavSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.heading && !collapsed ? (
              <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-wider text-white/40">
                {section.heading}
              </p>
            ) : section.heading && collapsed ? (
              <div className="my-1.5 border-t border-white/10" />
            ) : null}

            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href, searchParams);
                const baseClass = `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                  active
                    ? "bg-[#1f6fa8] text-white shadow-sm font-semibold"
                    : item.disabled
                      ? "cursor-not-allowed text-white/30"
                      : "text-white/70 hover:bg-white/8 hover:text-white"
                } ${collapsed ? "justify-center px-2" : ""}`;

                const content = (
                  <>
                    <NavIcon name={item.icon} />
                    {!collapsed ? (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge ? (
                          <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px]">
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    ) : null}
                  </>
                );

                return (
                  <li key={item.label}>
                    {item.href && !item.disabled ? (
                      <Link
                        href={item.href}
                        onClick={onCloseMobile}
                        className={baseClass}
                        title={collapsed ? item.label : undefined}
                      >
                        {content}
                      </Link>
                    ) : (
                      <span className={baseClass} title={item.label}>
                        {content}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer: Web Portal Link & Collapse Feature */}
      <div className="mt-auto border-t border-white/10 p-2 space-y-1 bg-black/20">
        {/* Link to public Web Portal */}
        <Link
          href="/en"
          target="_blank"
          rel="noopener noreferrer"
          title="Go to Public Web Portal"
          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-300 border border-emerald-500/20 transition group ${
            collapsed ? "justify-center px-2" : ""
          }`}
        >
          <svg
            className="h-4 w-4 shrink-0 text-emerald-400 group-hover:scale-110 transition-transform"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          {!collapsed ? (
            <>
              <span className="truncate">Web Portal</span>
              <svg
                className="ml-auto h-3 w-3 text-emerald-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </>
          ) : null}
        </Link>

        {/* Sidebar Collapse / Expand toggle button */}
        {onToggleCollapse ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`hidden md:flex items-center gap-2.5 w-full rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/50 hover:bg-white/10 hover:text-white transition ${
              collapsed ? "justify-center px-2" : ""
            }`}
          >
            <svg
              className={`h-4 w-4 shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 3v18" />
              <polyline points="15 9 12 12 15 15" />
            </svg>
            {!collapsed ? <span className="truncate">Collapse sidebar</span> : null}
          </button>
        ) : null}
      </div>
    </aside>
  );
}

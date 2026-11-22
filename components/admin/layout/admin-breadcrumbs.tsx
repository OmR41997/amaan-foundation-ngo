"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labelMap: Record<string, string> = {
  admin: "Dashboard",
  dashboard: "Dashboard",
  "member-requests": "All Requests",
  teams: "Teams",
  gallery: "Gallery",
  "initiatives-programs": "Initiatives & Programs",
  "change-password": "Change Password",
  login: "Login",
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const rawSegments = pathname.split("/").filter(Boolean);
  const segments =
    rawSegments.length === 2 && rawSegments[0] === "admin" && rawSegments[1] === "dashboard"
      ? ["admin"]
      : rawSegments;

  const crumbs = segments.map((segment, index) => {
    const href = "/" + rawSegments.slice(0, index + 1).join("/");
    const label = labelMap[segment] ?? segment.replace(/-/g, " ");
    return { href, label, isLast: index === segments.length - 1 };
  });

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-[#6b7c8f]">
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 ? <span>/</span> : null}
            {crumb.isLast ? (
              <span className="font-medium capitalize text-[#143046]">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="capitalize hover:text-[#1f6fa8]">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

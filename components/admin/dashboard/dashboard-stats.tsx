"use client";

import { LoadingSpinner } from "@/components/admin/ui/loading-spinner";
import { useToast } from "@/contexts/toast-context";
import { fetchDashboardStats } from "@/lib/api/member-requests";
import type { DashboardStats } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import Link from "next/link";
import { useEffect, useState } from "react";

const cards = [
  { key: "total" as const, label: "Total Requests", color: "from-[#1f6fa8] to-[#143046]", href: "/admin/member-requests" },
  { key: "pending" as const, label: "Pending", color: "from-amber-500 to-amber-600", href: "/admin/member-requests?status=pending" },
  { key: "approved" as const, label: "Approved", color: "from-emerald-500 to-emerald-600", href: "/admin/member-requests?status=approved" },
  { key: "rejected" as const, label: "Rejected", color: "from-rose-500 to-rose-600", href: "/admin/member-requests?status=rejected" },
];

export function DashboardStats() {
  const { showToast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((res) => setStats(res.data ?? null))
      .catch((err) =>
        showToast(err instanceof ApiError ? err.message : "Failed to load stats", "error"),
      )
      .finally(() => setLoading(false));
  }, [showToast]);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Link
          key={card.key}
          href={card.href}
          className={`rounded-2xl bg-gradient-to-br ${card.color} p-5 text-white shadow-lg transition hover:scale-[1.02]`}
        >
          <p className="text-sm text-white/80">{card.label}</p>
          <p className="mt-2 text-4xl font-bold">{stats?.[card.key] ?? 0}</p>
        </Link>
      ))}
    </div>
  );
}

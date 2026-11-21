"use client";

import { LoadingSpinner } from "@/components/admin/ui/loading-spinner";
import { useToast } from "@/contexts/toast-context";
import { fetchDashboardOverview } from "@/lib/api/dashboard";
import type { DashboardOverviewData } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export function DashboardOverview() {
  const { showToast } = useToast();
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const res = await fetchDashboardOverview();
        if (res.data) {
          setData(res.data);
          if (isManualRefresh) {
            showToast("Dashboard overview refreshed", "success");
          }
        }
      } catch (err) {
        showToast(
          err instanceof ApiError ? err.message : "Failed to load dashboard data",
          "error",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && !data) {
    return <LoadingSpinner label="Loading dashboard records overview..." />;
  }

  const { members, assets, team, cloudinary, system, recentRequests } = data ?? {
    members: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      temporary: 0,
      lifetime: 0,
      recentCount: 0,
    },
    assets: {
      totalAssets: 0,
      uploadsCount: 0,
      galleryCount: 0,
      totalSizeBytes: 0,
      totalSizeFormatted: "0 B",
      byMediaType: { image: 0, video: 0, other: 0 },
      galleryPublished: 0,
      galleryUnpublished: 0,
    },
    team: {
      total: 0,
      rolesCount: 0,
      districtsCount: 0,
      statesCount: 0,
      rolesBreakdown: [],
    },
    cloudinary: {
      connected: false,
      isLive: false,
      cloudName: "Not Configured",
      plan: "Free Tier",
      credits: { usage: 0, limit: 25, remaining: 25, percentUsed: 0 },
      storage: {
        usedBytes: 0,
        usedFormatted: "0 B",
        limitBytes: 25 * 1024 * 1024 * 1024,
        limitFormatted: "25 GB",
        remainingBytes: 25 * 1024 * 1024 * 1024,
        remainingFormatted: "25 GB",
        percentUsed: 0,
      },
      objects: { storedFiles: 0, galleryFiles: 0, memberPhotos: 0, uploadFiles: 0 },
      bandwidth: { usedBytes: 0, usedFormatted: "0 B", creditsUsage: 0 },
      transformations: { usage: 0, creditsUsage: 0 },
    },
    system: {
      totalVisitors: 0,
      topSources: [],
      serverUptimeSeconds: 0,
      nodeEnv: "development",
    },
    recentRequests: [],
  };

  const approvedRate =
    members.total > 0
      ? Math.round((members.approved / members.total) * 100)
      : 0;

  const creditsPercent = cloudinary.credits.percentUsed ?? 0;
  const storagePercent = cloudinary.storage.percentUsed ?? 0;

  return (
    <div className="space-y-6">
      {/* Top Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Platform Overview
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#d7e4ef] bg-white px-3 py-1.5 text-xs font-semibold text-[#143046] shadow-2xs transition hover:bg-[#f8fafc] hover:border-[#1f6fa8] active:scale-95 disabled:opacity-50"
          >
            <svg
              className={`h-3.5 w-3.5 text-[#1f6fa8] ${refreshing ? "animate-spin" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{refreshing ? "Refreshing..." : "Refresh Stats"}</span>
          </button>

          <Link
            href="/admin/member-requests"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f6fa8] px-3.5 py-1.5 text-xs font-semibold !text-white text-white shadow-2xs transition hover:bg-[#143046] hover:!text-white active:scale-95"
          >
            <span className="!text-white text-white">Review Requests</span>
            <span
              className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                members.pending > 0
                  ? "bg-amber-400 !text-slate-900"
                  : "bg-white/20 !text-white text-white"
              }`}
            >
              {members.pending}
            </span>
          </Link>
        </div>
      </div>

      {/* 3 Core KPI Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Members Card */}
        <Link
          href="/admin/member-requests"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#d7e4ef] bg-white p-5 shadow-xs transition hover:border-[#1f6fa8] hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7c8f]">
                Total Members
              </p>
              <p className="mt-1 text-3xl font-extrabold text-[#143046]">
                {members.total}
              </p>
            </div>
            <div className="rounded-xl bg-[#1f6fa8]/10 p-2.5 text-[#1f6fa8] transition group-hover:bg-[#1f6fa8] group-hover:text-white">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          <div className="mt-4 border-t border-[#edf2f7] pt-3 text-xs text-[#6b7c8f]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {members.approved} Approved
              </span>
              <span className="flex items-center gap-1 font-medium text-amber-600">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {members.pending} Pending
              </span>
              <span className="flex items-center gap-1 font-medium text-rose-600">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                {members.rejected} Rejected
              </span>
            </div>
          </div>
        </Link>

        {/* Team Card */}
        <Link
          href="/admin/teams"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#d7e4ef] bg-white p-5 shadow-xs transition hover:border-[#1f6fa8] hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7c8f]">
                Team Personnel
              </p>
              <p className="mt-1 text-3xl font-extrabold text-[#143046]">
                {team.total}
              </p>
            </div>
            <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          <div className="mt-4 border-t border-[#edf2f7] pt-3 text-xs text-[#6b7c8f]">
            <div className="flex items-center justify-between">
              <span>{team.rolesCount} Defined roles</span>
              <span>
                {team.statesCount} States / {team.districtsCount} Districts
              </span>
            </div>
          </div>
        </Link>

        {/* Cloudinary Storage & Credits Card */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#d7e4ef] bg-white p-5 shadow-xs transition hover:border-[#1f6fa8] hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6b7c8f]">
                Cloudinary Storage & Credits
              </p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#143046]">
                  {cloudinary.objects.storedFiles}
                </span>
                <span className="text-xs font-medium text-[#6b7c8f]">stored files</span>
              </div>
            </div>
            <div className="rounded-xl bg-sky-500/10 p-2.5 text-sky-600 transition group-hover:bg-sky-600 group-hover:text-white">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
          </div>

          <div className="mt-3 border-t border-[#edf2f7] pt-2.5 text-xs text-[#6b7c8f] space-y-1.5">
            <div className="flex items-center justify-between">
              <span>Credits:</span>
              <span className="font-semibold text-[#143046]">
                {cloudinary.credits.remaining} / {cloudinary.credits.limit} Left ({creditsPercent}% used)
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${creditsPercent >= 90
                  ? "bg-rose-500"
                  : creditsPercent >= 70
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                  }`}
                style={{ width: `${Math.min(100, Math.max(3, creditsPercent))}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span>Used: {cloudinary.storage.usedFormatted}</span>
              <span className="font-medium text-emerald-600">
                {cloudinary.storage.remainingFormatted} Free
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED RECORD SECTIONS GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* MEMBERS DETAILED BREAKDOWN */}
        <div className="rounded-2xl border border-[#d7e4ef] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#edf2f7] pb-3.5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#1f6fa8]/10 p-1.5 text-[#1f6fa8]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#143046]">Members Status</h3>
            </div>
            <Link
              href="/admin/member-requests"
              className="text-xs font-semibold text-[#1f6fa8] hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="mt-4 space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-emerald-700">Approved Members</span>
                <span className="font-bold text-[#143046]">
                  {members.approved} ({approvedRate}%)
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${approvedRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-amber-700">Pending Review</span>
                <span className="font-bold text-[#143046]">
                  {members.pending}
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{
                    width: `${members.total > 0
                      ? (members.pending / members.total) * 100
                      : 0
                      }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-rose-700">Rejected Requests</span>
                <span className="font-bold text-[#143046]">
                  {members.rejected}
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-rose-500"
                  style={{
                    width: `${members.total > 0
                      ? (members.rejected / members.total) * 100
                      : 0
                      }%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-[#4b5563]">
              <div className="flex justify-between py-1">
                <span>Lifetime Memberships:</span>
                <span className="font-semibold text-[#143046]">
                  {members.lifetime}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Temporary Memberships:</span>
                <span className="font-semibold text-[#143046]">
                  {members.temporary}
                </span>
              </div>
              <div className="flex justify-between py-1 border-t border-slate-200 mt-1 pt-1">
                <span>Recent Applications (30d):</span>
                <span className="font-bold text-[#1f6fa8]">
                  +{members.recentCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TEAM & ORGANISATION BREAKDOWN */}
        <div className="rounded-2xl border border-[#d7e4ef] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#edf2f7] pb-3.5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 p-1.5 text-blue-600">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#143046]">Team Roster</h3>
            </div>
            <Link
              href="/admin/teams"
              className="text-xs font-semibold text-[#1f6fa8] hover:underline"
            >
              Teams →
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-slate-50 p-3 text-xs">
              <p className="font-semibold text-[#143046] mb-2">Team Roles Distribution</p>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {team.rolesBreakdown.length > 0 ? (
                  team.rolesBreakdown.map((r) => (
                    <div
                      key={r.role}
                      className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 shadow-2xs text-[11px]"
                    >
                      <span className="font-medium text-[#334155] truncate max-w-[150px]">
                        {r.role}
                      </span>
                      <span className="rounded-full bg-[#1f6fa8]/10 px-2 py-0.5 font-bold text-[#1f6fa8]">
                        {r.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[#6b7c8f] py-2">No roles created yet</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-slate-100 p-2.5 text-center">
                <span className="text-[10px] text-[#6b7c8f]">States</span>
                <p className="font-bold text-lg text-[#143046]">{team.statesCount}</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-2.5 text-center">
                <span className="text-[10px] text-[#6b7c8f]">Districts</span>
                <p className="font-bold text-lg text-[#143046]">{team.districtsCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT MEMBERSHIP APPLICATIONS TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#d7e4ef] bg-white shadow-xs">
        <div className="flex flex-col justify-between gap-3 border-b border-[#edf2f7] p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1f6fa8]/10 text-[#1f6fa8]">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-[#143046]">Recent Membership Applications</h3>
              <p className="text-xs text-[#6b7c8f]">Latest membership requests submitted through the portal</p>
            </div>
          </div>

          <Link
            href="/admin/member-requests"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1f6fa8] hover:text-[#143046] transition"
          >
            <span>View All Requests</span>
            <span>→</span>
          </Link>
        </div>

        {recentRequests && recentRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#edf2f7] bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-[#6b7c8f]">
                <tr>
                  <th className="px-5 py-3">Applicant</th>
                  <th className="px-5 py-3">City</th>
                  <th className="px-5 py-3">Mobile</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Applied On</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf2f7]">
                {recentRequests.map((req) => (
                  <tr key={req.id} className="transition hover:bg-slate-50/50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1f6fa8]/10 text-xs font-bold text-[#1f6fa8]">
                          {req.name ? req.name.charAt(0).toUpperCase() : "M"}
                        </div>
                        <span className="font-semibold text-[#143046]">{req.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#4b5563]">{req.city || "—"}</td>
                    <td className="px-5 py-3.5 text-[#4b5563] font-mono text-[11px]">
                      {req.mobile || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${req.membershipType === "lifetime"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                          }`}
                      >
                        {req.membershipType === "lifetime" ? "Lifetime" : "Temporary"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#6b7c8f]">
                      {new Date(req.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${req.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : req.status === "rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                          }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${req.status === "approved"
                            ? "bg-emerald-500"
                            : req.status === "rejected"
                              ? "bg-rose-500"
                              : "bg-amber-500"
                            }`}
                        />
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href="/admin/member-requests"
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-[#143046] transition hover:bg-[#1f6fa8] hover:text-white"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#6b7c8f]">
            No recent member requests recorded yet.
          </div>
        )}
      </div>

      {/* WEBSITE VISITORS & TRAFFIC */}
      <div className="rounded-2xl border border-[#d7e4ef] bg-white p-5 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#edf2f7] pb-3">
          <div className="h-7 w-7 rounded-lg bg-[#1f6fa8]/10 p-1 text-[#1f6fa8]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h3 className="font-bold text-[#143046]">Website Visitors & Engagement</h3>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <span className="text-xs font-medium text-[#6b7c8f]">Total Website Visitors</span>
            <p className="mt-1 text-2xl font-bold text-[#143046]">
              {system.totalVisitors.toLocaleString()}
            </p>
            <p className="mt-1 text-[11px] text-[#6b7c8f]">Cumulative views across public portal</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <span className="text-xs font-medium text-[#6b7c8f]">Top Referral Domain</span>
            <p className="mt-1 text-base font-bold text-[#143046] truncate">
              {system.topSources[0]?.source ?? "Direct / Organic Traffic"}
            </p>
            <p className="mt-1 text-[11px] text-[#6b7c8f]">
              {system.topSources[0]?.viewCount ?? 0} tracked sessions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

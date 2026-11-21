"use client";

import { MemberRequestEditModal } from "@/components/admin/member-requests/member-request-edit-modal";
import { MemberRequestDetailModal } from "@/components/admin/member-requests/member-request-detail-modal";
import { MembershipBadge } from "@/components/admin/ui/status-badge";
import { Pagination } from "@/components/admin/ui/pagination";
import { LoadingSpinner } from "@/components/admin/ui/loading-spinner";
import { useToast } from "@/contexts/toast-context";
import {
  approveMemberRequest,
  deleteMemberRequest,
  fetchMemberRequests,
  rejectMemberRequest,
} from "@/lib/api/member-requests";
import type { MemberRequest, MembershipType, PaginationMeta, RequestStatus } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { useCallback, useEffect, useState } from "react";

interface MemberRequestsTableProps {
  title: string;
  initialStatus?: RequestStatus;
}

const COMMON_REJECTION_REASONS = [
  "Incomplete Address",
  "Invalid Aadhaar No.",
  "Photo Not Clear",
  "Duplicate Application",
  "Information Mismatch",
];

export function MemberRequestsTable({
  title,
  initialStatus,
}: MemberRequestsTableProps) {
  const { showToast } = useToast();
  const [items, setItems] = useState<MemberRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [prevInitialStatus, setPrevInitialStatus] = useState(initialStatus);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "">(
    initialStatus ?? "",
  );

  if (initialStatus !== prevInitialStatus) {
    setPrevInitialStatus(initialStatus);
    setStatusFilter(initialStatus ?? "");
    setPage(1);
  }

  const [membershipFilter, setMembershipFilter] = useState<MembershipType | "">("");
  const [editingRecord, setEditingRecord] = useState<MemberRequest | null>(null);
  const [viewingRecord, setViewingRecord] = useState<MemberRequest | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Reject Modal state
  const [rejectTarget, setRejectTarget] = useState<MemberRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  // Delete Confirm Modal state
  const [deleteTarget, setDeleteTarget] = useState<MemberRequest | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true);
    }
    try {
      const res = await fetchMemberRequests({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter || undefined,
        membershipType: membershipFilter || undefined,
      });
      setItems(res.data ?? []);
      setMeta(res.meta);
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Failed to load requests",
        "error",
      );
    } finally {
      if (!options?.silent) {
        setLoading(false);
      }
    }
  }, [page, search, statusFilter, membershipFilter, showToast]);

  useEffect(() => {
    let ignore = false;
    fetchMemberRequests({
      page,
      limit: 10,
      search: search || undefined,
      status: statusFilter || undefined,
      membershipType: membershipFilter || undefined,
    })
      .then((res) => {
        if (!ignore) {
          setItems(res.data ?? []);
          setMeta(res.meta);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          showToast(
            err instanceof ApiError ? err.message : "Failed to load requests",
            "error",
          );
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [page, search, statusFilter, membershipFilter, showToast]);

  useEffect(() => {
    const refresh = () => {
      void load({ silent: true });
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "member-requests-updated") {
        refresh();
      }
    };

    const channel = typeof window !== "undefined" && "BroadcastChannel" in window
      ? new BroadcastChannel("member-requests")
      : null;

    window.addEventListener("focus", refresh);
    window.addEventListener("storage", handleStorage);
    channel?.addEventListener("message", refresh);

    const intervalId = window.setInterval(refresh, 15000);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", handleStorage);
      channel?.removeEventListener("message", refresh);
      channel?.close();
      window.clearInterval(intervalId);
    };
  }, [load]);

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      const res = await approveMemberRequest(id);
      showToast("Request approved successfully", "success");

      // Optimistically update list
      setItems((prev) =>
        prev.map((it) =>
          it.id === id
            ? {
                ...it,
                status: "approved",
                approvalDate: res.data?.approvalDate ?? new Date().toISOString(),
                expiryDate: res.data?.expiryDate ?? it.expiryDate,
                rejectionReason: null,
                rejectedAt: null,
              }
            : it,
        ),
      );

      // Also update viewing record if open
      setViewingRecord((prev) =>
        prev && prev.id === id
          ? {
              ...prev,
              status: "approved",
              approvalDate: res.data?.approvalDate ?? new Date().toISOString(),
              expiryDate: res.data?.expiryDate ?? prev.expiryDate,
              rejectionReason: null,
              rejectedAt: null,
            }
          : prev,
      );

      void load({ silent: true });
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Approval failed", "error");
    } finally {
      setActionId(null);
    }
  };

  const openRejectModal = (record: MemberRequest) => {
    setRejectTarget(record);
    setRejectReason(record.rejectionReason || "");
  };

  const handleConfirmReject = async () => {
    if (!rejectTarget) return;
    const id = rejectTarget.id;
    const reason = rejectReason.trim() || undefined;

    setRejectLoading(true);
    setActionId(id);
    try {
      const res = await rejectMemberRequest(id, reason);
      showToast("Request rejected", "success");

      // Optimistically update list
      setItems((prev) =>
        prev.map((it) =>
          it.id === id
            ? {
                ...it,
                status: "rejected",
                rejectionReason: reason ?? null,
                rejectedAt: res.data?.rejectedAt ?? new Date().toISOString(),
                approvalDate: null,
                expiryDate: null,
              }
            : it,
        ),
      );

      // Also update viewing record if open
      setViewingRecord((prev) =>
        prev && prev.id === id
          ? {
              ...prev,
              status: "rejected",
              rejectionReason: reason ?? null,
              rejectedAt: res.data?.rejectedAt ?? new Date().toISOString(),
              approvalDate: null,
              expiryDate: null,
            }
          : prev,
      );

      setRejectTarget(null);
      void load({ silent: true });
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Rejection failed", "error");
    } finally {
      setRejectLoading(false);
      setActionId(null);
    }
  };

  const openDeleteModal = (record: MemberRequest) => {
    setDeleteTarget(record);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;

    setDeleteLoading(true);
    setActionId(id);
    try {
      await deleteMemberRequest(id);
      showToast("Request deleted successfully", "success");

      setItems((prev) => prev.filter((it) => it.id !== id));
      if (viewingRecord?.id === id) {
        setViewingRecord(null);
      }
      if (editingRecord?.id === id) {
        setEditingRecord(null);
      }
      setDeleteTarget(null);
      void load({ silent: true });
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Delete failed", "error");
    } finally {
      setDeleteLoading(false);
      setActionId(null);
    }
  };

  const formatDate = (value: string | null) => {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return value;
    }
  };

  const getFullAddress = (row: MemberRequest) => {
    return [
      row.currentAddress,
      row.tehsil ? `Tehsil: ${row.tehsil}` : "",
      row.district,
      row.state,
      row.pinCode ? `PIN: ${row.pinCode}` : "",
    ]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-[#143046]">
          {title || "Member Requests"}
        </h2>
      </div>

      <div className="grid gap-3 rounded-2xl border border-[#d7e4ef] bg-white p-4 md:grid-cols-4">
        <input
          type="search"
          placeholder="Search name, mobile, Application No., aadhaar..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-[#d7e4ef] px-3 py-2 text-sm outline-none focus:border-[#1f6fa8] md:col-span-2"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as RequestStatus | "");
            setPage(1);
          }}
          className="rounded-xl border border-[#d7e4ef] px-3 py-2 text-sm uppercase"
        >
          <option value="">ALL STATUSES</option>
          <option value="pending">PENDING</option>
          <option value="approved">APPROVED</option>
          <option value="rejected">REJECTED</option>
        </select>
        <select
          value={membershipFilter}
          onChange={(e) => {
            setMembershipFilter(e.target.value as MembershipType | "");
            setPage(1);
          }}
          className="rounded-xl border border-[#d7e4ef] px-3 py-2 text-sm uppercase"
        >
          <option value="">ALL MEMBERSHIP TYPES</option>
          <option value="temporary">TEMPORARY</option>
          <option value="lifetime">LIFETIME</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#d7e4ef] bg-white shadow-sm">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-xs text-[#1e293b] divide-y divide-[#e2e8f0]">
                <thead className="bg-[#f3f9ff] text-[11px] uppercase tracking-wider text-[#6b7c8f]">
                  <tr>
                    <th className="px-3.5 py-3 whitespace-nowrap">Photo</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">App.No.</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Name</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Mobile</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Location / Address</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Membership</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Date</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Status / Decision</th>
                    <th className="px-3.5 py-3 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] text-[#1e293b]">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-10 text-center text-[#6b7c8f]">
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    items.map((row) => (
                      <tr key={row.id} className="hover:bg-[#f8fbfe] transition-colors">
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          {row.photoUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={row.photoUrl}
                              alt={row.name}
                              onClick={() => setPreviewImage(row.photoUrl!)}
                              className="h-9 w-9 cursor-pointer rounded-full object-cover border border-[#cbd5e1] shadow-2xs transition hover:scale-110"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=User";
                              }}
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#cbd5e1] bg-[#f1f5f9] text-[#94a3b8]">
                              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          )}
                        </td>
                        <td className="px-3.5 py-2.5 whitespace-nowrap font-mono text-xs font-semibold text-[#475569]">
                          {row.referenceNo || "—"}
                        </td>
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          <span
                            onClick={() => setViewingRecord(row)}
                            className="inline-block max-w-[150px] truncate font-semibold text-[#0f172a] hover:text-[#1f6fa8] cursor-pointer transition capitalize align-middle"
                            title={row.name}
                          >
                            {row.name}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 whitespace-nowrap font-mono text-xs text-[#334155]">
                          {row.mobile}
                        </td>

                        {/* Short Address Column with Location Pin and Tooltip */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          <div
                            title={getFullAddress(row)}
                            className="flex items-center gap-1.5 max-w-[170px] cursor-help"
                          >
                            <svg className="h-3.5 w-3.5 text-[#1f6fa8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div className="flex flex-col min-w-0">
                              <span className="truncate text-xs font-semibold text-[#0f172a] capitalize">
                                {row.district || row.city || "—"}
                              </span>
                              {row.state && (
                                <span className="truncate text-[10px] text-[#64748b] capitalize">
                                  {row.state}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          <MembershipBadge type={row.membershipType} />
                        </td>

                        {/* Pretty Date Column */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1.5 font-semibold text-[#0f172a] text-xs">
                              <svg className="h-3.5 w-3.5 text-[#1f6fa8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(row.createdAt)}
                            </span>
                            {row.membershipType === "lifetime" ? (
                              <span className="text-[10px] font-medium text-violet-600 pl-5">
                                Lifetime
                              </span>
                            ) : row.expiryDate ? (
                              <span className="text-[10px] text-[#64748b] pl-5">
                                Exp: {formatDate(row.expiryDate)}
                              </span>
                            ) : null}
                          </div>
                        </td>

                        {/* Pretty Approve / Reject Toggle Column */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          <div className="flex flex-col items-start gap-1">
                            {row.status === "pending" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                Pending
                              </span>
                            )}
                            <div className="inline-flex items-center rounded-lg border border-[#cbd5e1] bg-[#f8fafc] p-0.5 shadow-2xs">
                              {/* Approve Button */}
                              <button
                                type="button"
                                disabled={actionId === row.id || row.status === "approved"}
                                onClick={() => handleApprove(row.id)}
                                title={row.status === "approved" ? "Currently Approved" : "Click to Approve"}
                                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-150 ${
                                  row.status === "approved"
                                    ? "bg-emerald-600 text-white shadow-xs cursor-default"
                                    : "text-[#64748b] hover:bg-emerald-50 hover:text-emerald-700 active:scale-95 cursor-pointer"
                                } disabled:opacity-80`}
                              >
                                {actionId === row.id && row.status !== "approved" ? (
                                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                                <span>Approve</span>
                              </button>

                              {/* Reject Button */}
                              <button
                                type="button"
                                disabled={actionId === row.id || row.status === "rejected"}
                                onClick={() => openRejectModal(row)}
                                title={
                                  row.status === "rejected"
                                    ? row.rejectionReason
                                      ? `Reason: ${row.rejectionReason}`
                                      : "Currently Rejected"
                                    : "Click to Reject"
                                }
                                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-150 ${
                                  row.status === "rejected"
                                    ? "bg-rose-600 text-white shadow-xs cursor-default"
                                    : "text-[#64748b] hover:bg-rose-50 hover:text-rose-700 active:scale-95 cursor-pointer"
                                } disabled:opacity-80`}
                              >
                                {actionId === row.id && row.status !== "rejected" ? (
                                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                ) : (
                                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                                  </svg>
                                )}
                                <span>Reject</span>
                              </button>
                            </div>

                            {row.status === "rejected" && row.rejectionReason && (
                              <span
                                title={row.rejectionReason}
                                className="max-w-[150px] truncate text-[10px] normal-case text-rose-600/90 font-medium cursor-help"
                              >
                                Reason: {row.rejectionReason}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions Column (Clean, extra approve/reject buttons removed) */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          <div className="flex min-w-max items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setViewingRecord(row)}
                              title="View Details"
                              aria-label="View record details"
                              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#cbd5e1] bg-white px-2.5 py-1 text-xs font-semibold text-[#334155] shadow-xs hover:border-[#1f6fa8] hover:bg-[#f8fafc] hover:text-[#1f6fa8] transition"
                            >
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>View</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingRecord(row)}
                              title="Edit Record"
                              aria-label="Edit record"
                              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#cbd5e1] bg-white px-2.5 py-1 text-xs font-semibold text-[#1f6fa8] shadow-xs hover:border-[#1f6fa8] hover:bg-[#f0f7fc] transition"
                            >
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              disabled={actionId === row.id}
                              onClick={() => openDeleteModal(row)}
                              aria-label="Delete request"
                              title="Delete Permanently"
                              className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#fecaca] bg-white px-2.5 py-1 text-xs font-semibold text-[#dc2626] shadow-xs hover:bg-[#fef2f2] transition disabled:opacity-50"
                            >
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              meta={meta}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 border-b border-[#e2e8f0] pb-3">
              <div>
                <h3 className="text-base font-bold text-rose-700 flex items-center gap-1.5">
                  <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Reject Member Request
                </h3>
                <p className="mt-0.5 text-xs text-[#64748b]">
                  {rejectTarget.name} ({rejectTarget.referenceNo || "No App.No."})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="rounded-full p-1 text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-3">
              <label className="block text-xs font-semibold text-[#475569]">
                Rejection Reason (Optional):
              </label>

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-1.5">
                {COMMON_REJECTION_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setRejectReason(reason)}
                    className="rounded-md border border-[#cbd5e1] bg-[#f8fafc] px-2 py-0.5 text-[11px] font-medium text-[#475569] hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700 transition"
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason or select a tag above..."
                className="w-full rounded-xl border border-[#cbd5e1] p-3 text-xs text-[#0f172a] outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-[#e2e8f0] pt-3">
              <button
                type="button"
                disabled={rejectLoading}
                onClick={() => setRejectTarget(null)}
                className="rounded-lg border border-[#cbd5e1] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#475569] hover:bg-[#f1f5f9] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={rejectLoading}
                onClick={handleConfirmReject}
                className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-rose-700 transition disabled:opacity-50"
              >
                {rejectLoading ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0f172a]">Delete Member Request?</h3>
                <p className="text-xs text-[#64748b]">
                  Permanently remove {deleteTarget.name}. This cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-[#e2e8f0] pt-3">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-[#cbd5e1] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#475569] hover:bg-[#f1f5f9] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-rose-700 transition disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingRecord ? (
        <MemberRequestDetailModal
          record={viewingRecord}
          isOpen={Boolean(viewingRecord)}
          onClose={() => setViewingRecord(null)}
          onEdit={(r) => setEditingRecord(r)}
          onApprove={handleApprove}
          onReject={(id) => {
            const target = items.find((it) => it.id === id) || viewingRecord;
            if (target) openRejectModal(target);
          }}
        />
      ) : null}

      {editingRecord ? (
        <MemberRequestEditModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSaved={load}
        />
      ) : null}

      {previewImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -right-2 -top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-black"
            >
              ×
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Member"
              className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

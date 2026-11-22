"use client";

import { Pagination } from "@/components/admin/ui/pagination";
import { useToast } from "@/contexts/toast-context";
import {
  createInitiativeProgram,
  deleteInitiativeProgram,
  fetchInitiativesPrograms,
  updateInitiativeProgram,
} from "@/lib/api/initiatives-programs";
import type {
  CreateInitiativesProgramDto,
  InitiativesProgram,
  PaginationMeta,
  UpdateInitiativesProgramDto,
} from "@/lib/api/types";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { InitiativesProgramDetailModal } from "./initiatives-program-detail-modal";
import { InitiativesProgramModal } from "./initiatives-program-modal";

export function InitiativesProgramsTable() {
  const { showToast } = useToast();
  const [items, setItems] = useState<InitiativesProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);

  // Modal and action states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InitiativesProgram | null>(
    null,
  );
  const [viewingItem, setViewingItem] = useState<InitiativesProgram | null>(
    null,
  );
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const isPublishedQuery =
        statusFilter === "published"
          ? ("true" as const)
          : statusFilter === "draft"
            ? ("false" as const)
            : undefined;

      const response = await fetchInitiativesPrograms({
        page,
        limit,
        search: search.trim() || undefined,
        isPublished: isPublishedQuery,
        sortBy: "createdAt",
        order: "desc",
      });

      if (Array.isArray(response.data)) {
        setItems(response.data);
        setMeta(response.meta);
        setTotalPages(response.meta?.totalPages ?? 1);
      } else {
        setItems([]);
        setMeta(undefined);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to load initiative programs.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter, showToast]);

  useEffect(() => {
    let ignore = false;
    const isPublishedQuery =
      statusFilter === "published"
        ? ("true" as const)
        : statusFilter === "draft"
          ? ("false" as const)
          : undefined;

    fetchInitiativesPrograms({
      page,
      limit,
      search: search.trim() || undefined,
      isPublished: isPublishedQuery,
      sortBy: "createdAt",
      order: "desc",
    })
      .then((response) => {
        if (!ignore) {
          if (Array.isArray(response.data)) {
            setItems(response.data);
            setMeta(response.meta);
            setTotalPages(response.meta?.totalPages ?? 1);
          } else {
            setItems([]);
            setMeta(undefined);
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to load initiative programs.";
          showToast(msg, "error");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [page, limit, search, statusFilter, showToast]);

  const handleSave = async (
    data: CreateInitiativesProgramDto | UpdateInitiativesProgramDto,
  ) => {
    if (selectedItem) {
      await updateInitiativeProgram(selectedItem.id, data);
      showToast("Initiative program updated successfully.", "success");
    } else {
      await createInitiativeProgram(data as CreateInitiativesProgramDto);
      showToast("Initiative program created successfully.", "success");
    }
    loadItems();
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;
    setDeleting(true);
    try {
      await deleteInitiativeProgram(deleteItemId);
      showToast("Initiative program deleted successfully.", "success");
      setDeleteItemId(null);
      loadItems();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to delete initiative program.";
      showToast(msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async (item: InitiativesProgram) => {
    setTogglingId(item.id);
    try {
      const newStatus = !item.isPublished;
      await updateInitiativeProgram(item.id, { isPublished: newStatus });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isPublished: newStatus } : i)),
      );
      showToast(
        `Initiative program ${newStatus ? "published" : "moved to draft"}.`,
        "success",
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to toggle status.";
      showToast(msg, "error");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm border border-[#e2e8f0] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <input
              type="text"
              placeholder="Search initiatives..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-[#cbd5e1] pl-9 pr-3.5 py-2 text-xs text-[#0f172a] placeholder-[#94a3b8] outline-none transition focus:border-[#1f6fa8] focus:ring-2 focus:ring-[#1f6fa8]/20"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-[#94a3b8]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-xs text-[#0f172a] outline-none transition focus:border-[#1f6fa8]"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedItem(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1f6fa8] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#185886] transition"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Initiative
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                <th className="py-3 px-4">Photo</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9] text-xs text-[#334155]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#94a3b8]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1f6fa8] border-t-transparent" />
                      <span>Loading initiatives...</span>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#94a3b8]">
                    No initiatives or programs found. Click &quot;Add Initiative&quot; or &quot;Seed Initial Data&quot; to begin.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#f8fafc]/80 transition group"
                  >
                    <td className="py-3 px-4">
                      <div
                        onClick={() => setViewingItem(item)}
                        className="relative h-12 w-16 cursor-pointer overflow-hidden rounded-lg border border-[#e2e8f0] bg-[#f1f5f9]"
                      >
                        {item.photoUrl ? (
                          <Image
                            src={item.photoUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-[#94a3b8]">
                            No photo
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0f172a] max-w-[220px]">
                      <span className="line-clamp-2">{item.title}</span>
                    </td>
                    <td className="py-3 px-4 max-w-[320px] text-[#64748b]">
                      <span className="line-clamp-2">{item.description}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        disabled={togglingId === item.id}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition ${item.isPublished
                          ? "bg-[#ecfdf5] text-[#047857] hover:bg-[#d1fae5]"
                          : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                          }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${item.isPublished ? "bg-[#10b981]" : "bg-[#94a3b8]"
                            }`}
                        />
                        {item.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-[#64748b]">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingItem(item)}
                          className="rounded-lg p-1.5 text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition"
                          title="View Details"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setModalOpen(true);
                          }}
                          className="rounded-lg p-1.5 text-[#1f6fa8] hover:bg-[#f0f9ff] transition"
                          title="Edit Initiative"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteItemId(item.id)}
                          className="rounded-lg p-1.5 text-[#dc2626] hover:bg-[#fef2f2] transition"
                          title="Delete Initiative"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta && totalPages > 1 ? (
          <div className="border-t border-[#e2e8f0] px-4 py-3">
            <Pagination
              meta={meta}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </div>

      {/* Create / Edit Modal */}
      <InitiativesProgramModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        item={selectedItem}
      />

      {/* Details View Modal */}
      <InitiativesProgramDetailModal
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
        item={viewingItem}
      />

      {/* Delete Confirmation Modal */}
      {deleteItemId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-base font-bold text-[#0f172a]">
              Delete Initiative / Program?
            </h3>
            <p className="mt-2 text-xs text-[#64748b] leading-relaxed">
              Are you sure you want to permanently delete this initiative? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteItemId(null)}
                disabled={deleting}
                className="rounded-xl px-4 py-2 text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-[#dc2626] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#b91c1c] transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

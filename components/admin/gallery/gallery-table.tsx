"use client";

import { useToast } from "@/contexts/toast-context";
import {
  createGalleryItem,
  deleteGalleryItem,
  fetchGalleryItems,
  updateGalleryItem,
} from "@/lib/api/gallery";
import type { CreateGalleryDto, GalleryItem, PaginationMeta, UpdateGalleryDto } from "@/lib/api/types";
import { useState, useCallback, useEffect } from "react";
import { GalleryItemModal } from "./gallery-item-modal";
import { GalleryItemDetailModal } from "./gallery-item-detail-modal";
import { Pagination } from "@/components/admin/ui/pagination";

export function GalleryTable() {
  const { showToast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sourceFilter, setSourceFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);

  // Modal and action states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [viewingItem, setViewingItem] = useState<GalleryItem | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [togglingSourceId, setTogglingSourceId] = useState<string | null>(null);

  const loadGalleryItems = useCallback(async () => {
    setLoading(true);
    try {
      const isPublishedQuery =
        statusFilter === "published"
          ? ("true" as const)
          : statusFilter === "draft"
          ? ("false" as const)
          : undefined;

      const sourceQuery =
        sourceFilter === "cloud" || sourceFilter === "local"
          ? (sourceFilter as "local" | "cloud")
          : undefined;

      const response = await fetchGalleryItems({
        page,
        limit,
        search: search.trim() || undefined,
        eventType: eventTypeFilter.trim() || undefined,
        isPublished: isPublishedQuery,
        source: sourceQuery,
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
      const msg = err instanceof Error ? err.message : "Failed to load gallery items.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, eventTypeFilter, statusFilter, sourceFilter, showToast]);

  useEffect(() => {
    let ignore = false;
    const isPublishedQuery =
      statusFilter === "published"
        ? ("true" as const)
        : statusFilter === "draft"
        ? ("false" as const)
        : undefined;

    const sourceQuery =
      sourceFilter === "cloud" || sourceFilter === "local"
        ? (sourceFilter as "local" | "cloud")
        : undefined;

    fetchGalleryItems({
      page,
      limit,
      search: search.trim() || undefined,
      eventType: eventTypeFilter.trim() || undefined,
      isPublished: isPublishedQuery,
      source: sourceQuery,
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
          const msg = err instanceof Error ? err.message : "Failed to load gallery items.";
          showToast(msg, "error");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [page, limit, search, eventTypeFilter, statusFilter, sourceFilter, showToast]);

  const handleCreateOrUpdate = async (
    data: CreateGalleryDto | UpdateGalleryDto,
  ) => {
    if (selectedItem) {
      await updateGalleryItem(selectedItem.id, data as UpdateGalleryDto);
      showToast("Gallery image updated successfully!", "success");
    } else {
      // In frontend isPublished is taken as false when creating
      await createGalleryItem({
        ...(data as CreateGalleryDto),
        isPublished: false,
      });
      showToast("Gallery image added as draft!", "success");
    }
    loadGalleryItems();
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    const nextStatus = !item.isPublished;
    setTogglingId(item.id);
    try {
      await updateGalleryItem(item.id, { isPublished: nextStatus });
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, isPublished: nextStatus } : it)),
      );
      showToast(
        nextStatus ? "Gallery image published live!" : "Gallery image marked as draft.",
        "success",
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update publishing status.";
      showToast(msg, "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleToggleSource = async (item: GalleryItem) => {
    const nextSource = item.source === "local" ? "cloud" : "local";
    setTogglingSourceId(item.id);
    try {
      await updateGalleryItem(item.id, { source: nextSource });
      showToast(`Storage source switched to ${nextSource.toUpperCase()}!`, "success");
      loadGalleryItems();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update source.";
      showToast(msg, "error");
    } finally {
      setTogglingSourceId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;
    setDeleting(true);
    try {
      await deleteGalleryItem(deleteItemId);
      showToast("Gallery image deleted.", "success");
      setDeleteItemId(null);
      loadGalleryItems();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete gallery item.";
      showToast(msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Media & Gallery Management</h1>
          <p className="text-xs text-[#64748b]">
            Manage photo event galleries, drive pictures, and Cloudinary media
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedItem(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f6fa8] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#185887] transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Gallery Image
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-2 rounded-xl border border-[#e2e8f0] bg-white p-2.5 shadow-2xs lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-2.5 h-4 w-4 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by event name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-[#cbd5e1] pl-9 pr-4 py-1.5 text-xs text-[#0f172a] focus:border-[#1f6fa8] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={eventTypeFilter}
            onChange={(e) => {
              setEventTypeFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-[#cbd5e1] px-3 py-1.5 text-xs text-[#0f172a] uppercase focus:border-[#1f6fa8] focus:outline-none"
          >
            <option value="">ALL CATEGORIES</option>
            <option value="General">GENERAL</option>
            <option value="Distribution">DISTRIBUTION</option>
            <option value="Education">EDUCATION</option>
            <option value="Healthcare">HEALTHCARE</option>
            <option value="Awareness">AWARENESS</option>
            <option value="Event">EVENT / PROGRAM</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-[#cbd5e1] px-3 py-1.5 text-xs text-[#0f172a] uppercase focus:border-[#1f6fa8] focus:outline-none"
          >
            <option value="">ALL STATUS</option>
            <option value="published">PUBLISHED (LIVE)</option>
            <option value="draft">DRAFT (HIDDEN)</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-[#cbd5e1] px-3 py-1.5 text-xs text-[#0f172a] uppercase focus:border-[#1f6fa8] focus:outline-none"
          >
            <option value="">ALL SOURCES</option>
            <option value="cloud">CLOUD</option>
            <option value="local">LOCAL</option>
          </select>
        </div>
      </div>

      {/* Gallery Cards Grid View */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e2e8f0] border-t-[#1f6fa8]" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-12 text-center shadow-sm">
          <svg className="mx-auto h-12 w-12 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-[#0f172a]">No Gallery Media Found</h3>
          <p className="mt-1 text-xs text-[#64748b]">
            Upload gallery photos to Cloudinary or local storage to showcase NGO events and drives.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <div
              key={g.id}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-xs transition hover:shadow-md uppercase"
            >
              <div
                onClick={() => setViewingItem(g)}
                className="relative h-28 sm:h-32 lg:h-28 xl:h-32 w-full overflow-hidden bg-[#0f2235] cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.photoUrl}
                  alt={g.eventName}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x225?text=Image+Not+Found";
                  }}
                />

                {/* Event Category Badge */}
                <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                  {g.eventType || "General"}
                </span>

                {/* Source & Published Status Badges */}
                <div className="absolute right-2 top-2 flex items-center gap-1.5 z-10">
                  <button
                    type="button"
                    disabled={togglingSourceId === g.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSource(g);
                    }}
                    title="Click to toggle Storage Source (CLOUD / LOCAL)"
                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm shadow-sm transition hover:scale-105 active:scale-95 ${
                      g.source === "local" ? "bg-purple-600/90 hover:bg-purple-700" : "bg-sky-600/90 hover:bg-sky-700"
                    }`}
                  >
                    {togglingSourceId === g.id ? "..." : g.source === "local" ? "LOCAL" : "CLOUD"}
                  </button>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm shadow-sm ${
                      g.isPublished ? "bg-emerald-600/90" : "bg-amber-600/90"
                    }`}
                  >
                    {g.isPublished ? "PUBLISHED" : "DRAFT"}
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                  <span className="rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    View Details
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    onClick={() => setViewingItem(g)}
                    className="font-bold text-[#0f172a] text-xs line-clamp-1 cursor-pointer hover:text-[#1f6fa8] transition flex-1 uppercase"
                    title={g.eventName}
                  >
                    {g.eventName}
                  </h4>
                  <span className="text-[10px] font-medium text-[#94a3b8] shrink-0">
                    {g.createdAt ? new Date(g.createdAt).toLocaleDateString() : ""}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between border-t border-[#f1f5f9] pt-2">
                  {/* Direct Table Publish Toggle Button */}
                  <button
                    type="button"
                    disabled={togglingId === g.id}
                    onClick={() => handleTogglePublish(g)}
                    title={g.isPublished ? "Click to unpublish" : "Click to publish"}
                    className={`inline-flex h-6 items-center gap-1 rounded-full px-2 text-[10px] font-semibold shadow-2xs transition border ${
                      g.isPublished
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                    } disabled:opacity-50`}
                  >
                    {togglingId === g.id ? (
                      <span className="h-2 w-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          g.isPublished ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                        }`}
                      />
                    )}
                    <span>{g.isPublished ? "Published" : "Draft"}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewingItem(g)}
                      title="View Details"
                      className="inline-flex h-6 items-center gap-1 rounded border border-[#cbd5e1] bg-white px-2 text-[11px] font-semibold text-[#334155] hover:border-[#1f6fa8] hover:bg-[#f8fafc] hover:text-[#1f6fa8] transition"
                    >
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedItem(g);
                        setModalOpen(true);
                      }}
                      title="Edit Gallery Item"
                      className="inline-flex h-6 items-center gap-1 rounded border border-[#cbd5e1] bg-white px-2 text-[11px] font-semibold text-[#1f6fa8] hover:border-[#1f6fa8] hover:bg-[#f0f7fc] transition"
                    >
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteItemId(g.id)}
                      title="Delete Gallery Item"
                      className="inline-flex h-6 items-center gap-1 rounded border border-[#fecaca] bg-white px-2 text-[11px] font-semibold text-[#dc2626] hover:bg-[#fef2f2] transition"
                    >
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-[#e2e8f0] bg-white">
        <Pagination
          meta={meta}
          onPageChange={setPage}
          className="border-t-0 rounded-xl"
        />
      </div>

      {/* Gallery View Detail Modal */}
      <GalleryItemDetailModal
        item={viewingItem}
        isOpen={Boolean(viewingItem)}
        onClose={() => setViewingItem(null)}
        onEdit={(g) => {
          setSelectedItem(g);
          setModalOpen(true);
        }}
      />

      {/* Gallery Create/Edit Modal */}
      <GalleryItemModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleCreateOrUpdate}
        item={selectedItem}
      />

      {/* Delete Confirmation Modal */}
      {deleteItemId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-[#0f172a]">Delete Gallery Media</h3>
            <p className="mt-2 text-xs text-[#64748b]">
              Are you sure you want to delete this gallery entry? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteItemId(null)}
                className="rounded-lg border border-[#cbd5e1] px-3.5 py-1.5 text-xs font-semibold text-[#475569] hover:bg-[#f1f5f9]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="rounded-lg bg-[#dc2626] px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-[#b91c1c] disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

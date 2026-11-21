"use client";

import { EditableCombobox } from "@/components/ui/editable-combobox";
import { INDIAN_STATES, getDistrictsForState } from "@/data/india-locations";
import { COMMON_NGO_ROLES } from "@/data/team";
import { useToast } from "@/contexts/toast-context";
import {
  createTeamMember,
  deleteTeamMember,
  fetchTeamMembers,
  updateTeamMember,
} from "@/lib/api/teams";
import type { CreateTeamMemberDto, PaginationMeta, TeamMember, UpdateTeamMemberDto } from "@/lib/api/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TeamMemberModal } from "./team-member-modal";
import { TeamMemberDetailModal } from "./team-member-detail-modal";
import { Pagination } from "@/components/admin/ui/pagination";

export function TeamsTable() {
  const { showToast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);

  // Dynamic role list for filtering
  const roleOptions = useMemo(() => {
    const roleSet = new Set<string>(COMMON_NGO_ROLES);
    members.forEach((m) => {
      if (m.role && m.role.trim()) {
        roleSet.add(m.role.trim());
      }
    });
    return Array.from(roleSet).sort((a, b) => a.localeCompare(b));
  }, [members]);

  const handleStateFilterChange = (val: string) => {
    setStateFilter(val);
    setPage(1);
    if (val.trim()) {
      const validDistricts = getDistrictsForState(val);
      if (
        districtFilter &&
        !validDistricts.some(
          (d) => d.toLowerCase() === districtFilter.trim().toLowerCase(),
        )
      ) {
        setDistrictFilter("");
      }
    }
  };

  const hasActiveFilters = Boolean(
    search.trim() || roleFilter.trim() || stateFilter.trim() || districtFilter.trim(),
  );

  const handleClearFilters = () => {
    setSearch("");
    setRoleFilter("");
    setStateFilter("");
    setDistrictFilter("");
    setPage(1);
  };

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const loadTeamMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchTeamMembers({
        page,
        limit,
        search: search.trim() || undefined,
        role: roleFilter.trim() || undefined,
        state: stateFilter.trim() || undefined,
        district: districtFilter.trim() || undefined,
      });

      if (Array.isArray(response.data)) {
        setMembers(response.data);
        setMeta(response.meta);
      } else {
        setMembers([]);
        setMeta(undefined);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load team members.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, roleFilter, stateFilter, districtFilter, showToast]);

  useEffect(() => {
    let ignore = false;
    fetchTeamMembers({
      page,
      limit,
      search: search.trim() || undefined,
      role: roleFilter.trim() || undefined,
      state: stateFilter.trim() || undefined,
      district: districtFilter.trim() || undefined,
    })
      .then((response) => {
        if (!ignore) {
          if (Array.isArray(response.data)) {
            setMembers(response.data);
            setMeta(response.meta);
          } else {
            setMembers([]);
            setMeta(undefined);
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : "Failed to load team members.";
          showToast(msg, "error");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [page, limit, search, roleFilter, stateFilter, districtFilter, showToast]);

  const handleCreateOrUpdate = async (
    data: CreateTeamMemberDto | UpdateTeamMemberDto,
  ) => {
    if (selectedMember) {
      await updateTeamMember(selectedMember.id, data as UpdateTeamMemberDto);
      showToast("Team member updated successfully!", "success");
    } else {
      await createTeamMember(data as CreateTeamMemberDto);
      showToast("Team member added successfully!", "success");
    }
    loadTeamMembers();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTeamMember(deleteTarget.id);
      showToast("Team member deleted successfully.", "success");
      setDeleteTarget(null);
      loadTeamMembers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete team member.";
      showToast(msg, "error");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (value?: string | null) => {
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

  const getFullAddress = (m: TeamMember) => {
    return [m.address, m.district, m.state, m.country || "India"].filter(Boolean).join(", ");
  };

  return (
    <div className="space-y-5">
      {/* Header Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Team Members Directory</h1>
          <p className="text-xs text-[#64748b]">
            Manage NGO team leaders, staff, and core committee members
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedMember(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f6fa8] px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-[#185887] transition"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Team Member
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#d7e4ef] bg-white p-3.5 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-2.5 h-4 w-4 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search team member by name, role, location, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-[#cbd5e1] pl-9 pr-4 py-2 text-xs text-[#0f172a] focus:border-[#1f6fa8] focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-48">
          <EditableCombobox
            value={roleFilter}
            onChange={(val) => {
              setRoleFilter(val);
              setPage(1);
            }}
            options={roleOptions}
            placeholder="Filter by role..."
          />
        </div>

        <div className="w-full sm:w-48">
          <EditableCombobox
            value={stateFilter}
            onChange={handleStateFilterChange}
            options={INDIAN_STATES}
            placeholder="Filter state..."
          />
        </div>

        <div className="w-full sm:w-48">
          <EditableCombobox
            value={districtFilter}
            onChange={(val) => {
              setDistrictFilter(val);
              setPage(1);
            }}
            options={getDistrictsForState(stateFilter)}
            placeholder="Filter district..."
          />
        </div>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] px-3 py-2 text-xs font-semibold text-[#475569] hover:bg-[#e2e8f0] hover:text-[#0f172a] transition shrink-0"
            title="Reset filters"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset
          </button>
        ) : null}
      </div>

      {/* Team Members Data Table */}
      <div className="overflow-hidden rounded-2xl border border-[#d7e4ef] bg-white shadow-2xs">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e2e8f0] border-t-[#1f6fa8]" />
          </div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-[#0f172a]">No Team Members Found</h3>
            <p className="mt-1 text-xs text-[#64748b]">
              No team member matches your search query or role filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-xs text-[#1e293b] divide-y divide-[#e2e8f0]">
              <thead className="bg-[#f3f9ff] text-[11px] uppercase tracking-wider text-[#6b7c8f]">
                <tr>
                  <th className="px-4 py-3 whitespace-nowrap">Member</th>
                  <th className="px-4 py-3 whitespace-nowrap">Role / Designation</th>
                  <th className="px-4 py-3 whitespace-nowrap">Contact</th>
                  <th className="px-4 py-3 whitespace-nowrap">Location / Address</th>
                  <th className="px-4 py-3 whitespace-nowrap">Date Added</th>
                  <th className="px-4 py-3 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] text-[#1e293b]">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-[#f8fbfe] transition-colors">
                    {/* Member photo and name */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {m.photoUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={m.photoUrl}
                            alt={m.fullName}
                            onClick={() => setPreviewPhoto(m.photoUrl!)}
                            className="h-10 w-10 shrink-0 cursor-pointer rounded-full object-cover border border-[#cbd5e1] shadow-2xs transition hover:scale-110"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=User";
                            }}
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#cbd5e1] bg-[#f1f5f9] text-[#94a3b8]">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <span
                            onClick={() => setViewingMember(m)}
                            className="block max-w-[170px] truncate font-semibold text-[#0f172a] hover:text-[#1f6fa8] cursor-pointer transition capitalize text-xs"
                            title={m.fullName}
                          >
                            {m.fullName}
                          </span>
                          {m.bio ? (
                            <p className="max-w-[170px] truncate text-[11px] text-[#64748b]" title={m.bio}>
                              {m.bio}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 text-xs font-semibold text-[#0369a1]">
                        {m.role || "Team Member"}
                      </span>
                    </td>

                    {/* Contact details */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5 text-xs">
                        {m.email ? (
                          <a
                            href={`mailto:${m.email}`}
                            className="flex items-center gap-1.5 text-[#334155] hover:text-[#1f6fa8] transition truncate max-w-[180px]"
                            title={m.email}
                          >
                            <svg className="h-3 w-3 text-[#64748b] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">{m.email}</span>
                          </a>
                        ) : null}
                        {m.phone ? (
                          <a
                            href={`tel:${m.phone}`}
                            className="flex items-center gap-1.5 font-mono text-[#64748b] hover:text-[#0f172a] transition"
                            title={m.phone}
                          >
                            <svg className="h-3 w-3 text-[#64748b] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{m.phone}</span>
                          </a>
                        ) : null}
                        {!m.email && !m.phone && <span className="text-[#94a3b8]">—</span>}
                      </div>
                    </td>

                    {/* Location in short form */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div
                        title={getFullAddress(m)}
                        className="flex items-center gap-1.5 max-w-[170px] cursor-help"
                      >
                        <svg className="h-3.5 w-3.5 text-[#1f6fa8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate text-xs font-semibold text-[#0f172a] capitalize">
                            {m.district || m.address || "—"}
                          </span>
                          {m.state && (
                            <span className="truncate text-[10px] text-[#64748b] capitalize">
                              {[m.state, m.country || "India"].filter(Boolean).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Date added */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="flex items-center gap-1.5 text-xs text-[#334155] font-medium">
                        <svg className="h-3.5 w-3.5 text-[#1f6fa8] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(m.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-2.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingMember(m)}
                          title="View Details"
                          aria-label="View member details"
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#cbd5e1] bg-white px-2.5 py-1 text-xs font-semibold text-[#334155] shadow-2xs hover:border-[#1f6fa8] hover:bg-[#f8fafc] hover:text-[#1f6fa8] transition"
                        >
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMember(m);
                            setModalOpen(true);
                          }}
                          title="Edit Team Member"
                          aria-label="Edit member"
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#cbd5e1] bg-white px-2.5 py-1 text-xs font-semibold text-[#1f6fa8] shadow-2xs hover:border-[#1f6fa8] hover:bg-[#f0f7fc] transition"
                        >
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(m)}
                          title="Delete Team Member"
                          aria-label="Delete member"
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#fecaca] bg-white px-2.5 py-1 text-xs font-semibold text-[#dc2626] shadow-2xs hover:bg-[#fef2f2] transition"
                        >
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <Pagination
          meta={meta}
          onPageChange={setPage}
        />
      </div>

      {/* View Member Detail Modal */}
      <TeamMemberDetailModal
        member={viewingMember}
        isOpen={Boolean(viewingMember)}
        onClose={() => setViewingMember(null)}
        onEdit={(m) => {
          setSelectedMember(m);
          setModalOpen(true);
        }}
      />

      {/* Member Create/Edit Modal */}
      <TeamMemberModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedMember(null);
        }}
        onSave={handleCreateOrUpdate}
        member={selectedMember}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#0f172a]">Delete Team Member?</h3>
                <p className="text-xs text-[#64748b] truncate">
                  Permanently remove {deleteTarget.fullName}. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2 border-t border-[#e2e8f0] pt-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-[#cbd5e1] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#475569] hover:bg-[#f1f5f9] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-rose-700 transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Lightbox for Team Member Photo Preview */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              type="button"
              onClick={() => setPreviewPhoto(null)}
              className="absolute -right-2 -top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-black shadow-lg"
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewPhoto}
              alt="Team Member"
              className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

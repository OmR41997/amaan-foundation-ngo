"use client";

import type { TeamMember } from "@/lib/api/types";
import { useState } from "react";

interface TeamMemberDetailModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (member: TeamMember) => void;
}

export function TeamMemberDetailModal({
  member,
  isOpen,
  onClose,
  onEdit,
}: TeamMemberDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  if (!isOpen || !member) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm">
        <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in duration-200">
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-[#0f2235] via-[#1f6fa8] to-[#0f2235] p-5 sm:p-6 text-white shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition"
              title="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div
                onClick={() => member.photoUrl && setPreviewPhoto(member.photoUrl)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white/40 bg-white/10 shadow-lg ${
                  member.photoUrl ? "cursor-pointer group" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.photoUrl || "https://via.placeholder.com/150?text=User"}
                  alt={member.fullName}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=User";
                  }}
                />
                {member.photoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left space-y-1">
                <span className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium backdrop-blur-sm">
                  {member.role || "Team Member"}
                </span>
                <h2 className="text-xl font-bold tracking-tight text-white">{member.fullName}</h2>
                <p className="text-xs text-white/80 flex items-center justify-center sm:justify-start gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {[member.district, member.state, member.country || "India"].filter(Boolean).join(", ") || "Location Not Specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Contact Information */}
            <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-3 flex items-center gap-1.5">
                <svg className="h-4 w-4 text-[#1f6fa8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Email Address</span>
                  {member.email ? (
                    <div className="flex items-center gap-2 mt-0.5">
                      <a href={`mailto:${member.email}`} className="text-xs font-medium text-[#1f6fa8] hover:underline break-all normal-case">
                        {member.email}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(member.email!, "Email")}
                        className="text-[#94a3b8] hover:text-[#0f172a] transition"
                        title="Copy Email"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      {copiedField === "Email" && (
                        <span className="text-[10px] font-medium text-emerald-600">Copied!</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-[#94a3b8]">Not provided</span>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Phone Number</span>
                  {member.phone ? (
                    <div className="flex items-center gap-2 mt-0.5">
                      <a href={`tel:${member.phone}`} className="text-xs font-medium text-[#1f6fa8] hover:underline">
                        {member.phone}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(member.phone!, "Phone")}
                        className="text-[#94a3b8] hover:text-[#0f172a] transition"
                        title="Copy Phone"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      {copiedField === "Phone" && (
                        <span className="text-[10px] font-medium text-emerald-600">Copied!</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-[#94a3b8]">Not provided</span>
                  )}
                </div>
              </div>
            </div>

            {/* Address & Location */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] flex items-center gap-1.5">
                <svg className="h-4 w-4 text-[#1f6fa8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0v-4m0 4h4" />
                </svg>
                Location & Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Street Address</span>
                  <span className="font-medium text-[#0f172a]">{member.address || "—"}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">District</span>
                  <span className="font-medium text-[#0f172a]">{member.district || "—"}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">State & Country</span>
                  <span className="font-medium text-[#0f172a]">
                    {[member.state, member.country || "India"].filter(Boolean).join(", ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Bio / Description */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] flex items-center gap-1.5">
                <svg className="h-4 w-4 text-[#1f6fa8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Biography & Profile Summary
              </h3>
              <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-wrap">
                {member.bio || "No biography provided for this team member."}
              </p>
            </div>

            {/* Metadata Footer */}
            {member.createdAt && (
              <div className="flex items-center justify-end border-t border-[#e2e8f0] pt-3 text-[11px] text-[#64748b]">
                <span>Added: {formatDate(member.createdAt)}</span>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex shrink-0 items-center justify-between border-t border-[#e2e8f0] bg-[#f8fafc] px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#cbd5e1] bg-white px-4 py-2 text-xs font-semibold text-[#475569] hover:bg-[#f1f5f9] transition"
            >
              Close
            </button>

            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(member);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f6fa8] px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#185887] transition"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Member Details
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fullsize Image Lightbox */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setPreviewPhoto(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <button
              type="button"
              onClick={() => setPreviewPhoto(null)}
              className="absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black font-bold shadow-lg hover:bg-gray-200 transition"
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewPhoto}
              alt="Team Member"
              className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}

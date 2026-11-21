"use client";

import { MembershipBadge, StatusBadge } from "@/components/admin/ui/status-badge";
import type { MemberRequest } from "@/lib/api/types";
import { formatAadhaar, getAadhaarDigits } from "@/lib/formatters";
import { useState } from "react";

interface MemberRequestDetailModalProps {
  record: MemberRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (record: MemberRequest) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function MemberRequestDetailModal({
  record,
  isOpen,
  onClose,
  onEdit,
  onApprove,
  onReject,
}: MemberRequestDetailModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [showAadhaar, setShowAadhaar] = useState(false);

  if (!isOpen || !record) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const maskAadhaar = (aadhaarStr?: string) => {
    if (!aadhaarStr) return "—";
    const cleaned = getAadhaarDigits(aadhaarStr);
    if (cleaned.length !== 12) return aadhaarStr;
    return showAadhaar
      ? formatAadhaar(cleaned)
      : `•••• •••• ${cleaned.slice(8, 12)}`;
  };

  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm">
        <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden transition-all animate-in fade-in zoom-in duration-200 uppercase">
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-[#0f2235] via-[#143046] to-[#1f6fa8] p-5 sm:p-6 text-white shrink-0">
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
                onClick={() => record.photoUrl && setPreviewPhoto(record.photoUrl)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white/40 bg-white/10 shadow-lg ${
                  record.photoUrl ? "cursor-pointer group" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={record.photoUrl || "https://via.placeholder.com/150?text=Member"}
                  alt={record.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Member";
                  }}
                />
                {record.photoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="font-mono text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-md text-white tracking-wide uppercase">
                    App No: {record.referenceNo || "—"}
                  </span>
                  <MembershipBadge type={record.membershipType} />
                  <StatusBadge status={record.status} />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">{record.name}</h2>
                <p className="text-xs text-white/80 flex items-center justify-center sm:justify-start gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {[record.district, record.state].filter(Boolean).join(", ") || "Location Not Specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Rejection notice if rejected */}
            {record.status === "rejected" && record.rejectionReason && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
                <span className="font-bold block text-rose-900 mb-0.5">Rejection Reason:</span>
                <p>{record.rejectionReason}</p>
              </div>
            )}

            {/* Personal Info Grid */}
            <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] mb-3 flex items-center gap-1.5">
                <svg className="h-4 w-4 text-[#1f6fa8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Mobile Number</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-semibold text-[#0f172a]">{record.mobile || "—"}</span>
                    {record.mobile && (
                      <button
                        type="button"
                        onClick={() => handleCopy(record.mobile, "Mobile")}
                        className="text-[#94a3b8] hover:text-[#0f172a] transition"
                        title="Copy Mobile"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    )}
                    {copiedField === "Mobile" && <span className="text-[10px] text-emerald-600 font-bold">Copied</span>}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Email Address</span>
                  <span className="font-medium text-[#0f172a] truncate block normal-case">{record.email || "—"}</span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Aadhaar Number</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-[#0f172a]">{maskAadhaar(record.aadhaar)}</span>
                    {record.aadhaar && (
                      <button
                        type="button"
                        onClick={() => setShowAadhaar(!showAadhaar)}
                        className="text-[#94a3b8] hover:text-[#0f172a] transition"
                        title={showAadhaar ? "Hide Aadhaar" : "Show Aadhaar"}
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Date of Birth</span>
                  <span className="font-medium text-[#0f172a]">{formatDate(record.dob)}</span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Gender</span>
                  <span className="font-medium text-[#0f172a] uppercase">{record.gender || "—"}</span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Blood Group</span>
                  <span className="inline-block rounded bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700">
                    {record.bloodGroup || "—"}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Education</span>
                  <span className="font-medium text-[#0f172a]">{record.education || "—"}</span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Profession</span>
                  <span className="font-medium text-[#0f172a]">{record.profession || "—"}</span>
                </div>
              </div>
            </div>

            {/* Address & Location Grid */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] flex items-center gap-1.5">
                <svg className="h-4 w-4 text-[#1f6fa8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Address & Geographic Location
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Current Address</span>
                  <span className="font-medium text-[#0f172a]">{record.currentAddress || "—"}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 border-t border-[#f1f5f9] pt-2">
                  <div>
                    <span className="text-[11px] font-semibold text-[#64748b] block">Tehsil</span>
                    <span className="font-medium text-[#0f172a]">{record.tehsil || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#64748b] block">District</span>
                    <span className="font-medium text-[#0f172a]">{record.district || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#64748b] block">Division</span>
                    <span className="font-medium text-[#0f172a]">{record.division || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#64748b] block">State</span>
                    <span className="font-medium text-[#0f172a]">{record.state || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#64748b] block">PIN Code</span>
                    <span className="font-mono font-semibold text-[#0f172a]">{record.pinCode || "—"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Membership & Application Metadata */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] flex items-center gap-1.5">
                <svg className="h-4 w-4 text-[#1f6fa8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Membership Status & Application Dates
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Form Date</span>
                  <span className="font-medium text-[#0f172a]">{formatDate(record.formDate)}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Submitted On</span>
                  <span className="font-medium text-[#0f172a]">{formatDate(record.createdAt)}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Approval Date</span>
                  <span className="font-medium text-[#0f172a]">{formatDate(record.approvalDate)}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-[#64748b] block">Membership Expiry</span>
                  <span className="font-medium text-[#0f172a]">
                    {record.membershipType === "lifetime" ? "Never Expires" : formatDate(record.expiryDate)}
                  </span>
                </div>
              </div>
            </div>
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

            <div className="flex items-center gap-3">
              {/* Pretty Status Toggle for All Records */}
              {(onApprove || onReject) && (
                <div className="inline-flex items-center rounded-lg border border-[#cbd5e1] bg-white p-0.5 shadow-2xs">
                  <button
                    type="button"
                    disabled={record.status === "approved"}
                    onClick={() => onApprove?.(record.id)}
                    title={record.status === "approved" ? "Currently Approved" : "Click to Approve"}
                    className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                      record.status === "approved"
                        ? "bg-emerald-600 text-white shadow-xs cursor-default"
                        : "text-[#64748b] hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Approve</span>
                  </button>

                  <button
                    type="button"
                    disabled={record.status === "rejected"}
                    onClick={() => onReject?.(record.id)}
                    title={record.status === "rejected" ? "Currently Rejected" : "Click to Reject"}
                    className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                      record.status === "rejected"
                        ? "bg-rose-600 text-white shadow-xs cursor-default"
                        : "text-[#64748b] hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                    </svg>
                    <span>Reject</span>
                  </button>
                </div>
              )}

              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(record);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f6fa8] px-4 py-2 text-xs font-semibold text-white shadow hover:bg-[#185887] transition"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Record
                </button>
              )}
            </div>
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
              alt="Member"
              className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}

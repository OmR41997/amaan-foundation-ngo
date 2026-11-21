"use client";

import { ImageUploadField } from "@/components/admin/ui/image-upload-field";
import { EditableCombobox } from "@/components/ui/editable-combobox";
import { INDIAN_STATES, getDistrictsForState } from "@/data/india-locations";
import { COMMON_NGO_ROLES } from "@/data/team";
import type { CreateTeamMemberDto, TeamMember, UpdateTeamMemberDto } from "@/lib/api/types";
import { useState } from "react";

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTeamMemberDto | UpdateTeamMemberDto) => Promise<void>;
  member?: TeamMember | null;
}

export function TeamMemberModal({
  isOpen,
  onClose,
  onSave,
  member,
}: TeamMemberModalProps) {
  if (!isOpen) return null;

  return (
    <TeamMemberModalForm
      key={member?.id ?? "new"}
      member={member}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function TeamMemberModalForm({
  member,
  onClose,
  onSave,
}: {
  member?: TeamMember | null;
  onClose: () => void;
  onSave: (data: CreateTeamMemberDto | UpdateTeamMemberDto) => Promise<void>;
}) {
  const [fullName, setFullName] = useState(member?.fullName || "");
  const [role, setRole] = useState(member?.role || "");
  const [email, setEmail] = useState(member?.email || "");
  const [phone, setPhone] = useState(member?.phone || "");
  const [address, setAddress] = useState(member?.address || "");
  const [district, setDistrict] = useState(member?.district || "");
  const [state, setState] = useState(member?.state || "");
  const [photoUrl, setPhotoUrl] = useState(member?.photoUrl || "");
  const [bio, setBio] = useState(member?.bio || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStateChange = (val: string) => {
    setState(val);
    if (val.trim()) {
      const validDistricts = getDistrictsForState(val);
      if (
        district &&
        !validDistricts.some(
          (d) => d.toLowerCase() === district.trim().toLowerCase(),
        )
      ) {
        setDistrict("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Full Name is required.");
      return;
    }

    // Validate State against official Indian records if provided
    let finalState = state.trim();
    if (finalState) {
      const stateMatch = INDIAN_STATES.find(
        (s) => s.toLowerCase() === finalState.toLowerCase(),
      );
      if (!stateMatch) {
        setError(
          `Invalid State "${finalState}". Please select a valid State or Union Territory of India from the suggestion list.`,
        );
        return;
      }
      finalState = stateMatch;
    }

    // Validate District against official records if provided
    let finalDistrict = district.trim();
    if (finalDistrict) {
      const validDistricts = getDistrictsForState(finalState);
      const districtMatch = validDistricts.find(
        (d) => d.toLowerCase() === finalDistrict.toLowerCase(),
      );
      if (!districtMatch) {
        setError(
          finalState
            ? `Invalid District "${finalDistrict}" for ${finalState}. Please select a valid district from the suggestion list.`
            : `Invalid District "${finalDistrict}". Please select a valid district of India from the suggestion list.`,
        );
        return;
      }
      finalDistrict = districtMatch;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSave({
        fullName: fullName.trim(),
        role: role.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        district: finalDistrict || undefined,
        state: finalState || undefined,
        country: "India",
        photoUrl: photoUrl.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save team member.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white p-5 sm:p-6 shadow-2xl transition-all">
        <div className="flex shrink-0 items-center justify-between border-b border-[#e2e8f0] pb-3 sm:pb-4">
          <h2 className="text-base sm:text-lg font-bold text-[#0f172a]">
            {member ? "Edit Team Member" : "Add New Team Member"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto py-4 pr-2.5 space-y-4">
            {error ? (
              <div className="rounded-lg bg-[#fef2f2] p-3 text-xs font-semibold text-[#b91c1c]">
                {error}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alim Ansari"
                  className="mt-1 w-full rounded-lg border border-[#cbd5e1] px-3 py-2 text-sm text-[#0f172a] focus:border-[#1f6fa8] focus:outline-none"
                />
              </div>

              <EditableCombobox
                label="Role / Designation"
                value={role}
                onChange={(val) => setRole(val)}
                options={COMMON_NGO_ROLES}
                placeholder="e.g. Founder & President"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alim@example.com"
                  className="mt-1 w-full rounded-lg border border-[#cbd5e1] px-3 py-2 text-sm text-[#0f172a] focus:border-[#1f6fa8] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="mt-1 w-full rounded-lg border border-[#cbd5e1] px-3 py-2 text-sm text-[#0f172a] focus:border-[#1f6fa8] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
                Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Ring Road No 1, Mangla"
                className="mt-1 w-full rounded-lg border border-[#cbd5e1] px-3 py-2 text-sm text-[#0f172a] focus:border-[#1f6fa8] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <EditableCombobox
                label="State"
                value={state}
                onChange={handleStateChange}
                options={INDIAN_STATES}
                placeholder="Search or select state"
                strict={true}
              />

              <EditableCombobox
                label="District"
                value={district}
                onChange={(val) => setDistrict(val)}
                options={getDistrictsForState(state)}
                placeholder="Search or select district"
                strict={true}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569]">
                Biography / Short Note
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of member's background or achievements..."
                className="mt-1 w-full rounded-lg border border-[#cbd5e1] px-3 py-2 text-sm text-[#0f172a] focus:border-[#1f6fa8] focus:outline-none"
              />
            </div>

            <div className="rounded-xl border border-[#dbe8f2] bg-[#f8fbfe] p-3 sm:p-4">
              <ImageUploadField
                label="Team Member Photo"
                value={photoUrl}
                onChange={(url) => setPhotoUrl(url)}
                category="teams"
                helpText="Upload the member photo to Cloudinary or backend storage"
              />
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-3 pt-3 sm:pt-4 border-t border-[#e2e8f0]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#cbd5e1] px-4 py-2 text-xs font-semibold text-[#475569] hover:bg-[#f1f5f9]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#1f6fa8] px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#185887] disabled:opacity-50"
            >
              {submitting ? "Saving..." : member ? "Update Member" : "Create Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

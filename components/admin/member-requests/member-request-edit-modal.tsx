"use client";

import { useToast } from "@/contexts/toast-context";
import { updateMemberRequest } from "@/lib/api/member-requests";
import type { MemberRequest } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { ImageUploadField } from "@/components/admin/ui/image-upload-field";
import { EditableCombobox } from "@/components/ui/editable-combobox";
import { INDIAN_STATES, getDistrictsForState } from "@/data/india-locations";
import { formatAadhaar, getAadhaarDigits } from "@/lib/formatters";
import { deleteUploadedMedia } from "@/lib/api/uploads";
import { useEffect, useRef, useState } from "react";

const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const fieldClass =
  "w-full rounded-lg border border-[#d7e4ef] bg-white px-3 py-2 text-sm text-[#0f172a] placeholder-[#94a3b8] uppercase outline-none focus:border-[#1f6fa8]";

function toFormState(record: MemberRequest) {
  return {
    name: record.name,
    city: record.city,
    dob: record.dob,
    age: record.age,
    gender: record.gender,
    bloodGroup: record.bloodGroup,
    aadhaar: formatAadhaar(record.aadhaar),
    mobile: record.mobile,
    photoUrl: record.photoUrl || "",
    email: record.email,
    education: record.education,
    profession: record.profession,
    currentAddress: record.currentAddress,
    district: record.district,
    tehsil: record.tehsil,
    division: record.division,
    state: record.state,
    pinCode: record.pinCode,
    referenceNo: record.referenceNo ?? "",
    membershipType: record.membershipType,
    place: record.place,
    date: record.formDate,
  };
}

interface MemberRequestEditModalProps {
  record: MemberRequest;
  onClose: () => void;
  onSaved: () => void;
}

export function MemberRequestEditModal({
  record,
  onClose,
  onSaved,
}: MemberRequestEditModalProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState(toFormState(record));
  const [prevRecordId, setPrevRecordId] = useState(record.id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [declarationAccepted, setDeclarationAccepted] = useState(true);

  // Track any image URLs uploaded in this session but not yet saved
  const unsavedUploadedUrlsRef = useRef<string[]>([]);
  const isSavedRef = useRef(false);

  // Helper to cleanup unsaved uploaded media from Cloudinary
  const cleanupUnsavedUploads = () => {
    if (isSavedRef.current) return;
    while (unsavedUploadedUrlsRef.current.length > 0) {
      const urlToDelete = unsavedUploadedUrlsRef.current.pop();
      if (urlToDelete && urlToDelete !== record.photoUrl) {
        deleteUploadedMedia(urlToDelete);
      }
    }
  };

  // Safe dismiss handler: cleans up unsaved Cloudinary uploads before closing
  const handleDismiss = () => {
    cleanupUnsavedUploads();
    onClose();
  };

  // On unmount (e.g. navigation or component unmount without saving)
  useEffect(() => {
    return () => {
      cleanupUnsavedUploads();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.photoUrl]);

  if (record.id !== prevRecordId) {
    cleanupUnsavedUploads();
    setPrevRecordId(record.id);
    setForm(toFormState(record));
    setDeclarationAccepted(true);
    isSavedRef.current = false;
  }

  const handlePhotoChange = (newUrl: string) => {
    if (newUrl !== form.photoUrl) {
      const prevUnsaved = unsavedUploadedUrlsRef.current.pop();
      if (prevUnsaved && prevUnsaved !== record.photoUrl) {
        deleteUploadedMedia(prevUnsaved);
      }

      if (newUrl && newUrl !== record.photoUrl) {
        unsavedUploadedUrlsRef.current.push(newUrl);
      }
    }
    set("photoUrl", newUrl);
  };

  const handleStateChange = (stateVal: string) => {
    setForm((prev) => {
      const newState = stateVal;
      const validDistricts = getDistrictsForState(newState);
      const newDistrict =
        prev.district &&
        !validDistricts.some(
          (d) => d.toLowerCase() === prev.district.trim().toLowerCase(),
        )
          ? ""
          : prev.district;
      return {
        ...prev,
        state: newState,
        district: newDistrict,
      };
    });
  };

  const validate = () => {
    if (!declarationAccepted) {
      setError("Please read the declaration and tick it.");
      return false;
    }
    const required = [
      form.name,
      form.mobile,
      form.dob,
      form.gender,
      form.bloodGroup,
      form.currentAddress,
      form.date,
      form.aadhaar,
      form.district,
      form.tehsil,
      form.division,
      form.state,
      form.pinCode,
    ];
    if (required.some((v) => !String(v).trim())) {
      setError("Please fill all required fields.");
      return false;
    }
    if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, ""))) {
      setError("Mobile must be 10 digits.");
      return false;
    }
    if (!/^\d{12}$/.test(getAadhaarDigits(form.aadhaar))) {
      setError("Aadhaar must be 12 digits.");
      return false;
    }
    if (!/^\d{6}$/.test(form.pinCode.replace(/\D/g, ""))) {
      setError("PIN code must be 6 digits.");
      return false;
    }
    if (form.referenceNo.trim() && !/^[a-zA-Z0-9]+$/.test(form.referenceNo.trim())) {
      setError("Application No. must contain only letters and numbers.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      isSavedRef.current = true;
      await updateMemberRequest(record.id, {
        name: form.name.trim(),
        city: form.city.trim() || undefined,
        dob: form.dob,
        age: form.age.trim() || undefined,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        aadhaar: getAadhaarDigits(form.aadhaar),
        mobile: form.mobile.replace(/\D/g, ""),
        email: form.email.trim() || undefined,
        education: form.education.trim() || undefined,
        profession: form.profession.trim() || undefined,
        currentAddress: form.currentAddress.trim(),
        district: form.district.trim(),
        tehsil: form.tehsil.trim(),
        division: form.division.trim(),
        state: form.state.trim(),
        pinCode: form.pinCode.replace(/\D/g, ""),
        referenceNo: form.referenceNo.trim() || undefined,
        membershipType: form.membershipType,
        photoUrl: form.photoUrl.trim() || undefined,
        place: form.place.trim() || undefined,
        date: form.date,
      });
      unsavedUploadedUrlsRef.current = [];
      showToast("Record updated successfully", "success");
      onSaved();
      onClose();
    } catch (err) {
      isSavedRef.current = false;
      showToast(err instanceof ApiError ? err.message : "Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#0f2235]/50 p-3 sm:p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white p-5 sm:p-6 shadow-xl transition-all">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#e2e8f0] pb-3">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#0f172a]">Edit Request</h3>
            <p className="mt-0.5 text-xs text-[#6b7c8f]">
              Status: <span className="capitalize font-medium text-[#143046]">{record.status}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-full p-1 text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs text-[#6b7c8f]">Application No.</label>
              <input
                value={form.referenceNo}
                onChange={(e) =>
                  set(
                    "referenceNo",
                    e.target.value.replace(/[^a-zA-Z0-9]/gi, "").slice(0, 30),
                  )
                }
                className={`${fieldClass} uppercase`}
              />
            </div>
            <div>
              <label className="text-xs text-[#6b7c8f]">Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-xs text-[#6b7c8f]">Mobile *</label>
              <input
                required
                maxLength={10}
                value={form.mobile}
                onChange={(e) =>
                  set("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-xs text-[#6b7c8f]">Aadhaar *</label>
              <input
                required
                maxLength={14}
                value={form.aadhaar}
                onChange={(e) =>
                  set("aadhaar", formatAadhaar(e.target.value))
                }
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-xs text-[#6b7c8f]">DOB *</label>
              <input
                type="date"
                required
                value={form.dob}
                onChange={(e) => set("dob", e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-xs text-[#6b7c8f]">Form Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-xs text-[#6b7c8f]">Gender *</label>
              <select
                required
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
                className={fieldClass}
              >
                <option value="">SELECT</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#6b7c8f]">Blood Group *</label>
              <select
                required
                value={form.bloodGroup}
                onChange={(e) => set("bloodGroup", e.target.value)}
                className={fieldClass}
              >
                <option value="">SELECT</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#6b7c8f]">Membership *</label>
              <select
                value={form.membershipType}
                onChange={(e) => set("membershipType", e.target.value)}
                className={fieldClass}
              >
                <option value="temporary">TEMPORARY</option>
                <option value="lifetime">LIFETIME</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#6b7c8f]">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className={`${fieldClass} normal-case`}
                style={{ textTransform: "none" }}
              />
            </div>
            <div>
              <label className="text-xs text-[#6b7c8f]">City</label>
              <input value={form.city} onChange={(e) => set("city", e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className="text-xs text-[#6b7c8f]">Age</label>
              <input value={form.age} onChange={(e) => set("age", e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className="text-xs text-[#6b7c8f]">Education</label>
              <input
                value={form.education}
                onChange={(e) => set("education", e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-xs text-[#6b7c8f]">Profession</label>
              <input
                value={form.profession}
                onChange={(e) => set("profession", e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className="text-xs text-[#6b7c8f]">Place</label>
              <input value={form.place} onChange={(e) => set("place", e.target.value)} className={fieldClass} />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#6b7c8f]">Address *</label>
            <textarea
              required
              rows={2}
              value={form.currentAddress}
              onChange={(e) => set("currentAddress", e.target.value)}
              className={fieldClass}
            />
          </div>

          {/* Location & Regional Details */}
          <div className="space-y-4 pt-2 border-t border-[#e2e8f0]">
            <div className="grid gap-4 sm:grid-cols-2">
              <EditableCombobox
                label="State *"
                value={form.state}
                onChange={handleStateChange}
                options={INDIAN_STATES}
                placeholder="Select State..."
                strict={true}
              />

              <EditableCombobox
                label="District *"
                value={form.district}
                onChange={(val) => set("district", val)}
                options={getDistrictsForState(form.state)}
                placeholder="Select District..."
                strict={true}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1">Tehsil *</label>
                <input
                  required
                  value={form.tehsil}
                  onChange={(e) => set("tehsil", e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1">Division *</label>
                <input
                  required
                  value={form.division}
                  onChange={(e) => set("division", e.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1">PIN Code *</label>
                <input
                  required
                  maxLength={6}
                  value={form.pinCode}
                  onChange={(e) =>
                    set("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#dbe8f2] bg-[#f8fbfe] p-3 sm:p-4">
            <ImageUploadField
              label="Member Photo"
              value={form.photoUrl}
              onChange={handlePhotoChange}
              category="members"
              helpText="Upload the member photo to Cloudinary or backend storage"
            />
          </div>

          <div className="flex items-start gap-3 border-t border-[#d7e4ef] pt-4">
            <input
              type="checkbox"
              id="declaration"
              checked={declarationAccepted}
              onChange={(e) => setDeclarationAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#d7e4ef] text-[#1f6fa8]"
            />
            <label htmlFor="declaration" className="text-xs text-[#6b7c8f] cursor-pointer">
              I declare that the information provided above is true and accurate to the best of my knowledge.
            </label>
          </div>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          </div>

          <div className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-[#d7e4ef] pt-3 sm:pt-4">
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-lg border border-[#d7e4ef] px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#1f6fa8] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { AppLocale } from "@/i18n/routing";
import { submitMemberRequest } from "@/lib/api/member-requests";
import { ApiError } from "@/lib/api/client";
import { deleteUploadedMedia } from "@/lib/api/uploads";
import { useEffect, useRef, useState } from "react";
import { ContactPhotoUploader } from "@/components/contact/contact-photo-uploader";
import { INDIAN_STATES, getDistrictsForState } from "@/data/india-locations";
import { formatAadhaar, getAadhaarDigits } from "@/lib/formatters";

const GENDER_OPTIONS = [
  { value: "Male", en: "Male", hi: "पुरुष" },
  { value: "Female", en: "Female", hi: "महिला" },
  { value: "Other", en: "Other", hi: "अन्य" },
] as const;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const inputClass =
  "w-full rounded-xl border border-[var(--line)] bg-white dark:bg-[#0c2017] dark:border-white/15 px-4 py-3 text-sm text-[#0f172a] dark:text-[#e6f1ea] placeholder-[#94a3b8] dark:placeholder-emerald-200/40 outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30";

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-medium text-[var(--muted)]">
      {children}
      {required ? <span className="ml-0.5 text-rose-500 font-bold">*</span> : null}
    </label>
  );
}

export function ContactForm({ locale }: { locale: AppLocale }) {
  const labels =
    locale === "hi"
      ? {
          title: "आजीवन / अस्थायी सदस्यता फॉर्म",
          subtitle: "(*) चिह्नित फील्ड अनिवार्य हैं।",
          name: "नाम",
          city: "शहर / बल्द",
          dob: "जन्म तिथि",
          age: "उम्र",
          gender: "लिंग",
          bloodGroup: "ब्लड ग्रुप",
          aadhaar: "आधार संख्या",
          mobile: "मोबाइल",
          email: "ई-मेल",
          education: "योग्यता शिक्षा",
          profession: "व्यवसाय / विभाग",
          currentAddress: "वर्तमान पता",
          district: "जिला",
          tehsil: "तहसील",
          division: "संभाग",
          state: "राज्य",
          pinCode: "पिन कोड",
          referenceNo: "संदर्भ संख्या",
          declaration: "घोषणा",
          declarationText:
            "मैं घोषणा करता/करती हूँ कि समाज के कल्याणकारी कार्यों में निष्काम भावना से सेवा/सहयोग प्रदान करूंगा/करूंगी और फाउंडेशन के नियमों का पालन करूंगा/करूंगी।",
          membershipType: "सदस्यता प्रकार",
          temporary: "अस्थायी सदस्यता (100)",
          lifetime: "आजीवन सदस्यता (1000)",
          place: "स्थान",
          date: "दिनांक",
          submit: "फॉर्म सबमिट करें",
          successTitle: "धन्यवाद",
          successMessage: "आपकी जानकारी सफलतापूर्वक जमा हो गई है। प्रतिक्रिया देने के लिए धन्यवाद।",
          required: "कृपया सभी अनिवार्य फील्ड भरें।",
          mobileInvalid: "कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।",
          aadhaarInvalid: "कृपया सही 12 अंकों की आधार संख्या दर्ज करें।",
          pinInvalid: "कृपया सही 6 अंकों का पिन कोड दर्ज करें।",
          refInvalid: "संदर्भ संख्या में केवल अक्षर और अंक हो सकते हैं।",
          selectGender: "लिंग चुनें",
          selectBlood: "ब्लड ग्रुप चुनें",
          declarationError: "कृपया घोषणा पढ़ें और इसे टिक करें।",
        }
      : {
          title: "Life / Temporary Membership Form",
          subtitle: "Fields marked with (*) are required.",
          name: "Name",
          city: "City / Town",
          dob: "Date of Birth",
          age: "Age",
          gender: "Gender",
          bloodGroup: "Blood Group",
          aadhaar: "Aadhaar Number",
          mobile: "Mobile",
          email: "Email",
          education: "Educational Qualification",
          profession: "Profession / Department",
          currentAddress: "Address",
          district: "District",
          tehsil: "Tehsil",
          division: "Division",
          state: "State",
          pinCode: "PIN Code",
          referenceNo: "Application No.",
          declaration: "Declaration",
          declarationText:
            "I declare that I will contribute with sincerity in social welfare activities and will follow the foundation's guidelines in spirit.",
          membershipType: "Membership Type",
          temporary: "Temporary Membership (100)",
          lifetime: "Lifetime Membership (1000)",
          place: "Place",
          date: "Date",
          submit: "Submit Form",
          successTitle: "Thank you",
          successMessage: "You have successfully sent your information. Thank you for responding.",
          required: "Please fill all required fields.",
          mobileInvalid: "Please enter a valid 10-digit mobile number.",
          aadhaarInvalid: "Please enter a valid 12-digit Aadhaar number.",
          pinInvalid: "Please enter a valid 6-digit PIN code.",
          refInvalid: "Application No. can only contain letters and numbers.",
          selectGender: "Select gender",
          selectBlood: "Select blood group",
          declarationError: "Please read the declaration and tick it.",
        };

  const placeholders =
    locale === "hi"
      ? {
          name: "अपना पूरा नाम लिखें",
          city: "उदा. बिलासपुर",
          age: "उदा. 28",
          aadhaar: "1234 5678 9012",
          mobile: "10 अंकों का मोबाइल नंबर",
          email: "उदा. name@email.com",
          education: "उदा. स्नातक",
          profession: "उदा. शिक्षक",
          currentAddress: "पूरा पता लिखें",
          district: "जिला",
          tehsil: "तहसील",
          division: "संभाग",
          state: "राज्य",
          pinCode: "6 अंकों का पिन कोड",
          referenceNo: "उदा. REF2026A1",
          place: "उदा. बिलासपुर",
        }
      : {
          name: "Enter full name",
          city: "e.g. Bilaspur",
          age: "e.g. 28",
          aadhaar: "1234 5678 9012",
          mobile: "10-digit mobile number",
          email: "e.g. name@email.com",
          education: "e.g. Graduate",
          profession: "e.g. Teacher",
          currentAddress: "Enter full address",
          district: "District",
          tehsil: "Tehsil",
          division: "Division",
          state: "State",
          pinCode: "6-digit PIN code",
          referenceNo: "e.g. REF2026A1",
          place: "e.g. Bilaspur",
        };

  const [values, setValues] = useState({
    name: "",
    city: "",
    dob: "",
    age: "",
    gender: "",
    bloodGroup: "",
    aadhaar: "",
    mobile: "",
    email: "",
    education: "",
    profession: "",
    currentAddress: "",
    district: "",
    tehsil: "",
    division: "",
    state: "",
    pinCode: "",
    referenceNo: "",
    declarationConsent: false,
    membershipType: "temporary",
    place: "",
    date: "",
  });
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  // Track image URLs uploaded during this session but not yet saved
  const unsavedUploadedUrlsRef = useRef<string[]>([]);
  const isSavedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (isSavedRef.current) return;
      while (unsavedUploadedUrlsRef.current.length > 0) {
        const urlToDelete = unsavedUploadedUrlsRef.current.pop();
        if (urlToDelete) {
          deleteUploadedMedia(urlToDelete);
        }
      }
    };
  }, []);

  const handlePhotoChange = (newUrl: string) => {
    if (newUrl !== photoUrl) {
      const prevUnsaved = unsavedUploadedUrlsRef.current.pop();
      if (prevUnsaved) {
        deleteUploadedMedia(prevUnsaved);
      }
      if (newUrl) {
        unsavedUploadedUrlsRef.current.push(newUrl);
      }
    }
    setPhotoUrl(newUrl);
    if (newUrl) setError("");
  };

  const handleStateChange = (newState: string) => {
    const validDistricts = getDistrictsForState(newState);
    setValues((p) => ({
      ...p,
      state: newState,
      district:
        p.district &&
        !validDistricts.some(
          (d) => d.toLowerCase() === p.district.trim().toLowerCase(),
        )
          ? ""
          : p.district,
    }));
  };

  const notifyMemberRequestsUpdated = () => {
    if (typeof window === "undefined") return;

    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel("member-requests");
      channel.postMessage({ type: "updated", at: Date.now() });
      channel.close();
      return;
    }

    try {
      window.localStorage.setItem("member-requests-updated", String(Date.now()));
    } catch {
      // Ignore localStorage access failures
    }
  };

  const validate = () => {
    if (!values.declarationConsent) {
      setError(labels.declarationError);
      return false;
    }

    const required = [
      values.name,
      values.mobile,
      values.dob,
      values.gender,
      values.bloodGroup,
      values.currentAddress,
      values.date,
      values.aadhaar,
      values.district,
      values.tehsil,
      values.division,
      values.state,
      values.pinCode,
    ];

    if (required.some((field) => !String(field).trim())) {
      setError(labels.required);
      return false;
    }

    const mobile = values.mobile.replace(/\D/g, "");
    if (!/^\d{10}$/.test(mobile)) {
      setError(labels.mobileInvalid);
      return false;
    }

    const aadhaar = getAadhaarDigits(values.aadhaar);
    if (!/^\d{12}$/.test(aadhaar)) {
      setError(labels.aadhaarInvalid);
      return false;
    }

    if (!/^\d{6}$/.test(values.pinCode.replace(/\D/g, ""))) {
      setError(labels.pinInvalid);
      return false;
    }

    if (values.referenceNo.trim() && !/^[a-zA-Z0-9]+$/.test(values.referenceNo.trim())) {
      setError(labels.refInvalid);
      return false;
    }
    if (!photoUrl.trim()) {
      setError(
        locale === "hi"
          ? "कृपया अपना फोटो अपलोड करें।"
          : "Please upload your photo."
      );
      return false;
    }

    setError("");
    return true;
  };

  const resetForm = () => ({
    name: "",
    city: "",
    dob: "",
    age: "",
    gender: "",
    bloodGroup: "",
    aadhaar: "",
    mobile: "",
    email: "",
    education: "",
    profession: "",
    currentAddress: "",
    district: "",
    tehsil: "",
    division: "",
    state: "",
    pinCode: "",
    referenceNo: "",
    declarationConsent: false,
    membershipType: "temporary",
    place: "",
    date: "",
    
  });
     const [fileKey, setFileKey] = useState(0);

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!validate()) return;

  setIsSubmitting(true);
  setError("");

  try {
    await submitMemberRequest({
      name: values.name.trim(),
      city: values.city.trim() || undefined,
      dob: values.dob,
      age: values.age.trim() || undefined,
      gender: values.gender,
      bloodGroup: values.bloodGroup,
      aadhaar: getAadhaarDigits(values.aadhaar),
      mobile: values.mobile.replace(/\D/g, ""),
      email: values.email.trim() || undefined,
      education: values.education.trim() || undefined,
      profession: values.profession.trim() || undefined,
      currentAddress: values.currentAddress.trim(),
      district: values.district.trim(),
      tehsil: values.tehsil.trim(),
      division: values.division.trim(),
      state: values.state.trim(),
      pinCode: values.pinCode.replace(/\D/g, ""),
      referenceNo: values.referenceNo.trim() || undefined,
      declarationConsent: values.declarationConsent,
      membershipType: values.membershipType,
      place: values.place.trim() || undefined,
      date: values.date,
      photoUrl: photoUrl.trim(),
    });

    notifyMemberRequestsUpdated();
    isSavedRef.current = true;
    unsavedUploadedUrlsRef.current = [];
    setShowSuccessPopup(true);
    setValues(resetForm());
    setPhotoUrl("");
    setFileKey((prev) => prev + 1);
  } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : locale === "hi"
            ? "फॉर्म जमा करने में समस्या हुई। कृपया पुनः प्रयास करें।"
            : "Could not submit the form. Please try again.",
      );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[var(--line)] bg-[linear-gradient(160deg,#ffffff,#f3f9ff)] dark:bg-[linear-gradient(160deg,#10231a,#12291d)] p-5 shadow-[0_12px_30px_rgba(20,48,70,0.05)] md:p-8"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)]">{labels.title}</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">{labels.subtitle}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <FieldLabel required>{labels.name}</FieldLabel>
          <input
            required
            value={values.name}
            onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
            placeholder={placeholders.name}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <FieldLabel>{labels.city}</FieldLabel>
          <input
            value={values.city}
            onChange={(e) => setValues((p) => ({ ...p, city: e.target.value }))}
            placeholder={placeholders.city}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <FieldLabel required>{labels.dob}</FieldLabel>
          <input
            type="date"
            required
            value={values.dob}
            onChange={(e) => setValues((p) => ({ ...p, dob: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <FieldLabel>{labels.age}</FieldLabel>
          <input
            value={values.age}
            onChange={(e) => setValues((p) => ({ ...p, age: e.target.value }))}
            placeholder={placeholders.age}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <FieldLabel required>{labels.gender}</FieldLabel>
          <select
            required
            value={values.gender}
            onChange={(e) => setValues((p) => ({ ...p, gender: e.target.value }))}
            className={`${inputClass} uppercase`}
          >
            <option value="">{labels.selectGender.toUpperCase()}</option>
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {(locale === "hi" ? opt.hi : opt.en).toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <FieldLabel required>{labels.bloodGroup}</FieldLabel>
          <select
            required
            value={values.bloodGroup}
            onChange={(e) => setValues((p) => ({ ...p, bloodGroup: e.target.value }))}
            className={`${inputClass} uppercase`}
          >
            <option value="">{labels.selectBlood.toUpperCase()}</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <FieldLabel required>{labels.aadhaar}</FieldLabel>
          <input
            required
            inputMode="numeric"
            maxLength={14}
            value={values.aadhaar}
            onChange={(e) =>
              setValues((p) => ({ ...p, aadhaar: formatAadhaar(e.target.value) }))
            }
            placeholder={placeholders.aadhaar}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <FieldLabel required>{labels.mobile}</FieldLabel>
          <input
            required
            inputMode="numeric"
            maxLength={10}
            value={values.mobile}
            onChange={(e) =>
              setValues((p) => ({ ...p, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }))
            }
            placeholder={placeholders.mobile}
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <FieldLabel>{labels.email}</FieldLabel>
          <input
            type="email"
            value={values.email}
            onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))}
            placeholder={placeholders.email}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <FieldLabel>{labels.education}</FieldLabel>
          <input
            value={values.education}
            onChange={(e) => setValues((p) => ({ ...p, education: e.target.value }))}
            placeholder={placeholders.education}
            className={inputClass}
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <FieldLabel>{labels.profession}</FieldLabel>
          <input
            value={values.profession}
            onChange={(e) => setValues((p) => ({ ...p, profession: e.target.value }))}
            placeholder={placeholders.profession}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <FieldLabel required>{labels.currentAddress}</FieldLabel>
        <textarea
          required
          rows={3}
          value={values.currentAddress}
          onChange={(e) => setValues((p) => ({ ...p, currentAddress: e.target.value }))}
          placeholder={placeholders.currentAddress}
          className={inputClass}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* State */}
        <div className="space-y-1">
          <FieldLabel required>{labels.state}</FieldLabel>
          <select
            required
            value={values.state}
            onChange={(e) => handleStateChange(e.target.value)}
            className={`${inputClass} uppercase`}
          >
            <option value="">
              {(locale === "hi" ? "राज्य चुनें" : "Select State").toUpperCase()}
            </option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div className="space-y-1">
          <FieldLabel required>{labels.district}</FieldLabel>
          <select
            required
            value={values.district}
            onChange={(e) =>
              setValues((p) => ({ ...p, district: e.target.value }))
            }
            className={`${inputClass} uppercase`}
          >
            <option value="">
              {(locale === "hi" ? "जिला चुनें" : "Select District").toUpperCase()}
            </option>
            {getDistrictsForState(values.state).map((dist) => (
              <option key={dist} value={dist}>
                {dist.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {/* Tehsil */}
        <div className="space-y-1">
          <FieldLabel required>{labels.tehsil}</FieldLabel>
          <input
            required
            value={values.tehsil}
            onChange={(e) =>
              setValues((p) => ({ ...p, tehsil: e.target.value }))
            }
            placeholder={placeholders.tehsil}
            className={inputClass}
          />
        </div>

        {/* Division */}
        <div className="space-y-1">
          <FieldLabel required>{labels.division}</FieldLabel>
          <input
            required
            value={values.division}
            onChange={(e) =>
              setValues((p) => ({ ...p, division: e.target.value }))
            }
            placeholder={placeholders.division}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <FieldLabel required>{labels.pinCode}</FieldLabel>
          <input
            required
            inputMode="numeric"
            maxLength={6}
            value={values.pinCode}
            onChange={(e) =>
              setValues((p) => ({ ...p, pinCode: e.target.value.replace(/\D/g, "").slice(0, 6) }))
            }
            placeholder={placeholders.pinCode}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <FieldLabel>{labels.referenceNo}</FieldLabel>
          <input
            value={values.referenceNo}
            onChange={(e) =>
              setValues((p) => ({
                ...p,
                referenceNo: e.target.value.replace(/[^a-zA-Z0-9]/gi, "").slice(0, 30),
              }))
            }
            placeholder={placeholders.referenceNo}
            className={`${inputClass} uppercase`}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <FieldLabel>{labels.membershipType}</FieldLabel>
          <select
            value={values.membershipType}
            onChange={(e) => setValues((p) => ({ ...p, membershipType: e.target.value }))}
            className={`${inputClass} uppercase`}
          >
            <option value="temporary">{labels.temporary.toUpperCase()}</option>
            <option value="lifetime">{labels.lifetime.toUpperCase()}</option>
          </select>
        </div>
        <div className="space-y-1">
          <FieldLabel>{labels.place}</FieldLabel>
          <input
            value={values.place}
            onChange={(e) => setValues((p) => ({ ...p, place: e.target.value }))}
            placeholder={placeholders.place}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <FieldLabel required>{labels.date}</FieldLabel>
          <input
            type="date"
            required
            value={values.date}
            onChange={(e) => setValues((p) => ({ ...p, date: e.target.value }))}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[#f8fbfe] dark:bg-[var(--surface)] p-4 sm:p-5">
        <ContactPhotoUploader
          key={fileKey}
          value={photoUrl}
          onChange={handlePhotoChange}
          locale={locale}
          required
        />
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
        <p className="text-sm font-semibold text-[var(--ink)]">{labels.declaration}</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{labels.declarationText}</p>
        <label className="mt-3 flex items-start gap-2 text-sm text-[var(--ink)] cursor-pointer">
          <input
            type="checkbox"
            checked={values.declarationConsent}
            onChange={(e) => setValues((p) => ({ ...p, declarationConsent: e.target.checked }))}
            className="mt-0.5 h-4 w-4 rounded border-[var(--line)] accent-[var(--primary)]"
          />
          <span className="font-medium">
            {labels.declaration}
            <span className="ml-0.5 text-rose-500 font-bold">*</span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60 cursor-pointer"
      >
        {isSubmitting
          ? locale === "hi"
            ? "जमा हो रहा है..."
            : "Submitting..."
          : labels.submit}
      </button>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      {showSuccessPopup ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#0f2235]/65 px-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[var(--card)] border border-[var(--line)] p-8 text-center shadow-[0_30px_80px_rgba(15,34,53,0.25)]">
            <button
              type="button"
              onClick={() => setShowSuccessPopup(false)}
              className="absolute right-5 top-5 text-3xl leading-none text-[#6b7c8f] dark:text-slate-400 transition hover:text-[#143046] dark:hover:text-white"
              aria-label="Close success popup"
            >
              ×
            </button>
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(180deg,#e9f2ff,#dce9ff)] dark:bg-[linear-gradient(180deg,#12291d,#1a3a2a)]">
              <div className="h-10 w-10 rounded-full bg-[var(--primary)]" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-semibold text-[var(--ink)]">{labels.successTitle}</h3>
            <p className="mx-auto mt-4 max-w-md text-base sm:text-lg leading-relaxed text-[var(--muted)]">
              {labels.successMessage}
            </p>
          </div>
        </div>
      ) : null}
    </form>
  );
}

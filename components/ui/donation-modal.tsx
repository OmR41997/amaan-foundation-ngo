"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Icon } from "./icons";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale?: string;
}

export function DonationModal({ isOpen, onClose, locale = "en" }: DonationModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const isHindi = locale === "hi";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg my-auto flex flex-col max-h-[calc(100dvh-2rem)] overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] shadow-2xl transition-all duration-300">
        {/* Header Accent */}
        <div className="shrink-0 bg-gradient-to-r from-[#0b2e4f] via-[#16507f] to-[#17653a] px-5 sm:px-6 py-4 sm:py-5 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-white/80 bg-white shadow-md">
                <Image src="/images/logo/logo.png" alt="AAWF" fill sizes="44px" className="object-contain p-1" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold font-[var(--disp)] text-white truncate">
                  {isHindi ? "दान करें और बदलाव लाएँ" : "Donate & Make a Difference"}
                </h3>
                <p className="text-[11px] sm:text-xs text-emerald-200 truncate">
                  {isHindi ? "अमान अंसारी वेलफेयर फाउंडेशन" : "Amaan Ansari Welfare Foundation"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="shrink-0 rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white cursor-pointer"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Tax Exemption Banner */}
          <div className="flex items-start sm:items-center gap-3 rounded-2xl bg-[var(--mint)] p-3 sm:p-3.5 text-xs text-[var(--navy)] border border-[var(--green)]/20">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--green)] text-white shadow-xs">
              <Icon name="donate" className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold leading-snug">
                {isHindi ? "धारा 80G के तहत आयकर छूट उपलब्ध" : "Tax Exemption Available under 80G"}
              </p>
              <p className="opacity-80 text-[11px] sm:text-xs mt-0.5">
                {isHindi ? "पंजीयन क्र.: 122202639627 · आधिकारिक 80G रसीद" : "Govt Reg. No: 122202639627 · Official 80G Receipts"}
              </p>
            </div>
          </div>

          {/* Donation QR Code & Instant UPI Section */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-3.5 sm:p-4 space-y-3.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[var(--green)]">
                {isHindi ? "डोनेशन QR कोड एवं UPI" : "Donation QR Code & UPI"}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[var(--muted)] font-medium">GPay / PhonePe / Paytm / BHIM</span>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center rounded-xl bg-white p-4 border border-[var(--line)] shadow-xs">
              <div className="relative aspect-[542/628] w-44 sm:w-48 max-w-full overflow-hidden rounded-lg">
                <Image
                  src="/images/donations/donation-qr.jpg"
                  alt="Amaan Ansari Welfare Foundation Donation QR Code"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 176px, 192px"
                  priority
                />
              </div>
              <p className="mt-2 text-center text-[11px] text-[var(--muted)]">
                {isHindi ? "किसी भी UPI ऐप से स्कैन करके दान करें" : "Scan with any UPI app to donate"}
              </p>
              <a
                href="/images/donations/donation-qr.jpg"
                download="Amaan_Ansari_Foundation_QR.jpg"
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--green)] hover:underline"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>{isHindi ? "QR कोड डाउनलोड करें" : "Download QR Code"}</span>
              </a>
            </div>

            {/* UPI ID Box */}
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[var(--card)] p-3 border border-[var(--line)]">
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">UPI ID</p>
                <p className="font-mono text-xs sm:text-sm font-bold text-[var(--navy)] truncate select-all">idb260600764105@idbi</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard("idb260600764105@idbi", "upi_id")}
                className="shrink-0 rounded-lg bg-[var(--green)] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 active:scale-95 cursor-pointer"
              >
                {copiedField === "upi_id" ? (isHindi ? "✓ कॉपी हो गया!" : "✓ Copied!") : (isHindi ? "कॉपी करें" : "Copy")}
              </button>
            </div>

            {/* UPI Number Box */}
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[var(--card)] p-3 border border-[var(--line)]">
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
                  {isHindi ? "UPI नंबर" : "UPI Number"}
                </p>
                <p className="font-mono text-xs sm:text-sm font-bold text-[var(--navy)] truncate select-all">9993090959</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard("9993090959", "upi_num")}
                className="shrink-0 rounded-lg bg-[var(--green)] px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 active:scale-95 cursor-pointer"
              >
                {copiedField === "upi_num" ? (isHindi ? "✓ कॉपी हो गया!" : "✓ Copied!") : (isHindi ? "कॉपी करें" : "Copy")}
              </button>
            </div>
          </div>

          {/* Direct Bank Transfer (IDBI Bank) */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-3.5 sm:p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[var(--green)]">
                {isHindi ? "सीधा बैंक ट्रांसफर (NEFT / RTGS / IMPS)" : "Direct Bank Transfer"}
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2 py-1 border-b border-[var(--line)]">
                <span className="opacity-75 shrink-0">{isHindi ? "बैंक का नाम:" : "Bank Name:"}</span>
                <span className="font-bold text-right text-[var(--navy)]">IDBI BANK</span>
              </div>
              <div className="flex items-center justify-between gap-2 py-1 border-b border-[var(--line)]">
                <span className="opacity-75 shrink-0">{isHindi ? "खाता धारक:" : "Account Name:"}</span>
                <span className="font-semibold text-right text-[var(--navy)] truncate">AMAAN ANSARI WELFARE FOUNDATION</span>
              </div>
              <div className="flex items-center justify-between gap-2 py-1 border-b border-[var(--line)]">
                <span className="opacity-75 shrink-0">{isHindi ? "खाता संख्या:" : "Account Number:"}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[var(--navy)] select-all">0223102000019929</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("0223102000019929", "acc")}
                    className="text-[var(--green)] font-semibold hover:underline cursor-pointer"
                  >
                    {copiedField === "acc" ? (isHindi ? "✓ कॉपी" : "✓ Copied") : (isHindi ? "कॉपी" : "Copy")}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 py-1 border-b border-[var(--line)]">
                <span className="opacity-75 shrink-0">IFSC Code:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[var(--navy)] select-all">IBKL0000223</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("IBKL0000223", "ifsc")}
                    className="text-[var(--green)] font-semibold hover:underline cursor-pointer"
                  >
                    {copiedField === "ifsc" ? (isHindi ? "✓ कॉपी" : "✓ Copied") : (isHindi ? "कॉपी" : "Copy")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support note */}
          <div className="rounded-xl bg-amber-500/10 p-3 text-center text-xs text-amber-900 dark:text-amber-200 border border-amber-500/20">
            <p className="leading-relaxed opacity-90">
              {isHindi
                ? "दान के बाद 80G रसीद प्राप्त करने के लिए कृपया हमें +91-99930 90959 पर व्हाट्सएप करें या support@aawf.in पर ईमेल करें।"
                : "After donating, please share the transaction reference at +91-99930 90959 or support@aawf.in to receive your official 80G tax receipt."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 bg-[var(--bg)] px-5 sm:px-6 py-3.5 border-t border-[var(--line)] flex items-center justify-between">
          <span className="text-[11px] text-[var(--muted)] font-medium">
            {isHindi ? "सुरक्षित एवं सत्यापित" : "100% Verified & Secure"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn line sm rounded-full px-5 py-1.5 text-xs font-semibold cursor-pointer"
          >
            {isHindi ? "बंद करें" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

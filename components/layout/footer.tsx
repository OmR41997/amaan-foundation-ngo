"use client";

import { Link } from "@/i18n/navigation";
import { AppLocale } from "@/i18n/routing";
import { navLinks, getContent } from "@/content/site-content";
import NextLink from "next/link";
import Image from "next/image";
import { CloudStatusIcon } from "@/components/ui/cloud-status-icon";

export function Footer({ locale }: { locale: AppLocale }) {
  const data = getContent(locale);
  const isHindi = locale === "hi";
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer id="contact" className="site-footer relative overflow-hidden bg-gradient-to-b from-[#092642] via-[#061d33] to-[#041220] text-white">
      {/* Top Radiant Accent Border */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 opacity-90" />

      {/* Ambient Lighting Orbs */}
      <div className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-8 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Column 1: Brand & Foundation Credentials (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            {/* Logo & Foundation Name */}
            <Link href="/" className="group inline-flex items-center gap-3.5 transition-transform hover:opacity-95">
              <div className="relative h-13 w-13 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-full bg-white p-1 ring-2 ring-emerald-400/30 shadow-lg transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/logo/logo.png"
                  alt={isHindi ? "अमान अंसारी वेलफेयर फाउंडेशन लोगो" : "AAWF Logo"}
                  fill
                  className="object-contain p-0.5"
                  sizes="56px"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-emerald-300">
                  {isHindi ? "अमान अंसारी" : "AMAAN ANSARI"}
                </span>
                <span className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                  {isHindi ? "वेलफेयर फाउंडेशन" : "WELFARE FOUNDATION"}
                </span>
              </div>
            </Link>

            {/* Official Registration Badge */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-950/40 px-3 py-1.5 text-xs text-emerald-300 backdrop-blur-sm shadow-sm">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
              <span className="font-medium tracking-wide">
                {isHindi ? "पंजीयन क्र. 122202639627" : "Govt. Reg. No. 122202639627"}
              </span>
            </div>

            {/* Mission Tagline */}
            <p className="mt-3.5 text-xs sm:text-sm text-slate-300/85 leading-relaxed max-w-sm">
              {data.footerTagline}
            </p>

            {/* Foundation Core Focus Pillars */}
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-300">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.05] px-2.5 py-1 border border-white/10">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span>{isHindi ? "स्वास्थ्य सेवा" : "Healthcare Aid"}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.05] px-2.5 py-1 border border-white/10">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-amber-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21.42 10.922a1 1 0 0 0-.019-.838L12.83 3.18a2 2 0 0 0-1.66 0L2.6 10.084a1 1 0 0 0 0 1.832l8.57 6.908a2 2 0 0 0 1.66 0l6.71-5.409" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                <span>{isHindi ? "शिक्षा सहयोग" : "Child Education"}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.05] px-2.5 py-1 border border-white/10">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>{isHindi ? "राहत व सेवा" : "Community Welfare"}</span>
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase">
              {isHindi ? "त्वरित लिंक" : "Quick Links"}
            </h4>
            <div className="h-0.5 w-8 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full mt-2 mb-4" />
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href || "/"}
                    className="group inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300/85 hover:text-white transition-colors duration-200 py-0.5"
                  >
                    <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-emerald-400/80 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                      {data.nav[link.key]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Office Details (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase">
              {isHindi ? "संपर्क विवरण" : "Contact Details"}
            </h4>
            <div className="h-0.5 w-8 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full mt-2 mb-4" />

            <div className="space-y-4">
              {/* Address block */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-400/90 mb-0.5">
                    {isHindi ? "पंजीकृत कार्यालय" : "Registered Office"}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200/90 leading-snug">
                    {data.address}
                  </p>
                </div>
              </div>

              {/* Phone block */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-400/90 mb-0.5">
                    {isHindi ? "हेल्पलाइन व संपर्क" : "Helpline & Contact"}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-slate-200/90 font-medium">
                    <a href={`tel:${data.phone.replace(/\s+/g, "")}`} className="hover:text-emerald-300 transition-colors">
                      {data.phone}
                    </a>
                    {/* <span className="text-white/30">•</span> */}
                    {/* <a href="tel:+918962370822" className="hover:text-emerald-300 transition-colors">
                      +91 XXXXX XXXXX
                    </a> */}
                  </div>
                </div>
              </div>

              {/* Email block */}
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-400/90 mb-0.5">
                    {isHindi ? "आधिकारिक ईमेल" : "Official Email"}
                  </span>
                  <a
                    href={`mailto:${data.email}`}
                    className="block text-xs sm:text-sm text-slate-200/90 hover:text-emerald-300 transition-colors break-all"
                  >
                    {data.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Community & Admin Portal (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase">
              {isHindi ? "हमसे जुड़ें" : "Connect With Us"}
            </h4>
            <div className="h-0.5 w-8 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full mt-2 mb-4" />

            <p className="text-xs text-slate-300/80 leading-relaxed mb-4">
              {isHindi
                ? "हमारे राहत अभियानों, स्वास्थ्य शिविरों और सामाजिक सेवा के दैनिक अपडेट के लिए सोशल मीडिया पर जुड़ें।"
                : "Follow our social channels to witness transparent ground-level actions and humanitarian updates."}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="h-9 w-9 rounded-xl bg-[#1877f2] text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:shadow-blue-500/40"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="h-9 w-9 rounded-xl bg-[#e00] text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:shadow-red-500/40"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/amaan_ansari_foundation"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#f9a825] via-[#d62976] to-[#5b51d8] text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 hover:shadow-pink-500/40"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>

            {/* Admin Portal Card */}
            <div className="mt-6">
              <NextLink
                href="/admin/login"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/40 hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white/90 group-hover:text-emerald-300 transition-colors">
                      {isHindi ? "एडमिन पोर्टल" : "Admin Portal"}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isHindi ? "अधिकृत लॉगिन" : "Authorized Login"}
                    </div>
                  </div>
                </div>
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </NextLink>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal & Agency Credits */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col gap-4 text-xs text-slate-300/75">
          {/* Main Row: Copyright, Legal Links & Back to Top */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-slate-300/80">
              © {currentYear} {isHindi ? "अमान अंसारी वेलफेयर फाउंडेशन" : "Amaan Ansari Welfare Foundation"} (AAWF). {isHindi ? "सर्वाधिकार सुरक्षित।" : "All Rights Reserved."}
            </p>

            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <a href="#" className="hover:text-white transition-colors">
                {isHindi ? "गोपनीयता नीति" : "Privacy Policy"}
              </a>
              <span className="text-white/20">|</span>
              <a href="#" className="hover:text-white transition-colors">
                {isHindi ? "नियम व शर्तें" : "Terms & Conditions"}
              </a>
              <span className="text-white/20">|</span>
              <button
                type="button"
                onClick={handleScrollToTop}
                className="group inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                title={isHindi ? "शीर्ष पर जाएं" : "Scroll to Top"}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-400/25 transition-transform duration-200 group-hover:-translate-y-0.5">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                </span>
                <span className="text-xs font-medium">{isHindi ? "शीर्ष" : "Top"}</span>
              </button>
            </div>
          </div>

          {/* Sub Row: Mission Dedication & Agency Signature */}
          <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-[11px] text-slate-400">
              <span>{isHindi ? "मानवता और समाज सेवा के लिए समर्पित" : "Dedicated to Healthcare, Education & Compassion"}</span>
              <CloudStatusIcon isHindi={isHindi} />
            </div>

            {/* Developer Credit Pill */}
            <div className="group inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-950/40 hover:bg-emerald-900/50 hover:border-emerald-400/50 px-3 py-1 text-[11px] text-slate-300 transition-all duration-300 shadow-sm hover:shadow-[0_0_12px_rgba(16,185,129,0.25)] backdrop-blur-sm cursor-default">
              <span className="tracking-wide text-slate-300">Crafted by</span>
              <span className="flex items-center justify-center rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300 transition-transform duration-200 group-hover:scale-105">
                &lt;/&gt;
              </span>
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-200">
                EZ Softech
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

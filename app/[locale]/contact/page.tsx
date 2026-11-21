import { ContactForm } from "@/components/contact/contact-form";
import { ContactDirectory, ContactItem } from "@/components/contact/contact-directory";
import { ContactMap } from "@/components/contact/contact-map";
import { getContent } from "@/content/site-content";
import { AppLocale } from "@/i18n/routing";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const data = getContent(locale);
  return { title: data.nav.contact };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const data = getContent(locale);

  // Define contact numbers with designations and categories
  const contactList: ContactItem[] = [
    { number: "9993090959", designationEn: "Founder", designationHi: "संस्थापक", category: "leadership" },
    { number: "8357861900", designationEn: "Secretary", designationHi: "सचिव", category: "leadership" },
    { number: "9977537986", designationEn: "Treasurer", designationHi: "कोषाध्यक्ष", category: "leadership" },
    { number: "9300284122", designationEn: "Legal Advisor", designationHi: "विधि सलाहकार", category: "legal" },
    { number: "9827113771", designationEn: "Legal Advisor", designationHi: "विधि सलाहकार", category: "legal" },
    { number: "9827178142", designationEn: "Core Member", designationHi: "मुख्य सदस्य", category: "core" },
    { number: "8871995665", designationEn: "Core Member", designationHi: "मुख्य सदस्य", category: "core" },
    { number: "8085535224", designationEn: "Core Member", designationHi: "मुख्य सदस्य", category: "core" },
    { number: "8770442886", designationEn: "Core Member", designationHi: "मुख्य सदस्य", category: "core" },
    { number: "7582095555", designationEn: "Medical Support", designationHi: "चिकित्सा सहायता", category: "medical" },
    { number: "9301266659", designationEn: "Medical Support", designationHi: "चिकित्सा सहायता", category: "medical" },
    { number: "8085464145", designationEn: "Medical Support", designationHi: "चिकित्सा सहायता", category: "medical" },
    { number: "9921690664", designationEn: "Medical Support", designationHi: "चिकित्सा सहायता", category: "medical" },
  ];

  const labels =
    locale === "hi"
      ? {
          headingTag: "हमसे जुड़ें",
          officeTitle: "कार्यालय एवं सहायता विवरण",
          officeNote: "सदस्यता, सहयोग और सामुदायिक पहलों के लिए हमसे सीधे संपर्क करें।",
          supportTitle: "सहायता समय",
          supportHours: "प्रतिदिन 24/7 सहायता उपलब्ध",
          moreInfoTitle: "महत्वपूर्ण दिशानिर्देश",
          contactNumbersTitle: "संपर्क निर्देशिका",
          viewMap: "गूगल मैप्स पर देखें",
          verifiedNgo: "पंजीकृत जनकल्याण संस्था",
          moreInfo: [
            "सदस्यता सत्यापन 24-48 घंटे में पूरा किया जाता है।",
            "सभी सहायता व सहयोग अनुरोध पारदर्शी ढंग से दर्ज होते हैं।",
            "आवश्यकता व प्राथमिकता के अनुसार फील्ड टीम विज़िट करती है।",
          ],
          credentialsTitle: "संस्था मान्यता एवं विवरण",
          regNoLabel: "पंजीयन क्र.",
          regNoValue: "122202639627",
          societyAct: "छत्तीसगढ़ सोसायटी पंजीकरण अधिनियम के तहत विधिवत पंजीकृत गैर-लाभकारी संस्था।",
          pillars: ["चिकित्सा सहायता", "राशन राहत", "बाल शिक्षा", "सामुदायिक सेवा"],
        }
      : {
          headingTag: "Get In Touch",
          officeTitle: "Office & Support Details",
          officeNote: "Connect with us for membership, collaboration and community initiatives.",
          supportTitle: "Support Hours",
          supportHours: "Everyday, 24/7 Support Available",
          contactNumbersTitle: "Contact Directory",
          viewMap: "View on Google Maps",
          verifiedNgo: "Registered Welfare Foundation",
          moreInfoTitle: "Important Guidelines",
          moreInfo: [
            "Membership requests are verified within 24-48 hours.",
            "All support requests are logged for transparent follow-up.",
            "Field visits are scheduled based on urgency and need.",
          ],
          credentialsTitle: "Foundation Credentials",
          regNoLabel: "Reg. No.",
          regNoValue: "122202639627",
          societyAct: "Registered non-profit welfare foundation under CG Societies Registration Act.",
          pillars: ["Healthcare Aid", "Ration Relief", "Child Education", "Community Care"],
        };

  // Google Maps query pointing directly to the Foundation and its exact address
  const mapSearchQuery = encodeURIComponent(
    "Aman Ansari Foundation, House No. 1350/7, Tegi Manzil, Devi Nagar, Maharana Pratap Chowk, Bilaspur, Chhattisgarh"
  );
  const mapUrl = `https://www.google.com/maps?q=${mapSearchQuery}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapSearchQuery}&output=embed`;

  return (
    <div className="section-shell pt-10 sm:pt-12 md:pt-16 pb-16 md:pb-20">
      {/* Page Header */}
      <div className="flex flex-col items-start gap-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--green)]/30 bg-[var(--mint)] px-3 py-1 text-xs font-semibold text-[var(--green)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)] animate-pulse" />
          <span className="uppercase tracking-wider">{labels.headingTag}</span>
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-[var(--ink)]">
          {data.contact.title}
        </h1>
        <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-[var(--muted)]">
          {data.contact.subtitle}
        </p>
      </div>

      {/* Main Grid: Membership Form + Beside Cards (Fully Responsive & Bottom-Matched) */}
      <section className="mt-6 sm:mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
        {/* Left Column: Life / Temporary Membership Form */}
        <div className="md:col-span-7 flex flex-col">
          <ContactForm locale={locale} />
        </div>

        {/* Right Column: Contact Directory and Information Cards */}
        <aside className="md:col-span-5 flex flex-col justify-between gap-4 h-auto md:h-full">
          {/* 1. Contact Directory */}
          <div className="shrink-0 rounded-2xl sm:rounded-3xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-5 shadow-[0_12px_30px_rgba(20,48,70,0.05)]">
            <ContactDirectory
              contactList={contactList}
              locale={locale}
              title={labels.contactNumbersTitle}
            />
          </div>

          {/* 2. Office & Support Details Card */}
          <div className="shrink-0 rounded-2xl sm:rounded-3xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-5 shadow-[0_12px_30px_rgba(20,48,70,0.05)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5 sm:pb-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[var(--ink)]">{labels.officeTitle}</h2>
                <p className="text-[11px] sm:text-xs text-[var(--muted)]">{labels.officeNote}</p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[var(--mint)] px-2.5 py-1 text-[11px] font-semibold text-[var(--green)] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {labels.verifiedNgo}
              </span>
            </div>

            {/* Address Row */}
            <div className="mt-3 sm:mt-3.5 flex items-start gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl bg-[#f9fbf9] dark:bg-[var(--surface)] p-2.5 sm:p-3 border border-[var(--line)]/60">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--green)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <div className="flex-1 text-xs leading-relaxed text-[var(--muted)]">
                <strong className="block text-xs font-semibold text-[var(--ink)]">
                  {locale === "hi" ? "संस्थान का पंजीकृत पता" : "Registered Address"}
                </strong>
                <p className="mt-0.5">{data.address}</p>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 font-semibold text-[var(--green)] hover:underline"
                >
                  <span>{labels.viewMap}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Email & 24/7 Support Rows */}
            <div className="mt-2.5 grid grid-cols-1 xl:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-[var(--line)]/60 bg-[#f9fbf9] dark:bg-[var(--surface)] px-3 py-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <a
                  href={`mailto:${data.email}`}
                  className="truncate text-xs font-medium text-[var(--ink)] hover:text-[var(--green)]"
                  title={data.email}
                >
                  {data.email}
                </a>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-[var(--line)]/60 bg-[#f9fbf9] dark:bg-[var(--surface)] px-3 py-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <p className="truncate text-xs font-medium text-[var(--muted)]">
                  {labels.supportHours}
                </p>
              </div>
            </div>
          </div>

          {/* 3. Important Guidelines Card */}
          <div className="shrink-0 rounded-2xl sm:rounded-3xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-5 shadow-[0_12px_30px_rgba(20,48,70,0.05)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5 sm:pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--green)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </span>
                <h3 className="text-xs sm:text-sm font-bold tracking-tight text-[var(--ink)]">
                  {labels.moreInfoTitle}
                </h3>
              </div>
            </div>
            <ul className="mt-3 space-y-2">
              {labels.moreInfo.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-[var(--muted)]">
                  <span className="mt-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[9px] sm:text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Interactive Location Map Card with Dark Mode Satellite Default */}
          <ContactMap
            locale={locale}
            mapSearchQuery={mapSearchQuery}
            mapTitle={locale === "hi" ? "कार्यालय लोकेशन मैप" : "Office Location Map"}
            viewMapLabel={labels.viewMap}
          />

          {/* 5. Foundation Credentials Card */}
          <div className="shrink-0 rounded-2xl sm:rounded-3xl border border-[var(--line)] bg-[var(--card)] p-4 sm:p-5 shadow-[0_12px_30px_rgba(20,48,70,0.05)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5 sm:pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-[var(--mint)] text-[var(--green)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                <h3 className="text-xs sm:text-sm font-bold tracking-tight text-[var(--ink)]">
                  {labels.credentialsTitle}
                </h3>
              </div>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-[var(--green)] border border-emerald-200/80 dark:border-emerald-700/50 shrink-0">
                {labels.regNoLabel}: {labels.regNoValue}
              </span>
            </div>

            <p className="mt-2.5 sm:mt-3 text-xs leading-relaxed text-[var(--muted)]">
              {labels.societyAct}
            </p>

            <div className="mt-2.5 sm:mt-3 flex flex-wrap gap-1.5">
              {labels.pillars.map((pillar) => (
                <span
                  key={pillar}
                  className="rounded-lg border border-[var(--line)] bg-[#fafcf9] dark:bg-[var(--surface)] px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-[var(--ink)]"
                >
                  {pillar}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

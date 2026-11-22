import { ActivitiesGrid } from "@/components/ui/activities-grid";
import { getContent } from "@/content/site-content";
import { AppLocale } from "@/i18n/routing";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const data = getContent(locale);
  return { title: data.nav.work };
}

export default async function WhatWeDoPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const data = getContent(locale);
  const labels =
    locale === "hi"
      ? {
        subtitle:
          "हमारे कार्यक्रम तात्कालिक मदद के साथ-साथ सम्मानपूर्ण और दीर्घकालिक सामाजिक बदलाव पर केंद्रित हैं।",
        processTitle: "हम कैसे काम करते हैं",
        process: [
          "समुदाय की जरूरतों की पहचान और सुनवाई",
          "स्थानीय टीम और स्वयंसेवकों के साथ योजना",
          "पारदर्शी क्रियान्वयन और फॉलो-अप सहायता",
        ],
        sectionTag: "सामाजिक प्रभाव",
      }
      : {
        subtitle:
          "Our interventions combine immediate relief with dignity-first, long-term social development for vulnerable communities.",
        processTitle: "How We Work",
        process: [
          "Listen and map real community needs",
          "Co-design interventions with field teams and volunteers",
          "Deliver transparently with follow-up support",
        ],
        sectionTag: "Social Impact",
      };

  return (
    <div className="section-shell space-y-10 pt-10 sm:pt-12 md:pt-16 pb-16 md:pb-20">
      <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[linear-gradient(130deg,#ffffff,#e9f3fb)] dark:bg-[linear-gradient(130deg,#10231a,#132b20)] shadow-xs">
        <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:items-center md:p-10">
          <div>
            <p className="text-xs tracking-[0.14em] text-[var(--muted)] uppercase">{labels.sectionTag}</p>
            <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-[var(--ink)]">{data.nav.work}</h1>
            <p className="mt-3.5 max-w-2xl text-sm sm:text-base leading-relaxed text-[var(--muted)]">{labels.subtitle}</p>
          </div>
          <div className="relative h-56 overflow-hidden rounded-2xl md:h-72">
            <Image
              src="/images/setting/whatwedo.png"
              alt="Volunteers helping families in community outreach"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 md:p-8 shadow-xs">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--ink)]">{labels.processTitle}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {labels.process.map((item, idx) => (
            <article key={item} className="border-l-4 border-[var(--primary)] bg-[#f8fcff] dark:bg-[var(--mint)]/60 border-y border-r border-[var(--line)] rounded-r-xl p-4">
              <p className="text-xs font-semibold tracking-[0.1em] text-[var(--primary)] uppercase">
                Step {idx + 1}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <ActivitiesGrid locale={locale} />
    </div>
  );
}

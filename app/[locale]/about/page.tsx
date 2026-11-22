import { Reveal } from "@/components/motion/transitions";
import { AppLocale } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { FounderImage } from "@/components/ui/founder-image";
import { getFounderPresidentImage } from "@/lib/api/teams";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const formation = (t.raw("formation.paragraphs") as string[])[0] ?? "";
  return {
    title: t("meta.title"),
    description: formation.slice(0, 165),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });

  const formationParagraphs = (t.raw("formation.paragraphs") as string[]) || [];
  const objectiveAreas = (t.raw("objectives.areas") as string[]) || [];
  const achievementItems = (t.raw("achievements.items") as string[]) || [];
  const futureVisionParagraphs = (t.raw("futureVision.paragraphs") as string[]) || [];
  const isHindi = locale === "hi";

  const founderAlt = isHindi ? "संस्थापक अलीम अंसारी" : "Founder Alim Ansari portrait";
  const founderImage = await getFounderPresidentImage();

  const coreValues = isHindi
    ? [
        {
          title: "निःस्वार्थ सेवा",
          desc: "बिना किसी भेदभाव के हर जरूरतमंद तक स्वास्थ्य, शिक्षा और राहत पहुँचाने का अटूट संकल्प।",
          icon: "heart",
        },
        {
          title: "पारदर्शिता एवं सत्यनिष्ठा",
          desc: "हर एक पाई और संसाधन का शत-प्रतिशत जवाबदेह और पारदर्शी उपयोग।",
          icon: "star",
        },
        {
          title: "सहानुभूति व सम्मान",
          desc: "हर व्यक्ति को सम्मान और आत्मसम्मान के साथ जीवन जीने के अवसर उपलब्ध कराना।",
          icon: "people",
        },
        {
          title: "दीर्घकालिक प्रभाव",
          desc: "तात्कालिक सहायता के साथ-साथ शिक्षा व रोजगार द्वारा परिवारों को स्वावलंबी बनाना।",
          icon: "cap",
        },
      ]
    : [
        {
          title: "Selfless Service",
          desc: "An unwavering pledge to deliver healthcare, education, and relief to those in need without distinction.",
          icon: "heart",
        },
        {
          title: "Total Transparency",
          desc: "Every donation, resource, and effort is accounted for with complete institutional transparency.",
          icon: "star",
        },
        {
          title: "Dignity & Compassion",
          desc: "Treating every individual and child with love, deep respect, and honoring their inherent dignity.",
          icon: "people",
        },
        {
          title: "Lasting Impact",
          desc: "Beyond immediate aid, empowering families toward long-term self-reliance through education and skills.",
          icon: "cap",
        },
      ];

  return (
    <div className="section-shell space-y-12 sm:space-y-16 pt-10 sm:pt-12 md:pt-16 pb-16 md:pb-24">
      {/* 1. Header Banner */}
      <Reveal>
        <header className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[#eaf5fb] via-white to-[#fff6ed] dark:from-[#10231a] dark:via-[#132b20] dark:to-[#0f2235] p-6 sm:p-8 md:p-12 shadow-xs">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--green)]/25 bg-[var(--mint)] px-3.5 py-1 text-xs font-semibold text-[var(--green)] shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-[var(--green)] animate-pulse" />
            <span className="tracking-wide uppercase">{t("registration")}</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--navy)] dark:text-[var(--ink)]" style={{ fontFamily: "var(--disp)" }}>
            {t("pageTitle")}
          </h1>
          <div className="mt-4 max-w-4xl space-y-3 text-sm sm:text-base leading-relaxed text-[var(--muted)]">
            {formationParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/${locale}/contact`} className="btn fill sm">
              <span>{isHindi ? "हमसे जुड़ें" : "Join Our Mission"}</span>
              <Icon name="arrow" />
            </Link>
            <Link href={`/${locale}/amaans-story`} className="btn line sm">
              <span>{isHindi ? "अमान की कहानी पढ़ें" : "Read Amaan's Story"}</span>
            </Link>
          </div>
        </header>
      </Reveal>

      {/* 2. Founder Section */}
      <Reveal delay={0.05}>
        <section className="grid gap-8 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 md:grid-cols-[0.8fr_1.2fr] md:p-10 shadow-xs items-center">
          <div className="relative h-80 sm:h-96 md:h-[460px] w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg)] shadow-xs">
            <FounderImage
              initialSrc={founderImage}
              alt={founderAlt}
              priority
              className="object-contain p-2"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              {isHindi ? "संस्था की नींव" : "Foundation Leadership"}
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--navy)] dark:text-[var(--ink)]" style={{ fontFamily: "var(--disp)" }}>
              {t("labels.founderTitle")}
            </h2>
            <p className="mt-2 text-xs sm:text-sm font-semibold text-[var(--primary)]">
              Alim Ansari · {t("labels.founderRole")}
            </p>
            <div className="mt-4 space-y-3 text-sm sm:text-base leading-relaxed text-[var(--muted)] whitespace-pre-line">
              {t("labels.founderBio")}
            </div>
          </div>
        </section>
      </Reveal>

      {/* 3. Core Values */}
      <Reveal delay={0.06}>
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              {isHindi ? "हमारे सिद्धांत" : "Core Values"}
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-[var(--navy)] dark:text-[var(--ink)]" style={{ fontFamily: "var(--disp)" }}>
              {t("labels.ngoDetailsTitle")}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((val) => (
              <div
                key={val.title}
                className="group rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-xs transition duration-300 hover:border-[var(--green)] hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--mint)] text-[var(--green)] mb-4 group-hover:scale-105 transition-transform">
                  <Icon name={val.icon} className="h-6 w-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--ink)]">{val.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--muted)]">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 4. Objectives & Focus Areas */}
      {objectiveAreas.length > 0 && (
        <Reveal delay={0.07}>
          <section className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 md:p-10 shadow-xs">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--navy)] dark:text-[var(--ink)]" style={{ fontFamily: "var(--disp)" }}>
              {t("labels.objectivesSectionTitle")}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--muted)] leading-relaxed">
              {t("objectives.primary")}
            </p>
            <p className="mt-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[var(--primary)]">
              {t("objectives.areasIntro")}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {objectiveAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-3.5 sm:p-4 transition hover:border-[var(--green)]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--green)] text-xs font-bold text-white shadow-xs">
                    ✓
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[var(--ink)]">{area}</span>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* 5. Achievements & Future Vision */}
      <Reveal delay={0.08}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Achievements */}
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                {isHindi ? "सराहना व पहचान" : "Milestones"}
              </span>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-[var(--navy)] dark:text-[var(--ink)]" style={{ fontFamily: "var(--disp)" }}>
                {t("labels.achievementsSectionTitle")}
              </h2>
              <div className="mt-4 space-y-3">
                {achievementItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-[var(--muted)] leading-relaxed">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-[var(--green)]">
                      ★
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Future Vision */}
          <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--mint)]/40 via-[var(--surface)] to-[var(--mint)]/20 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                {isHindi ? "आगे का संकल्प" : "Our Horizon"}
              </span>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold text-[var(--navy)] dark:text-[var(--ink)]" style={{ fontFamily: "var(--disp)" }}>
                {t("labels.futureVisionTitle")}
              </h2>
              <div className="mt-4 space-y-3 text-sm text-[var(--muted)] leading-relaxed">
                {futureVisionParagraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--line)]/60 flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--green)]">
                {isHindi ? "अमान अंसारी मेमोरियल संस्थान" : "Amaan Ansari Memorial Institution"}
              </span>
              <Link href={`/${locale}/amaans-story`} className="text-xs font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1">
                <span>{isHindi ? "कहानी देखें" : "Explore"}</span>
                <Icon name="arrow" className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

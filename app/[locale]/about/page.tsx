import { Reveal } from "@/components/motion/transitions";
import { AppLocale } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
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

  const formationParagraphs = t.raw("formation.paragraphs") as string[];

  const founderAlt = locale === "hi" ? "संस्थापक अलीम अंसारी" : "Founder Alim Ansari portrait";

  return (
    <div className="section-shell space-y-12 pt-10 sm:pt-12 md:pt-16 pb-16 md:pb-20">
      <Reveal>
        <header className="rounded-3xl bg-[linear-gradient(130deg,#ffffff,#eef6fc)] dark:bg-[linear-gradient(130deg,#10231a,#132b20)] p-6 sm:p-8 md:p-10 border border-[var(--line)] shadow-xs">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-[var(--ink)]">{t("pageTitle")}</h1>
          <p className="mt-3 text-xs font-semibold tracking-[0.1em] text-[var(--primary)] uppercase">{t("registration")}</p>
          <p className="mt-5 max-w-4xl text-sm sm:text-base leading-relaxed text-[var(--muted)]">{formationParagraphs[0]}</p>
        </header>
      </Reveal>

      <Reveal delay={0.05}>
        <section className="grid gap-6 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 md:grid-cols-[0.75fr_1.25fr] md:p-10 shadow-xs">
          <div className="relative h-80 sm:h-96 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg)] md:h-[440px]">
            <Image
              src="/images/team/alim.jpeg"
              alt={founderAlt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--ink)]">{t("labels.founderTitle")}</h2>
            <p className="mt-2 text-xs sm:text-sm font-semibold text-[var(--primary)]">Alim Ansari · {t("labels.founderRole")}</p>
            <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-[var(--muted)] whitespace-pre-line">{t("labels.founderBio")}</p>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

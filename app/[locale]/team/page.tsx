import { TeamGrid } from "@/components/ui/team-grid";
import { getContent } from "@/content/site-content";
import { AppLocale } from "@/i18n/routing";
import { Metadata } from "next";
import { teamMembers } from "@/data/team";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const data = getContent(locale);
  return { title: data.nav.team };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;

  return (
    <div className="section-shell pt-10 sm:pt-12 md:pt-16 pb-16 md:pb-20">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">{locale === "hi" ? "हमारी टीम" : "Our Team"}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--muted)] md:text-base">
        {locale === "hi"
          ? "हमारी 39-सदस्यीय टीम सेवा, संवेदनशीलता और जवाबदेही के साथ समुदाय के साथ खड़ी है।"
          : "Our 39-member team brings compassion, discipline and accountability to every community initiative."}
      </p>
      <p className="mt-2 text-sm text-[var(--muted)]">{teamMembers.length} members</p>
      <section className="mt-8 md:mt-10">
        <TeamGrid />
      </section>
    </div>
  );
}

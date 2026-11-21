import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
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
  return { title: data.nav.gallery };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const data = getContent(locale);

  return (
    
    <div className="section-shell pt-10 sm:pt-12 md:pt-16 pb-16 md:pb-20">
      <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[#eaf5fb] via-white to-[#fff6ed] dark:from-[#10231a] dark:via-[#132b20] dark:to-[#0f2235] px-6 py-8 md:px-10 shadow-xs">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Our work in motion</p>
        <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-[var(--ink)]">{data.nav.gallery}</h1>
        <p className="mt-3.5 max-w-2xl text-sm sm:text-base leading-relaxed text-[var(--muted)]">A glimpse into the people, programs, and moments that make our community stronger.</p>
      </div>
      <section className="mt-8 md:mt-10">
        <GalleryLightbox
          locale={locale}
        />
      </section>
    </div>
    
  );
}

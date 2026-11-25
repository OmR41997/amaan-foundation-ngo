import { AMAAN_GALLERY, NEWS_GALLERY, amaansStoryContent } from "@/content/amaans-story";
import { ImageGridLightbox } from "@/components/ui/image-grid-lightbox";
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import { Reveal } from "@/components/motion/transitions";
import { Icon } from "@/components/ui/icons";
import { AppLocale } from "@/i18n/routing";
import { fetchGalleryItems } from "@/lib/api/gallery";
import type { Metadata } from "next";
import type { ReactNode } from "react";

async function getNostalgiaImages(defaultAlt: string): Promise<{ images: string[]; alts: string[] }> {
  try {
    const res = await fetchGalleryItems({
      eventType: "nostalgia",
      isPublished: true,
      limit: 100,
    });

    const items = res?.data;
    if (Array.isArray(items) && items.length > 0) {
      const valid = items.filter((item) => Boolean(item.photoUrl));
      if (valid.length > 0) {
        return {
          images: valid.map((item) => item.photoUrl),
          alts: valid.map((item, i) =>
            item.eventName ? `${item.eventName} (${i + 1})` : `${defaultAlt} (${i + 1})`
          ),
        };
      }
    }
  } catch (err) {
    console.warn("Could not fetch nostalgia images from Gallery API, falling back:", err);
  }

  // Fallback 1: Local gallery collection from @/data/gallery
  try {
    const { getStaticNostalgiaItems } = await import("@/data/gallery");
    const nostalgiaList = getStaticNostalgiaItems();
    if (nostalgiaList.length > 0) {
      return {
        images: nostalgiaList.map((item) => item.photoUrl),
        alts: nostalgiaList.map((item, i) =>
          item.eventName ? `${item.eventName} (${i + 1})` : `${defaultAlt} (${i + 1})`
        ),
      };
    }
  } catch {
    // ignore
  }

  // Fallback 2: Legacy static AMAAN_GALLERY
  return {
    images: AMAAN_GALLERY,
    alts: AMAAN_GALLERY.map((_, i) => `${defaultAlt} (${i + 1})`),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = amaansStoryContent[locale];
  return {
    title: `${c.metaTitle} | ${c.orgName}`,
    description: c.leadQuote,
  };
}

function SectionHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">
      {children}
    </h2>
  );
}

export default async function AmaansStoryPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const c = amaansStoryContent[locale];
  const { images: nostalgiaImages, alts: nostalgiaAlts } = await getNostalgiaImages(c.imageAltAmaan);

  return (
    <article className="section-shell pt-10 sm:pt-12 md:pt-16 pb-16 md:pb-24">
      {/* Page Header */}
      <Reveal>
        <header className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[#eaf5fb] via-white to-[#fff6ed] p-6 sm:p-8 md:p-12 shadow-sm dark:from-[#0d231b] dark:via-[#11291f] dark:to-[#0f1f2d]">
          {/* Subtle Decorative Ambient Glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--green)]/10 blur-3xl dark:bg-[var(--green)]/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[var(--gold)]/10 blur-3xl dark:bg-[var(--gold)]/15"
          />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--green)]/25 bg-[var(--mint)]/80 px-3.5 py-1 text-xs font-semibold text-[var(--green)] shadow-2xs backdrop-blur-xs dark:border-[var(--green)]/35 dark:bg-[var(--green)]/15 dark:text-[#88e2a3]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--green)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--green)]" />
                </span>
                <span className="tracking-[0.12em] uppercase">{c.orgName}</span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--navy)] sm:text-4xl md:text-5xl dark:text-[var(--ink)]">
                {c.metaTitle}
              </h1>

              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="shrink-0 select-none font-serif text-3xl leading-none text-[var(--gold)] opacity-70"
                >
                  &ldquo;
                </span>
                <p className="text-sm font-medium leading-relaxed text-[var(--muted)] sm:text-base md:text-lg italic">
                  {c.leadQuote}
                </p>
              </div>

              {/* Key Pillars / Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-xs font-medium text-[var(--foreground)] shadow-2xs backdrop-blur-xs dark:bg-white/5">
                  <Icon name="cal" className="h-3.5 w-3.5 text-[var(--green)]" />
                  <span>{locale === "hi" ? "स्थापना: 9 सितंबर 2021" : "Est. 9 Sep 2021"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-xs font-medium text-[var(--foreground)] shadow-2xs backdrop-blur-xs dark:bg-white/5">
                  <Icon name="healthcare-education" className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{locale === "hi" ? "स्वास्थ्य एवं शिक्षा" : "Healthcare & Education"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white/70 px-3 py-1 text-xs font-medium text-[var(--foreground)] shadow-2xs backdrop-blur-xs dark:bg-white/5">
                  <Icon name="gullak" className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                  <span>{locale === "hi" ? "प्रोजेक्ट गुल्लक" : "Project Gullak"}</span>
                </span>
              </div>
            </div>

            {/* Memorial Badge Card on the right */}
            <div className="hidden lg:flex flex-col items-center justify-center rounded-2xl border border-[var(--line)] bg-white/60 p-5 text-center shadow-xs backdrop-blur-md dark:bg-black/25 sm:w-64 shrink-0">
              <div className="mb-2.5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--mint)] text-[var(--green)] shadow-inner dark:bg-[var(--green)]/20">
                <Icon name="heart" className="h-6 w-6 text-[var(--green)]" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--primary)]">
                {locale === "hi" ? "अमर स्मृति" : "In Everlasting Memory"}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[var(--foreground)]">
                Amaan Ansari
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-[var(--muted)]">
                {locale === "hi"
                  ? "प्रेरणा से सेवा तक — हर जरूरतमंद के चेहरे पर मुस्कान लाने का संकल्प।"
                  : "From sorrow to service — keeping his memory alive through hope."}
              </p>
            </div>
          </div>
        </header>
      </Reveal>

      <div className="mx-auto mt-10 max-w-4xl space-y-12 md:mt-14 md:space-y-16">
        {/* Who was Amaan */}
        <Reveal delay={0.05}>
          <section aria-labelledby="story-who" className="space-y-5 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 md:p-10 shadow-xs">
            <SectionHeading id="story-who">{c.whoTitle}</SectionHeading>
            <div className="space-y-4">
              {c.whoParagraphs.map((p, idx) => (
                <p key={idx} className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                  {p}
                </p>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Amaan Gallery / Memories */}
        <Reveal delay={0.06}>
          <section aria-labelledby="story-gallery-amaan" className="space-y-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
                {locale === "hi" ? "स्मृति संग्रह" : "Memorial Gallery"}
              </p>
              <SectionHeading id="story-gallery-amaan">{c.galleryAmaanHeading}</SectionHeading>
              <p className="text-xs text-[var(--muted)] sm:text-sm">
                {locale === "hi"
                  ? "किसी भी चित्र पर क्लिक करके उसे बड़े आकार में देखें。"
                  : "Click on any photo to view in high resolution."}
              </p>
            </div>

            <ImageGridLightbox
              images={nostalgiaImages}
              alts={nostalgiaAlts}
              thumbnailHeight="aspect"
              aspectRatio="aspect-[3/4]"
              fitMode="cover"
              gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 sm:gap-4 lg:gap-5"
              initialLimit={8}
              showMoreLabel={locale === "hi" ? "सभी यादें देखें" : "View all photos"}
              showLessLabel={locale === "hi" ? "कम दिखाएं" : "Show fewer"}
              closeLabel={locale === "hi" ? "बंद करें" : "Close"}
              prevLabel={locale === "hi" ? "पिछला चित्र" : "Previous"}
              nextLabel={locale === "hi" ? "अगला चित्र" : "Next"}
            />
          </section>
        </Reveal>

        {/* Press Coverage & News Clippings */}
        <Reveal delay={0.07}>
          <section aria-labelledby="story-news" className="space-y-6">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
                {c.galleryNewsHeading}
              </p>
              <h2 id="story-news" className="text-xl font-bold text-[var(--foreground)] md:text-2xl">
                {c.newsBannerTitle}
              </h2>
              <p className="text-xs text-[var(--muted)] sm:text-sm">
                {c.newsBannerSubtitle}
              </p>
            </div>

            <ImageGridLightbox
              images={NEWS_GALLERY}
              alts={NEWS_GALLERY.map((_, i) => `${c.imageAltNews} (${i + 1})`)}
              thumbnailHeight="aspect"
              aspectRatio="aspect-[4/5]"
              fitMode="contain"
              gridClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              closeLabel={locale === "hi" ? "बंद करें" : "Close"}
              prevLabel={locale === "hi" ? "पिछला" : "Previous"}
              nextLabel={locale === "hi" ? "अगला" : "Next"}
            />
          </section>
        </Reveal>

        {/* Project Gullak Section */}
        <Reveal delay={0.075}>
          <section
            aria-labelledby="story-gullak"
            className="space-y-6 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 md:p-10 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Icon name="gullak" className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-600 dark:text-amber-400">
                  {locale === "hi" ? "विशेष पहल" : "Special Initiative"}
                </p>
                <SectionHeading id="story-gullak">{c.projectGullakTitle}</SectionHeading>
              </div>
            </div>

            <div className="space-y-3.5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              {c.gullakIntro.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* How it works */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-5 sm:p-6 space-y-3">
              <h3 className="text-base font-bold text-[var(--foreground)] sm:text-lg">
                {c.gullakWorkingTitle}
              </h3>
              <ul className="space-y-2">
                {c.gullakWorkingItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gullak Gallery */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
                {locale === "hi" ? "गुल्लक वितरण एवं गतिविधियाँ" : "Gullak Distribution & Outreach"}
              </h3>
              <GalleryLightbox
                locale={locale}
                initialCategory="gullak"
                hideFilters={true}
                limit={6}
                columnsClassName="columns-1 gap-4 sm:columns-2 lg:columns-3"
                disableScroll={true}
              />
            </div>

            {/* Goal quote */}
            <blockquote className="rounded-2xl border-l-4 border-amber-500 bg-amber-50/60 dark:bg-amber-950/20 p-4 text-sm font-medium italic text-[var(--foreground)]">
              {c.orgGoalQuote}
            </blockquote>
          </section>
        </Reveal>

        {/* Inspiration */}
        <Reveal delay={0.08}>
          <section
            aria-labelledby="story-inspiration"
            className="space-y-4 rounded-3xl border border-[var(--primary)]/20 bg-gradient-to-br from-[var(--surface)] to-emerald-50/30 p-6 sm:p-8 md:p-10 shadow-xs dark:to-emerald-950/20"
          >
            <SectionHeading id="story-inspiration">{c.inspirationTitle}</SectionHeading>
            <div className="space-y-3">
              {c.inspirationParagraphs.map((p, idx) => (
                <p key={idx} className="text-base font-medium leading-relaxed text-[var(--foreground)] sm:text-lg">
                  {p}
                </p>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Office Contact Info */}
        <Reveal delay={0.09}>
          <address className="not-italic rounded-3xl border border-[var(--line)] bg-[#f6fafd] p-6 text-[var(--foreground)] shadow-xs dark:bg-[var(--card)] md:p-8">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
              {c.officeHeading}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              {c.officeAddress}
            </p>
          </address>
        </Reveal>
      </div>
    </article>
  );
}

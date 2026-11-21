import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { LocaleHtmlSync } from "@/components/layout/locale-html-sync";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/motion/transitions";
import { SvgDefs } from "@/components/ui/icons";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "hi")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleHtmlSync locale={locale} />
      <SvgDefs />
      <ScrollProgress />
      <Header locale={locale as "en" | "hi"} />
      <main className="flex-1 min-h-[calc(100vh-160px)]">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer locale={locale as "en" | "hi"} />
    </NextIntlClientProvider>
  );
}

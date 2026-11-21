"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { AppLocale } from "@/i18n/routing";
import { navLinks, getContent } from "@/content/site-content";
import { LanguageSwitcher } from "./language-switcher";
import { Icon } from "@/components/ui/icons";
import { DonationModal } from "@/components/ui/donation-modal";
import Image from "next/image";

export function Header({ locale }: { locale: AppLocale }) {
  const pathname = usePathname();
  const data = getContent(locale);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHindi = locale === "hi";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aawf-theme");
      if (saved === "dark" || saved === "light") {
        document.documentElement.dataset.theme = saved;
        queueMicrotask(() => setTheme(saved));
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.dataset.theme = "dark";
        queueMicrotask(() => setTheme("dark"));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("aawf-theme", next);
    } catch {
      // ignore
    }
  };

  const isLinkActive = (href: string) => {
    const target = href || "/";
    if (target === "/") return pathname === "/";
    return pathname.startsWith(target);
  };

  return (
    <>
      <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="nav">
          <Link className="brand" href="/">
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-full bg-white p-1 border-2 border-white shadow-md">
              <Image
                src="/images/logo/logo.png"
                alt={isHindi ? "अमान अंसारी वेलफेयर फाउंडेशन लोगो" : "AAWF Logo"}
                fill
                priority
                className="object-contain p-0.5"
                sizes="(max-width: 640px) 48px, 56px"
              />
            </div>
            <span>
              <em>{isHindi ? "अमान अंसारी" : "AMAAN ANSARI"}</em>
              <b>{isHindi ? "वेलफेयर फाउंडेशन" : "WELFARE FOUNDATION"}</b>
            </span>
          </Link>

          <nav className="main-nav" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const href = link.href || "/";
              const active = isLinkActive(href);
              return (
                <Link
                  key={link.key}
                  href={href}
                  className={active ? "active font-semibold text-[var(--green)]" : ""}
                >
                  {data.nav[link.key]}
                </Link>
              );
            })}
          </nav>

          <LanguageSwitcher locale={locale} />

          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDonateOpen(true)}
            className="btn fill sm beat inline-flex items-center gap-2 font-bold tracking-wide shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap"
          >
            <Icon name="donate" className="h-4 w-4.5" />
            <span className="font-bold tracking-wide">{isHindi ? "दान करें" : "Donate Now"}</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--ink)] lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="border-t border-[var(--line)] bg-[var(--card)] px-6 py-4 lg:hidden space-y-2">
            {navLinks.map((link) => {
              const href = link.href || "/";
              const active = isLinkActive(href);
              return (
                <Link
                  key={link.key}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-xl px-4 py-2 text-sm font-semibold ${
                    active
                      ? "bg-[var(--mint)] text-[var(--green)]"
                      : "text-[var(--ink)] hover:bg-[var(--mint)] hover:text-[var(--green)]"
                  }`}
                >
                  {data.nav[link.key]}
                </Link>
              );
            })}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsDonateOpen(true);
                }}
                className="btn fill w-full justify-center text-sm py-2.5 font-bold tracking-wide shadow-sm beat cursor-pointer"
              >
                <Icon name="donate" className="h-4 w-4.5" />
                <span>{isHindi ? "दान करें" : "Donate Now"}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        locale={locale}
      />
    </>
  );
}

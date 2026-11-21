"use client";

import { usePathname } from "@/i18n/navigation";
import { AppLocale, routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

export function LanguageSwitcher({ locale }: { locale: AppLocale }) {
  const pathname = usePathname();

  return (
    <div className="lang" role="group" aria-label="Language">
      {routing.locales.map((item) => {
        const active = item === locale;
        return (
          <Link
            key={item}
            href={pathname}
            locale={item}
            className={`btn-lang ${active ? "on" : ""}`}
            style={{
              padding: "3.5px 7.5px",
              borderRadius: "30px",
              fontSize: "11px",
              fontWeight: 600,
              background: active ? "var(--green)" : "transparent",
              color: active ? "#ffffff" : "var(--ink)",
              display: "inline-block",
              transition: "all 0.25s ease",
            }}
          >
            {item === "en" ? "EN" : "हिं"}
          </Link>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect } from "react";

export function LocaleHtmlSync({ locale }: { locale: string }) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.setAttribute("data-lang", locale);
    }
  }, [locale]);

  return null;
}

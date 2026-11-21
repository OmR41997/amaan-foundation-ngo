"use client";

import { getContent } from "@/content/site-content";
import { AppLocale } from "@/i18n/routing";
import { motion } from "framer-motion";

export function ActivitiesGrid({ locale }: { locale: AppLocale }) {
  const data = getContent(locale);
  const label = locale === "hi" ? "कार्यक्रम" : "Program";

  return (
    <section className="mt-10 grid gap-5 md:grid-cols-2">
      {data.activities.map((activity, index) => (
        <motion.article
          key={activity.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
          whileHover={{ y: -6 }}
          className="group rounded-3xl border border-[var(--line)] bg-[linear-gradient(180deg,#ffffff,#f6fbff)] dark:bg-[linear-gradient(180deg,#10231a,#12291d)] p-6 shadow-[0_10px_28px_rgba(20,48,70,0.05)]"
        >
          <div className="flex items-center justify-between">
            <p className="rounded-full border border-[var(--line)] bg-white dark:bg-[var(--mint)] px-3 py-1 text-xs tracking-[0.12em] text-[var(--muted)] uppercase">
              {label}
            </p>
            <p className="text-sm font-semibold text-[var(--primary)]">{String(index + 1).padStart(2, "0")}</p>
          </div>
          <h2 className="mt-3.5 text-lg sm:text-xl font-bold leading-snug text-[var(--ink)]">{activity.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{activity.description}</p>
          <div className="mt-5 h-1.5 w-14 rounded-full bg-[#d9e9f6] dark:bg-white/20 transition-all duration-300 group-hover:w-24 group-hover:bg-[var(--primary)]" />
        </motion.article>
      ))}
    </section>
  );
}

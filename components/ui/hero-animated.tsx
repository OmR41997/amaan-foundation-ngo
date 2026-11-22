"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { HeroCarousel } from "./hero-carousel";
import Image from "next/image";
import React from "react";

const MotionLink = motion(Link);

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

function AnimatedHeadline({ text }: { text: string }) {
  return (
    <h1 className="mt-4 max-w-3xl text-2xl leading-snug md:text-3xl lg:text-[2.15rem]">
      {text}
    </h1>
  );
}

export function HeroAnimated({
  registration,
  tagline,
  headline,
  introLines,
  ctaLabel,
  storyLabel,
}: {
  eyebrow?: string;
  registration: string;
  tagline: string;
  headline: string;
  introLines: string[];
  ctaLabel: string;
  storyLabel: string;
}) {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full"
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <motion.div variants={item} className="space-y-3">
          <motion.div 
            variants={item} 
            className="flex items-center justify-start gap-4 md:gap-6 lg:gap-8"
          >
            {/* Foundation Official Logo */}
            <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
              <Image
                src="/images/logo/logo.png"
                alt="Amaan Ansari Welfare Foundation Logo"
                width={128}
                height={128}
                className="w-full h-full object-contain drop-shadow-md"
                priority
              />
            </div>
          </motion.div>
          <motion.p variants={item} className="mt-2 text-xs font-semibold tracking-[0.08em] text-(--primary) uppercase">
            {registration}
          </motion.p>
          <motion.p variants={item} className="mt-5 max-w-2xl text-base font-medium italic leading-snug text-(--primary) md:text-lg">
            {tagline}
          </motion.p>

          <AnimatedHeadline text={headline} />

          <motion.div variants={item} className="mt-5 max-w-2xl space-y-4">
            {introLines.map((line) => (
              <motion.p key={line} variants={item} className="text-lg leading-relaxed text-(--muted)">
                {line}
              </motion.p>
            ))}
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
            <MotionLink
              href="/contact"
              whileHover={{ scale: 1.06, x: 8, y: -2 }}
              whileTap={{ scale: 0.98, x: 2 }}
              transition={{ type: "spring", stiffness: 360, damping: 18 }}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-(--primary) px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(47,116,170,0.24)] transition-shadow hover:shadow-[0_14px_34px_rgba(47,116,170,0.34)]"
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.3),transparent)]"
                animate={{ x: ["0%", "180%"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative">{ctaLabel}</span>
              <motion.span
                aria-hidden
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="relative text-base leading-none"
              >
                →
              </motion.span>
            </MotionLink>
            <Link href="/amaans-story" className="text-sm font-semibold text-(--primary) underline decoration-(--line) underline-offset-4 transition hover:text-foreground">
              {storyLabel}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div variants={item} className="mx-auto w-full max-w-md">
          <HeroCarousel />
        </motion.div>
      </div>
    </motion.section>
  );
}

export default HeroAnimated;

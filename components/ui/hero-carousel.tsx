"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const heroSlides = [
  {
    src: "/images/hero/hero1.png",
    alt: "Children receiving community education support",
  },
  {
    src: "/images/hero/hero4.png",
    alt: "Community volunteers helping families",
  },
  {
    src: "/images/hero/hero5.png",
    alt: "Community volunteers helping families",
  },
  {
    src: "/images/hero/hero6.jpeg",
    alt: "Community volunteers helping families",
  },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % heroSlides.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-[var(--line)] bg-white/60 p-3 shadow-[0_14px_40px_rgba(20,48,70,0.12)]">
      <div className="relative h-[320px] overflow-hidden rounded-2xl bg-[#e9f3fb] md:h-[360px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroSlides[active].src}
            initial={{ opacity: 0.25, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.2, scale: 0.98 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image 
              src={heroSlides[active].src} 
              alt={heroSlides[active].alt} 
              fill 
              className="object-cover" 
              sizes="(max-width: 768px) 100vw, 420px"
              onError={() => {
                console.error(`Failed to load image: ${heroSlides[active].src}`);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {heroSlides.map((item, index) => (
          <button
            key={item.src}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-2.5 rounded-full transition ${active === index ? "w-6 bg-[var(--primary)]" : "w-2.5 bg-[#b8cad8]"}`}
          />
        ))}
      </div>
      
      {/* Optional: Show current slide number */}
      <div className="mt-2 text-center text-xs text-[var(--muted)]">
        {active + 1} / {heroSlides.length}
      </div>
    </div>
  );
}
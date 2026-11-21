"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

export interface ImpactItem {
  title: string;
  description: string;
  image: string;
}

interface ImpactSliderProps {
  items: ImpactItem[];
  isHindi: boolean;
  openLightbox?: (src: string, title?: string, category?: string) => void;
}

export function ImpactSlider({ items, isHindi }: ImpactSliderProps) {
  const totalOriginal = items.length;
  const [currentIndex, setCurrentIndex] = useState(() => totalOriginal);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Triple items for seamless infinite looping
  const extendedItems = [...items, ...items, ...items];

  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  const goToSlide = useCallback(
    (targetIndex: number) => {
      setIsTransitioning(true);
      setCurrentIndex(totalOriginal + targetIndex);
    },
    [totalOriginal]
  );

  // Handle seamless infinite looping at transition edges
  const handleTransitionEnd = useCallback(() => {
    if (currentIndex >= totalOriginal * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - totalOriginal);
    } else if (currentIndex < totalOriginal) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + totalOriginal);
    }
  }, [currentIndex, totalOriginal]);

  // Re-enable transition after seamless instant jump
  useEffect(() => {
    if (!isTransitioning) {
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
        return () => cancelAnimationFrame(raf2);
      });
      return () => cancelAnimationFrame(raf1);
    }
  }, [isTransitioning]);

  // Autoplay functionality (smoothly advances every 4 seconds)
  useEffect(() => {
    if (isPaused || totalOriginal <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused, totalOriginal, handleNext]);

  // Keyboard navigation support when focused
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch / Swipe controls
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 45) {
        handleNext();
      } else if (diff < -45) {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPaused(false);
  };

  if (items.length === 0) return null;

  const activeIndex = ((currentIndex % totalOriginal) + totalOriginal) % totalOriginal;

  return (
    <section className="sec relative" id="work">
      {/* Header with Title and Tagline (Centered & Proportionate) */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 rv">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[var(--mint)] text-[var(--green)] dark:bg-[var(--green)]/20 dark:text-emerald-300 border border-[var(--green)]/20 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
          {isHindi ? "हमारी प्रमुख पहल" : "Our Core Initiatives"}
        </span>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--navy)] dark:text-emerald-300 leading-tight"
          style={{ fontFamily: "var(--disp)" }}
        >
          {isHindi ? "मुख्य प्रभाव क्षेत्र एवं कार्यक्रम" : "Impact Initiatives & Programs"}
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-[var(--gold)] to-[var(--green)] rounded-full mx-auto my-3 sm:my-4" />
        <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed max-w-2xl mx-auto">
          {isHindi
            ? "स्वास्थ्य, शिक्षा, पोषण और राहत कार्यों के माध्यम से समाज के जरूरतमंद वर्गों तक निरंतर सहयोग एवं सशक्तिकरण।"
            : "Dedicated grassroots programs transforming lives through healthcare, education, welfare, and emergency relief."}
        </p>
      </div>

      {/* Slider Viewport Container (Shows Strictly ONE Initiative at a Time) */}
      <div
        ref={containerRef}
        tabIndex={0}
        className="relative overflow-hidden w-full rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex flex-nowrap"
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
            transition: isTransitioning
              ? "transform 550ms cubic-bezier(0.25, 1, 0.45, 1)"
              : "none",
          }}
        >
          {extendedItems.map((item, idx) => (
            <div
              key={idx}
              className="shrink-0 w-full px-1"
              style={{
                flex: "0 0 100%",
                maxWidth: "100%",
              }}
            >
              <article className="group relative overflow-hidden rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-[var(--mint)]/20 dark:from-[var(--card)] dark:via-[var(--card)] dark:to-[var(--mint)]/10 p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm hover:shadow-md transition-all duration-300 select-none">
                {/* Ambient subtle glow for depth */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[var(--green)]/8 blur-3xl dark:bg-[var(--green)]/5" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[var(--gold)]/8 blur-3xl" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Left: Heading, Clean Tag, Divider & Description */}
                  <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--mint)] text-[var(--green)] dark:bg-[var(--green)]/20 dark:text-emerald-300 border border-[var(--green)]/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
                        <span>{isHindi ? "सामुदायिक सेवा पहल" : "Community Welfare Initiative"}</span>
                      </span>
                    </div>

                    <h3
                      className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-extrabold text-[var(--navy)] dark:text-emerald-300 leading-tight tracking-tight group-hover:text-[var(--green)] transition-colors duration-200"
                      style={{ fontFamily: "var(--disp)" }}
                    >
                      {item.title}
                    </h3>

                    {/* Gradient accent line */}
                    <div className="h-1 w-16 bg-gradient-to-r from-[var(--green)] to-[var(--gold)] rounded-full my-4" />

                    <p className="text-base sm:text-lg text-[var(--ink)] opacity-85 dark:opacity-90 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* Right: Clean High-Resolution Image (No Zoom / Lightbox) */}
                  <div className="lg:col-span-5 order-1 lg:order-2">
                    <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] w-full overflow-hidden rounded-2xl md:rounded-3xl border border-[var(--line)] bg-[var(--line)]/10 shadow-sm transition-transform duration-500 group-hover:scale-[1.01]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 45vw"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      {/* Centered Pagination Indicator Dots & Arrow Controls */}
      <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={handlePrev}
          aria-label={isHindi ? "पिछला कार्यक्रम" : "Previous initiative"}
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--navy)] dark:text-emerald-300 shadow-xs transition-all hover:bg-[var(--green)] hover:text-white hover:border-[var(--green)] active:scale-95 cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`${isHindi ? "कार्यक्रम" : "Go to initiative"} ${idx + 1}`}
              onClick={() => goToSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? "w-9 bg-[var(--green)] shadow-xs"
                  : "w-2.5 bg-[var(--line)] hover:bg-[var(--green)]/50"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label={isHindi ? "अगला कार्यक्रम" : "Next initiative"}
          className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--navy)] dark:text-emerald-300 shadow-xs transition-all hover:bg-[var(--green)] hover:text-white hover:border-[var(--green)] active:scale-95 cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}

// Named alias for semantic backwards compatibility
export { ImpactSlider as ImpactStairs };

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/icons";
import { DonationModal } from "@/components/ui/donation-modal";
import { LightboxModal } from "@/components/ui/lightbox-modal";
import { Link } from "@/i18n/navigation";
import { ImpactStairs } from "@/components/home/impact-slider";

// 3D Tilt Card Component
function TiltCard({
  className = "",
  style = {},
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-8px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`wc ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

// Animated Counter on Scroll Component
function AnimatedCounter({ valueString }: { valueString: string }) {
  const numeric = parseInt(valueString.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = valueString.replace(/[0-9,]/g, "") || "+";
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || numeric === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start: number | null = null;
          const duration = 1800;

          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(numeric * easeOut));
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(numeric);
            }
          };

          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [numeric]);

  return (
    <b ref={elementRef}>
      {count.toLocaleString()}{suffix}
    </b>
  );
}

export interface HomeViewProps {
  locale: string;
  hero: {
    eyebrow: string;
    registration: string;
    tagline: string;
    headline: string;
    introLines: string[];
    ctaLabel: string;
    storyLabel: string;
  };
  vision: {
    title: string;
    paragraphs: string[];
  };
  founder: {
    title: string;
    role: string;
    bio: string;
    alt: string;
  };
  objectives: {
    title: string;
    primary: string;
    areasIntro: string;
    areas: string[];
  };
  highlights: Array<{
    title: string;
    value: string;
    description: string;
  }>;
  byLaws: Array<{
    title: string;
    points: string[];
  }>;
  impactSections: Array<{
    title: string;
    description: string;
    image: string;
  }>;
  certificates: Array<{
    href: string;
    title: string;
    description: string;
  }>;
}

export function HomeView({
  locale,
  hero,
  vision,
  founder,
  objectives,
  highlights,
  byLaws,
  impactSections,
  certificates,
}: HomeViewProps) {
  const isHindi = locale === "hi";
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<{
    isOpen: boolean;
    imageSrc: string;
    title?: string;
    category?: string;
  }>({
    isOpen: false,
    imageSrc: "",
  });

  // Falling Petals in Hero (deterministic to avoid hydration mismatch and cascading renders)
  const petals = [
    { left: "8%", duration: "11s", delay: "-2s" },
    { left: "22%", duration: "14s", delay: "-7s" },
    { left: "36%", duration: "10s", delay: "-4s" },
    { left: "50%", duration: "15s", delay: "-9s" },
    { left: "64%", duration: "12s", delay: "-1s" },
    { left: "75%", duration: "16s", delay: "-8s" },
    { left: "86%", duration: "13s", delay: "-3s" },
    { left: "94%", duration: "11s", delay: "-6s" },
    { left: "18%", duration: "15s", delay: "-10s" },
  ];

  // Reveal elements on scroll
  useEffect(() => {
    const elements = document.querySelectorAll(".rv");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const openLightbox = useCallback((src: string, title?: string, category?: string) => {
    setLightboxData({
      isOpen: true,
      imageSrc: src,
      title,
      category,
    });
  }, []);

  return (
    <>
      {/* 1. HERO SECTION (SampleB Structure & Layout with Real Project Content) */}
      <section className="hero" id="top">
        {petals.map((petal, index) => (
          <i
            key={index}
            className="petal"
            style={{
              left: petal.left,
              animationDuration: petal.duration,
              animationDelay: petal.delay,
            }}
          />
        ))}

        <div className="wrap">
          <div>
            {/* Eyebrow & Registration badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--card)] px-3.5 py-1 text-xs font-semibold text-[var(--navy)] shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[var(--green)] animate-pulse" />
              <span>{hero.registration}</span>
            </div>

            <h1 className="disp">
              <span
                className="l hero-headline"
                style={{
                  color: "var(--navy)",
                  fontStyle: "normal",
                  fontWeight: 700,
                }}
              >
                {hero.headline}
              </span>
              <span className="l hero-tagline" style={{ color: "var(--green)" }}>
                {hero.tagline}
              </span>
            </h1>

            {/* Intro text */}
            <div className="hero-p mt-3.5 mb-7 space-y-2 max-w-xl text-sm sm:text-base leading-relaxed text-[var(--ink)] opacity-90">
              {hero.introLines.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>

            <div className="ctas">
              <button
                type="button"
                onClick={() => setIsDonateOpen(true)}
                className="btn fill beat w-full sm:w-auto justify-center"
              >
                <Icon name="donate" className="h-4 w-4.5" />
                <span>{hero.ctaLabel || (isHindi ? "दान करें" : "Donate Now")}</span>
                <Icon name="arrow" />
              </button>

              <Link className="btn line w-full sm:w-auto justify-center" href="/amaans-story">
                <span>{hero.storyLabel || (isHindi ? "अमान की कहानी" : "Amaan's Story")}</span>
                <Icon name="arrow" />
              </Link>
            </div>
          </div>

          <div className="stage">
            <div className="tag">
              {isHindi ? "आइए, बेहतर कल बनाएँ…" : "Let’s Build a Better Tomorrow…"}
            </div>
            <div className="halo" />

            <svg className="sc" viewBox="0 0 500 500" aria-hidden="true">
              <g className="sprout">
                <g className="sway">
                  <path
                    d="M250 330V200"
                    stroke="#2e7d32"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M250 210C180 210 140 160 150 105c64 0 104 42 100 105z"
                    fill="#5cb85c"
                  />
                  <path
                    d="M250 198C298 158 352 148 395 105c-10 64-62 116-145 105z"
                    fill="#3a9a45"
                  />
                  <path
                    d="M250 250C208 250 182 228 172 196c42 0 74 16 78 54z"
                    fill="#82d474"
                  />
                </g>
              </g>
              <g className="hands">
                <ellipse cx="250" cy="335" rx="100" ry="26" fill="#4a2e1a" />
                <path
                  d="M100 360c42-42 96-32 150 0 62-32 122-42 158 0-42 76-104 118-158 118S138 436 100 360z"
                  fill="#dba67f"
                />
                <path
                  d="M122 376c64-26 108-4 128 18 44-26 96-36 134-10-32 54-80 90-134 90s-100-38-128-98z"
                  fill="#c68a63"
                />
              </g>
            </svg>

            {/* Orbiting Rotating Badges */}
            <div className="orbit">
              <span
                className="chip"
                style={{
                  left: "calc(50% - 28px)",
                  top: "-2%",
                  background: "#17653a",
                }}
                title={isHindi ? "स्वास्थ्य सहायता" : "Healthcare"}
              >
                <Icon name="pulse" />
              </span>
              <span
                className="chip"
                style={{
                  right: "-2%",
                  top: "calc(50% - 28px)",
                  background: "#16507f",
                }}
                title={isHindi ? "शिक्षा सहायता" : "Education"}
              >
                <Icon name="cap" />
              </span>
              <span
                className="chip"
                style={{
                  left: "calc(50% - 28px)",
                  bottom: "-2%",
                  background: "#d81f26",
                }}
                title={isHindi ? "रक्तदान" : "Blood Donation"}
              >
                <Icon name="drop" />
              </span>
              <span
                className="chip"
                style={{
                  left: "-2%",
                  top: "calc(50% - 28px)",
                  background: "#c8962e",
                }}
                title={isHindi ? "सामाजिक कल्याण" : "Social Welfare"}
              >
                <Icon name="people" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE MARQUEE BAND */}
      <div className="band" aria-hidden="true">
        <div>
          <span><Icon name="star" />सेवा</span>
          <span><Icon name="heart" />Compassion</span>
          <span><Icon name="healthcare" />स्वास्थ्य</span>
          <span><Icon name="education" />Education</span>
          <span><Icon name="heart" />करुणा</span>
          <span><Icon name="people" />Humanity</span>
          <span><Icon name="star" />सेवा</span>
          <span><Icon name="heart" />Compassion</span>
          <span><Icon name="healthcare" />स्वास्थ्य</span>
          <span><Icon name="education" />Education</span>
          <span><Icon name="heart" />करुणा</span>
          <span><Icon name="people" />Humanity</span>
        </div>
      </div>

      {/* 3. MAIN CONTENT CONTAINER */}
      <main className="wrap space-y-20 py-12 md:py-16">
        {/* Section: Live Key Highlights (3D Tilt Cards with Real Data) */}
        {highlights.length > 0 && (
          <section className="sec" id="highlights">
            <h2 className="t rv">{isHindi ? "हमारा प्रभाव और उपलब्धियां" : "Our Impact Highlights"}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 rv">
              {highlights.map((item, idx) => {
                const colors = ["#17653a", "#16507f", "#c8962e", "#c4262d"];
                const color = colors[idx % colors.length];
                const icons = ["people", "cap", "pulse", "drop"];
                const icon = icons[idx % icons.length];
                return (
                  <TiltCard key={idx} style={{ "--c": color } as React.CSSProperties}>
                    <div className="ic">
                      <Icon name={icon} />
                    </div>
                    <div className="mb-2">
                      <AnimatedCounter valueString={item.value} />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm opacity-80">{item.description}</p>
                  </TiltCard>
                );
              })}
            </div>
          </section>
        )}

        {/* Section: Vision (SampleB Card styling) */}
        {vision.paragraphs.length > 0 && (
          <section
            aria-labelledby="home-vision"
            className="rv rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 md:p-10 shadow-[var(--sh)]"
          >
            <h2 id="home-vision" className="disp text-2xl sm:text-3xl font-bold text-[var(--navy)]">
              {vision.title}
            </h2>
            <div className="mt-4 sm:mt-5 space-y-3.5 leading-relaxed text-sm sm:text-base opacity-85">
              {vision.paragraphs.map((p, index) => (
                <p key={index}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {/* Section: Founder Profile */}
        <section className="rv grid gap-8 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 md:grid-cols-[0.75fr_1.25fr] md:p-10 shadow-sm">
          <div className="relative h-80 sm:h-96 md:h-[440px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg)] shadow-xs">
            <Image
              src="/images/team/alim.jpeg"
              alt={founder.alt}
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="disp text-2xl sm:text-3xl font-bold text-[var(--navy)]">{founder.title}</h2>
            <p className="mt-2 text-xs sm:text-sm font-semibold text-[var(--green)]">
              Alim Ansari · {founder.role}
            </p>
            <p className="mt-3.5 leading-relaxed opacity-85 text-sm sm:text-base whitespace-pre-line">
              {founder.bio}
            </p>
          </div>
        </section>

        {/* Section: About Foundation & Animated Seal */}
        <section className="about sec" id="about">
          <div className="rv">
            <h2>{isHindi ? "AAWF के बारे में" : "About AAWF"}</h2>
            <p>
              {isHindi
                ? "अमान अंसारी वेलफेयर फाउंडेशन (AAWF) एक गैर-लाभकारी संस्था है, जो स्वास्थ्य, शिक्षा और सामाजिक कल्याण के लिए समर्पित है। हम ज़रूरतमंदों की सहायता, जागरूकता और एक स्वस्थ, शिक्षित व सशक्त समाज के निर्माण का प्रयास करते हैं — भारत की सेवा-भावना के साथ, बिना किसी भेदभाव के।"
                : "Amaan Ansari Welfare Foundation (AAWF) is a non-profit organization committed to health, education and social welfare. We strive to support the needy, create awareness and build a healthier, educated and empowered society — in the spirit of India’s seva: service to humanity, without distinction."}
            </p>
            <Link className="btn fill mt-4" href="/about">
              <span>{isHindi ? "विस्तार से जानें" : "Learn More"}</span>
              <Icon name="arrow" />
            </Link>
          </div>
          <div className="seal rv">
            <div className="logo" role="img" aria-label="Official Foundation Seal" />
          </div>
        </section>

        {/* Section: Objectives */}
        {objectives.areas.length > 0 && (
          <section
            aria-labelledby="home-objectives"
            className="rv rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 sm:p-8 md:p-10 shadow-sm"
          >
            <h2 id="home-objectives" className="disp text-2xl sm:text-3xl font-bold text-[var(--navy)]">
              {objectives.title}
            </h2>
            <p className="mt-3.5 leading-relaxed text-sm sm:text-base opacity-85">
              {objectives.primary}
            </p>
            <p className="mt-3.5 text-sm sm:text-base font-semibold text-[var(--navy)]">{objectives.areasIntro}</p>
            <ul className="mt-3 grid gap-2.5 ps-5 list-disc text-sm sm:text-base opacity-85 marker:text-[var(--green)] md:grid-cols-2">
              {objectives.areas.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Section: By-Laws & Objectives */}
        {byLaws.length > 0 && (
          <section className="sec" id="bylaws">
            <h2 className="t rv">{byLaws[0].title}</h2>
            <div className="rv grid gap-4 rounded-3xl border border-[var(--line)] bg-[var(--card)] p-6 md:p-10 shadow-sm md:grid-cols-2">
              {byLaws[0].points.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3.5 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4 transition hover:border-[var(--green)]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--green)] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-[var(--ink)] opacity-90">{point}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Impact Initiatives & Programs (Left-Right Stairs) */}
        {impactSections.length > 0 && (
          <ImpactStairs
            items={impactSections}
            isHindi={isHindi}
            openLightbox={openLightbox}
          />
        )}

        {/* Section: Impact Donation CTA Banner */}
        <div className="cta rv" id="donate">
          <Icon name="heart" />
          <div>
            <h3>
              {isHindi
                ? "आपका सहयोग बदलाव लाता है"
                : "Your Support Makes a Difference"}
            </h3>
            <p>
              {isHindi
                ? "एक दयालु और स्वस्थ समाज के हमारे मिशन का हिस्सा बनें।"
                : "Be a part of our mission to build a kinder and healthier society."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsDonateOpen(true)}
            className="btn gold beat"
          >
            <Icon name="donate" className="h-4 w-4.5" />
            <span>{isHindi ? "दान करें" : "Donate Now"}</span>
            <Icon name="arrow" />
          </button>
        </div>

        {/* Section: Identification */}
        <section className="sec" id="identification">
          <h2 className="t rv">{isHindi ? "संस्था पहचान" : "Identification"}</h2>
          <div className="rv grid gap-6 md:grid-cols-3">
            {/* 1. Foundation Logo */}
            <article className="flex flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-xs transition duration-300 hover:border-[var(--green)]">
              <div className="relative flex h-48 w-full items-center justify-center overflow-hidden border-b border-[var(--line)] bg-gradient-to-br from-[var(--mint)]/40 via-[var(--surface)] to-[var(--mint)]/20 dark:from-emerald-950/40 dark:via-[#10231a] dark:to-emerald-950/20 p-4">
                <div className="relative aspect-square h-36 w-36 overflow-hidden rounded-full bg-white p-2.5 shadow-md ring-4 ring-emerald-500/20 dark:ring-emerald-400/25">
                  <Image
                    src="/images/logo/logo.png"
                    alt={isHindi ? "फाउंडेशन लोगो" : "Foundation Logo"}
                    fill
                    className="object-contain p-1.5"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-[var(--navy)] leading-snug">
                  {isHindi ? "फाउंडेशन लोगो" : "Foundation Logo"}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed opacity-75">
                  {isHindi
                    ? "अमान अंसारी वेलफेयर फाउंडेशन का आधिकारिक प्रतीक चिन्ह।"
                    : "Official logo of Amaan Ansari Welfare Foundation."}
                </p>
              </div>
            </article>

            {/* 2. Registration Certificate */}
            <article className="flex flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-xs transition duration-300 hover:border-[var(--green)]">
              <div className="relative flex h-48 w-full items-center justify-center overflow-hidden border-b border-[var(--line)] bg-gradient-to-br from-[var(--mint)]/40 via-[var(--surface)] to-[var(--mint)]/20 p-4">
                <div className="relative aspect-[4/3] h-36 overflow-hidden rounded-xl border border-[var(--line)] bg-white dark:bg-[var(--surface)] shadow-xs">
                  <Image
                    src="/images/certificates/registrationletter.jpeg"
                    alt={isHindi ? "पंजीयन प्रमाणपत्र" : "Registration Certificate"}
                    fill
                    className="object-contain p-1"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-[var(--navy)] leading-snug">
                  {isHindi ? "पंजीयन प्रमाणपत्र" : "Registration Certificate"}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed opacity-75">
                  {isHindi
                    ? "सोसायटी पंजीयन क्रमांक: 122202639627 (छत्तीसगढ़ सोसाइटी पंजीकरण अधिनियम, 1973)।"
                    : "Society Registration No: 122202639627 under CG Society Registration Act, 1973."}
                </p>
              </div>
            </article>

            {/* 3. NGO PAN */}
            <article className="flex flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-xs transition duration-300 hover:border-[var(--green)]">
              <div className="relative flex h-48 w-full items-center justify-center overflow-hidden border-b border-[var(--line)] bg-gradient-to-br from-[var(--mint)]/40 via-[var(--surface)] to-[var(--mint)]/20 p-4">
                <div className="relative aspect-[16/10] h-36 overflow-hidden rounded-xl border border-[var(--line)] bg-white dark:bg-[var(--surface)] shadow-xs">
                  <Image
                    src="/images/certificates/ngopan.jpeg"
                    alt={isHindi ? "एनजीओ पैन" : "NGO PAN"}
                    fill
                    className="object-contain p-1"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-[var(--navy)] leading-snug">
                  {isHindi ? "एनजीओ पैन" : "NGO PAN"}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed opacity-75">
                  {isHindi
                    ? "आयकर विभाग (भारत सरकार) द्वारा जारी अधिकृत पैन कार्ड।"
                    : "Official PAN card issued by Income Tax Department, Government of India."}
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Section: Official Certificates & Compliance (Downloadable PDFs) */}
        <section className="sec" id="certificates">
          <h2 className="t rv">{isHindi ? "प्रमाणपत्र" : "Official Certificates"}</h2>
          <div className="rv grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {certificates.map((cert) => (
              <a
                key={cert.href}
                href={cert.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--card)] shadow-xs transition duration-300 hover:-translate-y-1.5 hover:border-[var(--green)] hover:shadow-xl"
              >
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--mint)]/70 via-[var(--surface)] to-[var(--mint)]/30 p-4 border-b border-[var(--line)]">
                  <div className="relative aspect-[10/7] w-full max-w-[240px] overflow-hidden rounded-xl border border-[var(--line)] bg-white dark:bg-[var(--surface)] shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <Image
                      src="/images/certificates/template-certificate.svg"
                      alt={cert.title}
                      fill
                      className="object-contain p-1"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 text-[#0b2e4f] dark:bg-[#10231a]/95 dark:text-[#7ad694] px-3 py-1 text-xs font-semibold shadow-md backdrop-blur-xs">
                        <Icon name="arrow" className="h-3 w-3" />
                        <span>{isHindi ? "प्रमाणपत्र देखें" : "View Certificate"}</span>
                      </span>
                    </div>
                    <span className="absolute right-2 top-2 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white shadow-xs">
                      PDF
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold text-[var(--navy)] leading-snug">{cert.title}</h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed opacity-75">{cert.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--green)] group-hover:underline">
                    {isHindi ? "PDF खोलें" : "Open PDF"}
                    <Icon name="arrow" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        locale={locale}
      />

      {/* Lightbox Viewer */}
      <LightboxModal
        isOpen={lightboxData.isOpen}
        onClose={() => setLightboxData((prev) => ({ ...prev, isOpen: false }))}
        imageSrc={lightboxData.imageSrc}
        title={lightboxData.title}
        category={lightboxData.category}
      />
    </>
  );
}

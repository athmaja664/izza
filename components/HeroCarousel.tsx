"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { KEYS, useStored } from "@/lib/izha-store";
import { DEFAULT_HERO_SLIDES, type HeroSlide } from "@/lib/demo-store";

const AUTOPLAY_MS = 5000;

/* Beige background behind the carousel */
const SECTION_BG = "#F5EBDD";

/* Button colours – same as the Add to Cart button in BestSellers */
const BUTTON = {
  bg: "#FFFFFF", // button background (white)
  border: "#E99A9F", // pink outline
  text: "#B20947", // button text
  hoverBg: "#FFF5F7", // light pink on hover
};

export default function HeroCarousel() {
  const [storedSlides] = useStored<HeroSlide[]>(KEYS.heroSlides, DEFAULT_HERO_SLIDES);
  const slides = storedSlides.length > 0 ? storedSlides : DEFAULT_HERO_SLIDES;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = slides.length;
  const activeIndex = current >= total ? 0 : current;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  // Autoplay
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [current, paused, next]);

  // Swipe support for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) (diff > 0 ? next : prev)();
    touchStartX.current = null;
  };

  return (
    <section
      className="w-full py-3 sm:py-6 md:py-8"
      style={{ backgroundColor: SECTION_BG }}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-5 md:px-8">
        {/* Banner height (width : height). Smaller first number = taller banner.
            mobile 1.6:1 · tablet 2.4:1 · small laptop 2.6:1 · large laptop 2.8:1 */}
        <div
          className="group relative aspect-[1.6/1] w-full overflow-hidden rounded-xl shadow-md sm:aspect-[2.4/1] sm:rounded-2xl md:aspect-[2.6/1] lg:aspect-[2.8/1]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Sliding track */}
          <div
            className="flex h-full w-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div
                key={slide.id ?? slide.image}
                className="relative h-full w-full shrink-0"
                aria-hidden={i !== activeIndex}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${total}`}
              >
                {/* Image (clickable) */}
                <Link
                  href={slide.href}
                  tabIndex={-1}
                  aria-label={slide.imageAlt}
                  className="absolute inset-0 block"
                >
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt}
                    fill
                    priority={i === 0}
                    unoptimized={slide.image.startsWith("data:")}
                    sizes="(max-width: 1600px) 100vw, 1600px"
                    quality={85}
                    className="object-cover"
                    style={{ objectPosition: slide.imagePosition }}
                  />
                </Link>

                {/* Text on the left side of the image.
                    pointer-events-none so the image link still works;
                    the button turns pointer events back on. */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex w-[55%] items-center pl-8 pr-1 sm:w-[52%] sm:pl-12 md:w-[46%] md:pl-16 lg:w-[42%] lg:pl-20">
                  <div
                    className={`transition-all duration-700 ease-out ${
                      i === activeIndex ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                  >
                    {/* Eyebrow hidden on phones to keep the banner clean */}
                    <p
                      className="hidden text-xs font-bold uppercase tracking-[0.16em] sm:block md:text-sm"
                      style={{ color: slide.accentColor }}
                    >
                      {slide.eyebrow}
                    </p>

                    <h2
                      className="line-clamp-3 text-base font-bold leading-tight tracking-tight sm:mt-1 sm:line-clamp-none sm:text-xl md:mt-2 md:text-3xl lg:text-[40px]"
                      style={{ color: slide.textColor }}
                    >
                      {slide.title}
                    </h2>

                    {/* Paragraph hidden on phones */}
                    <p
                      className="mt-2 hidden text-sm leading-relaxed sm:block md:text-base lg:mt-3 lg:text-[17px]"
                      style={{ color: slide.textColor }}
                    >
                      {slide.text}
                    </p>

                    {/* Shop Now button – same style as Add to Cart */}
                    <Link
                      href={slide.href}
                      tabIndex={i === activeIndex ? 0 : -1}
                      className="pointer-events-auto mt-2.5 inline-flex items-center justify-center rounded-md border-[1.5px] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.05em] transition-colors duration-200 hover:!bg-[var(--hero-btn-hover)] sm:mt-3 sm:rounded-[10px] sm:px-7 sm:py-2.5 sm:text-xs md:mt-5 md:px-9 md:py-3 md:text-sm"
                      style={
                        {
                          backgroundColor: BUTTON.bg,
                          borderColor: BUTTON.border,
                          color: BUTTON.text,
                          "--hero-btn-hover": BUTTON.hoverBg,
                        } as React.CSSProperties
                      }
                    >
                      {slide.cta}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows (smaller on phones so they don't cover the image) */}
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-1.5 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#222] shadow-md transition hover:scale-105 sm:left-3 sm:h-9 sm:w-9 md:left-4 md:h-12 md:w-12"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" strokeWidth={1.8} />
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="absolute right-1.5 top-1/2 z-20 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#222] shadow-md transition hover:scale-105 sm:right-3 sm:h-9 sm:w-9 md:right-4 md:h-12 md:w-12"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" strokeWidth={1.8} />
          </button>

          {/* Dots (bottom-right pill) */}
          <div className="absolute bottom-1.5 right-1.5 z-20 flex items-center gap-1 rounded-full bg-white/70 px-1.5 py-1 backdrop-blur-sm sm:bottom-3 sm:right-3 sm:gap-1.5 sm:px-2.5 sm:py-1.5 md:bottom-4 md:right-4">
            {slides.map((slide, i) => (
              <button
                key={slide.id ?? slide.image}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activeIndex}
                onClick={() => setCurrent(i)}
                className={`h-1 rounded-full transition-all duration-300 sm:h-1.5 ${
                  i === activeIndex
                    ? "w-3 bg-[#8F3057] sm:w-5"
                    : "w-1 bg-[#8F3057]/40 hover:bg-[#8F3057]/70 sm:w-1.5"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTOPLAY_MS = 5000;

/* Pink shade over the image. Lower numbers = lighter, higher = stronger.
   Top / middle / bottom strength (0 to 1). */
const OVERLAY_TOP = 0.35;
const OVERLAY_MIDDLE = 0.2;
const OVERLAY_BOTTOM = 0.4;

const SLIDES = [
  {
    image: "/images/herosection1.png",
    imageAlt: "Izha Blooms embroidered kurtas in soft rose shades",
    imagePosition: "center", // object-position, e.g. "center", "top", "left center"
    eyebrow: "New Festive Collection",
    title: "Where Every Thread Blooms",
    text: "Handcrafted embroidered kurtas in soft rose shades, made for your most beautiful moments.",
    cta: "Shop the Collection",
    href: "/shop",
  },
  // To add more slides, copy the object above and change the image, title, text and link.
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = SLIDES.length;
  const multiple = total > 1;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  // Autoplay only when there is more than one slide
  useEffect(() => {
    if (!multiple || paused) return;
    const timer = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [current, paused, multiple, next]);

  // Swipe support for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!multiple || touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) (diff > 0 ? next : prev)();
    touchStartX.current = null;
  };

  return (
    <section
      /*
        Height = full screen minus the header (navbar h-16 / h-20 + offers bar h-8 / h-10 = 96px / 120px),
        so the hero starts right below the offers bar.
      */
      className="relative isolate w-full overflow-hidden bg-[#8F3057] h-[calc(100vh-96px)] min-h-[480px] md:h-[calc(100vh-120px)] md:min-h-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? "z-10 opacity-100" : "z-0 opacity-0"
          }`}
          aria-hidden={i !== current}
        >
          {/* Background image (sharp, no blur) */}
          <Image
            src={slide.image}
            alt={slide.imageAlt}
            fill
            priority={i === 0}
            sizes="100vw"
            quality={85}
            className="object-cover"
            style={{ objectPosition: slide.imagePosition }}
          />

          {/* Light pink shade over the image */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom,
                rgba(143, 48, 87, ${OVERLAY_TOP}),
                rgba(176, 64, 106, ${OVERLAY_MIDDLE}),
                rgba(143, 48, 87, ${OVERLAY_BOTTOM}))`,
            }}
          />

          {/* Centred text */}
          <div className="relative flex h-full items-center justify-center px-4 text-center md:px-[3.3vw]">
            <div
              className={`mx-auto max-w-[680px] transition-all duration-1000 ease-out ${
                i === current ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <p
                className="text-sm font-bold uppercase tracking-[0.18em] text-[#FFF0C5]"
                style={{ textShadow: "0 1px 10px rgba(0,0,0,0.45)" }}
              >
                {slide.eyebrow}
              </p>

              <h1
                className="mt-3 text-[32px] font-bold leading-tight tracking-tight text-white md:text-[42px] lg:text-[54px]"
                style={{ textShadow: "0 2px 16px rgba(0,0,0,0.45)" }}
              >
                {slide.title}
              </h1>

              <p
                className="mt-3 text-base font-normal leading-relaxed text-white md:text-[17px] lg:mt-4 lg:text-[19px]"
                style={{ textShadow: "0 1px 10px rgba(0,0,0,0.45)" }}
              >
                {slide.text}
              </p>

              <Link
                href={slide.href}
                className="mt-8 inline-flex h-12 items-center justify-center rounded-md border-2 border-white bg-white px-9 text-[15px] font-semibold text-[#8F3057] transition-colors duration-300 hover:bg-transparent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows and dots (shown only when there is more than one slide) */}
      {multiple && (
        <>
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 text-white transition-colors hover:bg-white hover:text-[#8F3057] md:flex"
          >
            <ChevronLeft size={26} strokeWidth={1.5} />
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="absolute right-3 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 text-white transition-colors hover:bg-white hover:text-[#8F3057] md:flex"
          >
            <ChevronRight size={26} strokeWidth={1.5} />
          </button>

          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.title}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
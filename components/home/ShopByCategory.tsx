"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/categories";
import { KEYS, useStored } from "@/lib/izha-store";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/* How many cards the arrows move at a time */
const STEP = 1;

type Props = {
  categories?: Category[];
};

export default function ShopByCategory({ categories: propCategories }: Props) {
  const [storedCategories] = useStored<Category[]>(KEYS.categories, CATEGORIES);
  const categories =
    propCategories ?? (storedCategories.length > 0 ? storedCategories : CATEGORIES);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 2);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    el?.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el?.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, categories.length]);

  // Slide the whole track by one card (card width + gap)
  const slide = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    if (!card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: direction * STEP * (card.offsetWidth + gap), behavior: "smooth" });
  };

  const arrowClass =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#382B2B]/30 text-[#382B2B] transition-colors duration-300 hover:border-[#382B2B] hover:bg-[#382B2B] hover:text-[#F3E8D8] disabled:pointer-events-none disabled:opacity-30";

  return (
    <section
      aria-labelledby="shop-by-category-heading"
      className={`${cormorant.className} bg-[#F3E8D8] py-16 md:py-24`}
    >
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        {/* Heading */}
        <h2
          id="shop-by-category-heading"
          className="mb-8 text-center text-2xl font-medium uppercase tracking-[0.12em] text-[#382B2B] sm:text-3xl md:mb-16 md:text-5xl md:tracking-[0.14em]"
        >
          Shop by Category
        </h2>

        {/* Arrows + track */}
        <div className="flex items-stretch gap-4 lg:gap-6">
          {/* Previous arrow (centred on the images, not on the labels) */}
          <div className="hidden items-center pb-[76px] md:flex">
            <button
              type="button"
              aria-label="Previous categories"
              onClick={() => slide(-1)}
              disabled={!canPrev}
              className={arrowClass}
            >
              <ChevronLeft size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Scrollable track: cards per view = --n, space between cards = --gap */}
          <div
            ref={trackRef}
            className="flex min-w-0 flex-1 touch-pan-x snap-x snap-mandatory gap-[var(--gap)] overflow-x-auto overscroll-x-contain scroll-smooth px-1 py-2 [--gap:14px] [--n:2] [scrollbar-width:none] sm:[--gap:20px] sm:[--n:3] md:[--gap:24px] md:[--n:4] lg:[--gap:32px] lg:[--n:5] [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                href={cat.href}
                data-card
                draggable={false}
                className="group block shrink-0 snap-start"
                style={{ width: "calc((100% - var(--gap) * (var(--n) - 1)) / var(--n))" }}
              >
                {/* Outer pink border + small gap (beige shows through) */}
                <div className="rounded-t-full border-[1.5px] border-[#E99A9F] p-[5px] md:p-[7px]">
                  {/* Inner white border + image, both follow the arch */}
                  <div className="relative aspect-[2/3] overflow-hidden rounded-t-full border-2 border-white bg-[#F6DADD]">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      priority={i < 5}
                      unoptimized={cat.image.startsWith("data:")}
                      draggable={false}
                      sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 44vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ objectPosition: cat.objectPosition ?? "center top" }}
                    />
                  </div>
                </div>

                {/* Label below the image (fixed height keeps all cards aligned) */}
                <span className="mt-3 flex h-12 items-start justify-center px-1 text-center text-base font-medium leading-tight text-[#382B2B] transition-colors duration-300 group-hover:text-[#EC4899] sm:mt-5 sm:h-14 sm:text-lg md:text-xl">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Next arrow */}
          <div className="hidden items-center pb-[76px] md:flex">
            <button
              type="button"
              aria-label="Next categories"
              onClick={() => slide(1)}
              disabled={!canNext}
              className={arrowClass}
            >
              <ChevronRight size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
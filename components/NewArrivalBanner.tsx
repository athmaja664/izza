import Image from "next/image";
import Link from "next/link";

/* ---- Easy settings ---- */
const BANNER_IMAGE = "/images/newarrivalhome.png"; // image in public/images/
const BANNER_LINK = "/new-arrivals"; // page the button opens
const ACCENT = "#ad0e48"; //b20947 dark pink for the caption

/* Which part of the image stays visible on mobile (the image is cropped to 4:3 there).
   Examples: "center", "right center", "left center", "center top" */
const MOBILE_IMAGE_POSITION = "center";
/* ----------------------- */

export default function NewArrivalBanner() {
  return (
    <section
      aria-label="New arrivals"
      className="mx-auto w-full max-w-[1600px] px-4 py-10 md:px-8 md:py-16"
    >
      {/* Banner height: mobile 4:3 · small tablet 16:10 · laptop fixed 560px */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#FBEFEA] sm:aspect-[16/10] md:aspect-auto md:h-[560px] md:rounded-[44px]">
        {/* Banner image (fills the whole banner on every screen) */}
        <Image
          src={BANNER_IMAGE}
          alt="Izha Blooms new arrivals"
          fill
          sizes="(min-width: 1600px) 1600px, 100vw"
          className="object-cover md:!object-[center]"
          style={{ objectPosition: MOBILE_IMAGE_POSITION }}
        />

        {/* Caption + button, over the right side of the image on every screen */}
        <div className="absolute inset-0 flex items-center justify-end px-4 text-center sm:px-8 md:px-16 lg:px-24">
          <div className="w-[52%] sm:w-[45%] md:w-[38%]">
            <p
              className="text-[8px] font-medium uppercase tracking-[0.2em] sm:text-xs sm:tracking-[0.3em] md:text-sm md:tracking-[0.35em]"
              style={{ color: ACCENT }}
            >
              Just Landed
            </p>

            <h2
              className="mt-1 text-xl font-semibold leading-tight sm:mt-2 sm:text-4xl md:mt-3 md:text-5xl lg:text-6xl"
              style={{ color: ACCENT }}
            >
              New Arrivals
            </h2>

            <div
              className="mx-auto mt-2 h-px w-8 sm:mt-4 sm:w-14 md:mt-5 md:w-16"
              style={{ backgroundColor: ACCENT }}
            />

            <p className="mt-2 text-[10px] leading-snug text-[#382B2B] sm:mt-4 sm:text-sm sm:leading-relaxed md:mt-5 md:text-base">
              Fresh embroidered kurtas and festive styles, handpicked for you.
            </p>

    <Link
  href={BANNER_LINK}
  className="mt-3 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#ad0e48] backdrop-blur-md transition-colors duration-300 hover:bg-white/25 sm:mt-6 sm:px-9 sm:py-3.5 sm:text-sm sm:tracking-[0.2em] md:mt-7"
>
  Shop Now
</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
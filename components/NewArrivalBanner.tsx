import Image from "next/image";
import Link from "next/link";

/* ---- Easy settings ---- */
const BANNER_IMAGE = "/images/newarrivalhome.png"; // image in public/images/
const BANNER_LINK = "/collections/new-arrivals"; // page the button opens
const ACCENT = "#b20947"; //b20947 dark pink for the caption

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
      <div className="relative overflow-hidden rounded-[28px] bg-[#FBEFEA] md:h-[560px] md:rounded-[44px]">
        {/* Banner image
            Mobile: sits at the top as a 4:3 picture
            Desktop: fills the whole banner */}
        <div className="relative aspect-[4/3] w-full sm:aspect-[16/10] md:absolute md:inset-0 md:aspect-auto">
          <Image
            src={BANNER_IMAGE}
            alt="Izha Blooms new arrivals"
            fill
            sizes="(min-width: 1600px) 1600px, 100vw"
            className="object-cover md:!object-[center]"
            style={{ objectPosition: MOBILE_IMAGE_POSITION }}
          />
        </div>

        {/* Caption + button
            Mobile: below the image, centred
            Desktop: over the right side of the image */}
        <div className="relative px-6 py-9 text-center sm:py-10 md:absolute md:inset-0 md:flex md:items-center md:justify-end md:px-16 md:py-0 lg:px-24">
          <div className="mx-auto max-w-sm md:mx-0 md:w-[38%] md:max-w-none">
            <p
              className="text-[11px] font-medium uppercase tracking-[0.3em] sm:text-xs md:text-sm md:tracking-[0.35em]"
              style={{ color: ACCENT }}
            >
              Just Landed
            </p>

            <h2
              className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl md:mt-3 md:text-5xl lg:text-6xl"
              style={{ color: ACCENT }}
            >
              New Arrivals
            </h2>

            <div
              className="mx-auto mt-4 h-px w-14 md:mt-5 md:w-16"
              style={{ backgroundColor: ACCENT }}
            />

            <p className="mt-4 text-sm leading-relaxed text-[#382B2B] md:mt-5 md:text-base">
              Fresh embroidered kurtas and festive styles, handpicked for you.
            </p>

            <Link
              href={BANNER_LINK}
              className="mt-6 inline-block rounded-full bg-[#B0406A] px-9 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-[#8F3057] md:mt-7"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
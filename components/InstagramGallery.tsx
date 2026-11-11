"use client";

import Image from "next/image";
import { useState } from "react";

/* ---- Easy settings ---- */

const INSTAGRAM_HANDLE = "@izhablooms";

/* Your real Instagram profile link, e.g. "https://www.instagram.com/your-handle/".
   Left empty on purpose: the Follow Us button stays hidden until you add it. */
const INSTAGRAM_PROFILE_URL = "";

/* Exactly five photos. Replace each `image` with your own (put them in
   public/images/instagram/). Add `postUrl` to link a card to its real Instagram post;
   with no postUrl the card is not clickable. These are replaceable images,
   not live Instagram posts. */
const GALLERY = [
  {
    image: "/images/inst6.jpg",
    alt: "Embroidered kurta in soft pastel shades",
    postUrl: "",
  },
  {
    image: "/images/inst2.jpg",
    alt: "Close-up of intricate embroidery and fabric detail",
    postUrl: "",
  },
  {
    image: "/images/inst3.jpg",
    alt: "Ethnic outfit styled for a festive occasion",
    postUrl: "",
  },
  {
    image: "/images/inst4.jpg",
    alt: "Collection of women's ethnic wear in soft colours",
    postUrl: "",
  },
  {
    image: "/images/inst5.png",
    alt: "Fashion product photography with floral styling",
    postUrl: "",
  },
];

/* Tilt and height of each card (same order as GALLERY).
   Change the rotate-* and lg:mt-* values to rearrange the collage. */
const LAYOUT = [
  "-rotate-3 lg:mt-12",
  "rotate-2 lg:mt-0",
  "-rotate-1 lg:mt-16",
  "rotate-3 lg:mt-4",
  "-rotate-2 lg:mt-10",
];

/* Colour of the little tape pieces on top of each card */
const TAPE = ["bg-[#F6DADD]/90", "bg-[#F3E7D3]/95", "bg-[#E99A9F]/60", "bg-[#F3E7D3]/95", "bg-[#F6DADD]/90"];

/* ----------------------- */

function InstagramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 5 6 5c2 0 3.3 1.1 4 2.3C10.7 6.1 12 5 14 5c3.3 0 5.1 3.4 3.6 6.8C19.5 16.4 12 21 12 21Z" />
    </svg>
  );
}

function Polaroid({
  image,
  alt,
  postUrl,
  tape,
}: {
  image: string;
  alt: string;
  postUrl?: string;
  tape: string;
}) {
  // If an image file is missing, show a soft blush tile instead of a broken image
  const [failed, setFailed] = useState(false);

  const inner = (
    <>
      {/* Tape piece */}
      <span
        aria-hidden="true"
        className={`absolute -top-3 left-1/2 z-10 h-6 w-16 -translate-x-1/2 -rotate-3 ${tape} shadow-sm`}
      />

      {/* Photo */}
      <span className="relative block aspect-square w-full overflow-hidden bg-[#F3E7D3]">
        {failed ? (
          <span className="absolute inset-0 bg-gradient-to-br from-[#F6DADD] to-[#F3E7D3]" />
        ) : (
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 44vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none"
            onError={() => setFailed(true)}
          />
        )}

        {/* Dark translucent overlay + Instagram icon (only on cards that link to a post) */}
        {postUrl && (
          <span className="absolute inset-0 flex items-center justify-center bg-[#382B2B]/40 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
            <InstagramIcon size={26} />
          </span>
        )}
      </span>

      {/* Polaroid caption strip */}
      <span className="mt-2.5 flex items-center justify-between px-1 pb-1 text-[11px] font-medium tracking-[0.12em] text-[#9C555C] md:text-xs">
        <span>{INSTAGRAM_HANDLE}</span>
        <span className="text-[#E99A9F]">
          <HeartIcon />
        </span>
      </span>
    </>
  );

  const base =
    "group relative block w-full bg-white p-2.5 pb-2 shadow-[0_10px_30px_-12px_rgba(56,43,43,0.35)] transition-all duration-500 ease-out hover:z-30 hover:-translate-y-2 hover:rotate-0 hover:shadow-[0_22px_45px_-14px_rgba(56,43,43,0.45)] focus-visible:z-30 focus-visible:-translate-y-2 focus-visible:rotate-0 motion-reduce:transition-none md:p-3 md:pb-2.5";

  return postUrl ? (
    <a
      href={postUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${alt} – view on Instagram`}
      className={`${base} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9707F]`}
    >
      {inner}
    </a>
  ) : (
    <div className={base}>{inner}</div>
  );
}

export default function InstagramGallery() {
  return (
    <section
      aria-labelledby="instagram-heading"
      className="relative overflow-hidden bg-[#FFF9F4] py-14 md:py-20"
    >
      {/* Soft decorative blush circles behind the collage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 size-[320px] rounded-full bg-[#F6DADD]/60 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-10 size-[360px] rounded-full bg-[#F3E7D3]/80 blur-2xl"
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-4 md:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#D9707F] md:text-sm">
            Follow Our Journey
          </p>

          <h2
            id="instagram-heading"
            className="mt-3 text-3xl font-semibold leading-tight text-[#382B2B] md:text-4xl lg:text-5xl"
          >
            Find Us on Instagram
          </h2>

          <div className="mx-auto mt-5 h-px w-16 bg-[#E99A9F]" />

          <p className="mt-5 text-sm leading-relaxed text-[#382B2B]/80 md:text-base">
            A little inspiration, a little elegance. Discover our latest styles and moments from
            IZHA BLOOMS.
          </p>

          <p className="mt-4 text-sm font-semibold tracking-[0.15em] text-[#9C555C]">
            {INSTAGRAM_HANDLE}
          </p>

          {INSTAGRAM_PROFILE_URL && (
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-[#382B2B] px-8 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[#9C555C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#382B2B]"
            >
              <InstagramIcon size={18} />
              Follow Us
            </a>
          )}
        </div>

        {/* Collage
            Mobile / tablet: tilted polaroids wrap into rows, centred
            Desktop: one overlapping, staggered row */}
        <ul
          className="mx-auto mt-14 flex max-w-[1400px] flex-wrap justify-center gap-x-5 gap-y-10 md:mt-16 lg:flex-nowrap lg:items-start lg:gap-x-0 lg:pb-10"
          aria-label="Instagram gallery"
        >
          {GALLERY.map((item, i) => (
            <li
              key={item.image}
              className={`w-[44%] max-w-[260px] sm:w-[29%] lg:w-[21%] lg:max-w-none lg:-mx-2 ${LAYOUT[i]}`}
            >
              <Polaroid {...item} tape={TAPE[i]} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
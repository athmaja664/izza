import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
import { WhatsAppSvg } from "@/components/WhatsAppFloat";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

/* ==================================================================
   COLOUR CODES – change any colour here, it updates the whole section
================================================================== */
const COLORS = {
  bg: "#FBF1EE", // section background (soft blush)
  ink: "#332B2B", // headings
  body: "#6f6565", // paragraph text
  plum: "#8F3057", // small accents
  frame: "#E8B8C5", // pink outline around the arches
  frameBg: "#FFF5F7", // behind the images (shows if an image is missing)
  line: "#E8CFD2", // thin dividers between the points
  button: "#FFFFFF", // button background
  buttonBorder: "#E99A9F", // button outline
  buttonText: "#B20947", // button text
  buttonHover: "#FFF5F7", // button hover
};

/* Replace these with your own photos in /public/images/ */
const IMAGES = {
  main: { src: "/images/about1.png", alt: "Embroidered kurta from Izha Blooms" },
  small: { src: "/images/about2.png", alt: "Detail of handwork on an Izha Blooms kurta" },
};

const POINTS = [
  {
    title: "Thoughtfully designed",
    text: "Styles that bring together elegance, simplicity and contemporary charm.",
  },
  {
    title: "Comfort in every detail",
    text: "Carefully considered silhouettes, fabrics and finishes for effortless everyday wear.",
  },
  {
    title: "Crafted with character",
    text: "From delicate prints to beautiful embroidery, discover details that make each piece special.",
  },
  {
    title: "Made to feel like you",
    text: "Versatile styles for everyday moments, celebrations and everything in between.",
  },
];

/* Official WhatsApp business number (country code, no + or spaces) */
const WHATSAPP = "919995757612";

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      style={{ backgroundColor: COLORS.bg }}
      className="w-full py-14 md:py-20"
    >
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 px-5 md:grid-cols-2 md:gap-14 md:px-8 lg:gap-20">
        {/* ---------- Pictures: two arches, like the category cards ---------- */}
        <div className="relative mx-auto aspect-[1/1.2] w-full max-w-[400px] md:max-w-none">
          {/* Large arch */}
          <div
            className="absolute left-0 top-0 aspect-[3/4] w-[78%] overflow-hidden rounded-t-full border-2 p-1.5"
            style={{ borderColor: COLORS.frame, backgroundColor: "#fff" }}
          >
            <div
              className="relative h-full w-full overflow-hidden rounded-t-full"
              style={{ backgroundColor: COLORS.frameBg }}
            >
              <Image
                src="/images/about4.jpg"
                alt={IMAGES.main.alt}
                fill
                sizes="(min-width: 768px) 28vw, 70vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Small arch, overlapping the corner */}
          <div
            className="absolute bottom-0 right-0 aspect-[3/4] w-[44%] overflow-hidden rounded-t-full border-[6px] shadow-lg"
            style={{ borderColor: COLORS.bg, backgroundColor: COLORS.frameBg }}
          >
            <div className="relative h-full w-full">
              <Image
                src="/images/about3.png"
                alt={IMAGES.small.alt}
                fill
                sizes="(min-width: 768px) 16vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* ---------- Text ---------- */}
        <div className="text-center md:text-left">
          <h2
            id="about-heading"
            className={`${cormorant.className} text-4xl font-medium leading-[1.1] md:text-5xl`}
            style={{ color: COLORS.ink }}
          >
            Clothes that bloom with you.
          </h2>

          <div
            className="mx-auto mt-5 h-0.5 w-14 rounded md:mx-0"
            style={{ backgroundColor: COLORS.frame }}
            aria-hidden="true"
          />

          <p
            className={`${cormorant.className} mt-6 text-lg leading-relaxed md:text-xl`}
            style={{ color: COLORS.body }}
          >
            At Izha Blooms, we believe every woman deserves to feel beautiful, confident and
            effortlessly herself.
          </p>
          <p
            className={`${cormorant.className} mt-4 text-lg leading-relaxed md:text-xl`}
            style={{ color: COLORS.body }}
          >
            Rooted in Aluva, Kerala, our journey began with a simple thought — to bring together
            timeless elegance, thoughtful details and everyday comfort.
          </p>
          <p
            className={`${cormorant.className} mt-4 text-lg leading-relaxed md:text-xl`}
            style={{ color: COLORS.body }}
          >
            From graceful kurtas to thoughtfully designed dresses and contemporary ethnic wear,
            every piece is chosen to make you feel special, without compromising on comfort.
          </p>

          {/* Four points, separated by thin lines */}
          <ul className="mt-7 text-left">
            {POINTS.map((p) => (
              <li
                key={p.title}
                className="border-t py-3.5 last:border-b"
                style={{ borderColor: COLORS.line }}
              >
                <h3
                  className={`${cormorant.className} text-xl font-semibold`}
                  style={{ color: COLORS.plum }}
                >
                  {p.title}
                </h3>
                <p className="mt-0.5 text-sm leading-relaxed" style={{ color: COLORS.body }}>
                  {p.text}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-1 text-center md:text-left">
            <p
              className={`${cormorant.className} text-xl font-semibold italic`}
              style={{ color: COLORS.plum }}
            >
              Izha Blooms — Where Every Thread Blooms.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.body }}>
              Discover a wardrobe that feels as beautiful as it looks.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row md:justify-start">
            <Link
              href="/collections"
              className="inline-flex items-center justify-center rounded-[10px] border-[1.5px] border-[#E99A9F] bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#B20947] transition-colors hover:bg-[#FFF5F7]"
            >
              Explore Our Collections
            </Link>

            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm underline underline-offset-4 transition-colors hover:text-[#B20947]"
              style={{ color: COLORS.ink }}
            >
              <WhatsAppSvg size={24} />
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
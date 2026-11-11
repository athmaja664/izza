import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";

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
  line: "#E8CFD2", // thin dividers between the three points
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

/* Three short points. Edit the wording to match the real brand. */
const POINTS = [
  {
    title: "Designed in Aluva",
    text: "Every style is planned and finished by our own team in Kerala.",
  },
  {
    title: "Handwork you can feel",
    text: "Soft rose shades and fine embroidery, made for festivals and everyday wear.",
  },
  {
    title: "Sized for you",
    text: "Clear size details on every product, so ordering is easy and returns are rare.",
  },
];

/* WhatsApp number for the text link (country code, no + or spaces) */
const WHATSAPP = "918281003090";

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
                src="/images/about1.jpg"
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
                src="/images/about2.jpg"
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
            Clothes made to bloom
            <br className="hidden md:block" /> with you
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
  Izha Designs began in Aluva with a simple idea: ladies’ wear should feel special without
  feeling complicated.
</p>
<p
  className={`${cormorant.className} mt-4 text-lg leading-relaxed md:text-xl`}
  style={{ color: COLORS.body }}
>
  Izha Blooms brings our kurtas, dresses and tops to women across Kerala.
</p>

          {/* Three points, separated by thin lines */}
          <ul className="mt-8 text-left">
            {POINTS.map((p) => (
              <li
                key={p.title}
                className="border-t py-4 last:border-b"
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

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row md:justify-start">
            
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline underline-offset-4 transition-colors hover:text-[#B20947]"
              style={{ color: COLORS.ink }}
            >
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
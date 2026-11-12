import { Cormorant_Garamond } from "next/font/google";
import { Star } from "lucide-react";

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
  bg: "#FFFFFF", // section background (same white as Best Sellers)
  ink: "#332B2B", // headings and names
  body: "#6f6565", // review text and small text
  plum: "#8F3057", // product line
  star: "#E99A9F", // filled stars
  frame: "#E8B8C5", // pink outline around each card
  cardBg: "#FCF8F3", // card background
  badgeBg: "#F9E3E9", // initial badge background
  badgeText: "#B5607A", // initial badge letter
  quote: "#E8B8C5", // big quote mark
};

/*
  SAMPLE REVIEWS – these are placeholders so you can see the design.
  Replace them with real reviews from your customers (with their permission)
  before the site goes live.
  rating: 1 to 5
*/
const REVIEWS = [
  {
    name: "Customer name",
    place: "Kochi",
    product: "Embroidered kurta",
    rating: 5,
    text: "Sample review. Write what the customer said about the fit, the fabric and the delivery here.",
  },
  {
    name: "Customer name",
    place: "Aluva",
    product: "Cotton dress",
    rating: 5,
    text: "Sample review. A short, honest line works better than a long one.",
  },
  {
    name: "Customer name",
    place: "Thrissur",
    product: "Festive set",
    rating: 4,
    text: "Sample review. Mention the occasion she wore it for, if she shared one.",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={16}
          strokeWidth={1.6}
          aria-hidden="true"
          style={{ color: COLORS.star }}
          className={n <= rating ? "fill-current" : "fill-transparent opacity-50"}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      style={{ backgroundColor: COLORS.bg }}
      className="w-full py-14 md:py-20"
    >
      <div className="mx-auto max-w-[1100px] px-4 md:px-8">
        {/* Heading (same style as Best Sellers) */}
        <div className="mx-auto mb-8 max-w-xl text-center md:mb-12">
          <h2
            id="reviews-heading"
            className={`${cormorant.className} text-3xl font-medium after:mx-auto after:mt-3 after:block after:h-0.5 after:w-14 after:rounded md:text-4xl`}
            style={{ color: COLORS.ink }}
          >
            Words from our customers
            <style>{`#reviews-heading::after{background:${COLORS.frame}}`}</style>
          </h2>
          <p
            className={`${cormorant.className} mt-3 text-base leading-relaxed md:text-lg`}
            style={{ color: COLORS.body }}
          >
            Real notes from women who wear Izha Blooms.
          </p>
        </div>

        {/* Mobile: swipe sideways · Desktop: 3 columns */}
        <ul
          style={{ touchAction: "manipulation" }}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {REVIEWS.map((r, i) => (
            <li
              key={i}
              className="w-[85%] shrink-0 snap-start sm:w-[60%] md:w-auto"
            >
              <figure
                className="relative flex h-full flex-col rounded-2xl border-2 p-6 shadow-[inset_0_0_0_2px_#fff]"
                style={{ borderColor: COLORS.frame, backgroundColor: COLORS.cardBg }}
              >
                {/* Big quote mark */}
                <span
                  aria-hidden="true"
                  className={`${cormorant.className} pointer-events-none absolute right-5 top-1 select-none text-7xl leading-none`}
                  style={{ color: COLORS.quote }}
                >
                  &rdquo;
                </span>

                <Stars rating={r.rating} />

                <blockquote
                  className={`${cormorant.className} mt-4 flex-1 text-lg italic leading-relaxed md:text-xl`}
                  style={{ color: COLORS.ink }}
                >
                  {r.text}
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3">
                  {/* Arch-shaped initial, like the category cards */}
                  <span
                    aria-hidden="true"
                    className={`${cormorant.className} flex h-11 w-9 shrink-0 items-center justify-center rounded-t-full border text-lg font-semibold`}
                    style={{
                      backgroundColor: COLORS.badgeBg,
                      color: COLORS.badgeText,
                      borderColor: COLORS.frame,
                    }}
                  >
                    {r.name.charAt(0)}
                  </span>
                  <div>
                    <p
                      className={`${cormorant.className} text-lg font-semibold leading-tight`}
                      style={{ color: COLORS.ink }}
                    >
                      {r.name}
                    </p>
                    <p className="text-xs" style={{ color: COLORS.body }}>
                      {r.place}
                      {" · "}
                      <span style={{ color: COLORS.plum }}>{r.product}</span>
                    </p>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
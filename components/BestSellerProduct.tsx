"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Cormorant_Garamond } from "next/font/google";
import { ArrowRight, Heart } from "lucide-react";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/* ==================================================================
   COLOUR CODES – change any colour here, it updates the whole section
================================================================== */
const COLORS = {
  button: "#FFFFFF",       // Add to Cart button background (white)
  buttonBorder: "#E99A9F", // Add to Cart pink outline
  buttonText: "#B20947",   // Add to Cart text
  label: "#B20947",        // "OUR CUSTOMER FAVOURITES" text
  accent: "#E99A9F",       // heading line, heart, selected size, arrow circle
  cardBorder: "#E8B8C5",   // outer pink card border
  cardBg: "#FCF8F3",       // card background
  imageBg: "#FFF5F7",      // behind product image / View More card
  ink: "#332B2B",          // main text
  badgeBg: "#F9E3E9",      // "% OFF" badge background
  badgeText: "#B5607A",    // "% OFF" badge text
  slash: "#8f8588",        // "/" line on sold-out sizes
};

/* Every card always shows these sizes. A size missing from product.sizes
   (or marked inStock:false) is shown crossed out and cannot be selected. */
const ALL_SIZES = ["XS", "S", "M", "L", "XL"];

/* Shape this component expects. Map your real DB/API product to it. */
export type BestSellerProduct = {
  id: string | number;
  name: string;
  image: string;
  href: string;
  price: number;
  compareAtPrice?: number | null;
  inStock: boolean;
  /* If omitted, all five sizes are treated as available */
  sizes?: { label: string; inStock: boolean }[];
  isWishlisted?: boolean;
};

type Props = {
  products: BestSellerProduct[];
  viewAllHref?: string;
  currency?: string;
  onAddToCart?: (product: BestSellerProduct, size: string | null) => Promise<void> | void;
  onToggleWishlist?: (id: BestSellerProduct["id"]) => Promise<boolean | void> | boolean | void;
};

/* Diagonal "/" line drawn across a sold-out size box */
const SLASH = `linear-gradient(to top right, transparent calc(50% - 0.6px), ${COLORS.slash} calc(50% - 0.6px), ${COLORS.slash} calc(50% + 0.6px), transparent calc(50% + 0.6px))`;

function Card({
  product,
  currency,
  onAddToCart,
  onToggleWishlist,
}: { product: BestSellerProduct; currency: string } & Pick<Props, "onAddToCart" | "onToggleWishlist">) {
  const [wished, setWished] = useState(!!product.isWishlisted);
  const [size, setSize] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const fmt = (n: number) => `${currency}${n.toLocaleString("en-IN")}`;
  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice > product.price;
  const percent = hasDiscount ? Math.round((1 - product.price / product.compareAtPrice!) * 100) : 0;

  const sizeList = ALL_SIZES.map((label) => {
    const found = product.sizes?.find((s) => s.label.toUpperCase() === label);
    const available = product.inStock && (product.sizes ? !!found?.inStock : true);
    return { label, available };
  });
  const needsSize = sizeList.some((s) => s.available);

  const toggleWish = async () => {
    const next = !wished;
    setWished(next);
    try {
      const res = await onToggleWishlist?.(product.id);
      if (typeof res === "boolean") setWished(res);
    } catch {
      setWished(!next);
      setMsg("Please sign in or try again.");
    }
  };

  const add = async () => {
    if (busy) return;
    if (needsSize && !size) return setMsg("Please select a size.");
    setBusy(true);
    try {
      await onAddToCart?.(product, size);
      setMsg("Added to cart ✓");
    } catch {
      setMsg("Couldn’t add to cart. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="group flex h-full flex-col gap-2 rounded-2xl border-2 border-[color:var(--bs-border)] bg-[color:var(--bs-card)] p-2 shadow-[inset_0_0_0_2px_#fff] transition duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_0_0_2px_#fff,0_8px_20px_rgba(51,43,43,0.08)]">
      {/* Image + wishlist */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-[color:var(--bs-img-bg)]">
        <Link href={product.href} draggable={false} className="relative block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 16vw, 45vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </Link>
        <button
          type="button"
          onClick={toggleWish}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition duration-200 hover:scale-110 hover:text-[color:var(--bs-accent)] md:h-9 md:w-9 ${
            wished ? "text-[color:var(--bs-accent)]" : "text-[color:var(--bs-ink)]"
          }`}
        >
          <Heart size={17} strokeWidth={1.8} className={wished ? "fill-current" : ""} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 px-0.5 pb-0.5">
        <h3 className="line-clamp-2 text-base font-medium leading-tight text-[color:var(--bs-ink)]">
          <Link href={product.href}>{product.name}</Link>
        </h3>

        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <span className="text-base font-semibold text-[color:var(--bs-ink)]">{fmt(product.price)}</span>
          {hasDiscount && (
            <>
              <span className="text-xs text-[#9b9090] line-through">{fmt(product.compareAtPrice!)}</span>
              <span className="rounded-full bg-[color:var(--bs-badge-bg)] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-[color:var(--bs-badge-text)]">
                {percent}% OFF
              </span>
            </>
          )}
        </div>

        {/* XS S M L XL – sold-out sizes get a "/" line */}
        <ul className="grid grid-cols-5 gap-1" aria-label="Sizes">
          {sizeList.map((s) => (
            <li key={s.label}>
              <button
                type="button"
                disabled={!s.available}
                aria-pressed={size === s.label}
                aria-label={s.available ? `Size ${s.label}` : `Size ${s.label} – not available`}
                title={s.available ? s.label : `${s.label} – not available`}
                onClick={() => {
                  setSize(s.label);
                  setMsg("");
                }}
                style={s.available ? undefined : { backgroundImage: SLASH }}
                className={`h-7 w-full rounded-md border text-[11px] font-medium transition-colors md:h-8 md:text-xs ${
                  !s.available
                    ? "cursor-not-allowed border-[#e3d9d9] bg-white text-[#b3a9ab]"
                    : size === s.label
                      ? "border-[color:var(--bs-accent)] bg-[color:var(--bs-accent)] text-white"
                      : "border-[color:var(--bs-border)] bg-white text-[color:var(--bs-ink)] hover:border-[color:var(--bs-accent)]"
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>

        <p className={`text-xs ${product.inStock ? "text-[#5f7a62]" : "font-semibold tracking-wider text-[#b04a4a]"}`}>
          {product.inStock ? "In stock" : "OUT OF STOCK"}
        </p>
        {msg && (
          <p role="status" className="text-xs text-[color:var(--bs-ink)]">
            {msg}
          </p>
        )}

        {/* Add to Cart: white background, pink outline, #B20947 text, no hover effect */}
        <button
          type="button"
          onClick={add}
          disabled={!product.inStock || busy}
          className="mt-auto w-full rounded-[10px] border-[1.5px] border-[color:var(--bs-btn-border)] bg-[color:var(--bs-btn)] px-2 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-[color:var(--bs-btn-text)] disabled:cursor-not-allowed disabled:border-[#d9cfd2] disabled:text-[#b3a9ab] md:text-sm"
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </article>
  );
}

export default function BestSellers({
  products,
  viewAllHref = "/shop?bestSellers=true",
  currency = "₹",
  onAddToCart,
  onToggleWishlist,
}: Props) {
  const items = products.slice(0, 4);

  const vars = {
    "--bs-btn": COLORS.button,
    "--bs-btn-border": COLORS.buttonBorder,
    "--bs-btn-text": COLORS.buttonText,
    "--bs-label": COLORS.label,
    "--bs-accent": COLORS.accent,
    "--bs-border": COLORS.cardBorder,
    "--bs-card": COLORS.cardBg,
    "--bs-img-bg": COLORS.imageBg,
    "--bs-ink": COLORS.ink,
    "--bs-badge-bg": COLORS.badgeBg,
    "--bs-badge-text": COLORS.badgeText,
  } as CSSProperties;

  return (
    <section
      aria-labelledby="best-sellers-heading"
      style={vars}
      className={`${cormorant.className} bg-white py-10 md:py-14`}
    >
      <div className="mx-auto max-w-[1100px] px-4 md:px-8">
        <div className="mx-auto mb-6 max-w-xl text-center md:mb-8">
          <p className="mb-1.5 text-xs uppercase tracking-[0.28em] text-[color:var(--bs-label)] md:text-sm">
            Our Customer Favourites
          </p>
          <h2
            id="best-sellers-heading"
            className="text-3xl font-medium text-[color:var(--bs-ink)] after:mx-auto after:mt-3 after:block after:h-0.5 after:w-14 after:rounded after:bg-[color:var(--bs-accent)] md:text-4xl"
          >
            Best Sellers
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#6f6565] md:text-lg">
            Discover the styles our customers love the most. Timeless elegance, beautiful details and effortless style.
          </p>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-[#8a7e82]">Our best sellers will be back shortly.</p>
        ) : (
          /* Mobile: 2 cards per screen, swipe to the next 2 · Tablet: 2 cols · Desktop: 4 cols */
          <ul className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible lg:grid-cols-4 lg:gap-5 [&::-webkit-scrollbar]:hidden">
            {items.map((p, i) => (
              <li
                key={p.id}
                className={`w-[calc((100%-0.75rem)/2)] shrink-0 sm:w-auto ${
                  i % 2 === 0 ? "snap-start" : "[scroll-snap-align:none]"
                }`}
              >
                <Card product={p} currency={currency} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} />
              </li>
            ))}

            {/* Mobile-only end slide */}
            <li
              className={`flex w-[calc((100%-0.75rem)/2)] shrink-0 sm:hidden ${
                items.length % 2 === 0 ? "snap-start" : "[scroll-snap-align:none]"
              }`}
            >
              <Link
                href={viewAllHref}
                className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-[color:var(--bs-border)] bg-[color:var(--bs-img-bg)] p-3 text-center text-xs uppercase tracking-[0.14em] text-[color:var(--bs-ink)] shadow-[inset_0_0_0_2px_#fff]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--bs-accent)] text-white">
                  <ArrowRight size={18} />
                </span>
                View More
              </Link>
            </li>
          </ul>
        )}

        <div className="mt-6 text-center md:mt-8">
          <Link
            href={viewAllHref}
            className="inline-block rounded-full border border-[color:var(--bs-border)] bg-[color:var(--bs-card)] px-8 py-3 text-xs uppercase tracking-[0.18em] text-[color:var(--bs-ink)] transition-colors duration-300 hover:border-[color:var(--bs-accent)] hover:bg-[color:var(--bs-badge-bg)] md:text-sm"
          >
            View All Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}
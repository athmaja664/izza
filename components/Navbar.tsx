"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { KEYS, useStored, type CartItem, type WishItem } from "@/lib/izha-store";

/* How long each sentence stays before the next one starts sliding in */
const OFFER_INTERVAL_MS = 2000;

/* How long the slide itself takes (bigger number = slower swipe) */
const SLIDE_DURATION_MS = 1000;

/* Navbar hide/show: ignore tiny scrolls, and never hide near the top of the page */
const SCROLL_THRESHOLD = 8;
const ALWAYS_SHOW_BELOW = 80;

/* WhatsApp chat link (country code 91 + number) */
const WHATSAPP_URL =
  "https://wa.me/919995757612?text=" +
  encodeURIComponent("Hi IZHA BLOOMS, I would like to know more about your collection.");

const OFFERS = [
  "Free shipping on orders above ₹999",
  "Flat 10% off on your first order",
  "New festive collection is live",
  "Buy 2 and get 15% off",
];

/* Menu order: Home, New Arrivals, Shop All, Collection (image cards on laptop hover and in the mobile menu).
   Put the photos in public/images/collections/ or change the paths below. */
type NavChild = { label: string; href: string; image?: string };
type NavLink = {
  label: string;
  href: string;
  children?: NavChild[];
};

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Shop All", href: "/shop" },
  {
    label: "Collection",
    href: "/collections",
    children: [
      { label: "Dresses", href: "/collections/dresses", image: "/images/dress.jpg" },
      { label: "Kurtas", href: "/collections/kurtas", image: "/images/kurtas1.jpg" },
      { label: "Kurta Sets", href: "/collections/kurta-sets", image: "/images/kurtasset.jpg" },
      { label: "Tops", href: "/collections/tops", image: "/images/tops.jpg" },
      { label: "Maternity Wear", href: "/collections/maternity-wear", image: "/images/maternity-wear.jpg" },
    ],
  },
];

/* WhatsApp logo (lucide-react has no brand icons) */
function WhatsAppIcon({ size = 21 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute right-0 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#382B2B] px-1 text-[10px] font-medium leading-none text-white sm:right-0.5">
      {count}
    </span>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [offerIndex, setOfferIndex] = useState(0);
  const [prevOfferIndex, setPrevOfferIndex] = useState<number | null>(null);
  const [hidden, setHidden] = useState(false); // true = navbar slid out of view
  const [megaDismissed, setMegaDismissed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Cart and wishlist counts come straight from the browser storage
  const [cart] = useStored<CartItem[]>(KEYS.cart, []);
  const [wish] = useStored<WishItem[]>(KEYS.wish, []);
  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const wishlistCount = wish.length;

  // Slide to the next offer every 2 seconds without glitching on initial render
  useEffect(() => {
    const timer = setInterval(() => {
      setOfferIndex((curr) => {
        setPrevOfferIndex(curr);
        return (curr + 1) % OFFERS.length;
      });
    }, OFFER_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  // Hide the navbar when scrolling down, show it again when scrolling up
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const diff = y - lastY;

      if (y < ALWAYS_SHOW_BELOW) {
        setHidden(false);
        lastY = y;
      } else if (diff > SCROLL_THRESHOLD) {
        setHidden(true); // scrolling down
        lastY = y;
      } else if (diff < -SCROLL_THRESHOLD) {
        setHidden(false); // scrolling up
        lastY = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when the drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Focus the search input and close on Escape
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const submitSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
  };

  // Black text on the pink navbar
  const textColor = "text-black hover:text-white";
  // Slightly smaller on mobile so all the icons fit beside the logo
  const iconClass = `relative flex h-9 w-9 items-center justify-center transition-colors duration-200 sm:h-10 sm:w-10 ${textColor}`;

  return (
    <>
      {/* Slides up out of view on scroll down, slides back in on scroll up */}
      <header
        className={`sticky top-0 z-50 w-full transition-transform duration-300 ease-in-out ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* MAIN NAVBAR (pink background, black text)
            relative z-20 keeps it, and its dropdowns, above the offers bar below.
            The collection panel is positioned against this full-width box. */}
        <div className="relative z-20 border-b border-black/10 bg-[#E99A9F]">
          <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] grid-rows-1 items-center px-2 sm:px-4 md:h-20 md:px-8">
            {/* LEFT: menu button (mobile) / nav links (laptop) */}
            <div className="flex h-full items-center">
              <button
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
                className={`flex h-10 w-10 items-center justify-center transition-colors sm:h-11 sm:w-11 lg:hidden ${textColor}`}
              >
                <Menu size={24} strokeWidth={1.5} />
              </button>

              <nav className="hidden h-full items-center gap-8 lg:flex">
                {NAV_LINKS.map((link) => (
                  /* h-full so the hover area touches the panel (no gap that closes it) */
                  <div
                    key={link.label}
                    onMouseEnter={() => link.children && setMegaDismissed(false)}
                    onMouseLeave={() => link.children && setMegaDismissed(false)}
                    className="group flex h-full items-center"
                  >
                    <Link
                      href={link.href}
                      onClick={() => link.children && setMegaDismissed(true)}
                      className={`flex h-full items-center text-[13px] font-medium uppercase tracking-[0.18em] transition-colors duration-200 ${textColor}`}
                    >
                      {link.label}
                    </Link>

                    {/* COLLECTION MEGA MENU: image cards, full width, opens on hover */}
                    {link.children && (
                      <div
                        className={`invisible absolute left-0 right-0 top-full z-30 translate-y-1 border-t border-[#382B2B]/10 bg-[#FFF9F4] opacity-0 shadow-xl transition-all duration-200 ${
                          megaDismissed
                            ? "pointer-events-none"
                            : "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
                        }`}
                      >
                        <div className="mx-auto max-w-[1100px] px-8 py-8">
                          <ul className="grid grid-cols-5 gap-5">
                            {link.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={() => setMegaDismissed(true)}
                                  className="group/card block text-center"
                                >
                                  <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#F6DADD]">
                                    {child.image && (
                                      <Image
                                        src={child.image}
                                        alt={child.label}
                                        fill
                                        sizes="200px"
                                        quality={80}
                                        className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                                      />
                                    )}
                                  </span>
                                  <span className="mt-3 block text-[13px] uppercase tracking-[0.15em] text-[#382B2B] transition-colors group-hover/card:text-[#9C555C]">
                                    {child.label}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* CENTER LOGO (bigger logo, navbar height stays the same) */}
            <Link
              href="/"
              aria-label="Izha Blooms home"
              className="flex h-full items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <Image
                src="/images/logooo.png"
                alt="Izha Blooms"
                width={240}
                height={240}
                priority
                className="h-[92px] w-auto max-w-none object-contain sm:h-[108px] md:h-[124px]"
              />
            </Link>

            {/* RIGHT ICONS, in this order: Cart, Wishlist, Account, WhatsApp, Search */}
            <div className="flex items-center justify-end gap-0 sm:gap-0.5 md:gap-1">
              <Link href="/addtocart" aria-label="Cart" className={iconClass}>
                <ShoppingBag size={21} strokeWidth={1.5} />
                <Badge count={cartCount} />
              </Link>
              <Link href="/wishlist" aria-label="Wishlist" className={iconClass}>
                <Heart size={21} strokeWidth={1.5} />
                <Badge count={wishlistCount} />
              </Link>
              <Link href="/account" aria-label="Account" className={iconClass}>
                <User size={21} strokeWidth={1.5} />
              </Link>
              {/* WhatsApp: hidden on small phones (it is in the menu drawer), shown from sm up */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className={`${iconClass} hidden sm:flex`}
              >
                <WhatsAppIcon size={21} />
              </a>
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className={iconClass}
              >
                <Search size={21} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        {/* OFFERS BAR BELOW THE NAVBAR (one sentence at a time, slides every 2 seconds)
            relative z-10 keeps it below the navbar dropdowns */}
        <div
          className="relative z-10 h-8 overflow-hidden bg-[#F3E7D3] md:h-10"
          aria-live="polite"
        >
          {OFFERS.map((offer, i) => {
            const isActive = i === offerIndex;
            const isLeaving = prevOfferIndex !== null && i === prevOfferIndex;
            const position = isActive
              ? "translate-x-0 transition-transform ease-in-out"
              : isLeaving
              ? "-translate-x-full transition-transform ease-in-out"
              : "translate-x-full";

            return (
              <p
                key={offer}
                aria-hidden={!isActive}
                style={isActive || isLeaving ? { transitionDuration: `${SLIDE_DURATION_MS}ms` } : undefined}
                className={`absolute inset-0 flex items-center justify-center px-2 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-[#D9707F] sm:px-4 sm:text-[11px] sm:tracking-[0.2em] md:text-xs truncate ${position}`}
              >
                {offer}
              </p>
            );
          })}
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${menuOpen ? "visible" : "invisible"}`}>
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-[#382B2B]/40 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-[80%] max-w-sm flex-col bg-[#FFF9F4] transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-[#382B2B]/10 bg-[#E99A9F] px-4">
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-black">Menu</span>
            <button
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="flex h-11 w-11 items-center justify-center text-black hover:text-white"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-6">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="border-b border-[#382B2B]/10 py-3">
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-1 text-sm font-medium uppercase tracking-[0.18em] text-[#382B2B] hover:text-[#9C555C]"
                >
                  {link.label}
                </Link>

                {/* Collection on mobile: image cards in a 2 column grid */}
                {link.children && (
                  <ul className="mt-3 grid grid-cols-2 gap-3 pb-2">
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => setMenuOpen(false)}
                          className="group/card block text-center"
                        >
                          <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#F6DADD]">
                            {child.image && (
                              <Image
                                src={child.image}
                                alt={child.label}
                                fill
                                sizes="150px"
                                quality={75}
                                className="object-cover"
                              />
                            )}
                          </span>
                          <span className="mt-2 block text-[11px] uppercase tracking-[0.12em] text-[#382B2B] group-hover/card:text-[#9C555C]">
                            {child.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>

          {/* Same order as the navbar icons: Cart, Wishlist, Account, WhatsApp, Search */}
          <div className="flex flex-col gap-1 border-t border-[#382B2B]/10 bg-[#F6DADD] px-6 py-4">
            <Link
              href="/addtocart"
              onClick={() => setMenuOpen(false)}
              className="flex h-12 items-center gap-3 text-sm uppercase tracking-[0.15em] text-[#382B2B] hover:text-[#9C555C]"
            >
              <ShoppingBag size={20} strokeWidth={1.5} /> Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="flex h-12 items-center gap-3 text-sm uppercase tracking-[0.15em] text-[#382B2B] hover:text-[#9C555C]"
            >
              <Heart size={20} strokeWidth={1.5} /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex h-12 items-center gap-3 text-sm uppercase tracking-[0.15em] text-[#382B2B] hover:text-[#9C555C]"
            >
              <User size={20} strokeWidth={1.5} /> Account
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex h-12 items-center gap-3 text-sm uppercase tracking-[0.15em] text-[#382B2B] hover:text-[#9C555C]"
            >
              <WhatsAppIcon size={20} /> WhatsApp
            </a>
            <button
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="flex h-12 items-center gap-3 text-sm uppercase tracking-[0.15em] text-[#382B2B] hover:text-[#9C555C]"
            >
              <Search size={20} strokeWidth={1.5} /> Search
            </button>
          </div>
        </aside>
      </div>

      {/* SEARCH OVERLAY */}
      <div
        onClick={() => setSearchOpen(false)}
        className={`fixed inset-0 z-[70] bg-[#382B2B]/50 transition-opacity duration-300 ${
          searchOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={`bg-[#FFF9F4] px-4 py-8 transition-transform duration-300 md:px-8 ${
            searchOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="mx-auto flex max-w-3xl items-center gap-3 border-b border-[#382B2B]/30 pb-3">
            <Search size={22} strokeWidth={1.5} className="text-[#382B2B]" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Search for dresses, kurtas, tops..."
              className="flex-1 bg-transparent text-base text-[#382B2B] outline-none placeholder:text-[#382B2B]/50"
            />
            <button
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="text-[#382B2B] hover:text-[#9C555C]"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
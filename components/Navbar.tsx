"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";

type NavbarProps = {
  cartCount?: number;
  wishlistCount?: number;
};

/* How long each sentence stays before the next one starts sliding in */
const OFFER_INTERVAL_MS = 2000;

/* How long the slide itself takes (bigger number = slower swipe) */
const SLIDE_DURATION_MS = 1000;

const OFFERS = [
  "Free shipping on orders above ₹999",
  "Flat 10% off on your first order",
  "New festive collection is live",
  "Buy 2 and get 15% off",
];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "Collections",
    href: "/collections",
    children: [
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Embroidered", href: "/collections/embroidered" },
      { label: "Festive", href: "/collections/festive" },
    ],
  },
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "All Products", href: "/shop" },
      { label: "Dresses", href: "/shop/dresses" },
      { label: "Accessories", href: "/shop/accessories" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
];

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#382B2B] px-1 text-[10px] font-medium leading-none text-white">
      {count}
    </span>
  );
}

export default function Navbar({ cartCount = 0, wishlistCount = 0 }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [offerIndex, setOfferIndex] = useState(0);
  const [prevOfferIndex, setPrevOfferIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
  const iconClass = `relative flex h-10 w-10 items-center justify-center transition-colors duration-200 ${textColor}`;

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        {/* MAIN NAVBAR (pink background, black text)
            relative z-20 keeps it, and its dropdowns, above the offers bar below */}
        <div className="relative z-20 border-b border-black/10 bg-[#E99A9F]">
          <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] grid-rows-1 items-center px-4 md:h-20 md:px-8">
            {/* LEFT */}
            <div className="flex items-center">
              <button
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
                className={`flex h-11 w-11 items-center justify-center transition-colors lg:hidden ${textColor}`}
              >
                <Menu size={24} strokeWidth={1.5} />
              </button>

              <nav className="hidden items-center gap-8 lg:flex">
                {NAV_LINKS.map((link) => (
                  <div key={link.label} className="group relative">
                    <Link
                      href={link.href}
                      className={`py-6 text-[13px] font-medium uppercase tracking-[0.18em] transition-colors duration-200 ${textColor}`}
                    >
                      {link.label}
                    </Link>

                    {link.children && (
                      <div className="invisible absolute left-0 top-full z-30 min-w-48 translate-y-1 border border-[#382B2B]/10 bg-[#FFF9F4] py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-5 py-2.5 text-[12px] uppercase tracking-[0.15em] text-[#382B2B] transition-colors hover:bg-[#F6DADD] hover:text-[#9C555C]"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* CENTER LOGO */}
            <Link
              href="/"
              aria-label="Izha Blooms home"
              className="flex items-center justify-center py-1 transition-transform duration-300 hover:scale-105"
            >
              <Image
                src="/images/logo-nav.png"
                alt="Izha Blooms"
                width={200}
                height={200}
                priority
                className="h-11 w-auto max-w-[140px] object-contain sm:h-12 md:h-16 md:max-w-none"
              />
            </Link>

            {/* RIGHT ICONS */}
            <div className="flex items-center justify-end gap-0.5 md:gap-1">
              <button
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
                className={iconClass}
              >
                <Search size={21} strokeWidth={1.5} />
              </button>
              <Link href="/account" aria-label="Account" className={`${iconClass} hidden lg:flex`}>
                <User size={21} strokeWidth={1.5} />
              </Link>
              <Link href="/wishlist" aria-label="Wishlist" className={`${iconClass} hidden sm:flex`}>
                <Heart size={21} strokeWidth={1.5} />
                <Badge count={wishlistCount} />
              </Link>
              <Link href="/cart" aria-label="Cart" className={iconClass}>
                <ShoppingBag size={21} strokeWidth={1.5} />
                <Badge count={cartCount} />
              </Link>
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
                {link.children && (
                  <div className="mt-1 flex flex-col pl-4">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMenuOpen(false)}
                        className="py-2 text-[13px] tracking-wide text-[#382B2B]/80 hover:text-[#9C555C]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex flex-col gap-1 border-t border-[#382B2B]/10 bg-[#F6DADD] px-6 py-4">
            <button
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="flex h-12 items-center gap-3 text-sm uppercase tracking-[0.15em] text-[#382B2B] hover:text-[#9C555C]"
            >
              <Search size={20} strokeWidth={1.5} /> Search
            </button>
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex h-12 items-center gap-3 text-sm uppercase tracking-[0.15em] text-[#382B2B] hover:text-[#9C555C]"
            >
              <User size={20} strokeWidth={1.5} /> Account
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="flex h-12 items-center gap-3 text-sm uppercase tracking-[0.15em] text-[#382B2B] hover:text-[#9C555C]"
            >
              <Heart size={20} strokeWidth={1.5} /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
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
              placeholder="Search for dresses, sarees, accessories..."
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
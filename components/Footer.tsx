import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Truck, ShieldCheck, MessageCircle, PackageCheck } from "lucide-react";

/* ---- Easy settings ---- */

const BRAND = "IZHA BLOOMS";
const BUSINESS_NAME = "Empire Ae It Services";
const TAGLINE =
  "Where Every Thread Blooms. Thoughtfully curated women's wear that brings together timeless elegance, effortless comfort and distinctive details. Designed with care in Kerala, for women who love to express themselves through style.";

const PHONE_DISPLAY = "+91 99957 57612";
const PHONE_DIGITS = "919995757612";
const EMAIL_ADDRESS = "izhablooms@gmail.com";
const LOCATION = "Aluva, Kerala, India";

const INSTAGRAM_URL = "https://www.instagram.com/izhablooms/";
const FACEBOOK_URL = "https://www.facebook.com/izhablooms/";

const WHATSAPP_URL = `https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(
  "Hi IZHA BLOOMS, I would like personal assistance with your collection."
)}`;

const TRUST = [
  { icon: Truck, title: "Delivery Across India", text: "Delivered to your doorstep." },
  { icon: ShieldCheck, title: "Secure Payments", text: "Safe and simple checkout" },
  { icon: PackageCheck, title: "Order Tracking", text: "Stay updated at every step." },
  { icon: MessageCircle, title: "Personal Assistance", text: "We're just a WhatsApp message away." },
];

const EXPLORE_LINKS = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Dresses", href: "/collections/dresses" },
  { label: "Kurtas", href: "/collections/kurtas" },
  { label: "Kurta Sets", href: "/collections/kurta-sets" },
  { label: "Tops", href: "/collections/tops" },
  { label: "Maternity Wear", href: "/collections/maternity-wear" },
  { label: "All Products", href: "/shop" },
];

const ACCOUNT_LINKS = [
  { label: "My Profile", href: "/account" },
  { label: "My Orders", href: "/account?tab=orders" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Shopping Bag", href: "/addtocart" },
  { label: "Track Your Order", href: "/track-order" },
  { label: "Admin Panel (Demo)", href: "/admin" },
];

const CUSTOMER_CARE_LINKS = [
  { label: "About Us", href: "/#about" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "FAQs", href: "/faqs" },
  { label: "Shipping & Delivery", href: "/shipping-policy" },
  { label: "Returns & Exchange", href: "/returns" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

/* ----------------------- */

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
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

function FacebookIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.5 3.5A11.8 11.8 0 0 0 12 0C5.4 0 .1 5.3.1 11.9c0 2.1.5 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.6 1.4C18.6 23.7 24 18.4 24 11.8c0-3.2-1.2-6.1-3.5-8.3ZM12 21.6c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.7 9.7 0 0 1-1.5-5.1C2.1 6.5 6.5 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9a9.600 9.600 0 0 1 2.900 6.900c0 5.400-4.400 9.600-9.800 9.600Zm5.300-7.200c-.3-.1-1.700-.8-2-.9-.3-.1-.5-.1-.7.1l-.9 1.100c-.2.200-.3.200-.6.100-1.600-.8-2.600-1.400-3.600-3.100-.3-.5.3-.5.800-1.500.1-.2 0-.4 0-.5l-.9-2.200c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400-.3.300-1 1-1 2.400s1 2.800 1.200 3c.1.200 2 3.100 4.900 4.300 1.800.8 2.500.9 3.400.7.600-.1 1.700-.7 2-1.400.2-.7.2-1.200.2-1.400-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

const linkClass =
  "text-sm text-[#F3E7D3]/75 transition-colors duration-200 hover:text-[#E99A9F] focus-visible:text-[#E99A9F] focus-visible:outline-none";

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E99A9F]">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className={linkClass}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = 2026;

  return (
    <footer className="bg-[#382B2B] text-[#F3E7D3]" aria-label="Site footer">
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 md:gap-6 md:px-8 lg:grid-cols-4 lg:py-10">
          {TRUST.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3 lg:items-center">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#E99A9F]/50 text-[#E99A9F] sm:size-11">
                <Icon size={20} strokeWidth={1.5} />
              </span>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white">
                  {title}
                </p>
                <p className="mt-0.5 text-xs text-[#F3E7D3]/70">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main columns */}
      <div className="mx-auto max-w-[1600px] px-4 py-10 md:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.3fr] lg:gap-x-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" aria-label={`${BRAND} home`} className="inline-block">
              <Image
                src="/images/logooo.png"
                alt={BRAND}
                width={200}
                height={200}
                className="h-24 w-auto object-contain brightness-0 invert opacity-90 transition-opacity hover:opacity-100 sm:h-28 md:h-36"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#F3E7D3]/75">{TAGLINE}</p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Izha Blooms on Instagram"
                className="flex size-11 items-center justify-center rounded-full border border-white/25 text-[#F3E7D3] transition-colors duration-300 hover:border-[#E99A9F] hover:bg-[#E99A9F] hover:text-[#382B2B]"
              >
                <InstagramIcon />
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Izha Blooms on Facebook"
                className="flex size-11 items-center justify-center rounded-full border border-white/25 text-[#F3E7D3] transition-colors duration-300 hover:border-[#E99A9F] hover:bg-[#E99A9F] hover:text-[#382B2B]"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          <LinkColumn title="Explore" links={EXPLORE_LINKS} />
          <LinkColumn title="My Account" links={ACCOUNT_LINKS} />
          <LinkColumn title="Customer Care" links={CUSTOMER_CARE_LINKS} />

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E99A9F]">
              Get in Touch
            </h3>

            <ul className="mt-5 space-y-4">
              <li>
                <a
                  href={`tel:+${PHONE_DIGITS}`}
                  className="flex items-start gap-3 text-sm text-[#F3E7D3]/85 transition-colors hover:text-[#E99A9F]"
                >
                  <Phone size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#E99A9F]" />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL_ADDRESS}`}
                  className="flex items-start gap-3 text-sm text-[#F3E7D3]/85 transition-colors hover:text-[#E99A9F]"
                >
                  <Mail size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#E99A9F]" />
                  {EMAIL_ADDRESS}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#F3E7D3]/85">
                <MapPin size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#E99A9F]" />
                {LOCATION}
              </li>
            </ul>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2.5 rounded-full bg-[#E99A9F] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#382B2B] transition-colors duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <WhatsAppIcon />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-3 px-4 py-6 text-center md:flex-row md:px-8 md:text-left">
          <p className="text-xs text-[#F3E7D3]/60">
            &copy; {year} {BUSINESS_NAME}. All rights reserved.
          </p>
          <p className="text-xs tracking-[0.15em] text-[#F3E7D3]/60">
            {BRAND} &middot; Where Every Thread Blooms
          </p>
        </div>
      </div>
    </footer>
  );
}
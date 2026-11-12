"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { PRODUCTS } from "@/lib/products";

const OFFICIAL_WA_NUMBER = "919995757612";
const WA_LOGO_SRC = "/images/whtapplogo.jpg";

export function WhatsAppSvg({ size = 20 }: { size?: number }) {
  return (
    <Image
      src={WA_LOGO_SRC}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="inline-block shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}

export default function WhatsAppFloat() {
  const pathname = usePathname() ?? "/";
  if (pathname.startsWith("/admin")) return null;

  let text = "Hi IZZA Designs, I would like personal assistance with your collection.";
  if (pathname.startsWith("/product/")) {
    const id = pathname.replace("/product/", "").split("/")[0];
    const prod = PRODUCTS.find((p) => p.id === id);
    if (prod) {
      text = `Hi IZZA Designs, I would like to enquire about "${prod.name}".`;
    }
  }

  const href = `https://wa.me/${OFFICIAL_WA_NUMBER}?text=${encodeURIComponent(text)}`;

  /* Slightly higher on cart/checkout/product pages on small screens so it never blocks bottom CTAs */
  const bottomOffset =
    pathname.startsWith("/product/") ||
    pathname.startsWith("/addtocart") ||
    pathname.startsWith("/checkout")
      ? "bottom-20 sm:bottom-6"
      : "bottom-5 sm:bottom-6";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Izha Blooms on WhatsApp"
      title="Chat on WhatsApp"
      className={`fixed right-4 z-40 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#E8B8C5] bg-white shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B20947] sm:right-6 ${bottomOffset}`}
    >
      <Image
        src={WA_LOGO_SRC}
        alt="WhatsApp"
        width={48}
        height={48}
        className="h-full w-full scale-125 object-cover"
      />
    </a>
  );
}


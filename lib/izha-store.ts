"use client";

import { useEffect, useRef, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  image: string;
  size: string;
  price: number;
  oldPrice?: number;
  qty: number;
};

export type WishItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  inStock?: boolean; // defaults to true
  soldOutSizes?: string[];
};

export type AppUser = {
  name: string;
  email: string;
  phone?: string;
  role?: "admin" | "customer";
};

export type Address = {
  id: string;
  label: string;
  name: string;
  phone: string;
  line: string;
  city: string;
  pincode: string;
  isDefault: boolean;
};

export const KEYS = {
  cart: "izha_cart",
  wish: "izha_wishlist",
  user: "izha_user",
  token: "izha_token",
  addresses: "izha_addresses",
  heroSlides: "izha_admin_hero_slides",
  categories: "izha_admin_categories",
  instagramPosts: "izha_admin_instagram_posts",
  adminProducts: "izha_admin_products",
  coupons: "izha_admin_coupons",
  offers: "izha_admin_offers",
  orders: "izha_admin_orders",
  customers: "izha_admin_customers",
  adminProfile: "izha_admin_profile",
} as const;

export const SIZES = ["XS", "S", "M", "L", "XL"];

export const inr = (n: number) =>
  "₹" + new Intl.NumberFormat("en-IN").format(n);

/** Browsers only fire "storage" in OTHER tabs, so every hook announces its own
 *  writes with this event. That keeps the Navbar badge, the Wishlist page and
 *  the product hearts in step inside the same tab. */
const SYNC_EVENT = "izha-store-sync";

/** localStorage-backed state. `ready` turns true after the first read. */
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  // Last raw string this hook has read from, or written to, localStorage.
  // Comparing against it is what stops two hooks echoing each other forever.
  const lastRaw = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    const read = () => {
      if (!active) return;
      try {
        const raw = localStorage.getItem(key);
        if (raw === lastRaw.current) return;
        lastRaw.current = raw;
        setValue(raw ? (JSON.parse(raw) as T) : initial);
      } catch {
        setValue(initial);
      }
    };
    queueMicrotask(() => {
      if (!active) return;
      read();
      setReady(true);
    });
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) read();
    };
    const onSync = (e: Event) => {
      if ((e as CustomEvent<string>).detail === key) read();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(SYNC_EVENT, onSync);
    return () => {
      active = false;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SYNC_EVENT, onSync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      const raw = value === null ? null : JSON.stringify(value);
      if (raw === lastRaw.current) return; // nothing new to save
      lastRaw.current = raw;
      if (raw === null) localStorage.removeItem(key);
      else localStorage.setItem(key, raw);
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: key }));
    } catch {
      /* storage unavailable: keep working in memory */
    }
  }, [key, value, ready]);

  return [value, setValue, ready] as const;
}
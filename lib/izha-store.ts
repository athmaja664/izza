"use client";

import { useEffect, useState } from "react";

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
} as const;

export const SIZES = ["XS", "S", "M", "L", "XL"];

export const inr = (n: number) =>
  "₹" + new Intl.NumberFormat("en-IN").format(n);

/** localStorage-backed state. `ready` turns true after the first read. */
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(key);
        setValue(raw ? (JSON.parse(raw) as T) : initial);
      } catch {
        setValue(initial);
      }
    };
    read();
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) read();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable: keep working in memory */
    }
  }, [key, value, ready]);

  return [value, setValue, ready] as const;
}
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import {
  KEYS,
  SIZES,
  inr,
  useStored,
  type CartItem,
  type WishItem,
} from "@/lib/izha-store";
import {
  EmptyBlock,
  PageTitle,
  PageShell,
  cardCream,
  focusRing,
  outlineBtn,
  serif,
} from "@/components/izha/ui";

export default function WishlistPage() {
  const [wish, setWish, ready] = useStored<WishItem[]>(KEYS.wish, []);
  const [, setCart] = useStored<CartItem[]>(KEYS.cart, []);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [needSize, setNeedSize] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const remove = (id: string) => setWish((w) => w.filter((x) => x.id !== id));

  const addToCart = (p: WishItem) => {
    const size = picked[p.id];
    if (!size) {
      setNeedSize(p.id);
      return;
    }
    setNeedSize(null);
    setCart((c) => {
      const i = c.findIndex((x) => x.id === p.id && x.size === size);
      if (i >= 0) {
        const next = [...c];
        next[i] = { ...next[i], qty: Math.min(10, next[i].qty + 1) };
        return next;
      }
      return [
        ...c,
        {
          id: p.id,
          name: p.name,
          image: p.image,
          size,
          price: p.price,
          oldPrice: p.oldPrice,
          qty: 1,
        },
      ];
    });
    setDone(p.id);
    setTimeout(() => setDone((d) => (d === p.id ? null : d)), 1600);
  };

  return (
    <PageShell>
      <PageTitle
        title="Wishlist"
        sub={
          ready && wish.length > 0
            ? `${wish.length} ${wish.length === 1 ? "piece" : "pieces"} saved`
            : undefined
        }
      />

      {ready && wish.length === 0 && (
        <EmptyBlock text="Your wishlist is empty" href="/shop" action="Discover more" />
      )}

      {ready && wish.length > 0 && (
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {wish.map((p) => {
            const inStock = p.inStock !== false;
            const off =
              p.oldPrice && p.oldPrice > p.price
                ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                : 0;
            return (
              <li key={p.id} className={`${cardCream} flex flex-col p-2`}>
                {/* arch photo with white inner frame */}
                <div className="rounded-t-full rounded-b-xl border border-[#E8B8C5] bg-white p-1.5">
                  <div className="group relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-lg bg-[#FFF5F7]">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width:1024px) 250px, 45vw"
                      quality={75}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={() => remove(p.id)}
                      aria-label={`Remove ${p.name} from wishlist`}
                      className={`absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white ${focusRing}`}
                    >
                      <Heart
                        size={18}
                        strokeWidth={1.6}
                        className="fill-[#E99A9F] text-[#E99A9F]"
                      />
                    </button>
                  </div>
                </div>

                <div className="flex flex-1 flex-col px-1 pb-1 pt-3">
                  <h3
                    className={`${serif} line-clamp-2 text-[17px] font-medium leading-snug text-[#332B2B]`}
                  >
                    {p.name}
                  </h3>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span
                      className={`${serif} text-[17px] font-semibold text-[#332B2B]`}
                    >
                      {inr(p.price)}
                    </span>
                    {off > 0 && (
                      <>
                        <span className="text-[12px] text-[#9b9090] line-through">
                          {inr(p.oldPrice!)}
                        </span>
                        <span className="rounded bg-[#F9E3E9] px-1.5 py-0.5 text-[10px] font-semibold text-[#B5607A]">
                          {off}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* size boxes */}
                  <div
                    className="mt-3 grid grid-cols-5 gap-1"
                    role="group"
                    aria-label={`Sizes for ${p.name}`}
                  >
                    {SIZES.map((s) => {
                      const soldOut = !inStock || p.soldOutSizes?.includes(s);
                      const on = picked[p.id] === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={soldOut}
                          aria-pressed={on}
                          onClick={() => {
                            setPicked((m) => ({ ...m, [p.id]: s }));
                            setNeedSize(null);
                          }}
                          className={`relative overflow-hidden rounded-md border py-1.5 text-[11px] font-medium ${focusRing} ${
                            soldOut
                              ? "cursor-not-allowed border-[#E8CFD2] bg-white text-[#b3a9ab]"
                              : on
                              ? "border-[#E99A9F] bg-[#E99A9F] text-white"
                              : "border-[#E8B8C5] bg-white text-[#332B2B]"
                          }`}
                        >
                          {s}
                          {soldOut && (
                            <span className="absolute left-0 right-0 top-1/2 h-px -rotate-[30deg] bg-[#b3a9ab]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <p
                    className={`mt-2 text-[12px] ${
                      inStock ? "text-[#5f7a62]" : "font-medium text-[#b04a4a]"
                    }`}
                  >
                    {inStock ? "In stock" : "OUT OF STOCK"}
                  </p>

                  <p
                    aria-live="polite"
                    className="min-h-[16px] text-[11px] text-[#B20947]"
                  >
                    {needSize === p.id ? "Pick a size to continue." : ""}
                  </p>

                  {/* Add to Cart: white background, pink outline, #B20947 text */}
                  <button
                    type="button"
                    onClick={() => addToCart(p)}
                    disabled={!inStock}
                    className={`${outlineBtn} mt-auto w-full !px-1 sm:!px-2`}
                  >
                    {!inStock
                      ? "Out of Stock"
                      : done === p.id
                      ? "Added to Cart"
                      : "Add to Cart"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {ready && wish.length > 0 && (
        <div className="mt-12 text-center">
          <Link href="/addtocart" className={`${outlineBtn} px-8`}>
            Go to Cart
          </Link>
        </div>
      )}
    </PageShell>
  );
}
"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import {
  KEYS,
  inr,
  useStored,
  type AppUser,
  type CartItem,
  type WishItem,
} from "@/lib/izha-store";
import {
  EmptyBlock,
  FlowerBadge,
  PageTitle,
  PageShell,
  card,
  focusRing,
  outlineBtn,
  serif,
  solidBtn,
} from "@/components/izha/ui";

export default function CartPage() {
  const [cart, setCart, ready] = useStored<CartItem[]>(KEYS.cart, []);
  const [, setWish] = useStored<WishItem[]>(KEYS.wish, []);
  const [user] = useStored<AppUser | null>(KEYS.user, null);

  const { subtotal, savings, count } = useMemo(() => {
    let subtotal = 0;
    let savings = 0;
    let count = 0;
    for (const i of cart) {
      subtotal += i.price * i.qty;
      count += i.qty;
      if (i.oldPrice && i.oldPrice > i.price)
        savings += (i.oldPrice - i.price) * i.qty;
    }
    return { subtotal, savings, count };
  }, [cart]);

  const changeQty = (id: string, size: string, delta: number) =>
    setCart((items) =>
      items.map((i) =>
        i.id === id && i.size === size
          ? { ...i, qty: Math.min(10, Math.max(1, i.qty + delta)) }
          : i
      )
    );

  const remove = (id: string, size: string) =>
    setCart((items) => items.filter((i) => !(i.id === id && i.size === size)));

  const moveToWishlist = (item: CartItem) => {
    setWish((w) =>
      w.some((x) => x.id === item.id)
        ? w
        : [
            ...w,
            {
              id: item.id,
              name: item.name,
              image: item.image,
              price: item.price,
              oldPrice: item.oldPrice,
            },
          ]
    );
    remove(item.id, item.size);
  };

  return (
    <PageShell>
      <PageTitle
        title="Cart"
        sub={
          ready && count > 0
            ? `${count} ${count === 1 ? "piece" : "pieces"} in your bag`
            : undefined
        }
      />

      {ready && cart.length === 0 && (
        <EmptyBlock text="Your cart is empty" href="/shop" action="Discover more" />
      )}

      {ready && cart.length > 0 && (
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_340px]">
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={`${item.id}-${item.size}`}
                className={`${card} flex gap-4 p-3 sm:p-4`}
              >
                {/* arch photo frame */}
                <div className="h-36 w-28 shrink-0 rounded-t-full rounded-b-xl border border-[#E8B8C5] bg-white p-1 sm:h-44 sm:w-32">
                  <div className="relative h-full w-full overflow-hidden rounded-t-full rounded-b-lg bg-[#FFF5F7]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="128px"
                      quality={75}
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3
                        className={`${serif} line-clamp-2 text-[20px] font-medium leading-snug text-[#332B2B]`}
                      >
                        {item.name}
                      </h3>
                      <p className="mt-1 text-[13px] text-[#6f6565]">
                        Size {item.size}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(item.id, item.size)}
                      aria-label={`Remove ${item.name} from cart`}
                      className={`rounded-full p-2 text-[#6f6565] hover:bg-[#FFF5F7] hover:text-[#B20947] ${focusRing}`}
                    >
                      <Trash2 size={18} strokeWidth={1.6} />
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap items-baseline gap-2">
                    <span
                      className={`${serif} text-[20px] font-semibold text-[#332B2B]`}
                    >
                      {inr(item.price)}
                    </span>
                    {item.oldPrice && item.oldPrice > item.price && (
                      <>
                        <span className="text-[12px] text-[#9b9090] line-through">
                          {inr(item.oldPrice)}
                        </span>
                        <span className="rounded bg-[#F9E3E9] px-1.5 py-0.5 text-[10px] font-semibold text-[#B5607A]">
                          {Math.round(
                            ((item.oldPrice - item.price) / item.oldPrice) * 100
                          )}
                          % OFF
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                    <div
                      className="flex items-center gap-3"
                      role="group"
                      aria-label={`Quantity for ${item.name}`}
                    >
                      <button
                        onClick={() => changeQty(item.id, item.size, -1)}
                        disabled={item.qty <= 1}
                        aria-label="Decrease quantity"
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-[#E99A9F] bg-white text-[#332B2B] disabled:cursor-not-allowed disabled:border-[#d9cfd2] disabled:text-[#b3a9ab] ${focusRing}`}
                      >
                        <Minus size={16} strokeWidth={1.8} />
                      </button>
                      <span className="min-w-[1.5rem] text-center text-[15px] font-medium text-[#332B2B]">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => changeQty(item.id, item.size, 1)}
                        disabled={item.qty >= 10}
                        aria-label="Increase quantity"
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-[#E99A9F] bg-white text-[#332B2B] disabled:cursor-not-allowed disabled:border-[#d9cfd2] disabled:text-[#b3a9ab] ${focusRing}`}
                      >
                        <Plus size={16} strokeWidth={1.8} />
                      </button>
                    </div>

                    <button
                      onClick={() => moveToWishlist(item)}
                      className={`inline-flex items-center gap-1.5 rounded text-[13px] text-[#B20947] underline-offset-4 hover:underline ${focusRing}`}
                    >
                      <Heart size={15} strokeWidth={1.7} />
                      Move to wishlist
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Order summary with flower badge on the top edge */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className={`${card} relative px-5 pb-6 pt-9 sm:px-6`}>
              <FlowerBadge />
              <h2
                className={`${serif} text-center text-[26px] font-medium text-[#332B2B]`}
              >
                Order Summary
              </h2>
              <span className="mx-auto mt-2 block h-[2px] w-14 bg-[#E8B8C5]" />

              <dl className="mt-6 space-y-3 text-[15px]">
                <div className="flex justify-between">
                  <dt className="text-[#6f6565]">
                    Subtotal ({count} {count === 1 ? "item" : "items"})
                  </dt>
                  <dd className="font-medium text-[#332B2B]">
                    {inr(subtotal)}
                  </dd>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-[#6f6565]">You save</dt>
                    <dd className="font-medium text-[#5f7a62]">
                      {inr(savings)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-[#6f6565]">Shipping</dt>
                  <dd className="text-[#6f6565]">Calculated at checkout</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-[#E8CFD2] pt-4">
                  <dt
                    className={`${serif} text-[22px] font-semibold text-[#332B2B]`}
                  >
                    Total
                  </dt>
                  <dd
                    className={`${serif} text-[26px] font-semibold text-[#332B2B]`}
                  >
                    {inr(subtotal)}
                  </dd>
                </div>
              </dl>

              <Link
                href={user ? "/checkout" : "/account?next=/checkout"}
                className={`${solidBtn} mt-6 w-full`}
              >
                {user ? "Proceed to Checkout" : "Sign in to Checkout"}
              </Link>
              <Link href="/wishlist" className={`${outlineBtn} mt-3 w-full`}>
                View Wishlist
              </Link>

              <p className="mt-5 text-center text-[13px] text-[#6f6565]">
                Not sure about a size?{" "}
                <a
                  href="https://wa.me/918281003090"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-[#B20947] underline underline-offset-4 ${focusRing}`}
                >
                  Chat with us on WhatsApp
                </a>
              </p>
            </div>
          </aside>
        </div>
      )}
    </PageShell>
  );
}
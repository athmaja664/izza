"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, ShoppingBag, X } from "lucide-react";
import {
  KEYS,
  inr,
  useStored,
  type CartItem,
  type WishItem,
} from "@/lib/izha-store";
import { getProductById, type Product } from "@/lib/products";
import {
  EmptyState,
  PageShell,
  PageTitle,
  card,
  focusRing,
  serif,
  solidBtn,
} from "@/components/izha/ui";

/* Change to "/addtocart" if that is the live shopping bag route
   (the Navbar currently links there). */
const BAG_HREF = "/cart";
const MAX_QTY = 10; // same cap the Shopping Bag quantity buttons use

/* ---------- Stock helpers (driven only by product data) ---------- */
const availableSizes = (p: Product) =>
  p.sizes.filter((s) => !(p.soldOutSizes ?? []).includes(s));
const isSoldOut = (p: Product) =>
  p.sizes.length > 0 && availableSizes(p).length === 0;

/* ---------- Toast ---------- */
type Toast = {
  id: number;
  message: string;
  kind: "bag" | "removed" | "info";
  undo?: () => void;
};

const toastLink = `text-[12px] font-semibold uppercase tracking-[0.05em] text-[#B20947] underline-offset-4 hover:underline ${focusRing} rounded`;

/* ---------- Size picker (bottom sheet on mobile, dialog on desktop) ---------- */
function SizePicker({
  product,
  onClose,
  onConfirm,
}: {
  product: Product;
  onClose: () => void;
  onConfirm: (size: string) => void;
}) {
  const [size, setSize] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const soldOut = product.soldOutSizes ?? [];
  const hasDiscount = product.mrp > product.price;

  // Focus the dialog, lock page scroll, and hand focus back when it closes
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      "button:not([disabled])"
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === dialogRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[#382B2B]/50 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={`${card} relative w-full max-w-md rounded-b-none p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] outline-none sm:rounded-b-2xl`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close size selection"
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-[#6f6565] hover:bg-[#FFF5F7] hover:text-[#B20947] ${focusRing}`}
        >
          <X size={20} strokeWidth={1.6} />
        </button>

        <div className="flex items-center gap-4 pr-10">
          <div className="relative h-24 w-[76px] shrink-0 overflow-hidden rounded-lg bg-[#F9E3E9]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="76px"
              quality={75}
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h2
              id={titleId}
              className={`${serif} line-clamp-2 text-[22px] font-medium leading-snug text-[#332B2B]`}
            >
              {product.name}
            </h2>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-[15px] font-medium text-[#332B2B]">
              {inr(product.price)}
              {hasDiscount && (
                <span className="text-[12px] font-normal text-[#9b9090] line-through">
                  {inr(product.mrp)}
                </span>
              )}
            </p>
          </div>
        </div>

        <p className="mt-5 text-[13px] font-medium text-[#332B2B]">Select a size</p>
        <div
          role="radiogroup"
          aria-label="Select a size"
          className="mt-2.5 flex flex-wrap gap-2"
        >
          {product.sizes.map((s) => {
            const out = soldOut.includes(s);
            const on = size === s;
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={on}
                disabled={out}
                title={out ? "Sold out" : undefined}
                onClick={() => setSize(s)}
                className={`h-11 min-w-[52px] rounded-full border px-4 text-[13px] ${focusRing} ${
                  out
                    ? "cursor-not-allowed border-[#e5dcde] bg-[#faf6f6] text-[#b3a9ab] line-through"
                    : on
                      ? "border-[#E99A9F] bg-[#E99A9F] text-white"
                      : "border-[#E8B8C5] bg-white text-[#332B2B] hover:bg-[#FFF5F7]"
                }`}
              >
                {s}
                {out && <span className="sr-only"> (sold out)</span>}
              </button>
            );
          })}
        </div>
        {soldOut.length > 0 && (
          <p className="mt-2 text-[12px] text-[#6f6565]">
            Crossed-out sizes are sold out.
          </p>
        )}

        <button
          type="button"
          disabled={!size}
          onClick={() => size && onConfirm(size)}
          className={`${solidBtn} mt-6 w-full`}
        >
          {size ? "Add to Shopping Bag" : "Choose a size to continue"}
        </button>
      </div>
    </div>
  );
}

/* ---------- Wishlist card (same look as the collection product cards) ---------- */
function WishlistCard({
  item,
  product,
  onRemove,
  onAdd,
}: {
  item: WishItem;
  product?: Product;
  onRemove: () => void;
  onAdd: () => void;
}) {
  // Prefer live catalogue data; fall back to what was saved with the item
  const name = product?.name ?? item.name;
  const image = product?.image ?? item.image;
  const price = product?.price ?? item.price;
  const mrp = product?.mrp ?? item.oldPrice;
  const oldPrice = mrp !== undefined && mrp > price ? mrp : undefined;
  const percent = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const unavailable = !product;
  const soldOut = product ? isSoldOut(product) : false;
  const limited =
    !!product && !soldOut && availableSizes(product).length < product.sizes.length;
  const dimmed = unavailable || soldOut;

  const status = unavailable
    ? "No longer available"
    : soldOut
      ? "Sold out"
      : limited
        ? "Limited sizes"
        : "In stock";
  const statusColor = dimmed
    ? "text-[#B20947]"
    : limited
      ? "text-[#B5607A]"
      : "text-[#5f7a62]";

  const media = (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F9E3E9]">
      <Image
        src={image}
        alt={name}
        fill
        sizes="(min-width: 1024px) 250px, (min-width: 768px) 33vw, 50vw"
        quality={80}
        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
          dimmed ? "opacity-60" : ""
        }`}
      />
      {product?.isNew && (
        <span className="absolute left-2 top-2 bg-[#B20947] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          New
        </span>
      )}
      {percent > 0 && (
        <span className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-[#B20947]">
          {percent}% OFF
        </span>
      )}
    </div>
  );

  const details = (
    <div className="min-w-0 px-3 pt-2.5">
      {product && (
        <p className="text-[11px] uppercase tracking-[0.15em] text-[#B5607A]">
          {product.category}
        </p>
      )}
      <h3 className="mt-0.5 line-clamp-1 text-[14px] text-[#332B2B] sm:text-[15px]">
        {name}
      </h3>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-[15px] font-medium text-[#332B2B]">
        {inr(price)}
        {oldPrice && (
          <span className="text-[12px] font-normal text-[#9b9090] line-through">
            {inr(oldPrice)}
          </span>
        )}
      </p>
      <p className={`mt-1 text-[12px] font-medium ${statusColor}`}>{status}</p>
    </div>
  );

  return (
    <li className={`${card} group relative flex min-w-0 flex-col overflow-hidden`}>
      {product ? (
        <Link href={`/product/${product.id}`} className={`block ${focusRing}`}>
          {media}
          {details}
        </Link>
      ) : (
        <div>
          {media}
          {details}
        </div>
      )}

      <div className="mt-auto px-3 pb-3 pt-2.5">
        <button
          type="button"
          onClick={onAdd}
          disabled={dimmed}
          aria-label={dimmed ? `${name} is unavailable` : `Add ${name} to shopping bag`}
          className={`flex w-full items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-[#E99A9F] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#B20947] transition-colors hover:bg-[#FFF5F7] disabled:cursor-not-allowed disabled:border-[#d9cfd2] disabled:text-[#b3a9ab] disabled:hover:bg-white sm:text-[12px] ${focusRing}`}
        >
          <ShoppingBag size={15} strokeWidth={1.7} />
          {dimmed ? (
            "Unavailable"
          ) : (
            <>
              <span className="xl:hidden">Add to Bag</span>
              <span className="hidden xl:inline">Add to Shopping Bag</span>
            </>
          )}
        </button>
      </div>

      {/* Remove from wishlist */}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${name} from wishlist`}
        className={`absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm ${focusRing}`}
      >
        <Heart size={18} strokeWidth={1.6} className="fill-[#B20947] text-[#B20947]" />
      </button>
    </li>
  );
}

/* ---------- Page ---------- */
export default function WishlistPage() {
  const [wish, setWish, ready] = useStored<WishItem[]>(KEYS.wish, []);
  const [cart, setCart] = useStored<CartItem[]>(KEYS.cart, []);
  const [picker, setPicker] = useState<Product | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastId = useRef(0);

  // One row per product id; ignores damaged entries
  const rows = useMemo(() => {
    const list = Array.isArray(wish) ? wish : [];
    const seen = new Set<string>();
    const out: { item: WishItem; product?: Product }[] = [];
    for (const item of list) {
      if (!item?.id || seen.has(item.id)) continue;
      seen.add(item.id);
      out.push({ item, product: getProductById(item.id) });
    }
    return out;
  }, [wish]);

  // Tidy storage if it held duplicates or bad entries
  useEffect(() => {
    if (!ready) return;
    const stored = Array.isArray(wish) ? wish.length : -1;
    if (rows.length !== stored) setWish(rows.map((r) => r.item));
  }, [ready, rows, wish, setWish]);

  // Auto-dismiss the toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.kind === "bag" ? 6000 : 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (t: Omit<Toast, "id">) =>
    setToast({ ...t, id: ++toastId.current });

  const removeFromWishlist = (item: WishItem) => {
    const index = rows.findIndex((r) => r.item.id === item.id);
    setWish((list) => list.filter((w) => w.id !== item.id));
    showToast({
      message: "Removed from your wishlist.",
      kind: "removed",
      undo: () => {
        setWish((list) => {
          if (list.some((w) => w.id === item.id)) return list;
          const next = [...list];
          next.splice(Math.min(Math.max(index, 0), next.length), 0, item);
          return next;
        });
        setToast(null);
      },
    });
  };

  const addToBag = (p: Product, size: string) => {
    const existing = cart.find((c) => c.id === p.id && c.size === size);
    if (existing && existing.qty >= MAX_QTY) {
      showToast({
        message: `You already have ${MAX_QTY} of this size in your bag.`,
        kind: "info",
      });
      return;
    }
    setCart((items) => {
      const i = items.findIndex((c) => c.id === p.id && c.size === size);
      if (i >= 0)
        return items.map((c, n) =>
          n === i ? { ...c, qty: Math.min(MAX_QTY, c.qty + 1) } : c
        );
      return [
        ...items,
        {
          id: p.id,
          name: p.name,
          image: p.image,
          size,
          price: p.price,
          oldPrice: p.mrp,
          qty: 1,
        },
      ];
    });
    showToast({ message: `Added to your shopping bag · Size ${size}`, kind: "bag" });
  };

  const startAdd = (p: Product) => {
    if (isSoldOut(p)) return;
    if (p.sizes.length === 0) return addToBag(p, "Free Size");
    if (p.sizes.length === 1) return addToBag(p, p.sizes[0]);
    setPicker(p); // several sizes: let the customer choose
  };

  return (
    <PageShell>
      <PageTitle
        title="My Wishlist"
        sub="Your favourite styles, saved for whenever you're ready."
      />

      {!ready && (
        <div
          aria-busy="true"
          className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          <span className="sr-only" role="status">
            Loading your wishlist
          </span>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              aria-hidden="true"
              className={`${card} aspect-[4/6] animate-pulse bg-[#FFF5F7]`}
            />
          ))}
        </div>
      )}

      {ready && rows.length === 0 && (
        <EmptyState
          icon={<Heart size={34} strokeWidth={1.3} />}
          title="Your Wishlist is Waiting to Bloom!"
          text="You haven't saved any favourite styles yet. Explore our collections and save the pieces you love to find them here later."
          href="/collections"
          action="Explore Collections"
        />
      )}

      {ready && rows.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[14px] text-[#6f6565]" aria-live="polite">
              Showing <b className="text-[#332B2B]">{rows.length}</b> saved{" "}
              {rows.length === 1 ? "item" : "items"}.
            </p>
            <Link
              href="/shop"
              className={`inline-flex items-center gap-1.5 rounded text-[13px] font-medium text-[#B20947] underline-offset-4 hover:underline ${focusRing}`}
            >
              <ArrowLeft size={15} />
              Continue Shopping
            </Link>
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {rows.map(({ item, product }) => (
              <WishlistCard
                key={item.id}
                item={item}
                product={product}
                onRemove={() => removeFromWishlist(item)}
                onAdd={() => product && startAdd(product)}
              />
            ))}
          </ul>
        </>
      )}

      {picker && (
        <SizePicker
          product={picker}
          onClose={() => setPicker(null)}
          onConfirm={(size) => {
            addToBag(picker, size);
            setPicker(null);
          }}
        />
      )}

      {/* Feedback toast: the region stays mounted so screen readers announce changes */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[90] flex justify-center px-4 sm:bottom-6"
      >
        {toast && (
          <div className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-4 rounded-2xl border-2 border-[#E8B8C5] bg-white px-4 py-3 shadow-xl">
            <p className="text-[13px] text-[#332B2B]">{toast.message}</p>
            <div className="flex shrink-0 items-center gap-3">
              {toast.kind === "bag" && (
                <>
                  <Link href={BAG_HREF} className={toastLink}>
                    View Bag
                  </Link>
                  <button
                    type="button"
                    onClick={() => setToast(null)}
                    className={`${toastLink} !text-[#6f6565]`}
                  >
                    Keep browsing
                  </button>
                </>
              )}
              {toast.kind === "removed" && toast.undo && (
                <button type="button" onClick={toast.undo} className={toastLink}>
                  Undo
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
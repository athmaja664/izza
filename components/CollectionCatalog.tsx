"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  Heart,
  ListFilter,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { KEYS, useStored, type WishItem } from "@/lib/izha-store";
import { type Product } from "@/lib/products";
import { PageShell, card, focusRing, serif } from "@/components/izha/ui";

const CATEGORIES = ["Dresses", "Kurtas", "Kurta Sets", "Tops", "Maternity Wear"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const PRICES = [
  { id: "u1000", label: "Under ₹1,000", min: 0, max: 999 },
  { id: "1000", label: "₹1,000 to ₹2,000", min: 1000, max: 2000 },
  { id: "2000", label: "₹2,000 to ₹3,000", min: 2001, max: 3000 },
  { id: "a3000", label: "Above ₹3,000", min: 3001, max: Infinity },
];
const DISCOUNTS = [10, 20, 30, 40, 50];
const SORTS = [
  { id: "popularity", label: "Popularity" },
  { id: "low", label: "Price: Low To High" },
  { id: "high", label: "Price: High To Low" },
  { id: "new", label: "New Arrivals" },
  { id: "discount", label: "Discount: High to Low" },
];

type Filters = {
  categories: string[];
  sizes: string[];
  prices: string[];
  discount: number | null;
};
const EMPTY: Filters = { categories: [], sizes: [], prices: [], discount: null };

const toggle = (arr: string[], v: string) =>
  arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const off = (p: Product) => Math.round(((p.mrp - p.price) / p.mrp) * 100);

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E8CFD2] py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded text-left text-[16px] font-medium text-[#332B2B] ${focusRing}`}
      >
        {title}
        <ChevronDown
          size={18}
          strokeWidth={1.6}
          className={`text-[#6f6565] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
  type = "checkbox",
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  type?: "checkbox" | "radio";
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-[14px] text-[#332B2B]">
      <input
        type={type}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 cursor-pointer accent-[#B20947]"
      />
      <span className={checked ? "font-medium text-[#B20947]" : ""}>{label}</span>
    </label>
  );
}

function FilterBody({
  filters,
  setFilters,
  showCategoryFilter,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  showCategoryFilter: boolean;
}) {
  return (
    <div>
      {showCategoryFilter && (
        <Section title="Category">
          {CATEGORIES.map((c) => (
            <CheckRow
              key={c}
              label={c}
              checked={filters.categories.includes(c)}
              onChange={() =>
                setFilters({ ...filters, categories: toggle(filters.categories, c) })
              }
            />
          ))}
        </Section>
      )}

      <Section title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const on = filters.sizes.includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => setFilters({ ...filters, sizes: toggle(filters.sizes, s) })}
                className={`min-w-[44px] rounded-full border px-3 py-1.5 text-[13px] ${focusRing} ${
                  on
                    ? "border-[#E99A9F] bg-[#E99A9F] text-white"
                    : "border-[#E8B8C5] bg-white text-[#332B2B] hover:bg-[#FFF5F7]"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Price">
        {PRICES.map((p) => (
          <CheckRow
            key={p.id}
            label={p.label}
            checked={filters.prices.includes(p.id)}
            onChange={() =>
              setFilters({ ...filters, prices: toggle(filters.prices, p.id) })
            }
          />
        ))}
      </Section>

      <Section title="Discount">
        {DISCOUNTS.map((d) => (
          <CheckRow
            key={d}
            type="radio"
            label={`${d}% and above`}
            checked={filters.discount === d}
            onChange={() =>
              setFilters({
                ...filters,
                discount: filters.discount === d ? null : d,
              })
            }
          />
        ))}
      </Section>
    </div>
  );
}

function SortDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = SORTS.find((s) => s.id === value) ?? SORTS[0];

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative min-w-0 flex-1 sm:w-[260px] sm:flex-none">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-11 w-full items-center justify-between gap-2 border bg-white px-3 text-[13px] text-[#332B2B] sm:px-4 sm:text-[14px] ${focusRing} ${
          open ? "border-[#B20947]" : "border-[#E8B8C5]"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <ListFilter size={16} strokeWidth={1.6} className="shrink-0 text-[#B20947]" />
          <span className="truncate">
            Sort by <b className="font-semibold text-[#B20947]">{current.label}</b>
          </span>
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.8}
          className={`shrink-0 text-[#B20947] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-30 w-full min-w-[240px] border border-[#E8B8C5] bg-white py-1 shadow-xl"
        >
          {SORTS.map((s) => {
            const on = s.id === value;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={on}
                  onClick={() => {
                    onChange(s.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-[14px] hover:bg-[#FFF5F7] ${
                    on ? "bg-[#FFF5F7] text-[#B20947]" : "text-[#332B2B]"
                  }`}
                >
                  {s.label}
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      on ? "bg-[#B20947] text-white" : "border border-[#d9cfd2]"
                    }`}
                  >
                    {on && <Check size={12} strokeWidth={3} />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function CatalogProductCard({
  p,
  liked,
  onLike,
}: {
  p: Product;
  liked: boolean;
  onLike: () => void;
}) {
  const href = `/product/${p.id}`;

  return (
    <div className={`${card} group relative flex flex-col overflow-hidden`}>
      <Link href={href} className={`block ${focusRing}`}>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F9E3E9]">
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(min-width: 1024px) 28vw, 50vw"
            quality={80}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {p.isNew && (
            <span className="absolute left-2 top-2 bg-[#B20947] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              New
            </span>
          )}
          {off(p) > 0 && (
            <span className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-[#B20947]">
              {off(p)}% OFF
            </span>
          )}
        </div>
        <div className="px-3 pt-2.5">
          <p className="text-[11px] uppercase tracking-[0.15em] text-[#B5607A]">
            {p.category}
          </p>
          <h3 className="mt-0.5 line-clamp-1 text-[14px] text-[#332B2B] sm:text-[15px]">
            {p.name}
          </h3>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-[15px] font-medium text-[#332B2B]">
            {rupees(p.price)}
            <span className="text-[12px] font-normal text-[#9b9090] line-through">
              {rupees(p.mrp)}
            </span>
          </p>
        </div>
      </Link>

      {/* Add to Cart: white background, pink outline, deep rose text. Opens the details page. */}
      <div className="mt-auto px-3 pb-3 pt-2.5">
        <Link
          href={href}
          className={`flex w-full items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-[#E99A9F] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#B20947] transition-colors hover:bg-[#FFF5F7] sm:text-[12px] ${focusRing}`}
        >
          <ShoppingBag size={15} strokeWidth={1.7} /> Add to Cart
        </Link>
      </div>

      {/* Wishlist heart */}
      <button
        type="button"
        onClick={onLike}
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={liked}
        className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm ${focusRing}`}
      >
        <Heart
          size={18}
          strokeWidth={1.6}
          className={liked ? "fill-[#B20947] text-[#B20947]" : "text-[#332B2B]"}
        />
      </button>
    </div>
  );
}

export default function CollectionCatalog({
  title,
  subtitle,
  products,
  showCategoryFilter = false,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  showCategoryFilter?: boolean;
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState("popularity");
  const [drawer, setDrawer] = useState(false);

  const [wish, setWish] = useStored<WishItem[]>(KEYS.wish, []);

  const isLiked = (id: string) =>
    wish.some((w) => (w as { id: string }).id === id);

  const toggleWish = (p: Product) => {
    setWish((list) =>
      list.some((w) => (w as { id: string }).id === p.id)
        ? list.filter((w) => (w as { id: string }).id !== p.id)
        : [
            ...list,
            {
              id: p.id,
              name: p.name,
              price: p.price,
              oldPrice: p.mrp,
              image: p.image,
              soldOutSizes: p.soldOutSizes,
            } as WishItem,
          ]
    );
  };

  const results = useMemo(() => {
    const list = products.filter((p) => {
      if (
        filters.categories.length &&
        !filters.categories.includes(p.category)
      )
        return false;
      if (
        filters.sizes.length &&
        !p.sizes.some((s) => filters.sizes.includes(s))
      )
        return false;
      if (filters.prices.length) {
        const ok = PRICES.some(
          (r) =>
            filters.prices.includes(r.id) &&
            p.price >= r.min &&
            p.price <= r.max
        );
        if (!ok) return false;
      }
      if (filters.discount !== null && off(p) < filters.discount) return false;
      return true;
    });
    const sorted = [...list];
    if (sort === "low") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "high") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "new")
      sorted.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    else if (sort === "discount") sorted.sort((a, b) => off(b) - off(a));
    else sorted.sort((a, b) => b.popularity - a.popularity);
    return sorted;
  }, [products, filters, sort]);

  const chips: { key: string; label: string; remove: () => void }[] = [
    ...filters.categories.map((c) => ({
      key: `c-${c}`,
      label: c,
      remove: () =>
        setFilters({
          ...filters,
          categories: filters.categories.filter((x) => x !== c),
        }),
    })),
    ...filters.sizes.map((s) => ({
      key: `s-${s}`,
      label: `Size ${s}`,
      remove: () =>
        setFilters({
          ...filters,
          sizes: filters.sizes.filter((x) => x !== s),
        }),
    })),
    ...filters.prices.map((id) => ({
      key: `p-${id}`,
      label: PRICES.find((p) => p.id === id)?.label ?? id,
      remove: () =>
        setFilters({
          ...filters,
          prices: filters.prices.filter((x) => x !== id),
        }),
    })),
    ...(filters.discount !== null
      ? [
          {
            key: "d",
            label: `${filters.discount}% and above`,
            remove: () => setFilters({ ...filters, discount: null }),
          },
        ]
      : []),
  ];

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [drawer]);

  return (
    <PageShell>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-[12px] uppercase tracking-[0.14em] text-[#6f6565]">
        <Link href="/" className="hover:text-[#B20947]">
          Home
        </Link>
        <span className="mx-2 text-[#B5607A]">/</span>
        <Link href="/collections" className="hover:text-[#B20947]">
          Collection
        </Link>
        {title !== "Collections" && (
          <>
            <span className="mx-2 text-[#B5607A]">/</span>
            <span className="font-medium text-[#332B2B]">{title}</span>
          </>
        )}
      </nav>

      {/* Heading */}
      <div className="text-center">
        <h1
          className={`${serif} text-[34px] font-medium leading-tight text-[#332B2B] sm:text-[44px]`}
        >
          {title}
        </h1>
        <span className="mx-auto mt-2 block h-[2px] w-14 bg-[#E8B8C5]" />
        <p className="mt-3 text-[14px] text-[#6f6565]">
          {subtitle
            ? `${subtitle} · ${products.length} pieces`
            : `${products.length} pieces, made with love`}
        </p>

        {/* Quick collection switcher */}
        <nav
          aria-label="Browse collections"
          className="mt-5 flex flex-wrap items-center justify-center gap-2"
        >
          {[
            { label: "All Collections", href: "/collections", match: "Collections" },
            { label: "Dresses", href: "/collections/dresses", match: "Dresses" },
            { label: "Kurtas", href: "/collections/kurtas", match: "Kurtas" },
            { label: "Kurta Sets", href: "/collections/kurta-sets", match: "Kurta Sets" },
            { label: "Tops", href: "/collections/tops", match: "Tops" },
            { label: "Maternity Wear", href: "/collections/maternity-wear", match: "Maternity Wear" },
          ].map((tab) => {
            const active = title === tab.match;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full border px-4 py-1.5 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "border-[#B20947] bg-[#FFF5F7] text-[#B20947]"
                    : "border-[#E8B8C5] bg-white text-[#332B2B] hover:border-[#B20947] hover:text-[#B20947]"
                } ${focusRing}`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <p className="hidden text-[14px] text-[#6f6565] lg:block">
          Showing <b className="text-[#332B2B]">{results.length}</b> items
        </p>

        {/* Mobile: Filters button */}
        <button
          type="button"
          onClick={() => setDrawer(true)}
          className={`flex h-11 flex-1 items-center justify-center gap-2 border border-[#E8B8C5] bg-white px-4 text-[13px] font-medium uppercase tracking-[0.1em] text-[#332B2B] sm:flex-none lg:hidden ${focusRing}`}
        >
          <SlidersHorizontal size={16} strokeWidth={1.7} className="text-[#B20947]" />
          Filters
          {chips.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#B20947] px-1 text-[11px] text-white">
              {chips.length}
            </span>
          )}
        </button>

        <SortDropdown value={sort} onChange={setSort} />
      </div>

      {/* Narrower sidebar and smaller gaps give the cards more width */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[250px_1fr]">
        {/* LAPTOP: filter sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
            <div className="border-b border-[#E8CFD2] pb-4">
              <h2 className={`${serif} text-[26px] font-medium text-[#332B2B]`}>
                Filters
              </h2>
            </div>
            <FilterBody
              filters={filters}
              setFilters={setFilters}
              showCategoryFilter={showCategoryFilter}
            />
          </div>
        </aside>

        {/* Products */}
        <div className="min-w-0">
          {chips.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={c.remove}
                  className={`flex items-center gap-1.5 rounded-full border border-[#E8B8C5] bg-[#FFF5F7] px-3 py-1 text-[12px] text-[#332B2B] hover:border-[#B20947] ${focusRing}`}
                >
                  {c.label}
                  <X size={12} strokeWidth={2} className="text-[#B20947]" />
                </button>
              ))}
            </div>
          )}

          <p className="mb-4 text-[13px] text-[#6f6565] lg:hidden">
            {results.length} items
          </p>

          {results.length === 0 ? (
            <div className={`${card} px-6 py-16 text-center`}>
              <h2 className={`${serif} text-[26px] font-medium text-[#332B2B]`}>
                No pieces found
              </h2>
              <p className="mt-2 text-[14px] text-[#6f6565]">
                Try removing a filter to see more of our collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3">
              {results.map((p) => (
                <CatalogProductCard
                  key={p.id}
                  p={p}
                  liked={isLiked(p.id)}
                  onLike={() => toggleWish(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE: filter side drawer (modal) */}
      <div
        className={`fixed inset-0 z-[80] lg:hidden ${
          drawer ? "visible" : "invisible"
        }`}
      >
        <div
          onClick={() => setDrawer(false)}
          className={`absolute inset-0 bg-[#382B2B]/50 transition-opacity duration-300 ${
            drawer ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={`absolute left-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-[#FFF9F4] shadow-2xl transition-transform duration-300 ease-out ${
            drawer ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#382B2B]/10 bg-[#E99A9F] px-4">
            <span className="text-sm font-medium uppercase tracking-[0.2em] text-black">
              Filters
            </span>
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setDrawer(false)}
              className="flex h-11 w-11 items-center justify-center text-black hover:text-white"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-6">
            <FilterBody
              filters={filters}
              setFilters={setFilters}
              showCategoryFilter={showCategoryFilter}
            />
          </div>

          <div className="shrink-0 border-t border-[#382B2B]/10 bg-white p-4">
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className={`w-full rounded-[10px] bg-[#E99A9F] px-3 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#382B2B] transition-colors hover:text-white ${focusRing}`}
            >
              Show {results.length} items
            </button>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}


"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Minus,
  Plus,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import {
  KEYS,
  inr,
  useStored,
  type CartItem,
  type WishItem,
} from "@/lib/izha-store";
import {
  getProductById,
  getRelatedProducts,
  type Product,
  type ProductReview,
} from "@/lib/products";
import {
  ALL_CLOTH_SIZES,
  DEFAULT_ADMIN_PRODUCTS,
  type AdminProduct,
} from "@/lib/demo-store";
import { formatMeasure, isStandardSizeSet, sortSizes, type SizeChartRow } from "@/lib/sizes";
import { CatalogProductCard } from "@/components/CollectionCatalog";
import { WhatsAppSvg } from "@/components/WhatsAppFloat";
import AlertBox from "@/components/izha/AlertBox";
import {
  EmptyBlock,
  PageShell,
  card,
  cardCream,
  focusRing,
  inputCls,
  outlineBtn,
  serif,
  solidBtn,
} from "@/components/izha/ui";

const SIZE_CHART_ROWS = [
  { size: "XS", bust: '32"', waist: '26"', hip: '35"' },
  { size: "S", bust: '34"', waist: '28"', hip: '37"' },
  { size: "M", bust: '36"', waist: '30"', hip: '39"' },
  { size: "L", bust: '38"', waist: '32"', hip: '41"' },
  { size: "XL", bust: '40"', waist: '34"', hip: '43"' },
  { size: "XXL", bust: '42"', waist: '36"', hip: '45"' },
  { size: "XXXL", bust: '44"', waist: '38"', hip: '47"' },
];

const SLASH =
  "linear-gradient(to top right, transparent calc(50% - 0.6px), #8f8588 calc(50% - 0.6px), #8f8588 calc(50% + 0.6px), transparent calc(50% + 0.6px))";

function StarRow({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          strokeWidth={1.6}
          aria-hidden="true"
          className={
            n <= Math.round(rating)
              ? "fill-[#E99A9F] text-[#E99A9F]"
              : "fill-transparent text-[#E99A9F]/50"
          }
        />
      ))}
    </div>
  );
}

export default function ProductDetailView({
  productId,
}: {
  productId: string;
}) {
  const [adminProducts] = useStored<AdminProduct[]>(
    KEYS.adminProducts,
    DEFAULT_ADMIN_PRODUCTS
  );
  const product =
    adminProducts.find((p) => p.id === productId) ?? getProductById(productId);

  if (!product) {
    return (
      <PageShell>
        <div className="py-12">
          <EmptyBlock
            text="This piece could not be found"
            href="/shop"
            action="Browse Shop All"
          />
        </div>
      </PageShell>
    );
  }

  return <ProductDetailContent product={product} />;
}

function ProductDetailContent({ product }: { product: Product | AdminProduct }) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!sizeGuideOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSizeGuideOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [sizeGuideOpen]);

  const [cart, setCart] = useStored<CartItem[]>(KEYS.cart, []);
  const [wish, setWish] = useStored<WishItem[]>(KEYS.wish, []);

  // Custom reviews saved per product in browser storage
  const [savedReviews, setSavedReviews] = useStored<ProductReview[]>(
    `izha_reviews_${product.id}`,
    []
  );

  const [reviewOpen, setReviewOpen] = useState(false);
  const [revName, setRevName] = useState("");
  const [revPlace, setRevPlace] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revText, setRevText] = useState("");
  const [revMsg, setRevMsg] = useState("");

  const allReviews = useMemo(
    () => [...savedReviews, ...product.reviews],
    [savedReviews, product.reviews]
  );

  const avgRating = useMemo(() => {
    if (allReviews.length === 0) return 0;
    const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / allReviews.length).toFixed(1));
  }, [allReviews]);

  const related = useMemo(() => getRelatedProducts(product, 4), [product]);

  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const isLiked = (id: string) =>
    wish.some((w) => (w as { id: string }).id === id);

  const liked = isLiked(product.id);

  const toggleWishItem = (target: Product) => {
    setWish((list) =>
      list.some((w) => (w as { id: string }).id === target.id)
        ? list.filter((w) => (w as { id: string }).id !== target.id)
        : [
            ...list,
            {
              id: target.id,
              name: target.name,
              image: target.image,
              price: target.price,
              oldPrice: target.mrp,
              soldOutSizes: target.soldOutSizes,
            } as WishItem,
          ]
    );
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setFeedback({ type: "error", text: "Please select a size first." });
      return;
    }

    setCart((items) => {
      const idx = items.findIndex(
        (x) => x.id === product.id && x.size === selectedSize
      );
      if (idx >= 0) {
        const next = [...items];
        next[idx] = {
          ...next[idx],
          qty: Math.min(10, next[idx].qty + qty),
        };
        return next;
      }
      return [
        ...items,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          size: selectedSize,
          price: product.price,
          oldPrice: product.mrp,
          qty,
        },
      ];
    });

    setFeedback({
      type: "success",
      text: `${product.name} (Size ${selectedSize}) has been added to your bag.`,
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revText.trim()) {
      setRevMsg("Please enter your name and review comment.");
      return;
    }

    const newReview: ProductReview = {
      id: `user-${Date.now()}`,
      name: revName.trim(),
      place: revPlace.trim() || "Kerala",
      rating: revRating,
      date: "Just now",
      text: revText.trim(),
    };

    setSavedReviews((prev) => [newReview, ...prev]);
    setRevName("");
    setRevPlace("");
    setRevRating(5);
    setRevText("");
    setRevMsg("Thank you! Your review has been added.");
    setTimeout(() => {
      setReviewOpen(false);
      setRevMsg("");
    }, 1200);
  };

  const whatsappInquiryUrl =
    "https://wa.me/919995757612?text=" +
    encodeURIComponent(
      `Hi IZHA BLOOMS, I would like to enquire about "${product.name}"${
        selectedSize ? ` (Size ${selectedSize})` : ""
      } (${inr(product.price)}).`
    );

  const colorLabel = "color" in product ? product.color : undefined;
  const stockCount = "stock" in product ? product.stock : 15;

  // Standard products (XS to XXXL only) keep the full row with unavailable sizes crossed out.
  // Products using number or custom sizes (34, 36, 38...) show only the sizes the admin set.
  const usesStandardSizes = useMemo(
    () => isStandardSizeSet(product.sizes),
    [product.sizes]
  );
  const displaySizes = useMemo(
    () =>
      usesStandardSizes
        ? ([...ALL_CLOTH_SIZES] as string[])
        : sortSizes(product.sizes),
    [usesStandardSizes, product.sizes]
  );

  // Measurements the admin typed for this product (overrides the default chart)
  const customChart = useMemo(() => {
    const rows = (product as unknown as { sizeChart?: SizeChartRow[] }).sizeChart ?? [];
    const wanted = rows.filter((r) => product.sizes.includes(r.size));
    return sortSizes(wanted.map((r) => r.size)).flatMap((s) =>
      wanted.filter((r) => r.size === s).slice(0, 1)
    );
  }, [product]);

  const inCartCount = cart
    .filter((i) => i.id === product.id)
    .reduce((n, i) => n + i.qty, 0);

  return (
    <PageShell>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-y-1 text-[12px] uppercase tracking-[0.14em] text-[#6f6565]"
      >
        <Link href="/" className="hover:text-[#B20947]">
          Home
        </Link>
        <span className="mx-2 text-[#B5607A]">/</span>
        <Link
          href={`/collections/${product.categorySlug}`}
          className="hover:text-[#B20947]"
        >
          {product.category}
        </Link>
        <span className="mx-2 text-[#B5607A]">/</span>
        <span className="line-clamp-1 font-medium text-[#332B2B]">
          {product.name}
        </span>
      </nav>

      {/* Main Product Section */}
      <section className="grid gap-8 lg:grid-cols-[1.02fr_1fr] lg:gap-12">
        {/* Left: Gallery */}
        <div>
          <div className={`${card} p-2 sm:p-3`}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#FFF5F7]">
              <Image
                src={product.gallery[activeImage] ?? product.image}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 48vw, 95vw"
                quality={85}
                className="object-cover"
              />
              {product.isNew && (
                <span className="absolute left-3 top-3 bg-[#B20947] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  New
                </span>
              )}
              {discount > 0 && (
                <span className="absolute bottom-3 left-3 rounded bg-white/95 px-2.5 py-1 text-[12px] font-semibold text-[#B20947] shadow-sm">
                  {discount}% OFF
                </span>
              )}
              <button
                type="button"
                onClick={() => toggleWishItem(product)}
                aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={liked}
                className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm transition-transform hover:scale-105 ${focusRing}`}
              >
                <Heart
                  size={20}
                  strokeWidth={1.6}
                  className={
                    liked ? "fill-[#B20947] text-[#B20947]" : "text-[#332B2B]"
                  }
                />
              </button>
            </div>
          </div>

          {product.gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2.5 sm:gap-3">
              {product.gallery.map((img, i) => {
                const active = i === activeImage;
                return (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`View photo ${i + 1} of ${product.name}`}
                    aria-pressed={active}
                    className={`relative aspect-[4/5] overflow-hidden rounded-xl border-2 bg-[#FFF5F7] transition-all ${focusRing} ${
                      active
                        ? "border-[#B20947] ring-2 ring-[#E99A9F]/50"
                        : "border-[#E8B8C5] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <Link
            href={`/collections/${product.categorySlug}`}
            className="text-[12px] font-medium uppercase tracking-[0.22em] text-[#B5607A] hover:text-[#B20947]"
          >
            {product.category}
          </Link>

          <h1
            className={`${serif} mt-2 text-[30px] font-medium leading-tight text-[#332B2B] sm:text-[40px]`}
          >
            {product.name}
          </h1>

          {/* Rating summary */}
          <a
            href="#customer-reviews"
            className="mt-2.5 inline-flex w-fit items-center gap-2 text-[13px] text-[#6f6565] hover:text-[#B20947]"
          >
            <StarRow rating={allReviews.length > 0 ? avgRating : 5} size={15} />
            <span>
              {allReviews.length > 0
                ? `${avgRating} (${allReviews.length} ${
                    allReviews.length === 1 ? "review" : "reviews"
                  })`
                : "Be the first to review"}
            </span>
          </a>

          {/* Price */}
          <div className="mt-5 flex flex-wrap items-baseline gap-3 border-b border-[#E8CFD2] pb-5">
            <span className="text-[26px] font-semibold text-[#332B2B] sm:text-[30px]">
              {inr(product.price)}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-[16px] text-[#9b9090] line-through">
                  {inr(product.mrp)}
                </span>
                <span className="rounded-full bg-[#F9E3E9] px-2.5 py-0.5 text-[12px] font-semibold text-[#B5607A]">
                  Save {inr(product.mrp - product.price)} ({discount}% OFF)
                </span>
              </>
            )}
            <p className="w-full text-[12px] text-[#6f6565]">
              Inclusive of all taxes · Free shipping on orders above ₹999
            </p>
          </div>

          {/* Description */}
          <p className="mt-5 text-[15px] leading-relaxed text-[#332B2B]/90">
            {product.description}
          </p>

          {/* Color & stock */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px]">
            {colorLabel && (
              <span className="rounded-full border border-[#E8B8C5] bg-white px-3 py-1 text-[#332B2B]">
                Shade: <strong>{colorLabel}</strong>
              </span>
            )}
            <span
              className={`rounded-full px-3 py-1 font-medium ${
                stockCount === 0
                  ? "bg-[#F9E3E9] text-[#B20947]"
                  : stockCount <= 5
                  ? "bg-[#FFF5F7] text-[#B20947]"
                  : "bg-[#f0f7f1] text-[#3f6a46]"
              }`}
            >
              {stockCount === 0
                ? "Out of Stock"
                : stockCount <= 5
                ? `Only ${stockCount} left in stock`
                : "In Stock · Ready to Ship"}
            </span>
          </div>

          {/* Size selection */}
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#332B2B]">
                  Select Size
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className={`inline-flex items-center gap-1.5 rounded-full border border-[#E8B8C5] bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#B20947] transition-colors hover:bg-[#FFF5F7] ${focusRing}`}
                >
                  <Ruler size={13} strokeWidth={1.8} />
                  Size Guide
                </button>
              </div>
              {selectedSize && (
                <span className="text-[12px] font-medium text-[#B20947]">
                  Selected: {selectedSize}
                </span>
              )}
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2 sm:max-w-md sm:grid-cols-7">
              {displaySizes.map((s) => {
                const available =
                  stockCount > 0 &&
                  product.sizes.includes(s) &&
                  !(product.soldOutSizes ?? []).includes(s);
                const active = selectedSize === s;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={!available}
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedSize(s);
                      setFeedback(null);
                    }}
                    style={available ? undefined : { backgroundImage: SLASH }}
                    className={`h-11 rounded-[10px] border text-[13px] font-medium transition-colors ${focusRing} ${
                      !available
                        ? "cursor-not-allowed border-[#e3d9d9] bg-white text-[#b3a9ab]"
                        : active
                        ? "border-[#B20947] bg-[#B20947] text-white"
                        : "border-[#E8B8C5] bg-white text-[#332B2B] hover:border-[#B20947] hover:bg-[#FFF5F7]"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex h-12 items-center rounded-[10px] border border-[#E8B8C5] bg-white">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className={`flex h-full w-10 items-center justify-center text-[#332B2B] hover:text-[#B20947] ${focusRing}`}
              >
                <Minus size={16} />
              </button>
              <span className="min-w-8 text-center text-[15px] font-medium text-[#332B2B]">
                {qty}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className={`flex h-full w-10 items-center justify-center text-[#332B2B] hover:text-[#B20947] ${focusRing}`}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`${solidBtn} h-12 flex-1 gap-2`}
            >
              <ShoppingBag size={18} strokeWidth={1.7} />
              Add to Cart
            </button>

            <button
              type="button"
              onClick={() => toggleWishItem(product)}
              aria-label={liked ? "Saved in wishlist" : "Save to wishlist"}
              aria-pressed={liked}
              className={`flex h-12 w-12 items-center justify-center rounded-[10px] border-[1.5px] border-[#E8B8C5] bg-white transition-colors hover:bg-[#FFF5F7] ${focusRing}`}
            >
              <Heart
                size={20}
                strokeWidth={1.7}
                className={
                  liked ? "fill-[#B20947] text-[#B20947]" : "text-[#332B2B]"
                }
              />
            </button>
          </div>

          {/* Feedback alert box */}
          {feedback && (
            <AlertBox
              variant={feedback.type}
              message={feedback.text}
              onClose={() => setFeedback(null)}
              className="mt-4"
              action={
                feedback.type === "success" ? (
                  <Link
                    href="/addtocart"
                    className="inline-block text-[12px] font-semibold uppercase tracking-[0.1em] text-[#B20947] underline underline-offset-4"
                  >
                    View Bag ({inCartCount})
                  </Link>
                ) : undefined
              }
            />
          )}

          {/* Product Specifications & More Details */}
          <div className={`${cardCream} mt-8 p-5`}>
            <h2
              className={`${serif} flex items-center gap-2 text-[22px] font-medium text-[#332B2B]`}
            >
              <Sparkles size={18} className="text-[#B20947]" />
              Product Details
            </h2>

            <dl className="mt-4 divide-y divide-[#E8CFD2] text-[14px]">
              <div className="grid grid-cols-[110px_1fr] gap-3 py-2.5">
                <dt className="font-medium text-[#6f6565]">Fabric</dt>
                <dd className="text-[#332B2B]">{product.fabric}</dd>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-3 py-2.5">
                <dt className="font-medium text-[#6f6565]">Craft</dt>
                <dd className="text-[#332B2B]">{product.craft}</dd>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-3 py-2.5">
                <dt className="font-medium text-[#6f6565]">Fit</dt>
                <dd className="text-[#332B2B]">{product.fit}</dd>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-3 py-2.5">
                <dt className="font-medium text-[#6f6565]">Wash Care</dt>
                <dd className="text-[#332B2B]">{product.care}</dd>
              </div>
            </dl>

            <div className="mt-4 grid grid-cols-1 gap-2.5 border-t border-[#E8CFD2] pt-4 text-[13px] text-[#6f6565] sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Truck size={16} className="shrink-0 text-[#B20947]" />
                <span>Fast delivery across Kerala & India</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="shrink-0 text-[#B20947]" />
                <span>Quality checked handcrafted piece</span>
              </div>
            </div>

            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-[#B20947] hover:underline"
            >
              <WhatsAppSvg size={16} />
              Enquire about &ldquo;{product.name}&rdquo; on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#382B2B]/55 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSizeGuideOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-modal-title"
            className={`${card} relative max-h-[90vh] w-full max-w-xl overflow-y-auto overscroll-contain p-5 shadow-2xl sm:p-7`}
          >
            <button
              type="button"
              onClick={() => setSizeGuideOpen(false)}
              aria-label="Close size guide"
              className={`absolute right-3 top-3 rounded-full p-2 text-[#332B2B] hover:bg-[#FFF5F7] hover:text-[#B20947] ${focusRing}`}
            >
              <X size={20} />
            </button>

            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#B5607A]">
              Izha Blooms Fit Guide
            </p>
            <h2
              id="size-guide-modal-title"
              className={`${serif} mt-1 text-[28px] font-medium text-[#332B2B]`}
            >
              Women&apos;s Size Chart
            </h2>
            <span className="mt-2 block h-[2px] w-12 bg-[#E8B8C5]" />

            {customChart.length > 0 ? (
              <>
                <p className="mt-3 text-[13px] text-[#6f6565]">
                  All measurements below are garment measurements in inches. If you fall between two sizes, we recommend choosing the larger size for comfortable everyday ease.
                </p>

                <div className="mt-4 overflow-x-auto rounded-xl border border-[#E8CFD2]">
                  <table className="w-full min-w-[300px] text-left text-[13px]">
                    <thead className="bg-[#FFF5F7] text-[11px] uppercase tracking-[0.14em] text-[#B20947]">
                      <tr>
                        <th className="px-3.5 py-2.5">Size</th>
                        <th className="px-3.5 py-2.5">Bust</th>
                        <th className="px-3.5 py-2.5">Waist</th>
                        <th className="px-3.5 py-2.5">Hip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8CFD2] bg-white text-[#332B2B]">
                      {customChart.map((row) => (
                        <tr key={row.size} className="hover:bg-[#FCF8F3]">
                          <td className="px-3.5 py-2.5 font-semibold">{row.size}</td>
                          <td className="px-3.5 py-2.5">{formatMeasure(row.bust) || "–"}</td>
                          <td className="px-3.5 py-2.5">{formatMeasure(row.waist) || "–"}</td>
                          <td className="px-3.5 py-2.5">{formatMeasure(row.hip) || "–"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : usesStandardSizes ? (
              <>
                <p className="mt-3 text-[13px] text-[#6f6565]">
                  All measurements below are garment body measurements in inches. If you fall between two sizes, we recommend choosing the larger size for comfortable everyday ease.
                </p>

                <div className="mt-4 overflow-x-auto rounded-xl border border-[#E8CFD2]">
                  <table className="w-full min-w-[300px] text-left text-[13px]">
                    <thead className="bg-[#FFF5F7] text-[11px] uppercase tracking-[0.14em] text-[#B20947]">
                      <tr>
                        <th className="px-3.5 py-2.5">Size</th>
                        <th className="px-3.5 py-2.5">Bust</th>
                        <th className="px-3.5 py-2.5">Waist</th>
                        <th className="px-3.5 py-2.5">Hip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8CFD2] bg-white text-[#332B2B]">
                      {SIZE_CHART_ROWS.map((row) => (
                        <tr key={row.size} className="hover:bg-[#FCF8F3]">
                          <td className="px-3.5 py-2.5 font-semibold">{row.size}</td>
                          <td className="px-3.5 py-2.5">{row.bust}</td>
                          <td className="px-3.5 py-2.5">{row.waist}</td>
                          <td className="px-3.5 py-2.5">{row.hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="mt-4 rounded-xl border border-[#E8CFD2] bg-white p-4">
                <p className="text-[13px] font-semibold text-[#332B2B]">
                  This piece is made in these sizes:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {displaySizes.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-[#E8B8C5] bg-[#FFF5F7] px-3 py-1 text-[12px] font-semibold text-[#B20947]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-[#6f6565]">
                  These sizes follow our local sizing, so they do not match the XS–XXXL letter chart. If you are unsure which size is right for you, message us on WhatsApp with your bust, waist and hip measurements and we will confirm the best fit.
                </p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/size-guide"
                onClick={() => setSizeGuideOpen(false)}
                className="text-[13px] font-medium text-[#B20947] underline underline-offset-4"
              >
                Open full Size Guide page
              </Link>
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${outlineBtn} gap-2`}
              >
                <WhatsAppSvg size={15} />
                Ask Size Help on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <section
        id="customer-reviews"
        aria-labelledby="product-reviews-heading"
        className="mt-16 border-t border-[#E8CFD2] pt-12 sm:mt-20 sm:pt-16"
      >
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#B5607A]">
              Customer Reviews
            </p>
            <h2
              id="product-reviews-heading"
              className={`${serif} mt-1 text-[30px] font-medium text-[#332B2B] sm:text-[36px]`}
            >
              Words from Women Who Wore It
            </h2>
            <div className="mt-2 flex items-center justify-center gap-2.5 sm:justify-start">
              <StarRow
                rating={allReviews.length > 0 ? avgRating : 5}
                size={18}
              />
              <span className="text-[14px] text-[#6f6565]">
                {allReviews.length > 0
                  ? `${avgRating} out of 5 · Based on ${allReviews.length} ${
                      allReviews.length === 1 ? "review" : "reviews"
                    }`
                  : "No reviews yet — share your experience!"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setReviewOpen((o) => !o)}
            className={`${outlineBtn} shrink-0`}
          >
            {reviewOpen ? "Cancel Review" : "Write a Review"}
          </button>
        </div>

        {/* Add Review Form */}
        {reviewOpen && (
          <form
            onSubmit={handleSubmitReview}
            className={`${card} mt-6 p-5 sm:p-7`}
          >
            <h3
              className={`${serif} text-[24px] font-medium text-[#332B2B]`}
            >
              Share Your Review
            </h3>
            <p className="mt-1 text-[13px] text-[#6f6565]">
              Tell others about the fabric, fit, and overall look of{" "}
              <span className="font-medium text-[#332B2B]">{product.name}</span>.
            </p>

            <div className="mt-4">
              <span className="block text-[12px] font-semibold uppercase tracking-[0.14em] text-[#332B2B]">
                Your Rating
              </span>
              <div className="mt-2 flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRevRating(star)}
                    aria-label={`Rate ${star} out of 5 stars`}
                    className={`rounded p-1 transition-transform hover:scale-110 ${focusRing}`}
                  >
                    <Star
                      size={24}
                      strokeWidth={1.6}
                      className={
                        star <= revRating
                          ? "fill-[#E99A9F] text-[#E99A9F]"
                          : "fill-transparent text-[#E99A9F]/50"
                      }
                    />
                  </button>
                ))}
                <span className="ml-2 text-[13px] font-medium text-[#6f6565]">
                  {revRating} / 5
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="rev-name"
                  className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#332B2B]"
                >
                  Your Name *
                </label>
                <input
                  id="rev-name"
                  type="text"
                  value={revName}
                  onChange={(e) => setRevName(e.target.value)}
                  placeholder="e.g. Ananya Menon"
                  className={inputCls}
                />
              </div>
              <div>
                <label
                  htmlFor="rev-place"
                  className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#332B2B]"
                >
                  City
                </label>
                <input
                  id="rev-place"
                  type="text"
                  value={revPlace}
                  onChange={(e) => setRevPlace(e.target.value)}
                  placeholder="e.g. Kochi"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="rev-text"
                className="mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[#332B2B]"
              >
                Your Review *
              </label>
              <textarea
                id="rev-text"
                rows={3}
                value={revText}
                onChange={(e) => setRevText(e.target.value)}
                placeholder="Write about the comfort, embroidery, sizing, or delivery..."
                className={inputCls}
              />
            </div>

            {revMsg && (
              <AlertBox
                variant={revMsg.startsWith("Thank you") ? "success" : "error"}
                message={revMsg}
                onClose={() => setRevMsg("")}
                className="mt-4"
              />
            )}

            <div className="mt-5 flex justify-end">
              <button type="submit" className={solidBtn}>
                Submit Review
              </button>
            </div>
          </form>
        )}

        {/* Review Cards */}
        {allReviews.length === 0 ? (
          <div className={`${cardCream} mt-6 px-6 py-10 text-center`}>
            <p className={`${serif} text-[22px] text-[#332B2B]`}>
              No customer reviews for this piece yet
            </p>
            <p className="mt-1 text-[14px] text-[#6f6565]">
              Worn this outfit? Click “Write a Review” above to share your thoughts.
            </p>
          </div>
        ) : (
          <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allReviews.map((r) => (
              <li key={r.id}>
                <figure
                  className={`${cardCream} relative flex h-full flex-col p-6`}
                >
                  <span
                    aria-hidden="true"
                    className={`${serif} pointer-events-none absolute right-5 top-1 select-none text-6xl leading-none text-[#E8B8C5]`}
                  >
                    &rdquo;
                  </span>

                  <StarRow rating={r.rating} size={16} />

                  <blockquote
                    className={`${serif} mt-4 flex-1 text-[18px] italic leading-relaxed text-[#332B2B]`}
                  >
                    {r.text}
                  </blockquote>

                  <figcaption className="mt-5 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`${serif} flex h-11 w-9 shrink-0 items-center justify-center rounded-t-full border border-[#E8B8C5] bg-[#F9E3E9] text-lg font-semibold text-[#B5607A]`}
                    >
                      {r.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p
                        className={`${serif} text-[17px] font-semibold leading-tight text-[#332B2B]`}
                      >
                        {r.name}
                      </p>
                      <p className="text-[12px] text-[#6f6565]">
                        {r.place} · {r.date}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Related Products Section */}
      <section
        aria-labelledby="related-products-heading"
        className="mt-16 border-t border-[#E8CFD2] pt-12 sm:mt-20 sm:pt-16"
      >
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#B5607A]">
            Pair & Explore
          </p>
          <h2
            id="related-products-heading"
            className={`${serif} mt-1 text-[30px] font-medium text-[#332B2B] sm:text-[38px]`}
          >
            Related Products
          </h2>
          <span className="mx-auto mt-2.5 block h-[2px] w-14 bg-[#E8B8C5]" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {related.map((rp) => (
            <CatalogProductCard
              key={rp.id}
              p={rp}
              liked={isLiked(rp.id)}
              onLike={() => toggleWishItem(rp)}
            />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
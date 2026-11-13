"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, MessageSquare, Plus, Search, Star, Trash2, Upload, X } from "lucide-react";
import { KEYS, useStored } from "@/lib/izha-store";
import { DEFAULT_ADMIN_PRODUCTS, type AdminProduct } from "@/lib/demo-store";
import AdminShell, {
  card,
  cardCream,
  inputCls,
  outlineBtn,
} from "@/components/admin/AdminShell";
import AlertBox from "@/components/izha/AlertBox";
import { serif, solidBtn } from "@/components/izha/ui";

/* ------------------------------------------------------------------ */
/* Reviews live inside each product (product.reviews[]).               */
/* The exact review type is not in the admin folder, so we read the    */
/* fields loosely. If your Review type uses different field names,     */
/* change ONLY `readReview` and `makeReview` below.                    */
/* ------------------------------------------------------------------ */

type AnyReview = Record<string, unknown>;

type ReviewView = {
  id: string;
  name: string;
  place: string;
  rating: number;
  comment: string;
  date: string;
  image: string; // photo added by the admin (data URL or path), "" if none
  featured: boolean; // true = shown in the landing page "Words from our customers"
};

/** Most reviews the admin can show on the landing page at once. */
const MAX_HOME_REVIEWS = 6;

function readReview(r: AnyReview, index: number): ReviewView {
  return {
    id: String(r.id ?? `idx-${index}`),
    name: String(r.name ?? r.author ?? r.user ?? r.customer ?? "Customer"),
    place: String(r.place ?? r.city ?? ""),
    rating: Number(r.rating ?? r.stars ?? 5),
    comment: String(r.comment ?? r.text ?? r.body ?? r.review ?? ""),
    date: String(r.date ?? r.createdAt ?? ""),
    image: String(r.image ?? ""),
    featured: r.featured === true,
  };
}

function makeReview(v: Omit<ReviewView, "id" | "featured">): AnyReview {
  return {
    id: `rev-${Date.now()}`,
    name: v.name,
    place: v.place,
    rating: v.rating,
    comment: v.comment,
    date: v.date,
    image: v.image,
    featured: false,
  };
}

function getReviews(p: AdminProduct): AnyReview[] {
  const list = (p as unknown as { reviews?: AnyReview[] }).reviews;
  return Array.isArray(list) ? list : [];
}

/** Shrinks the chosen photo so it fits in browser storage. */
function compressImage(file: File, maxSide = 480, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error("This file is not a valid image."));
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Could not process the image."));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= value ? "fill-[#E5A93C] text-[#E5A93C]" : "text-[#d9cfcf]"}
        />
      ))}
    </span>
  );
}

export default function AdminReviewsPage() {
  const [products, setProducts] = useStored<AdminProduct[]>(
    KEYS.adminProducts,
    DEFAULT_ADMIN_PRODUCTS
  );
  const [selectedId, setSelectedId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<{ type: "success" | "error" | "info"; text: string } | null>(
    null
  );

  // add-review form
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState("");

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => !q || p.name.toLowerCase().includes(q));
  }, [products, search]);

  const activeId = selectedId || filteredProducts[0]?.id || "";
  const product = products.find((p) => p.id === activeId);
  const reviews = product ? getReviews(product).map(readReview) : [];

  const featuredCount = products.reduce(
    (sum, p) => sum + getReviews(p).filter((r) => r.featured === true).length,
    0
  );

  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "–";

  const updateProductReviews = (productId: string, fn: (list: AnyReview[]) => AnyReview[]) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? ({ ...p, reviews: fn(getReviews(p)) } as unknown as AdminProduct)
          : p
      )
    );
  };

  const removeReview = (index: number) => {
    if (!product) return;
    if (!window.confirm("Remove this review permanently?")) return;
    updateProductReviews(product.id, (list) => list.filter((_, i) => i !== index));
    setNotice({ type: "info", text: "Review removed." });
  };

  const toggleFeatured = (index: number) => {
    if (!product) return;
    const current = getReviews(product)[index];
    const turningOn = current?.featured !== true;
    if (turningOn && featuredCount >= MAX_HOME_REVIEWS) {
      return setNotice({
        type: "error",
        text: `You can show up to ${MAX_HOME_REVIEWS} reviews on the landing page. Hide one first.`,
      });
    }
    updateProductReviews(product.id, (list) =>
      list.map((r, i) => (i === index ? { ...r, featured: turningOn } : r))
    );
    setNotice({
      type: "success",
      text: turningOn
        ? "Review will now show on the landing page."
        : "Review hidden from the landing page.",
    });
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return setNotice({ type: "error", text: "Please choose an image file (JPG, PNG or WebP)." });
    }
    try {
      setImage(await compressImage(file));
    } catch (err) {
      setNotice({
        type: "error",
        text: err instanceof Error ? err.message : "Could not add the image.",
      });
    }
  };

  const addReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (name.trim().length < 2) {
      return setNotice({ type: "error", text: "Enter the reviewer name." });
    }
    if (comment.trim().length < 5) {
      return setNotice({ type: "error", text: "Write a review comment (at least 5 characters)." });
    }
    const review = makeReview({
      name: name.trim(),
      place: place.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().slice(0, 10),
      image,
    });
    updateProductReviews(product.id, (list) => [review, ...list]);
    setName("");
    setPlace("");
    setComment("");
    setRating(5);
    setImage("");
    setNotice({ type: "success", text: `Review added to "${product.name}".` });
  };

  return (
    <AdminShell
      title="Product Reviews"
      subtitle="Add or remove customer reviews, and choose which ones appear on the landing page"
    >
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Product picker */}
        <aside className={`${card} h-fit p-4`}>
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F3057]"
            />
            <input
              className={`${inputCls} !pl-10`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
            />
          </div>

          <ul className="mt-3 max-h-[560px] space-y-2 overflow-y-auto pr-1">
            {filteredProducts.map((p) => {
              const count = getReviews(p).length;
              const active = p.id === activeId;
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(p.id);
                      setNotice(null);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition ${
                      active
                        ? "border-[#B20947] bg-[#FFF5F7]"
                        : "border-[#F3E3E8] bg-white hover:bg-[#FAF3E8]"
                    }`}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={44}
                      height={56}
                      className="h-14 w-11 shrink-0 rounded-lg object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-[#332B2B]">
                        {p.name}
                      </span>
                      <span className="text-[12px] text-[#6f6565]">
                        {count} review{count === 1 ? "" : "s"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
            {filteredProducts.length === 0 && (
              <li className="p-3 text-center text-[13px] text-[#6f6565]">No products found.</li>
            )}
          </ul>
        </aside>

        {/* Reviews for selected product */}
        <section className="space-y-5">
          {notice && (
            <AlertBox
              variant={notice.type}
              message={notice.text}
              onClose={() => setNotice(null)}
            />
          )}

          {!product ? (
            <div className={`${cardCream} p-8 text-center text-[14px] text-[#6f6565]`}>
              Select a product to manage its reviews.
            </div>
          ) : (
            <>
              <div className={`${card} flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5`}>
                <div>
                  <h2 className={`${serif} text-[24px] font-medium text-[#332B2B]`}>
                    {product.name}
                  </h2>
                  <p className="text-[13px] text-[#6f6565]">
                    {reviews.length} review{reviews.length === 1 ? "" : "s"} · Average {avg} / 5
                  </p>
                </div>
                <p className="rounded-full bg-[#FFF5F7] px-3 py-1 text-[12px] font-semibold text-[#B20947]">
                  On landing page: {featuredCount} / {MAX_HOME_REVIEWS}
                </p>
              </div>

              {/* Add review */}
              <form onSubmit={addReview} className={`${card} space-y-4 p-4 sm:p-5`}>
                <h3 className="flex items-center gap-2 text-[15px] font-semibold text-[#332B2B]">
                  <Plus size={16} /> Add a review
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                      Reviewer name
                    </span>
                    <input
                      className={inputCls}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anjali R."
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                      City / place (optional)
                    </span>
                    <input
                      className={inputCls}
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder="e.g. Kochi"
                    />
                  </label>
                </div>

                <div>
                  <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">Rating</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      >
                        <Star
                          size={24}
                          className={
                            n <= rating ? "fill-[#E5A93C] text-[#E5A93C]" : "text-[#d9cfcf]"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">Review</span>
                  <textarea
                    className={`${inputCls} min-h-[90px]`}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write the review text..."
                  />
                </label>

                {/* Photo */}
                <div>
                  <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                    Photo (optional)
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    {image ? (
                      <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-[#E8B8C5] bg-[#FAF3E8]">
                        <Image
                          src={image}
                          alt="Review photo preview"
                          fill
                          unoptimized
                          sizes="80px"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImage("")}
                          aria-label="Remove photo"
                          className="absolute right-1 top-1 rounded-full bg-white/90 p-0.5 text-[#B20947]"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : null}
                    <label className={`${outlineBtn} cursor-pointer gap-1.5`}>
                      <Upload size={14} /> {image ? "Change photo" : "Upload photo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>

                <button type="submit" className={`${solidBtn} w-full sm:w-auto`}>
                  Add Review
                </button>
              </form>

              {/* Review list */}
              <div className="space-y-3">
                {reviews.length === 0 && (
                  <div className={`${cardCream} flex flex-col items-center gap-2 p-8 text-center`}>
                    <MessageSquare size={22} className="text-[#8F3057]" />
                    <p className="text-[14px] text-[#6f6565]">No reviews for this product yet.</p>
                  </div>
                )}

                {reviews.map((r, i) => (
                  <article
                    key={`${r.id}-${i}`}
                    className={`${card} flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5`}
                  >
                    <div className="flex min-w-0 flex-1 gap-3">
                      {r.image && (
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#E8B8C5] bg-[#FAF3E8]">
                          <Image
                            src={r.image}
                            alt={`Photo by ${r.name}`}
                            fill
                            unoptimized={r.image.startsWith("data:")}
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[14px] font-semibold text-[#332B2B]">{r.name}</span>
                          <Stars value={r.rating} />
                          {r.date && <span className="text-[12px] text-[#6f6565]">{r.date}</span>}
                          {r.featured && (
                            <span className="rounded-full bg-[#eef7f0] px-2 py-0.5 text-[11px] font-semibold text-[#3a6b42]">
                              On landing page
                            </span>
                          )}
                        </div>
                        {r.place && <p className="text-[12px] text-[#8F3057]">{r.place}</p>}
                        <p className="mt-1.5 break-words text-[14px] leading-relaxed text-[#332B2B]">
                          {r.comment}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(i)}
                        className={`${outlineBtn} gap-1.5`}
                      >
                        {r.featured ? <EyeOff size={14} /> : <Eye size={14} />}
                        {r.featured ? "Hide from Home" : "Show on Home"}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeReview(i)}
                        aria-label={`Delete review by ${r.name}`}
                        className={`${outlineBtn} !p-2 text-[#B20947]`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Plus, RotateCcw, Trash2, Upload } from "lucide-react";
import { type Category } from "@/lib/categories";
import { KEYS, useStored } from "@/lib/izha-store";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_HERO_SLIDES,
  DEFAULT_INSTAGRAM_POSTS,
  type HeroSlide,
  type InstagramPost,
} from "@/lib/demo-store";
import AdminShell, { inputCls, outlineBtn } from "@/components/admin/AdminShell";
import AlertBox from "@/components/izha/AlertBox";
import { serif, solidBtn } from "@/components/izha/ui";

const CRIMSON = "#B20947";

/* ---------- Layout pieces (same structure as the dashboard) ---------- */

function StatCard({
  label,
  value,
  note,
  className = "",
}: {
  label: string;
  value: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={`h-full rounded-sm border border-[#E8CFD2] bg-[#FAF1E4] p-4 transition-colors hover:border-[#B20947]/40 sm:p-6 ${className}`}
    >
      <p className="m-0 text-[10px] uppercase tracking-[0.15em] text-black/50 sm:text-[11px] sm:tracking-[0.25em]">
        {label}
      </p>
      <p
        className={`${serif} lining-nums mb-0 mt-3 break-words text-[32px] font-medium leading-none sm:mt-4 sm:text-[46px]`}
        style={{ color: CRIMSON }}
      >
        {value}
      </p>
      {note && <p className="mb-0 mt-2 text-[11px] text-black/45 sm:mt-3 sm:text-[12px]">{note}</p>}
    </div>
  );
}

function Panel({
  title,
  note,
  action,
  className = "",
  children,
}: {
  title: string;
  note?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`min-w-0 rounded-sm border border-[#E8CFD2] bg-[#FAF1E4] p-4 sm:p-6 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className={`${serif} m-0 text-[22px] font-medium leading-tight sm:text-[28px]`} style={{ color: CRIMSON }}>
            {title}
          </h2>
          {note && <p className="mb-0 mt-1 text-[12px] text-black/45">{note}</p>}
        </div>
        {action && <div className="shrink-0 [&>button]:w-full [&>button]:justify-center sm:[&>button]:w-auto">{action}</div>}
      </div>
      <div className="mt-4 sm:mt-5">{children}</div>
    </section>
  );
}

export default function AdminHomepagePage() {
  const [slides, setSlides] = useStored<HeroSlide[]>(
    KEYS.heroSlides,
    DEFAULT_HERO_SLIDES
  );
  const [categories, setCategories] = useStored<Category[]>(
    KEYS.categories,
    DEFAULT_CATEGORIES
  );
  const [instagramPosts, setInstagramPosts] = useStored<InstagramPost[]>(
    KEYS.instagramPosts,
    DEFAULT_INSTAGRAM_POSTS
  );
  const [savedBanner, setSavedBanner] = useState(false);

  const updateSlide = (idx: number, patch: Partial<HeroSlide>) => {
    setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const addSlide = () => {
    setSlides((prev) => [
      ...prev,
      {
        id: `slide-${Date.now()}`,
        image: "/images/hero5.png",
        imageAlt: "New Izha Blooms banner",
        imagePosition: "right center",
        eyebrow: "New Collection",
        title: "Elegance in Every Thread",
        text: "Crafted in soft pastel hues for every occasion.",
        cta: "Explore Now",
        href: "/collections",
        textColor: "#3A1426",
        accentColor: "#8F3057",
      },
    ]);
  };

  const removeSlide = (idx: number) => {
    if (slides.length <= 1) return;
    setSlides((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateCategory = (idx: number, patch: Partial<Category>) => {
    setCategories((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      {
        id: `cat-${Date.now()}`,
        name: "New Category",
        href: "/collections/kurtas",
        image: "/images/kurtas1.jpg",
      },
    ]);
  };

  const removeCategory = (idx: number) => {
    if (categories.length <= 1) return;
    setCategories((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadToSlide = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateSlide(idx, { image: reader.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadToCategory = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateCategory(idx, { image: reader.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const updateInstagramPost = (idx: number, patch: Partial<InstagramPost>) => {
    setInstagramPosts((prev) =>
      prev.map((post, i) => (i === idx ? { ...post, ...patch } : post))
    );
  };

  const addInstagramPost = () => {
    setInstagramPosts((prev) => [
      ...prev,
      {
        id: `ig-${Date.now()}`,
        image: "/images/inst6.jpg",
        alt: "Izha Blooms showcase look",
        postUrl: "https://www.instagram.com/izhablooms/",
      },
    ]);
  };

  const removeInstagramPost = (idx: number) => {
    if (instagramPosts.length <= 1) return;
    setInstagramPosts((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadToInstagramPost = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateInstagramPost(idx, { image: reader.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerSaved = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2000);
  };

  const resetDefaults = () => {
    setSlides(DEFAULT_HERO_SLIDES);
    setCategories(DEFAULT_CATEGORIES);
    setInstagramPosts(DEFAULT_INSTAGRAM_POSTS);
    triggerSaved();
  };

  return (
    <AdminShell
      title="Home Hero, Categories & Instagram"
      actions={
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={resetDefaults} className={`${outlineBtn} gap-1.5`}>
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <button type="button" onClick={triggerSaved} className={`${solidBtn} gap-1.5`}>
            {savedBanner && <Check size={15} />}
            {savedBanner ? "Changes Live!" : "Save All Changes"}
          </button>
        </div>
      }
    >
      {/* Heading block */}
      <h2
        className={`${serif} mb-2 mt-0 break-words font-medium leading-tight`}
        style={{ color: CRIMSON, fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
      >
        Home Hero, Categories &amp; Instagram
      </h2>
      <p className="mb-6 mt-0 text-[14px] text-black/60 sm:text-[15px] md:mb-10">
        Edit homepage Hero Banners, Shop by Category &amp; Instagram Gallery pictures — changes reflect live on Home
      </p>

      {savedBanner && (
        <AlertBox
          variant="success"
          message="Homepage Hero, Categories & Instagram changes are now live on the storefront."
          onClose={() => setSavedBanner(false)}
          className="mb-5"
        />
      )}

      {/* Counts: two per row on phones */}
      <section aria-label="Homepage counts" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        <StatCard label="Hero slides" value={String(slides.length)} note="Banner slides" />
        <StatCard label="Categories" value={String(categories.length)} note="Shop by category cards" />
        <StatCard
          label="Instagram"
          value={String(instagramPosts.length)}
          note="Gallery photos"
          className="col-span-2 sm:col-span-1"
        />
      </section>

      {/* Section 1: Central Hero Carousel Banners */}
      <div className="mt-4 sm:mt-6">
        <Panel
          title="1. Central Hero Banner Slides"
          note="Update banner photo, eyebrow, headline, paragraph, CTA label and destination route."
          action={
            <button type="button" onClick={addSlide} className={`${outlineBtn} gap-1.5`}>
              <Plus size={14} /> Add Banner Slide
            </button>
          }
        >
          <div className="space-y-3 sm:space-y-4">
            {slides.map((slide, idx) => (
              <div
                key={slide.id ?? idx}
                className="grid min-w-0 gap-4 rounded-sm border border-[#E8CFD2] bg-[#FFFBF5] p-4 sm:gap-5 sm:p-5 lg:grid-cols-[260px_1fr]"
              >
                <div className="min-w-0">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-[#E8B8C5] bg-[#F5EBDD]">
                    <Image
                      src={slide.image}
                      alt={slide.imageAlt}
                      fill
                      unoptimized={slide.image.startsWith("data:")}
                      sizes="(min-width: 1024px) 260px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <label className={`${outlineBtn} flex-1 cursor-pointer justify-center gap-1.5`}>
                      <Upload size={14} /> Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => uploadToSlide(idx, e)}
                        className="sr-only"
                      />
                    </label>
                    {slides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSlide(idx)}
                        aria-label={`Remove slide ${idx + 1}`}
                        className="rounded-lg border border-[#F9E3E9] bg-[#FFF5F7] px-3 py-2 text-[#B20947] hover:bg-[#F9E3E9]"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid min-w-0 gap-3.5 sm:grid-cols-2">
                  <label className="block min-w-0">
                    <span className="mb-1 block text-[12px] font-medium text-[#332B2B]">
                      Eyebrow Tag
                    </span>
                    <input
                      className={inputCls}
                      value={slide.eyebrow}
                      onChange={(e) => updateSlide(idx, { eyebrow: e.target.value })}
                    />
                  </label>

                  <label className="block min-w-0">
                    <span className="mb-1 block text-[12px] font-medium text-[#332B2B]">
                      Banner Headline
                    </span>
                    <input
                      className={inputCls}
                      value={slide.title}
                      onChange={(e) => updateSlide(idx, { title: e.target.value })}
                    />
                  </label>

                  <label className="block min-w-0 sm:col-span-2">
                    <span className="mb-1 block text-[12px] font-medium text-[#332B2B]">
                      Description Text
                    </span>
                    <input
                      className={inputCls}
                      value={slide.text}
                      onChange={(e) => updateSlide(idx, { text: e.target.value })}
                    />
                  </label>

                  <label className="block min-w-0">
                    <span className="mb-1 block text-[12px] font-medium text-[#332B2B]">
                      Button Text
                    </span>
                    <input
                      className={inputCls}
                      value={slide.cta}
                      onChange={(e) => updateSlide(idx, { cta: e.target.value })}
                    />
                  </label>

                  <label className="block min-w-0">
                    <span className="mb-1 block text-[12px] font-medium text-[#332B2B]">
                      Button Link
                    </span>
                    <input
                      className={inputCls}
                      value={slide.href}
                      onChange={(e) => updateSlide(idx, { href: e.target.value })}
                    />
                  </label>

                  <label className="block min-w-0 sm:col-span-2">
                    <span className="mb-1 block text-[12px] font-medium text-[#332B2B]">
                      Image Path / Data URL
                    </span>
                    <input
                      className={inputCls}
                      value={slide.image}
                      onChange={(e) => updateSlide(idx, { image: e.target.value })}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Section 2: Shop by Category Cards */}
      <div className="mt-3 sm:mt-4">
        <Panel
          title="2. Shop by Category Cards"
          note="Edit category titles, destination links, and upload or update category arch images."
          action={
            <button type="button" onClick={addCategory} className={`${outlineBtn} gap-1.5`}>
              <Plus size={14} /> Add Category
            </button>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="flex min-w-0 flex-col justify-between rounded-sm border border-[#E8CFD2] bg-[#FFFBF5] p-4"
              >
                <div className="flex flex-col gap-3.5 min-[420px]:flex-row">
                  <div className="relative h-28 w-20 shrink-0 self-center overflow-hidden rounded-t-full border border-[#E8B8C5] bg-[#FAF3E8] min-[420px]:self-start">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      unoptimized={cat.image.startsWith("data:")}
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <label className="block">
                      <span className="block text-[11px] font-medium text-black/55">Name</span>
                      <input
                        className={`${inputCls} !py-1.5 text-[13px]`}
                        value={cat.name}
                        onChange={(e) => updateCategory(idx, { name: e.target.value })}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-[11px] font-medium text-black/55">Link</span>
                      <input
                        className={`${inputCls} !py-1.5 text-[12px]`}
                        value={cat.href}
                        onChange={(e) => updateCategory(idx, { href: e.target.value })}
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-3 space-y-2 border-t border-black/5 pt-3">
                  <input
                    className={`${inputCls} !py-1.5 text-[12px]`}
                    value={cat.image}
                    onChange={(e) => updateCategory(idx, { image: e.target.value })}
                    placeholder="/images/..."
                  />
                  <div className="flex gap-2">
                    <label className={`${outlineBtn} flex-1 cursor-pointer justify-center gap-1.5`}>
                      <Upload size={13} /> Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => uploadToCategory(idx, e)}
                        className="sr-only"
                      />
                    </label>
                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCategory(idx)}
                        aria-label={`Delete ${cat.name}`}
                        className="rounded-lg border border-[#F9E3E9] bg-[#FFF5F7] px-3 text-[#B20947] hover:bg-[#F9E3E9]"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Section 3: Instagram Home Section Pictures */}
      <div className="mt-3 sm:mt-4">
        <Panel
          title="3. Instagram Gallery Pictures (Home Section)"
          note="Upload photos, update image paths, alt descriptions & post links shown in “A Glimpse Into Our World”."
          action={
            <button type="button" onClick={addInstagramPost} className={`${outlineBtn} gap-1.5`}>
              <Plus size={14} /> Add Instagram Photo
            </button>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
            {instagramPosts.map((post, idx) => (
              <div
                key={post.id ?? idx}
                className="flex min-w-0 flex-col justify-between rounded-sm border border-[#E8CFD2] bg-[#FFFBF5] p-4"
              >
                <div className="flex flex-col gap-3.5 min-[420px]:flex-row">
                  <div className="relative h-24 w-24 shrink-0 self-center overflow-hidden rounded-sm border border-[#E8B8C5] bg-[#FAF3E8] min-[420px]:self-start">
                    <Image
                      src={post.image}
                      alt={post.alt}
                      fill
                      unoptimized={post.image.startsWith("data:")}
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <label className="block">
                      <span className="block text-[11px] font-medium text-black/55">
                        Alt Text / Caption
                      </span>
                      <input
                        className={`${inputCls} !py-1.5 text-[12px]`}
                        value={post.alt}
                        onChange={(e) => updateInstagramPost(idx, { alt: e.target.value })}
                      />
                    </label>
                    <label className="block">
                      <span className="block text-[11px] font-medium text-black/55">
                        Instagram Post Link
                      </span>
                      <input
                        className={`${inputCls} !py-1.5 text-[12px]`}
                        value={post.postUrl}
                        onChange={(e) => updateInstagramPost(idx, { postUrl: e.target.value })}
                        placeholder="https://www.instagram.com/..."
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-3 space-y-2 border-t border-black/5 pt-3">
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-medium text-black/55">
                      Image Path / Data URL
                    </span>
                    <input
                      className={`${inputCls} !py-1.5 text-[12px]`}
                      value={post.image}
                      onChange={(e) => updateInstagramPost(idx, { image: e.target.value })}
                      placeholder="/images/inst6.jpg"
                    />
                  </label>
                  <div className="flex gap-2">
                    <label className={`${outlineBtn} flex-1 cursor-pointer justify-center gap-1.5`}>
                      <Upload size={13} /> Upload Picture
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => uploadToInstagramPost(idx, e)}
                        className="sr-only"
                      />
                    </label>
                    {instagramPosts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstagramPost(idx)}
                        aria-label={`Remove Instagram photo ${idx + 1}`}
                        className="rounded-lg border border-[#F9E3E9] bg-[#FFF5F7] px-3 text-[#B20947] hover:bg-[#F9E3E9]"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AdminShell>
  );
}
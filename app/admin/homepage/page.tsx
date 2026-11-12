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
import AdminShell, { card, cardCream, inputCls, outlineBtn } from "@/components/admin/AdminShell";
import { serif, solidBtn } from "@/components/izha/ui";

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
      subtitle="Edit homepage Hero Banners, Shop by Category & Instagram Gallery pictures — changes reflect live on Home"
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
      {/* Section 1: Central Hero Carousel Banners */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className={`${serif} text-[28px] font-medium text-[#332B2B]`}>
              1. Central Hero Banner Slides
            </h2>
            <p className="text-[13px] text-[#6f6565]">
              Update banner photo, eyebrow, headline, paragraph, CTA label and destination route.
            </p>
          </div>
          <button type="button" onClick={addSlide} className={`${outlineBtn} gap-1.5`}>
            <Plus size={14} /> Add Banner Slide
          </button>
        </div>

        <div className="space-y-4">
          {slides.map((slide, idx) => (
            <div key={slide.id ?? idx} className={`${card} grid gap-5 p-4 sm:p-6 lg:grid-cols-[260px_1fr]`}>
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[#E8B8C5] bg-[#F5EBDD]">
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt}
                    fill
                    unoptimized={slide.image.startsWith("data:")}
                    sizes="260px"
                    className="object-cover"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <label className={`${outlineBtn} flex-1 cursor-pointer gap-1.5`}>
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

              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[12px] font-medium text-[#332B2B]">
                    Eyebrow Tag
                  </span>
                  <input
                    className={inputCls}
                    value={slide.eyebrow}
                    onChange={(e) => updateSlide(idx, { eyebrow: e.target.value })}
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[12px] font-medium text-[#332B2B]">
                    Banner Headline
                  </span>
                  <input
                    className={inputCls}
                    value={slide.title}
                    onChange={(e) => updateSlide(idx, { title: e.target.value })}
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-[12px] font-medium text-[#332B2B]">
                    Description Text
                  </span>
                  <input
                    className={inputCls}
                    value={slide.text}
                    onChange={(e) => updateSlide(idx, { text: e.target.value })}
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[12px] font-medium text-[#332B2B]">
                    Button Text
                  </span>
                  <input
                    className={inputCls}
                    value={slide.cta}
                    onChange={(e) => updateSlide(idx, { cta: e.target.value })}
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-[12px] font-medium text-[#332B2B]">
                    Button Link
                  </span>
                  <input
                    className={inputCls}
                    value={slide.href}
                    onChange={(e) => updateSlide(idx, { href: e.target.value })}
                  />
                </label>

                <label className="block sm:col-span-2">
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
      </section>

      {/* Section 2: Shop by Category Cards */}
      <section className="mt-12 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className={`${serif} text-[28px] font-medium text-[#332B2B]`}>
              2. Shop by Category Cards
            </h2>
            <p className="text-[13px] text-[#6f6565]">
              Edit category titles, destination links, and upload or update category arch images.
            </p>
          </div>
          <button type="button" onClick={addCategory} className={`${outlineBtn} gap-1.5`}>
            <Plus size={14} /> Add Category
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => (
            <div key={cat.id} className={`${cardCream} flex flex-col justify-between p-4`}>
              <div className="flex gap-3.5">
                <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-t-full border border-[#E8B8C5] bg-[#FAF3E8]">
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
                    <span className="block text-[11px] font-medium text-[#6f6565]">Name</span>
                    <input
                      className={`${inputCls} !py-1.5 text-[13px]`}
                      value={cat.name}
                      onChange={(e) => updateCategory(idx, { name: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    <span className="block text-[11px] font-medium text-[#6f6565]">Link</span>
                    <input
                      className={`${inputCls} !py-1.5 text-[12px]`}
                      value={cat.href}
                      onChange={(e) => updateCategory(idx, { href: e.target.value })}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-3 space-y-2 border-t border-[#E8CFD2] pt-3">
                <input
                  className={`${inputCls} !py-1.5 text-[12px]`}
                  value={cat.image}
                  onChange={(e) => updateCategory(idx, { image: e.target.value })}
                  placeholder="/images/..."
                />
                <div className="flex gap-2">
                  <label className={`${outlineBtn} flex-1 cursor-pointer gap-1.5`}>
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
                      className="rounded-lg border border-[#F9E3E9] bg-[#FFF5F7] px-2.5 text-[#B20947] hover:bg-[#F9E3E9]"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Instagram Home Section Pictures */}
      <section className="mt-12 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className={`${serif} text-[28px] font-medium text-[#332B2B]`}>
              3. Instagram Gallery Pictures (Home Section)
            </h2>
            <p className="text-[13px] text-[#6f6565]">
              Upload photos, update image paths, alt descriptions &amp; post links shown in &ldquo;A Glimpse Into Our World&rdquo;.
            </p>
          </div>
          <button type="button" onClick={addInstagramPost} className={`${outlineBtn} gap-1.5`}>
            <Plus size={14} /> Add Instagram Photo
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {instagramPosts.map((post, idx) => (
            <div key={post.id ?? idx} className={`${card} flex flex-col justify-between p-4`}>
              <div className="flex gap-3.5">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[#E8B8C5] bg-[#FAF3E8]">
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
                    <span className="block text-[11px] font-medium text-[#6f6565]">
                      Alt Text / Caption
                    </span>
                    <input
                      className={`${inputCls} !py-1.5 text-[12px]`}
                      value={post.alt}
                      onChange={(e) => updateInstagramPost(idx, { alt: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    <span className="block text-[11px] font-medium text-[#6f6565]">
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

              <div className="mt-3 space-y-2 border-t border-[#DFCBB3] pt-3">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-medium text-[#6f6565]">
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
                  <label className={`${outlineBtn} flex-1 cursor-pointer gap-1.5`}>
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
                      className="rounded-lg border border-[#F9E3E9] bg-[#FFF5F7] px-2.5 text-[#B20947] hover:bg-[#F9E3E9]"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}


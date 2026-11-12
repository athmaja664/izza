"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Edit3, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { KEYS, inr, useStored } from "@/lib/izha-store";
import { type CategoryName, type CategorySlug } from "@/lib/products";
import {
  ALL_CLOTH_SIZES,
  DEFAULT_ADMIN_PRODUCTS,
  type AdminProduct,
} from "@/lib/demo-store";
import AdminShell, {
  card,
  inputCls,
  outlineBtn,
} from "@/components/admin/AdminShell";
import AlertBox from "@/components/izha/AlertBox";
import {
  focusRing,
  serif,
  solidBtn,
} from "@/components/izha/ui";

const CATEGORY_OPTIONS: { name: CategoryName; slug: CategorySlug }[] = [
  { name: "Dresses", slug: "dresses" },
  { name: "Kurtas", slug: "kurtas" },
  { name: "Kurta Sets", slug: "kurta-sets" },
  { name: "Tops", slug: "tops" },
  { name: "Maternity Wear", slug: "maternity-wear" },
];

type ProductFormState = {
  id?: string;
  name: string;
  category: CategoryName;
  color: string;
  price: string;
  mrp: string;
  stock: string;
  sizes: string[];
  soldOutSizes: string[];
  image: string;
  description: string;
  fabric: string;
  craft: string;
  fit: string;
  care: string;
  isNew: boolean;
};

const EMPTY_FORM: ProductFormState = {
  name: "",
  category: "Kurtas",
  color: "Dusty Rose",
  price: "1499",
  mrp: "2199",
  stock: "15",
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  soldOutSizes: [],
  image: "/images/kurtas1.jpg",
  description: "",
  fabric: "100% Breathable Pure Cotton",
  craft: "Handcrafted embroidery & fine finishing",
  fit: "Comfort straight fit",
  care: "Gentle cold hand wash",
  isNew: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useStored<AdminProduct[]>(
    KEYS.adminProducts,
    DEFAULT_ADMIN_PRODUCTS
  );
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [customSize, setCustomSize] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState<{ type: "success" | "info"; text: string } | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (catFilter !== "All" && p.category !== catFilter) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [products, search, catFilter]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setCustomSize("");
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (p: AdminProduct) => {
    setForm({
      id: p.id,
      name: p.name,
      category: p.category,
      color: p.color,
      price: String(p.price),
      mrp: String(p.mrp),
      stock: String(p.stock),
      sizes: [...p.sizes],
      soldOutSizes: [...(p.soldOutSizes ?? [])],
      image: p.image,
      description: p.description,
      fabric: p.fabric,
      craft: p.craft,
      fit: p.fit,
      care: p.care,
      isNew: Boolean(p.isNew),
    });
    setCustomSize("");
    setFormError("");
    setModalOpen(true);
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((f) => ({ ...f, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const addSize = (sizeLabel: string) => {
    const clean = sizeLabel.trim().toUpperCase();
    if (!clean) return;
    setForm((f) =>
      f.sizes.includes(clean) ? f : { ...f, sizes: [...f.sizes, clean] }
    );
  };

  const removeSize = (sizeLabel: string) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.filter((s) => s !== sizeLabel),
      soldOutSizes: f.soldOutSizes.filter((s) => s !== sizeLabel),
    }));
  };

  const toggleSoldOutSize = (sizeLabel: string) => {
    setForm((f) => ({
      ...f,
      soldOutSizes: f.soldOutSizes.includes(sizeLabel)
        ? f.soldOutSizes.filter((s) => s !== sizeLabel)
        : [...f.soldOutSizes, sizeLabel],
    }));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price);
    const mrp = Number(form.mrp);
    const stock = Number(form.stock);

    if (form.name.trim().length < 2) return setFormError("Enter a product title.");
    if (!Number.isFinite(price) || price <= 0) return setFormError("Enter a valid selling price.");
    if (!Number.isFinite(mrp) || mrp < price) return setFormError("MRP must be equal to or greater than selling price.");
    if (!Number.isFinite(stock) || stock < 0) return setFormError("Stock cannot be negative.");
    if (form.sizes.length === 0) return setFormError("Keep or add at least one size.");

    const catSlug =
      CATEGORY_OPTIONS.find((c) => c.name === form.category)?.slug ?? "kurtas";

    if (form.id) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === form.id
            ? {
                ...p,
                name: form.name.trim(),
                category: form.category,
                categorySlug: catSlug,
                color: form.color.trim() || "Dusty Rose",
                price,
                mrp,
                stock,
                sizes: form.sizes,
                soldOutSizes: form.soldOutSizes,
                image: form.image.trim() || "/images/kurtas1.jpg",
                gallery: [form.image.trim() || "/images/kurtas1.jpg", ...p.gallery.slice(1)],
                description: form.description.trim() || p.description,
                fabric: form.fabric.trim() || p.fabric,
                craft: form.craft.trim() || p.craft,
                fit: form.fit.trim() || p.fit,
                care: form.care.trim() || p.care,
                isNew: form.isNew,
              }
            : p
        )
      );
    } else {
      const newProd: AdminProduct = {
        id: `p${Date.now()}`,
        name: form.name.trim(),
        category: form.category,
        categorySlug: catSlug,
        color: form.color.trim() || "Dusty Rose",
        price,
        mrp,
        stock,
        soldCount: 0,
        sizes: form.sizes,
        soldOutSizes: form.soldOutSizes,
        image: form.image.trim() || "/images/kurtas1.jpg",
        gallery: [form.image.trim() || "/images/kurtas1.jpg"],
        isNew: form.isNew,
        popularity: 85,
        description:
          form.description.trim() ||
          "Thoughtfully crafted by Izha Blooms for everyday elegance and effortless comfort.",
        fabric: form.fabric.trim() || "100% Pure Cotton",
        craft: form.craft.trim() || "Hand-finished detailing",
        fit: form.fit.trim() || "Comfort fit",
        care: form.care.trim() || "Gentle cold wash",
        reviews: [],
      };
      setProducts((prev) => [newProd, ...prev]);
    }
    setNotice({
      type: "success",
      text: form.id
        ? `"${form.name.trim()}" updated successfully.`
        : `"${form.name.trim()}" added to the catalog.`,
    });
    setModalOpen(false);
  };

  const updateStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (target) {
      setNotice({ type: "info", text: `"${target.name}" removed from catalog.` });
    }
  };

  return (
    <AdminShell
      title="Products & Inventory"
      subtitle="Add, edit, delete products, manage stock, colours, and manually add/remove XS–XXXL sizes"
      actions={
        <button type="button" onClick={openCreate} className={`${solidBtn} gap-1.5`}>
          <Plus size={16} /> Add Product
        </button>
      }
    >
      {/* Product action alert box */}
      {notice && (
        <AlertBox
          variant={notice.type}
          message={notice.text}
          onClose={() => setNotice(null)}
          className="mb-4"
        />
      )}

      {/* Filters bar */}
      <div className={`${card} flex flex-col gap-3 p-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between`}>
        <div className="relative w-full lg:min-w-[220px] lg:flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F3057]"
          />
          <input
            className={`${inputCls} !pl-10`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, category or shade..."
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["All", ...CATEGORY_OPTIONS.map((c) => c.name)].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCatFilter(cat)}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors sm:px-3.5 sm:text-[12px] ${
                catFilter === cat
                  ? "border-[#B20947] bg-[#F8EAE4] text-[#B20947]"
                  : "border-[#E8B8C5] bg-[#FAF3E8] text-[#332B2B] hover:border-[#B20947]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product list */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const discount = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
          return (
            <div key={p.id} className={`${card} flex min-w-0 flex-col justify-between p-4`}>
              <div className="flex gap-3.5">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-[#E8B8C5] bg-[#FFF5F7]">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="80px"
                    unoptimized={p.image.startsWith("data:")}
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B5607A]">
                    {p.category} · {p.color}
                  </p>
                  <h2 className="mt-0.5 line-clamp-2 text-[15px] font-semibold text-[#332B2B]">
                    {p.name}
                  </h2>
                  <p className="mt-1 flex flex-wrap items-baseline gap-1.5 text-[14px] font-semibold text-[#332B2B]">
                    {inr(p.price)}
                    <span className="text-[12px] font-normal text-[#9b9090] line-through">
                      {inr(p.mrp)}
                    </span>
                    {discount > 0 && (
                      <span className="rounded bg-[#F9E3E9] px-1.5 py-0.5 text-[10px] text-[#B20947]">
                        {discount}% OFF
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Sizes */}
              <div className="mt-3 border-t border-[#E8CFD2] pt-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#6f6565]">
                  Active Sizes ({p.sizes.length})
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {p.sizes.map((s) => (
                    <span
                      key={s}
                      className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${
                        (p.soldOutSizes ?? []).includes(s)
                          ? "border-[#e3d9d9] text-[#9b9090] line-through"
                          : "border-[#E8B8C5] bg-[#EFE2CE] text-[#332B2B]"
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stock + Actions */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#E8CFD2] pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#6f6565]">Stock:</span>
                  <button
                    type="button"
                    onClick={() => updateStock(p.id, -1)}
                    className="h-7 w-7 rounded-full border border-[#E8B8C5] bg-[#FAF3E8] text-[13px] font-semibold hover:bg-[#EFE2CE]"
                  >
                    -
                  </button>
                  <span
                    className={`min-w-6 text-center text-[13px] font-semibold ${
                      p.stock === 0
                        ? "text-[#B20947]"
                        : p.stock <= 5
                        ? "text-[#b5607a]"
                        : "text-[#3a6b42]"
                    }`}
                  >
                    {p.stock}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateStock(p.id, 1)}
                    className="h-7 w-7 rounded-full border border-[#E8B8C5] bg-[#FAF3E8] text-[13px] font-semibold hover:bg-[#EFE2CE]"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    aria-label={`Edit ${p.name}`}
                    className={`inline-flex items-center gap-1 rounded-lg border border-[#E8B8C5] bg-[#FAF3E8] px-2.5 py-1.5 text-[12px] font-medium text-[#332B2B] hover:border-[#B20947] hover:text-[#B20947] ${focusRing}`}
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProduct(p.id)}
                    aria-label={`Delete ${p.name}`}
                    className={`inline-flex items-center gap-1 rounded-lg border border-[#F9E3E9] bg-[#FFF5F7] px-2.5 py-1.5 text-[12px] font-medium text-[#B20947] hover:bg-[#F9E3E9] ${focusRing}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#382B2B]/55 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <form
            onSubmit={handleSaveProduct}
            className={`${card} relative my-4 w-full max-w-2xl p-5 shadow-2xl sm:p-7`}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label="Close product modal"
              className="absolute right-4 top-4 rounded-full p-2 text-[#332B2B] hover:bg-[#FFF5F7] hover:text-[#B20947]"
            >
              <X size={20} />
            </button>

            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B5607A]">
              {form.id ? "Update Product" : "Create New Clothing Product"}
            </p>
            <h2 className={`${serif} mt-1 text-[28px] font-medium text-[#332B2B]`}>
              {form.id ? form.name : "Add Clothing Piece"}
            </h2>

            {formError && (
              <AlertBox
                variant="error"
                message={formError}
                onClose={() => setFormError("")}
                className="mt-3"
              />
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                  Product Name *
                </span>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Dusty Rose Embroidered Kurta"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                  Collection Category
                </span>
                <select
                  className={inputCls}
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as CategoryName })
                  }
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.slug} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                  Colour / Shade
                </span>
                <input
                  className={inputCls}
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  placeholder="Dusty Rose / Ivory"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                  Selling Price (₹) *
                </span>
                <input
                  type="number"
                  className={inputCls}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                  Original Price / MRP (₹) *
                </span>
                <input
                  type="number"
                  className={inputCls}
                  value={form.mrp}
                  onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                  Stock Quantity *
                </span>
                <input
                  type="number"
                  className={inputCls}
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </label>

              <div className="block">
                <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                  Product Image (Path or Upload)
                </span>
                <div className="flex flex-wrap gap-2">
                  <input
                    className={`${inputCls} min-w-0 flex-1`}
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="/images/kurtas1.jpg"
                  />
                  <label className={`${outlineBtn} shrink-0 cursor-pointer gap-1.5`}>
                    <Upload size={14} /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFile}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              {/* Manual Size Management: XS S M L XL XXL XXXL */}
              <div className="rounded-xl border border-[#DFCBB3] bg-[#EFE2CE] p-4 sm:col-span-2">
                <p className="text-[13px] font-semibold text-[#332B2B]">
                  Available Sizes (Remove unwanted or manually add sizes)
                </p>
                <p className="mt-0.5 text-[12px] text-[#6f6565]">
                  Click × to delete a size (for example remove XS), click a quick button below to add it back, or click a size badge to mark Sold Out.
                </p>

                {/* Active selected sizes */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.sizes.map((s) => {
                    const soldOut = form.soldOutSizes.includes(s);
                    return (
                      <span
                        key={s}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold ${
                          soldOut
                            ? "border-[#d9cfd2] bg-[#FAF3E8] text-[#9b9090] line-through"
                            : "border-[#B20947] bg-[#F8EAE4] text-[#B20947]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSoldOutSize(s)}
                          title="Toggle sold-out status for this size"
                        >
                          {s}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSize(s)}
                          aria-label={`Remove size ${s}`}
                          className="rounded-full p-0.5 hover:bg-[#B20947] hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>

                {/* Preset quick-add buttons */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#6f6565]">
                    Add Standard:
                  </span>
                  {ALL_CLOTH_SIZES.filter((s) => !form.sizes.includes(s)).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSize(s)}
                      className="rounded-full border border-[#E8B8C5] bg-[#FAF3E8] px-2.5 py-1 text-[11px] font-semibold text-[#332B2B] hover:border-[#B20947] hover:text-[#B20947]"
                    >
                      + {s}
                    </button>
                  ))}
                  {ALL_CLOTH_SIZES.every((s) => form.sizes.includes(s)) && (
                    <span className="text-[11px] text-[#6f6565]">
                      All standard sizes XS–XXXL added
                    </span>
                  )}
                </div>

                {/* Manual custom size input */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    className={`${inputCls} w-full sm:max-w-[180px] !py-2 text-[13px]`}
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    placeholder="Custom size (e.g. XS, 4XL)"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addSize(customSize);
                      setCustomSize("");
                    }}
                    className={outlineBtn}
                  >
                    + Add Size
                  </button>
                </div>
              </div>

              <label className="block sm:col-span-2">
                <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                  Product Description
                </span>
                <textarea
                  rows={2}
                  className={inputCls}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the embroidery, silhouette, and occasion..."
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">Fabric</span>
                <input
                  className={inputCls}
                  value={form.fabric}
                  onChange={(e) => setForm({ ...form, fabric: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">Fit</span>
                <input
                  className={inputCls}
                  value={form.fit}
                  onChange={(e) => setForm({ ...form, fit: e.target.value })}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className={outlineBtn}
              >
                Cancel
              </button>
              <button type="submit" className={solidBtn}>
                {form.id ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}


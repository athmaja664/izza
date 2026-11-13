// "use client";

// import { useMemo, useState } from "react";
// import {
//   ArrowDown,
//   ArrowUp,
//   Eye,
//   EyeOff,
//   Pencil,
//   Plus,
//   Star,
//   Trash2,
//   X,
// } from "lucide-react";
// import { KEYS, useStored } from "@/lib/izha-store";
// import { DEFAULT_ADMIN_PRODUCTS, type AdminProduct } from "@/lib/demo-store";
// import { useHomeReviews, type HomeReview } from "@/lib/home-reviews";
// import AdminShell, {
//   card,
//   cardCream,
//   inputCls,
//   outlineBtn,
// } from "@/components/admin/AdminShell";
// import AlertBox from "@/components/izha/AlertBox";
// import { serif, solidBtn } from "@/components/izha/ui";

// type AnyReview = Record<string, unknown>;

// function StarRow({ value }: { value: number }) {
//   return (
//     <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5`}>
//       {[1, 2, 3, 4, 5].map((n) => (
//         <Star
//           key={n}
//           size={14}
//           className={n <= value ? "fill-[#E5A93C] text-[#E5A93C]" : "text-[#d9cfcf]"}
//         />
//       ))}
//     </span>
//   );
// }

// export default function AdminLandingReviewsPage() {
//   const [homeReviews, setHomeReviews] = useHomeReviews();
//   const [products] = useStored<AdminProduct[]>(KEYS.adminProducts, DEFAULT_ADMIN_PRODUCTS);

//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [name, setName] = useState("");
//   const [place, setPlace] = useState("");
//   const [product, setProduct] = useState("");
//   const [rating, setRating] = useState(5);
//   const [text, setText] = useState("");
//   const [notice, setNotice] = useState<{ type: "success" | "error" | "info"; text: string } | null>(
//     null
//   );

//   const visibleCount = homeReviews.filter((r) => r.visible).length;

//   /* ---------- reviews customers wrote on product pages ---------- */
//   const customerReviews = useMemo(() => {
//     const out: {
//       key: string;
//       name: string;
//       rating: number;
//       text: string;
//       product: string;
//     }[] = [];
//     for (const p of products) {
//       const list = (p as unknown as { reviews?: AnyReview[] }).reviews;
//       if (!Array.isArray(list)) continue;
//       list.forEach((r, i) => {
//         out.push({
//           key: `${p.id}:${String(r.id ?? `idx-${i}`)}`,
//           name: String(r.name ?? r.author ?? r.user ?? r.customer ?? "Customer"),
//           rating: Number(r.rating ?? r.stars ?? 5),
//           text: String(r.comment ?? r.text ?? r.body ?? r.review ?? ""),
//           product: p.name,
//         });
//       });
//     }
//     return out;
//   }, [products]);

//   const addedSources = new Set(homeReviews.map((r) => r.sourceId).filter(Boolean));

//   /* ---------- form ---------- */
//   const resetForm = () => {
//     setEditingId(null);
//     setName("");
//     setPlace("");
//     setProduct("");
//     setRating(5);
//     setText("");
//   };

//   const startEdit = (r: HomeReview) => {
//     setEditingId(r.id);
//     setName(r.name);
//     setPlace(r.place);
//     setProduct(r.product);
//     setRating(r.rating);
//     setText(r.text);
//     setNotice(null);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (name.trim().length < 2) return setNotice({ type: "error", text: "Enter the customer name." });
//     if (text.trim().length < 5)
//       return setNotice({ type: "error", text: "Write the review text (at least 5 characters)." });

//     if (editingId) {
//       setHomeReviews((prev) =>
//         prev.map((r) =>
//           r.id === editingId
//             ? {
//                 ...r,
//                 name: name.trim(),
//                 place: place.trim(),
//                 product: product.trim(),
//                 rating,
//                 text: text.trim(),
//               }
//             : r
//         )
//       );
//       setNotice({ type: "success", text: "Review updated." });
//     } else {
//       const created: HomeReview = {
//         id: `hr-${Date.now()}`,
//         name: name.trim(),
//         place: place.trim(),
//         product: product.trim(),
//         rating,
//         text: text.trim(),
//         visible: true,
//         createdAt: new Date().toISOString().slice(0, 10),
//       };
//       setHomeReviews((prev) => [created, ...prev]);
//       setNotice({ type: "success", text: "Review added and now showing on the landing page." });
//     }
//     resetForm();
//   };

//   /* ---------- list actions ---------- */
//   const toggleVisible = (id: string) =>
//     setHomeReviews((prev) => prev.map((r) => (r.id === id ? { ...r, visible: !r.visible } : r)));

//   const remove = (id: string) => {
//     if (!window.confirm("Remove this review from the landing page list?")) return;
//     setHomeReviews((prev) => prev.filter((r) => r.id !== id));
//     if (editingId === id) resetForm();
//     setNotice({ type: "info", text: "Review removed." });
//   };

//   const move = (index: number, dir: -1 | 1) =>
//     setHomeReviews((prev) => {
//       const j = index + dir;
//       if (j < 0 || j >= prev.length) return prev;
//       const next = [...prev];
//       [next[index], next[j]] = [next[j], next[index]];
//       return next;
//     });

//   const addFromCustomer = (c: (typeof customerReviews)[number]) => {
//     const created: HomeReview = {
//       id: `hr-${Date.now()}`,
//       name: c.name,
//       place: "",
//       product: c.product,
//       rating: c.rating,
//       text: c.text,
//       visible: true,
//       sourceId: c.key,
//       createdAt: new Date().toISOString().slice(0, 10),
//     };
//     setHomeReviews((prev) => [created, ...prev]);
//     setNotice({
//       type: "success",
//       text: `${c.name}'s review added to the landing page. You can edit it in the list below.`,
//     });
//   };

//   return (
//     <AdminShell
//       title="Landing Page Reviews"
//       subtitle="Choose which reviews appear in “Words from our customers” on the home page, or write your own"
//     >
//       {notice && (
//         <AlertBox
//           variant={notice.type}
//           message={notice.text}
//           onClose={() => setNotice(null)}
//           className="mb-5"
//         />
//       )}

//       <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
//         {/* Create / edit */}
//         <form onSubmit={handleSubmit} className={`${card} h-fit space-y-4 p-5 sm:p-6`}>
//           <div className="flex items-center justify-between gap-2">
//             <h2 className={`${serif} text-[24px] font-medium text-[#332B2B]`}>
//               {editingId ? "Edit review" : "Write a new review"}
//             </h2>
//             {editingId && (
//               <button type="button" onClick={resetForm} className={`${outlineBtn} gap-1.5`}>
//                 <X size={13} /> Cancel
//               </button>
//             )}
//           </div>

//           <div className="grid gap-3 sm:grid-cols-2">
//             <label className="block">
//               <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">Customer name</span>
//               <input
//                 className={inputCls}
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="e.g. Anjali R."
//               />
//             </label>
//             <label className="block">
//               <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">City / place</span>
//               <input
//                 className={inputCls}
//                 value={place}
//                 onChange={(e) => setPlace(e.target.value)}
//                 placeholder="e.g. Kochi"
//               />
//             </label>
//           </div>

//           <label className="block">
//             <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
//               Product bought (optional)
//             </span>
//             <input
//               className={inputCls}
//               value={product}
//               onChange={(e) => setProduct(e.target.value)}
//               placeholder="e.g. Embroidered kurta"
//             />
//           </label>

//           <div>
//             <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">Rating</span>
//             <div className="flex items-center gap-1">
//               {[1, 2, 3, 4, 5].map((n) => (
//                 <button
//                   key={n}
//                   type="button"
//                   onClick={() => setRating(n)}
//                   aria-label={`${n} star${n > 1 ? "s" : ""}`}
//                 >
//                   <Star
//                     size={26}
//                     className={n <= rating ? "fill-[#E5A93C] text-[#E5A93C]" : "text-[#d9cfcf]"}
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           <label className="block">
//             <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">Review text</span>
//             <textarea
//               className={`${inputCls} min-h-[110px]`}
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               placeholder="What did the customer say about the fit, fabric or delivery?"
//             />
//           </label>

//           <button type="submit" className={`${solidBtn} w-full gap-1.5`}>
//             {!editingId && <Plus size={15} />}
//             {editingId ? "Save changes" : "Add to landing page"}
//           </button>
//         </form>

//         {/* Current landing page list */}
//         <section className="space-y-3">
//           <div className="flex flex-wrap items-end justify-between gap-2">
//             <div>
//               <h2 className={`${serif} text-[24px] font-medium text-[#332B2B]`}>
//                 On the landing page ({visibleCount} showing)
//               </h2>
//               <p className="text-[12px] text-[#6f6565]">
//                 3 or 6 visible reviews look best. Use the arrows to change the order.
//               </p>
//             </div>
//           </div>

//           {homeReviews.length === 0 && (
//             <div className={`${cardCream} p-8 text-center text-[14px] text-[#6f6565]`}>
//               No reviews yet. The “Words from our customers” section stays hidden until you add one.
//             </div>
//           )}

//           {homeReviews.map((r, i) => (
//             <article
//               key={r.id}
//               className={`${r.visible ? card : cardCream} flex items-start gap-3 p-4 sm:p-5`}
//             >
//               <div className="flex flex-col gap-1">
//                 <button
//                   type="button"
//                   onClick={() => move(i, -1)}
//                   disabled={i === 0}
//                   aria-label="Move up"
//                   className="rounded-md border border-[#E8B8C5] bg-[#FAF3E8] p-1 text-[#332B2B] disabled:opacity-30"
//                 >
//                   <ArrowUp size={13} />
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => move(i, 1)}
//                   disabled={i === homeReviews.length - 1}
//                   aria-label="Move down"
//                   className="rounded-md border border-[#E8B8C5] bg-[#FAF3E8] p-1 text-[#332B2B] disabled:opacity-30"
//                 >
//                   <ArrowDown size={13} />
//                 </button>
//               </div>

//               <div className="min-w-0 flex-1">
//                 <div className="flex flex-wrap items-center gap-2">
//                   <span className="text-[14px] font-semibold text-[#332B2B]">{r.name}</span>
//                   <StarRow value={r.rating} />
//                   <span
//                     className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
//                       r.visible ? "bg-[#eef7f0] text-[#3a6b42]" : "bg-[#f3efef] text-[#6f6565]"
//                     }`}
//                   >
//                     {r.visible ? "Showing" : "Hidden"}
//                   </span>
//                 </div>
//                 {(r.place || r.product) && (
//                   <p className="text-[12px] text-[#8F3057]">
//                     {[r.place, r.product].filter(Boolean).join(" · ")}
//                   </p>
//                 )}
//                 <p className="mt-1.5 break-words text-[14px] leading-relaxed text-[#332B2B]">
//                   {r.text}
//                 </p>

//                 <div className="mt-3 flex flex-wrap gap-2">
//                   <button
//                     type="button"
//                     onClick={() => toggleVisible(r.id)}
//                     className={`${outlineBtn} gap-1.5`}
//                   >
//                     {r.visible ? <EyeOff size={13} /> : <Eye size={13} />}
//                     {r.visible ? "Hide" : "Show"}
//                   </button>
//                   <button type="button" onClick={() => startEdit(r)} className={`${outlineBtn} gap-1.5`}>
//                     <Pencil size={13} /> Edit
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => remove(r.id)}
//                     aria-label={`Remove review by ${r.name}`}
//                     className={`${outlineBtn} !px-3 text-[#B20947]`}
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </section>
//       </div>

//       {/* Pick from real customer reviews */}
//       <section className="mt-10 space-y-3">
//         <div>
//           <h2 className={`${serif} text-[24px] font-medium text-[#332B2B]`}>
//             Pick from customer reviews ({customerReviews.length})
//           </h2>
//           <p className="text-[12px] text-[#6f6565]">
//             Reviews customers wrote on product pages. Click “Add to landing page” to copy one into the
//             list above.
//           </p>
//         </div>

//         {customerReviews.length === 0 && (
//           <div className={`${cardCream} p-6 text-center text-[14px] text-[#6f6565]`}>
//             No customer reviews on products yet.
//           </div>
//         )}

//         <div className="grid gap-3 md:grid-cols-2">
//           {customerReviews.map((c) => {
//             const added = addedSources.has(c.key);
//             return (
//               <article key={c.key} className={`${card} flex flex-col justify-between gap-3 p-4`}>
//                 <div>
//                   <div className="flex flex-wrap items-center gap-2">
//                     <span className="text-[14px] font-semibold text-[#332B2B]">{c.name}</span>
//                     <StarRow value={c.rating} />
//                   </div>
//                   <p className="text-[12px] text-[#8F3057]">{c.product}</p>
//                   <p className="mt-1.5 text-[14px] leading-relaxed text-[#332B2B]">{c.text}</p>
//                 </div>
//                 <button
//                   type="button"
//                   disabled={added}
//                   onClick={() => addFromCustomer(c)}
//                   className={`${outlineBtn} w-full gap-1.5 sm:w-auto sm:self-start`}
//                 >
//                   {added ? "Already added" : (<><Plus size={13} /> Add to landing page</>)}
//                 </button>
//               </article>
//             );
//           })}
//         </div>
//       </section>
//     </AdminShell>
//   );
// }
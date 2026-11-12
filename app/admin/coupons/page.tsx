"use client";

import { useState } from "react";
import { Copy, Sparkles, Tag, Trash2 } from "lucide-react";
import { KEYS, inr, useStored } from "@/lib/izha-store";
import {
  DEFAULT_COUPONS,
  generateCouponCode,
  type Coupon,
} from "@/lib/demo-store";
import AdminShell, { card, cardCream, inputCls, outlineBtn } from "@/components/admin/AdminShell";
import AlertBox from "@/components/izha/AlertBox";
import { serif, solidBtn } from "@/components/izha/ui";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useStored<Coupon[]>(KEYS.coupons, DEFAULT_COUPONS);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "flat">("percent");
  const [value, setValue] = useState("15");
  const [minOrder, setMinOrder] = useState("999");
  const [expiry, setExpiry] = useState("2026-12-31");
  const [firstOrderOnly, setFirstOrderOnly] = useState(false);
  const [msg, setMsg] = useState("");

  const handleAutoGenerate = () => {
    setCode(generateCouponCode("IZHA"));
    setMsg("");
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    const numVal = Number(value);
    const numMin = Number(minOrder);

    if (clean.length < 3) return setMsg("Type a coupon code or click Auto-Generate.");
    if (coupons.some((c) => c.code === clean))
      return setMsg(`Coupon "${clean}" already exists.`);
    if (!Number.isFinite(numVal) || numVal <= 0)
      return setMsg("Enter a valid discount value.");

    const next: Coupon = {
      id: `cpn-${Date.now()}`,
      code: clean,
      type,
      value: numVal,
      minOrder: Number.isFinite(numMin) ? numMin : 0,
      firstOrderOnly,
      active: true,
      expiry,
      usedCount: 0,
    };
    setCoupons((prev) => [next, ...prev]);
    setCode("");
    setMsg(`Coupon ${clean} created — customers can apply it on /checkout now!`);
  };

  const toggleActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const removeCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <AdminShell
      title="Coupon Generator"
      subtitle="Type a custom coupon code or auto-generate codes — active coupons work live on Checkout"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Create Coupon Card */}
        <form onSubmit={handleCreate} className={`${card} h-fit p-5 sm:p-6`}>
          <h2 className={`${serif} text-[24px] font-medium text-[#332B2B]`}>
            Create New Coupon
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <span className="mb-1.5 block text-[13px] font-medium text-[#332B2B]">
                Coupon Code (Manual or Auto-Generate)
              </span>
              <div className="flex gap-2">
                <input
                  className={`${inputCls} min-w-0 flex-1 uppercase`}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVE20"
                />
                <button
                  type="button"
                  onClick={handleAutoGenerate}
                  className={`${outlineBtn} shrink-0 gap-1.5`}
                >
                  <Sparkles size={14} /> Auto
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                  Discount Type
                </span>
                <select
                  className={inputCls}
                  value={type}
                  onChange={(e) => setType(e.target.value as "percent" | "flat")}
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                  Discount Value
                </span>
                <input
                  type="number"
                  className={inputCls}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                  Min Order (₹)
                </span>
                <input
                  type="number"
                  className={inputCls}
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                  Expiry Date
                </span>
                <input
                  type="date"
                  className={inputCls}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />
              </label>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#332B2B]">
              <input
                type="checkbox"
                checked={firstOrderOnly}
                onChange={(e) => setFirstOrderOnly(e.target.checked)}
                className="h-4 w-4 accent-[#B20947]"
              />
              First-order customers only
            </label>

            {msg && (
              <AlertBox
                variant={msg.includes("created") ? "success" : "error"}
                message={msg}
                onClose={() => setMsg("")}
              />
            )}

            <button type="submit" className={`${solidBtn} w-full`}>
              Save Coupon Code
            </button>
          </div>
        </form>

        {/* Active Coupons List */}
        <section className="space-y-3">
          {coupons.map((cpn) => (
            <div
              key={cpn.id}
              className={`${cpn.active ? card : cardCream} flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-5`}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#B20947] bg-[#FFF5F7] px-3 py-1 text-[14px] font-bold tracking-wider text-[#B20947]">
                    <Tag size={14} /> {cpn.code}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      cpn.active
                        ? "bg-[#eef7f0] text-[#3a6b42]"
                        : "bg-[#f3efef] text-[#6f6565]"
                    }`}
                  >
                    {cpn.active ? "Active" : "Paused"}
                  </span>
                  {cpn.firstOrderOnly && (
                    <span className="rounded-full bg-[#F9E3E9] px-2 py-0.5 text-[10px] font-semibold text-[#8F3057]">
                      1st Order Only
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[14px] font-medium text-[#332B2B]">
                  {cpn.type === "percent" ? `${cpn.value}% OFF` : `${inr(cpn.value)} OFF`} · Min
                  order {inr(cpn.minOrder)}
                </p>
                <p className="mt-0.5 text-[12px] text-[#6f6565]">
                  Expires {cpn.expiry} · Redeemed {cpn.usedCount} times
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(cpn.code)}
                  aria-label={`Copy ${cpn.code}`}
                  className="rounded-lg border border-[#E8B8C5] bg-[#FAF3E8] p-2 text-[#332B2B] hover:text-[#B20947]"
                >
                  <Copy size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => toggleActive(cpn.id)}
                  className={outlineBtn}
                >
                  {cpn.active ? "Pause" : "Activate"}
                </button>
                <button
                  type="button"
                  onClick={() => removeCoupon(cpn.id)}
                  aria-label={`Delete ${cpn.code}`}
                  className="rounded-lg border border-[#F9E3E9] bg-[#FFF5F7] p-2 text-[#B20947] hover:bg-[#F9E3E9]"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </AdminShell>
  );
}


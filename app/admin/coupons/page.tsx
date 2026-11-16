"use client";

import { useMemo, useState } from "react";
import { Copy, Sparkles, Tag, Trash2 } from "lucide-react";
import { KEYS, inr, useStored } from "@/lib/izha-store";
import {
  DEFAULT_COUPONS,
  generateCouponCode,
  type Coupon,
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
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="h-full rounded-sm border border-[#E8CFD2] bg-[#FAF1E4] p-4 transition-colors hover:border-[#B20947]/40 sm:p-6">
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
  className = "",
  children,
}: {
  title: string;
  note?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`min-w-0 rounded-sm border border-[#E8CFD2] bg-[#FAF1E4] p-4 sm:p-6 ${className}`}>
      <h2 className={`${serif} m-0 text-[24px] font-medium sm:text-[28px]`} style={{ color: CRIMSON }}>
        {title}
      </h2>
      {note && <p className="mb-0 mt-1 text-[12px] text-black/45">{note}</p>}
      <div className="mt-4 sm:mt-5">{children}</div>
    </section>
  );
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useStored<Coupon[]>(KEYS.coupons, DEFAULT_COUPONS);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "flat">("percent");
  const [value, setValue] = useState("15");
  const [minOrder, setMinOrder] = useState("999");
  const [expiry, setExpiry] = useState("2026-12-31");
  const [firstOrderOnly, setFirstOrderOnly] = useState(false);
  const [msg, setMsg] = useState("");

  const stats = useMemo(() => {
    const active = coupons.filter((c) => c.active).length;
    const redeemed = coupons.reduce((sum, c) => sum + c.usedCount, 0);
    return { active, paused: coupons.length - active, redeemed };
  }, [coupons]);

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
    <AdminShell title="Coupon Generator">
      {/* Heading block */}
      <h2
        className={`${serif} mb-2 mt-0 break-words font-medium leading-tight`}
        style={{ color: CRIMSON, fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
      >
        Coupon Generator
      </h2>
      <p className="mb-6 mt-0 text-[14px] text-black/60 sm:text-[15px] md:mb-10">
        Type a custom coupon code or auto-generate codes — active coupons work live on Checkout
      </p>

      {/* Counts: two per row on phones */}
      <section aria-label="Coupon counts" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard label="Coupons" value={String(coupons.length)} note="All codes" />
        <StatCard label="Active" value={String(stats.active)} note="Working on Checkout" />
        <StatCard label="Paused" value={String(stats.paused)} note="Not usable right now" />
        <StatCard label="Redeemed" value={String(stats.redeemed)} note="Times used" />
      </section>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-[1fr_1.4fr]">
        {/* Create coupon */}
        <Panel title="Create New Coupon" className="h-fit">
          <form onSubmit={handleCreate} className="space-y-4">
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
              <label className="block min-w-0">
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

              <label className="block min-w-0">
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
              <label className="block min-w-0">
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

              <label className="block min-w-0">
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
          </form>
        </Panel>

        {/* Coupons list */}
        <Panel
          title="All coupons"
          note={`${coupons.length} ${coupons.length === 1 ? "coupon" : "coupons"}`}
        >
          {coupons.length === 0 ? (
            <p className="m-0 text-[14px] text-black/55">No coupons yet.</p>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {coupons.map((cpn) => (
                <li
                  key={cpn.id}
                  className={`flex min-w-0 flex-col gap-3 rounded-sm border border-[#E8CFD2] p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-5 ${
                    cpn.active ? "bg-[#FFFBF5]" : "bg-[#F3EBDD]"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex min-w-0 items-center gap-1.5 break-all rounded-lg border border-dashed border-[#B20947] bg-[#FFF5F7] px-3 py-1 text-[14px] font-bold tracking-wider text-[#B20947]">
                        <Tag size={14} className="shrink-0" /> {cpn.code}
                      </span>
                      <span
                        className={`inline-block shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                          cpn.active
                            ? "bg-[#eef7f0] text-[#3a6b42]"
                            : "bg-[#f3efef] text-[#6f6565]"
                        }`}
                      >
                        {cpn.active ? "Active" : "Paused"}
                      </span>
                      {cpn.firstOrderOnly && (
                        <span className="inline-block shrink-0 rounded-full bg-[#F9E3E9] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8F3057]">
                          1st Order Only
                        </span>
                      )}
                    </div>
                    <p className="lining-nums m-0 mt-2 text-[14px] font-medium text-[#332B2B]">
                      {cpn.type === "percent" ? `${cpn.value}% OFF` : `${inr(cpn.value)} OFF`} · Min
                      order {inr(cpn.minOrder)}
                    </p>
                    <p className="lining-nums m-0 mt-0.5 text-[12px] text-black/55">
                      Expires {cpn.expiry} · Redeemed {cpn.usedCount} times
                    </p>
                  </div>

                  <div className="flex w-full items-center gap-2 border-t border-black/5 pt-3 sm:w-auto sm:border-t-0 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(cpn.code)}
                      aria-label={`Copy ${cpn.code}`}
                      className="shrink-0 rounded-lg border border-[#E8B8C5] bg-[#FAF3E8] p-2 text-[#332B2B] hover:text-[#B20947]"
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleActive(cpn.id)}
                      className={`${outlineBtn} flex-1 justify-center sm:flex-none`}
                    >
                      {cpn.active ? "Pause" : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCoupon(cpn.id)}
                      aria-label={`Delete ${cpn.code}`}
                      className="shrink-0 rounded-lg border border-[#F9E3E9] bg-[#FFF5F7] p-2 text-[#B20947] hover:bg-[#F9E3E9]"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </AdminShell>
  );
}
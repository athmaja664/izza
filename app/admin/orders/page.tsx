"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Search, X } from "lucide-react";
import { KEYS, inr, useStored } from "@/lib/izha-store";
import { DEFAULT_ORDERS, type DemoOrder, type OrderStatus } from "@/lib/demo-store";
import AdminShell, { card, inputCls, outlineBtn } from "@/components/admin/AdminShell";

const STATUSES: ("All" | OrderStatus)[] = [
  "All",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const BADGE: Record<string, string> = {
  Processing: "bg-[#FFF5F7] text-[#B20947]",
  Packed: "bg-[#F9E3E9] text-[#8F3057]",
  Shipped: "bg-[#eef4ff] text-[#2b529a]",
  Delivered: "bg-[#eef7f0] text-[#3a6b42]",
  Cancelled: "bg-[#f3efef] text-[#6f6565]",
};

/** Local date as YYYY-MM-DD (same format the <input type="date"> gives). */
function ymd(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * Turns an order's createdAt text into YYYY-MM-DD.
 * Handles ISO strings, "13 Nov 2026, 10:44 AM" and "13/11/2026" (day first).
 * Returns "" if the text cannot be understood.
 */
function orderDateKey(createdAt: string): string {
  const dmy = createdAt.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  }
  const t = Date.parse(createdAt);
  return Number.isNaN(t) ? "" : ymd(new Date(t));
}

export default function AdminOrdersPage() {
  const [orders] = useStored<DemoOrder[]>(KEYS.orders, DEFAULT_ORDERS);
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const dateFilterOn = fromDate !== "" || toDate !== "";

  // Quick presets run on click (never during render), so the build stays safe.
  const setPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days - 1));
    setFromDate(ymd(start));
    setToDate(ymd(end));
  };

  const clearDates = () => {
    setFromDate("");
    setToDate("");
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "All" && o.status !== statusFilter) return false;

      if (dateFilterOn) {
        const key = orderDateKey(o.createdAt);
        if (!key) return false;
        if (fromDate && key < fromDate) return false;
        if (toDate && key > toDate) return false;
      }

      if (!q) return true;
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.pincode.includes(q)
      );
    });
  }, [orders, statusFilter, search, fromDate, toDate, dateFilterOn]);

  const filteredTotal = filtered.reduce((sum, o) => sum + o.total, 0);

  return (
    <AdminShell
      title="Orders"
      subtitle="Click any order to view full payment, delivery, and product details, or click a customer name"
    >
      <div className={`${card} flex flex-col gap-3 p-4`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
          <div className="relative w-full lg:min-w-[220px] lg:flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F3057]"
            />
            <input
              className={`${inputCls} !pl-10`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, customer, city or PIN..."
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors sm:px-3.5 sm:text-[12px] ${
                  statusFilter === s
                    ? "border-[#B20947] bg-[#F8EAE4] text-[#B20947]"
                    : "border-[#E8B8C5] bg-[#FAF3E8] text-[#332B2B] hover:border-[#B20947]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Date filter */}
        <div className="flex flex-col gap-3 border-t border-[#DFCBB3] pt-3 lg:flex-row lg:flex-wrap lg:items-end">
          <div className="grid grid-cols-2 gap-3 lg:flex lg:gap-3">
            <label className="block">
              <span className="mb-1 flex items-center gap-1 text-[12px] font-medium text-[#332B2B]">
                <CalendarDays size={13} /> From
              </span>
              <input
                type="date"
                className={`${inputCls} !py-2 text-[13px]`}
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1 flex items-center gap-1 text-[12px] font-medium text-[#332B2B]">
                <CalendarDays size={13} /> To
              </span>
              <input
                type="date"
                className={`${inputCls} !py-2 text-[13px]`}
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => setToDate(e.target.value)}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => setPreset(1)} className={outlineBtn}>
              Today
            </button>
            <button type="button" onClick={() => setPreset(7)} className={outlineBtn}>
              Last 7 days
            </button>
            <button type="button" onClick={() => setPreset(30)} className={outlineBtn}>
              Last 30 days
            </button>
            {dateFilterOn && (
              <button type="button" onClick={clearDates} className={`${outlineBtn} gap-1.5`}>
                <X size={13} /> Clear dates
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-[13px] text-[#6f6565]">
        Showing <strong className="text-[#332B2B]">{filtered.length}</strong> of {orders.length}{" "}
        orders · Total value{" "}
        <strong className="text-[#332B2B]">{inr(filteredTotal)}</strong>
      </p>

      <div className="mt-3 space-y-3">
        {filtered.length === 0 && (
          <div className={`${card} p-8 text-center text-[14px] text-[#6f6565]`}>
            No orders found for these filters.
          </div>
        )}

        {filtered.map((ord) => (
          <div
            key={ord.id}
            className={`${card} flex flex-col gap-4 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-5`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/admin/orders/details?id=${encodeURIComponent(ord.id)}`}
                  className="text-[16px] font-semibold text-[#B20947] hover:underline"
                >
                  {ord.id}
                </Link>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    BADGE[ord.status] ?? "bg-[#FFF5F7] text-[#332B2B]"
                  }`}
                >
                  {ord.status}
                </span>
                <span className="rounded-full bg-[#EFE2CE] px-2.5 py-0.5 text-[11px] text-[#6f6565]">
                  {ord.source}
                </span>
              </div>

              <p className="mt-1.5 text-[14px] text-[#332B2B]">
                Customer:{" "}
                <Link
                  href={`/admin/customers/details?id=${encodeURIComponent(ord.customerId)}`}
                  className="font-semibold text-[#B20947] underline decoration-[#E8B8C5] underline-offset-4 hover:text-[#8F3057]"
                >
                  {ord.customerName}
                </Link>{" "}
                <span className="text-[#6f6565]">· +91 {ord.customerPhone}</span>
              </p>

              <p className="mt-0.5 text-[13px] text-[#6f6565]">
                When: {ord.createdAt} · Where: {ord.city}, {ord.state} ({ord.pincode}) ·{" "}
                {ord.items.length} {ord.items.length === 1 ? "item" : "items"} · {ord.paymentMethod} (
                {ord.paymentStatus})
              </p>
            </div>

            <div className="flex w-full items-center justify-between gap-3 border-t border-[#DFCBB3] pt-3 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
              <div className="text-left sm:text-right">
                <p className="text-[18px] font-semibold text-[#332B2B]">{inr(ord.total)}</p>
                {ord.couponCode && (
                  <p className="text-[11px] text-[#5f7a62]">Coupon: {ord.couponCode}</p>
                )}
              </div>
              <Link
                href={`/admin/orders/details?id=${encodeURIComponent(ord.id)}`}
                className={`${outlineBtn} shrink-0 gap-1.5`}
              >
                Order Details <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
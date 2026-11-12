"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
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

export default function AdminOrdersPage() {
  const [orders] = useStored<DemoOrder[]>(KEYS.orders, DEFAULT_ORDERS);
  const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "All" && o.status !== statusFilter) return false;
      if (!q) return true;
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.pincode.includes(q)
      );
    });
  }, [orders, statusFilter, search]);

  return (
    <AdminShell
      title="Orders"
      subtitle="Click any order to view full payment, delivery, and product details, or click a customer name"
    >
      <div className={`${card} flex flex-wrap items-center justify-between gap-3 p-4`}>
        <div className="relative min-w-[220px] flex-1">
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
              className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
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

      <div className="mt-5 space-y-3">
        {filtered.map((ord) => (
          <div
            key={ord.id}
            className={`${card} flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5`}
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

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[18px] font-semibold text-[#332B2B]">{inr(ord.total)}</p>
                {ord.couponCode && (
                  <p className="text-[11px] text-[#5f7a62]">Coupon: {ord.couponCode}</p>
                )}
              </div>
              <Link
                href={`/admin/orders/details?id=${encodeURIComponent(ord.id)}`}
                className={`${outlineBtn} gap-1.5`}
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


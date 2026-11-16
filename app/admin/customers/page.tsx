"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { KEYS, inr, useStored } from "@/lib/izha-store";
import {
  DEFAULT_CUSTOMERS,
  DEFAULT_ORDERS,
  type DemoCustomer,
  type DemoOrder,
} from "@/lib/demo-store";
import AdminShell, { inputCls, outlineBtn } from "@/components/admin/AdminShell";
import { serif } from "@/components/izha/ui";

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

export default function AdminCustomersPage() {
  const [customers] = useStored<DemoCustomer[]>(KEYS.customers, DEFAULT_CUSTOMERS);
  const [orders] = useStored<DemoOrder[]>(KEYS.orders, DEFAULT_ORDERS);
  const [search, setSearch] = useState("");

  const statsMap = useMemo(() => {
    const map = new Map<string, { count: number; spent: number }>();
    for (const o of orders) {
      const prev = map.get(o.customerId) ?? { count: 0, spent: 0 };
      map.set(o.customerId, { count: prev.count + 1, spent: prev.spent + o.total });
    }
    return map;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter((c) => {
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    });
  }, [customers, search]);

  return (
    <AdminShell title="Customers">
      {/* Heading block */}
      <h2
        className={`${serif} mb-2 mt-0 break-words font-medium leading-tight`}
        style={{ color: CRIMSON, fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
      >
        Customers
      </h2>
      <p className="mb-6 mt-0 text-[14px] text-black/60 sm:text-[15px] md:mb-10">
        Click any customer name to view their complete profile, saved addresses &amp; order history
      </p>

      {/* Counts: two per row on phones */}
      <section aria-label="Customer counts" className="grid grid-cols-2 gap-3 sm:gap-4">
        <StatCard label="Customers" value={String(customers.length)} note="Registered accounts" />
        <StatCard label="Showing" value={String(filtered.length)} note="Matching your search" />
      </section>

      {/* Search */}
      <div className="mt-4 sm:mt-6">
        <Panel title="Search" note="By name, mobile, email or city">
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F3057]"
            />
            <input
              className={`${inputCls} !pl-10`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers by name, mobile, email or city..."
            />
          </div>
        </Panel>
      </div>

      {/* Customer list */}
      <div className="mt-3 sm:mt-4">
        <Panel
          title="All customers"
          note={`${filtered.length} of ${customers.length} ${customers.length === 1 ? "customer" : "customers"}`}
        >
          {filtered.length === 0 ? (
            <p className="m-0 text-[14px] text-black/55">No customers found.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              {filtered.map((cust) => {
                const stat = statsMap.get(cust.id) ?? { count: 0, spent: 0 };
                return (
                  <div
                    key={cust.id}
                    className="flex min-w-0 flex-col justify-between rounded-sm border border-[#E8CFD2] bg-[#FFFBF5] p-4 sm:p-5"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/admin/customers/details?id=${encodeURIComponent(cust.id)}`}
                        className={`${serif} block break-words text-[22px] font-semibold underline decoration-[#E8B8C5] underline-offset-4 hover:opacity-80`}
                        style={{ color: CRIMSON }}
                      >
                        {cust.name}
                      </Link>
                      <p className="lining-nums m-0 mt-2 text-[13px] text-[#332B2B]">+91 {cust.phone}</p>
                      <p className="m-0 truncate text-[13px] text-black/55">{cust.email}</p>
                      <p className="lining-nums m-0 mt-1 text-[13px] text-black/55">
                        {cust.city}, {cust.state} · {cust.pincode}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-3">
                      <div>
                        <p className="lining-nums m-0 text-[15px] font-semibold text-[#332B2B]">
                          {inr(stat.spent)}
                        </p>
                        <p className="lining-nums m-0 text-[11px] text-black/55">
                          {stat.count} {stat.count === 1 ? "order" : "orders"}
                        </p>
                      </div>
                      <Link
                        href={`/admin/customers/details?id=${encodeURIComponent(cust.id)}`}
                        className={`${outlineBtn} shrink-0 gap-1.5`}
                      >
                        View Details <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>
    </AdminShell>
  );
}
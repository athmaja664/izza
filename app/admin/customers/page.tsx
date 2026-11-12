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
import AdminShell, { card, inputCls, outlineBtn } from "@/components/admin/AdminShell";

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
    <AdminShell
      title="Customers"
      subtitle="Click any customer name to view their complete profile, saved addresses & order history"
    >
      <div className={`${card} p-4`}>
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
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((cust) => {
          const stat = statsMap.get(cust.id) ?? { count: 0, spent: 0 };
          return (
            <div key={cust.id} className={`${card} flex flex-col justify-between p-5`}>
              <div>
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/admin/customers/details?id=${encodeURIComponent(cust.id)}`}
                    className="text-[18px] font-semibold text-[#B20947] underline decoration-[#E8B8C5] underline-offset-4 hover:text-[#8F3057]"
                  >
                    {cust.name}
                  </Link>
                  <span className="rounded-full bg-[#FFF5F7] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#B20947]">
                    {cust.source}
                  </span>
                </div>
                <p className="mt-2 text-[13px] text-[#332B2B]">+91 {cust.phone}</p>
                <p className="truncate text-[13px] text-[#6f6565]">{cust.email}</p>
                <p className="mt-1 text-[13px] text-[#6f6565]">
                  {cust.city}, {cust.state} · {cust.pincode}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#E8CFD2] pt-3">
                <div>
                  <p className="text-[15px] font-semibold text-[#332B2B]">{inr(stat.spent)}</p>
                  <p className="text-[11px] text-[#6f6565]">
                    {stat.count} {stat.count === 1 ? "order" : "orders"}
                  </p>
                </div>
                <Link
                  href={`/admin/customers/details?id=${encodeURIComponent(cust.id)}`}
                  className={`${outlineBtn} gap-1.5`}
                >
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}


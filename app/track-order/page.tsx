"use client";

import { useState } from "react";
import Link from "next/link";
import { PackageCheck, Search, Truck } from "lucide-react";
import { KEYS, inr, useStored } from "@/lib/izha-store";
import { DEFAULT_ORDERS, type DemoOrder } from "@/lib/demo-store";
import { PageShell, PageTitle, card, inputCls, outlineBtn, serif, solidBtn } from "@/components/izha/ui";

const STEPS = ["Processing", "Packed", "Shipped", "Delivered"] as const;

export default function TrackOrderPage() {
  const [orders] = useStored<DemoOrder[]>(KEYS.orders, DEFAULT_ORDERS);
  const [query, setQuery] = useState("IZB-1006");
  const [searched, setSearched] = useState("IZB-1006");

  const found = orders.find(
    (o) =>
      o.id.toLowerCase() === searched.trim().toLowerCase() ||
      o.customerPhone === searched.trim()
  );

  const stepIndex = found ? STEPS.indexOf(found.status as (typeof STEPS)[number]) : -1;

  return (
    <PageShell>
      <PageTitle
        title="Track Your Order"
        sub="Stay updated at every step from our studio in Aluva to your doorstep."
      />

      <div className="mx-auto mt-10 max-w-2xl space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(query);
          }}
          className={`${card} flex flex-col gap-3 p-5 sm:flex-row sm:p-6`}
        >
          <input
            className={inputCls}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Order ID (e.g. IZB-1006) or 10-digit mobile"
          />
          <button type="submit" className={`${solidBtn} shrink-0 gap-2`}>
            <Search size={16} />
            Track Order
          </button>
        </form>

        {found ? (
          <div className={`${card} p-5 sm:p-6`}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8CFD2] pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#B5607A]">
                  Order {found.id}
                </p>
                <h2 className={`${serif} text-[26px] font-medium text-[#332B2B]`}>
                  {found.status}
                </h2>
              </div>
              <span className="rounded-full bg-[#FFF5F7] px-3 py-1 text-[12px] font-semibold text-[#B20947]">
                {found.city}, {found.state} · {found.pincode}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2">
              {STEPS.map((step, i) => {
                const active = stepIndex >= i;
                return (
                  <div key={step} className="text-center">
                    <div
                      className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border ${
                        active
                          ? "border-[#B20947] bg-[#B20947] text-white"
                          : "border-[#E8CFD2] bg-[#FCF8F3] text-[#9b9090]"
                      }`}
                    >
                      {i === 2 ? <Truck size={15} /> : <PackageCheck size={15} />}
                    </div>
                    <p
                      className={`mt-1.5 text-[11px] font-medium ${
                        active ? "text-[#332B2B]" : "text-[#9b9090]"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 border-t border-[#E8CFD2] pt-4 text-[13px] text-[#6f6565]">
              <p>
                Placed on <strong className="text-[#332B2B]">{found.createdAt}</strong> · Payment:{" "}
                <strong className="text-[#332B2B]">{found.paymentMethod}</strong> · Total:{" "}
                <strong className="text-[#332B2B]">{inr(found.total)}</strong>
              </p>
            </div>
          </div>
        ) : (
          <div className={`${card} p-6 text-center`}>
            <p className="text-[14px] text-[#6f6565]">
              No order found matching &ldquo;{searched}&rdquo;. Try sample order ID{" "}
              <button
                type="button"
                onClick={() => {
                  setQuery("IZB-1006");
                  setSearched("IZB-1006");
                }}
                className="font-semibold text-[#B20947] underline"
              >
                IZB-1006
              </button>
              .
            </p>
          </div>
        )}

        <div className="text-center">
          <Link href="/shop" className={outlineBtn}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </PageShell>
  );
}


"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import { KEYS, inr, useStored } from "@/lib/izha-store";
import {
  DEFAULT_CUSTOMERS,
  DEFAULT_ORDERS,
  type DemoCustomer,
  type DemoOrder,
} from "@/lib/demo-store";
import AdminShell, { card, cardCream, outlineBtn } from "@/components/admin/AdminShell";
import { serif } from "@/components/izha/ui";

function CustomerDetailsInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const [customers] = useStored<DemoCustomer[]>(KEYS.customers, DEFAULT_CUSTOMERS);
  const [orders] = useStored<DemoOrder[]>(KEYS.orders, DEFAULT_ORDERS);

  const customer = customers.find((c) => c.id === id) ?? customers[0];

  if (!customer) {
    return (
      <div className={`${card} p-8 text-center`}>
        <p className="text-[#6f6565]">Customer not found.</p>
        <Link href="/admin/customers" className={`${outlineBtn} mt-4`}>
          Back to Customers
        </Link>
      </div>
    );
  }

  const customerOrders = orders.filter((o) => o.customerId === customer.id);
  const totalSpent = customerOrders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#B20947] hover:underline"
      >
        <ArrowLeft size={15} /> Back to All Customers
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        {/* Customer Profile Card */}
        <section className={`${card} min-w-0 p-4 sm:p-6`}>
          <div className="flex items-center gap-3.5 border-b border-[#E8CFD2] pb-4 sm:gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#E8B8C5] bg-[#FFF5F7] text-[22px] font-semibold text-[#B20947] sm:h-14 sm:w-14 sm:text-[24px]">
              {customer.name.charAt(0)}
            </span>
            <div className="min-w-0">
              <h2 className={`${serif} truncate text-[24px] font-medium leading-none text-[#332B2B] sm:text-[28px]`}>
                {customer.name}
              </h2>
              <p className="mt-1 text-[12px] text-[#6f6565]">
                Joined {customer.joinedAt} · Source: <strong>{customer.source}</strong>
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-[14px]">
            <p className="flex items-center gap-2.5 text-[#332B2B]">
              <Phone size={16} className="shrink-0 text-[#B20947]" />
              <span className="tabular-nums leading-snug">+91 {customer.phone}</span>
            </p>
            <p className="flex min-w-0 items-center gap-2.5 text-[#332B2B]">
              <Mail size={16} className="shrink-0 text-[#B20947]" />
              <span className="break-all leading-snug">{customer.email}</span>
            </p>
            <p className="flex items-start gap-2.5 text-[#6f6565]">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[#B20947]" />
              <span className="leading-snug">
                {customer.address}, {customer.city}, {customer.state} —{" "}
                <span className="tabular-nums">{customer.pincode}</span>
              </span>
            </p>
          </div>

          <div className={`${cardCream} mt-5 grid grid-cols-2 gap-3 p-4 text-center`}>
            <div>
              <p className={`${serif} lining-nums tabular-nums text-[28px] font-semibold leading-tight text-[#B20947]`}>
                {customerOrders.length}
              </p>
              <p className="text-[12px] text-[#6f6565]">Total Orders</p>
            </div>
            <div>
              <p className={`${serif} lining-nums tabular-nums text-[28px] font-semibold leading-tight text-[#332B2B]`}>
                {inr(totalSpent)}
              </p>
              <p className="text-[12px] text-[#6f6565]">Lifetime Spend</p>
            </div>
          </div>
        </section>

        {/* Customer Order History */}
        <section className={`${card} p-5 sm:p-6`}>
          <h2 className={`${serif} flex items-center gap-2 text-[24px] font-medium text-[#332B2B]`}>
            <ShoppingBag size={20} className="text-[#B20947]" />
            Order History ({customerOrders.length})
          </h2>

          {customerOrders.length === 0 ? (
            <p className="mt-4 text-[14px] text-[#6f6565]">No orders recorded yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {customerOrders.map((ord) => (
                <Link
                  key={ord.id}
                  href={`/admin/orders/details?id=${encodeURIComponent(ord.id)}`}
                  className="block rounded-xl border border-[#DFCBB3] bg-[#EFE2CE] p-4 transition-colors hover:border-[#B20947] hover:bg-[#F8EAE4]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="tabular-nums font-semibold text-[#B20947]">{ord.id}</span>
                    <span className="rounded-full bg-[#FAF3E8] px-2.5 py-0.5 text-[11px] font-semibold text-[#332B2B]">
                      {ord.status}
                    </span>
                  </div>
                  <p className="mt-1 tabular-nums text-[13px] text-[#6f6565]">
                    {ord.createdAt} · {ord.paymentMethod} ({ord.paymentStatus})
                  </p>
                  <p className="mt-1.5 tabular-nums text-[14px] font-semibold text-[#332B2B]">
                    Total: {inr(ord.total)} · {ord.items.map((i) => `${i.name} (${i.size})`).join(", ")}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function AdminCustomerDetailsPage() {
  return (
    <AdminShell
      title="Customer Details"
      subtitle="Full customer profile, contact information, saved addresses, and order history"
    >
      <Suspense fallback={<div className="p-6 text-sm text-[#6f6565]">Loading customer...</div>}>
        <CustomerDetailsInner />
      </Suspense>
    </AdminShell>
  );
}


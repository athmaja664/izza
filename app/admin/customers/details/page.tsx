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
import AdminShell, { card, outlineBtn } from "@/components/admin/AdminShell";
import { serif } from "@/components/izha/ui";

const CRIMSON = "#B20947";

/* ---------- Layout pieces (same structure as the dashboard) ---------- */

function Panel({
  title,
  className = "",
  children,
}: {
  title?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`min-w-0 rounded-sm border border-[#E8CFD2] bg-[#FAF1E4] p-4 sm:p-6 ${className}`}>
      {title && (
        <h2
          className={`${serif} m-0 flex items-center gap-2 text-[22px] font-medium sm:text-[28px]`}
          style={{ color: CRIMSON }}
        >
          {title}
        </h2>
      )}
      <div className={title ? "mt-4 sm:mt-5" : ""}>{children}</div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="h-full min-w-0 rounded-sm border border-[#E8CFD2] bg-[#FFFBF5] p-4 sm:p-5">
      <p className="m-0 text-[10px] uppercase tracking-[0.15em] text-black/50 sm:text-[11px] sm:tracking-[0.25em]">
        {label}
      </p>
      <p
        className={`${serif} lining-nums mb-0 mt-3 break-words font-medium leading-none ${
          value.startsWith("₹") ? "text-[22px] sm:text-[30px]" : "text-[30px] sm:text-[38px]"
        }`}
        style={{ color: CRIMSON }}
      >
        {value}
      </p>
    </div>
  );
}

function CustomerDetailsInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const [customers] = useStored<DemoCustomer[]>(KEYS.customers, DEFAULT_CUSTOMERS);
  const [orders] = useStored<DemoOrder[]>(KEYS.orders, DEFAULT_ORDERS);

  const foundCustomer = customers.find((c) => c.id === id);
  const matchedOrder = !foundCustomer
    ? orders.find((o) => o.customerId === id || o.id === id)
    : null;
  const customer: DemoCustomer | null =
    foundCustomer ??
    (matchedOrder
      ? {
          id: matchedOrder.customerId,
          name: matchedOrder.customerName,
          email: matchedOrder.customerEmail,
          phone: matchedOrder.customerPhone,
          city: matchedOrder.city,
          state: matchedOrder.state,
          pincode: matchedOrder.pincode,
          address: matchedOrder.address,
          joinedAt: matchedOrder.createdAt.slice(0, 10),
          source: "Direct",
          savedAddresses: [],
        }
      : customers[0]);

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
    <div>
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1.5 py-1 text-[12px] uppercase tracking-[0.15em] underline underline-offset-4"
        style={{ color: CRIMSON }}
      >
        <ArrowLeft size={15} /> Back to All Customers
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-[1fr_1.5fr]">
        {/* Customer profile */}
        <Panel>
          <div className="flex items-center gap-3.5 border-b border-black/5 pb-4 sm:gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#E8B8C5] bg-[#FFF5F7] text-[22px] font-semibold text-[#B20947] sm:h-14 sm:w-14 sm:text-[24px]">
              {customer.name.charAt(0)}
            </span>
            <div className="min-w-0">
              <h2
                className={`${serif} m-0 break-words text-[24px] font-medium leading-tight sm:text-[28px]`}
                style={{ color: CRIMSON }}
              >
                {customer.name}
              </h2>
              <p className="lining-nums m-0 mt-1 text-[12px] text-black/55">Joined {customer.joinedAt}</p>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-[14px]">
            <p className="m-0 flex items-center gap-2.5 text-[#332B2B]">
              <Phone size={16} className="shrink-0 text-[#B20947]" />
              <span className="lining-nums leading-snug">+91 {customer.phone}</span>
            </p>
            <p className="m-0 flex min-w-0 items-center gap-2.5 text-[#332B2B]">
              <Mail size={16} className="shrink-0 text-[#B20947]" />
              <span className="break-all leading-snug">{customer.email}</span>
            </p>
            <p className="m-0 flex items-start gap-2.5 text-black/60">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[#B20947]" />
              <span className="break-words leading-snug">
                {customer.address}, {customer.city}, {customer.state} —{" "}
                <span className="lining-nums">{customer.pincode}</span>
              </span>
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <StatCard label="Total Orders" value={String(customerOrders.length)} />
            <StatCard label="Lifetime Spend" value={inr(totalSpent)} />
          </div>
        </Panel>

        {/* Order history */}
        <Panel
          title={
            <>
              <ShoppingBag size={20} />
              Order History ({customerOrders.length})
            </>
          }
        >
          {customerOrders.length === 0 ? (
            <p className="m-0 text-[14px] text-black/55">No orders recorded yet.</p>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {customerOrders.map((ord) => (
                <li key={ord.id}>
                  <Link
                    href={`/admin/orders/details?id=${encodeURIComponent(ord.id)}`}
                    className="block min-w-0 rounded-sm border border-[#E8CFD2] bg-[#FFFBF5] p-4 no-underline transition-colors hover:border-[#B20947]/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className="lining-nums min-w-0 break-all text-[14px] font-semibold"
                        style={{ color: CRIMSON }}
                      >
                        {ord.id}
                      </span>
                      <span className="inline-block shrink-0 rounded-full bg-[#F9E3E9] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8F3057]">
                        {ord.status}
                      </span>
                    </div>
                    <p className="lining-nums m-0 mt-2 text-[13px] text-black/55">
                      {ord.createdAt} · {ord.paymentMethod} ({ord.paymentStatus})
                    </p>
                    <p className="lining-nums m-0 mt-1.5 break-words text-[14px] font-semibold text-[#332B2B]">
                      Total: {inr(ord.total)} · {ord.items.map((i) => `${i.name} (${i.size})`).join(", ")}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

export default function AdminCustomerDetailsPage() {
  return (
    <AdminShell title="Customer Details">
      {/* Heading block */}
      <h2
        className={`${serif} mb-2 mt-0 break-words font-medium leading-tight`}
        style={{ color: CRIMSON, fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
      >
        Customer Details
      </h2>
      <p className="mb-6 mt-0 text-[14px] text-black/60 sm:text-[15px] md:mb-10">
        Full customer profile, contact information, saved addresses, and order history
      </p>

      <Suspense fallback={<div className="p-6 text-sm text-[#6f6565]">Loading customer...</div>}>
        <CustomerDetailsInner />
      </Suspense>
    </AdminShell>
  );
}
"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, CreditCard, MapPin, Package, User } from "lucide-react";
import { KEYS, inr, useStored } from "@/lib/izha-store";
import { DEFAULT_ORDERS, type DemoOrder, type OrderStatus } from "@/lib/demo-store";
import AdminShell, { card, inputCls, outlineBtn } from "@/components/admin/AdminShell";
import { serif } from "@/components/izha/ui";

const CRIMSON = "#B20947";

const STATUSES: OrderStatus[] = [
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

/* ---------- Layout pieces (same structure as the dashboard) ---------- */

function InfoCard({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full min-w-0 rounded-sm border border-[#E8CFD2] bg-[#FAF1E4] p-4 sm:p-6">
      <p className="m-0 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-black/50 sm:text-[11px] sm:tracking-[0.25em]">
        {icon} {label}
      </p>
      <div className="mt-3 sm:mt-4">{children}</div>
    </div>
  );
}

function Panel({
  title,
  className = "",
  children,
}: {
  title: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`min-w-0 rounded-sm border border-[#E8CFD2] bg-[#FAF1E4] p-4 sm:p-6 ${className}`}>
      <h2
        className={`${serif} m-0 flex items-center gap-2 text-[22px] font-medium sm:text-[28px]`}
        style={{ color: CRIMSON }}
      >
        {title}
      </h2>
      <div className="mt-4 sm:mt-5">{children}</div>
    </section>
  );
}

function OrderDetailsInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") ?? "";
  const [orders, setOrders] = useStored<DemoOrder[]>(KEYS.orders, DEFAULT_ORDERS);

  const order = orders.find((o) => o.id === orderId) ?? orders[0];

  if (!order) {
    return (
      <div className={`${card} p-8 text-center`}>
        <p className="text-[#6f6565]">Order not found.</p>
        <Link href="/admin/orders" className={`${outlineBtn} mt-4`}>
          Back to Orders
        </Link>
      </div>
    );
  }

  const updateStatus = (next: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: next } : o))
    );
  };

  return (
    <div>
      {/* Back link + status update */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 py-1 text-[12px] uppercase tracking-[0.15em] underline underline-offset-4"
          style={{ color: CRIMSON }}
        >
          <ArrowLeft size={15} /> Back to All Orders
        </Link>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/50">
            Update Status:
          </span>
          <select
            className={`${inputCls} w-full !py-2 text-[13px] font-medium sm:!w-auto`}
            value={order.status}
            onChange={(e) => updateStatus(e.target.value as OrderStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top meta: When, Where, Payment, Who (one per row on phones) */}
      <section
        aria-label="Order summary"
        className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4"
      >
        <InfoCard icon={<Calendar size={14} />} label="When Placed">
          <p className="lining-nums m-0 text-[15px] font-semibold text-[#332B2B]">{order.createdAt}</p>
        </InfoCard>

        <InfoCard icon={<MapPin size={14} />} label="Delivery Destination">
          <p className="m-0 break-words text-[14px] font-medium text-[#332B2B]">{order.address}</p>
          <p className="lining-nums m-0 mt-1 text-[13px] text-black/55">
            {order.city}, {order.state} · {order.pincode}
          </p>
        </InfoCard>

        <InfoCard icon={<CreditCard size={14} />} label="Payment Details">
          <p className="m-0 text-[15px] font-semibold text-[#332B2B]">
            {order.paymentMethod} · {order.paymentStatus}
          </p>
          <p className="m-0 mt-1 break-all text-[12px] text-black/55">Ref: {order.paymentRef}</p>
        </InfoCard>

        <InfoCard icon={<User size={14} />} label="Customer Data">
          <Link
            href={`/admin/customers/details?id=${encodeURIComponent(order.customerId)}`}
            className={`${serif} block break-words text-[22px] font-semibold underline decoration-[#E8B8C5] underline-offset-4 hover:opacity-80`}
            style={{ color: CRIMSON }}
          >
            {order.customerName}
          </Link>
          <p className="lining-nums m-0 mt-1 break-all text-[12px] text-black/55">
            +91 {order.customerPhone} · {order.customerEmail}
          </p>
        </InfoCard>
      </section>

      {/* Product details + price summary */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Panel
          title={
            <>
              <Package size={20} />
              Ordered Products ({order.items.length})
            </>
          }
        >
          <ul className="m-0 list-none p-0">
            {order.items.map((item) => (
              <li
                key={`${item.id}-${item.size}`}
                className="flex items-center gap-3 border-b border-black/5 py-3.5 last:border-0 sm:gap-4"
              >
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-sm border border-[#E8B8C5] bg-[#FFF5F7]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-[14px] font-semibold text-[#332B2B] sm:text-[15px]">{item.name}</p>
                  <p className="lining-nums m-0 mt-0.5 text-[12px] text-black/55 sm:text-[13px]">
                    Size: <strong>{item.size}</strong> · Qty: <strong>{item.qty}</strong> · Unit:{" "}
                    {inr(item.price)}
                  </p>
                </div>
                <span className="lining-nums shrink-0 text-[14px] font-semibold text-[#332B2B] sm:text-[15px]">
                  {inr(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Payment Summary" className="h-fit">
          <dl className="m-0 space-y-2.5 text-[14px]">
            <div className="flex justify-between gap-3">
              <dt className="text-black/55">Subtotal</dt>
              <dd className="lining-nums m-0 font-medium text-[#332B2B]">{inr(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between gap-3">
                <dt className="text-black/55">
                  Discount {order.couponCode ? `(${order.couponCode})` : ""}
                </dt>
                <dd className="lining-nums m-0 font-medium text-[#5f7a62]">−{inr(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between gap-3">
              <dt className="text-black/55">Shipping</dt>
              <dd className="lining-nums m-0 font-medium text-[#332B2B]">
                {order.shipping === 0 ? "FREE" : inr(order.shipping)}
              </dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-black/5 pt-3 text-[16px] font-semibold">
              <dt className="text-[#332B2B]">Order Total</dt>
              <dd className="lining-nums m-0" style={{ color: CRIMSON }}>
                {inr(order.total)}
              </dd>
            </div>
          </dl>

          <Link
            href={`/admin/customers/details?id=${encodeURIComponent(order.customerId)}`}
            className={`${outlineBtn} mt-5 w-full justify-center`}
          >
            View {order.customerName}&apos;s Full Profile
          </Link>
        </Panel>
      </div>
    </div>
  );
}

export default function AdminOrderDetailsPage() {
  return (
    <AdminShell title="Order Details">
      {/* Heading block */}
      <h2
        className={`${serif} mb-2 mt-0 break-words font-medium leading-tight`}
        style={{ color: CRIMSON, fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
      >
        Order Details
      </h2>
      <p className="mb-6 mt-0 text-[14px] text-black/60 sm:text-[15px] md:mb-10">
        Full breakdown of timestamps, shipping address, payment reference, products &amp; customer data
      </p>

      <Suspense fallback={<div className="p-6 text-sm text-[#6f6565]">Loading order...</div>}>
        <OrderDetailsInner />
      </Suspense>
    </AdminShell>
  );
}
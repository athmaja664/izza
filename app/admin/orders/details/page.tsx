"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, CreditCard, MapPin, Package, User } from "lucide-react";
import { KEYS, inr, useStored } from "@/lib/izha-store";
import { DEFAULT_ORDERS, type DemoOrder, type OrderStatus } from "@/lib/demo-store";
import AdminShell, { card, cardCream, inputCls, outlineBtn } from "@/components/admin/AdminShell";
import { serif } from "@/components/izha/ui";

const STATUSES: OrderStatus[] = [
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#B20947] hover:underline"
        >
          <ArrowLeft size={15} /> Back to All Orders
        </Link>
        <div className="flex w-full flex-wrap items-center justify-between gap-2.5 sm:w-auto sm:justify-end">
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#6f6565]">
            Update Status:
          </span>
          <select
            className={`${inputCls} !w-auto !py-2 text-[13px] font-medium`}
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

      {/* Top Meta Grid: When, Where, Payment, Who */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`${card} p-4`}>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B5607A]">
            <Calendar size={14} /> When Placed
          </p>
          <p className="mt-2 text-[15px] font-semibold text-[#332B2B]">{order.createdAt}</p>
          <p className="mt-1 text-[12px] text-[#6f6565]">Source: {order.source}</p>
        </div>

        <div className={`${card} p-4`}>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B5607A]">
            <MapPin size={14} /> Delivery Destination
          </p>
          <p className="mt-2 text-[14px] font-medium text-[#332B2B]">{order.address}</p>
          <p className="mt-0.5 text-[13px] text-[#6f6565]">
            {order.city}, {order.state} · {order.pincode}
          </p>
        </div>

        <div className={`${card} p-4`}>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B5607A]">
            <CreditCard size={14} /> Payment Details
          </p>
          <p className="mt-2 text-[15px] font-semibold text-[#332B2B]">
            {order.paymentMethod} · {order.paymentStatus}
          </p>
          <p className="mt-1 text-[12px] text-[#6f6565]">Ref: {order.paymentRef}</p>
        </div>

        <div className={`${cardCream} p-4`}>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#B20947]">
            <User size={14} /> Customer Data
          </p>
          <Link
            href={`/admin/customers/details?id=${encodeURIComponent(order.customerId)}`}
            className={`${serif} mt-1.5 block text-[22px] font-semibold text-[#B20947] underline decoration-[#E8B8C5] underline-offset-4 hover:text-[#8F3057]`}
          >
            {order.customerName}
          </Link>
          <p className="mt-1 text-[12px] text-[#6f6565]">
            +91 {order.customerPhone} · {order.customerEmail}
          </p>
        </div>
      </div>

      {/* Product Details + Price Summary */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className={`${card} p-5 sm:p-6`}>
          <h2 className={`${serif} flex items-center gap-2 text-[24px] font-medium text-[#332B2B]`}>
            <Package size={20} className="text-[#B20947]" />
            Ordered Products ({order.items.length})
          </h2>
          <ul className="mt-4 divide-y divide-[#E8CFD2]">
            {order.items.map((item) => (
              <li key={`${item.id}-${item.size}`} className="flex flex-wrap items-center gap-3 py-3.5 sm:flex-nowrap sm:gap-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-[#E8B8C5] bg-[#FFF5F7]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#332B2B]">{item.name}</p>
                  <p className="mt-0.5 text-[13px] text-[#6f6565]">
                    Size: <strong>{item.size}</strong> · Qty: <strong>{item.qty}</strong> · Unit:{" "}
                    {inr(item.price)}
                  </p>
                </div>
                <span className="font-semibold text-[#332B2B]">
                  {inr(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${card} h-fit p-5 sm:p-6`}>
          <h2 className={`${serif} text-[24px] font-medium text-[#332B2B]`}>
            Payment Summary
          </h2>
          <dl className="mt-4 space-y-2.5 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-[#6f6565]">Subtotal</dt>
              <dd className="font-medium text-[#332B2B]">{inr(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-[#6f6565]">
                  Discount {order.couponCode ? `(${order.couponCode})` : ""}
                </dt>
                <dd className="font-medium text-[#5f7a62]">−{inr(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[#6f6565]">Shipping</dt>
              <dd className="font-medium text-[#332B2B]">
                {order.shipping === 0 ? "FREE" : inr(order.shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-[#E8CFD2] pt-3 text-[16px] font-semibold">
              <dt className="text-[#332B2B]">Order Total</dt>
              <dd className="text-[#B20947]">{inr(order.total)}</dd>
            </div>
          </dl>

          <Link
            href={`/admin/customers/details?id=${encodeURIComponent(order.customerId)}`}
            className={`${outlineBtn} mt-5 w-full`}
          >
            View {order.customerName}&apos;s Full Profile
          </Link>
        </section>
      </div>
    </div>
  );
}

export default function AdminOrderDetailsPage() {
  return (
    <AdminShell
      title="Order Details"
      subtitle="Full breakdown of timestamps, shipping address, payment reference, products & customer data"
    >
      <Suspense fallback={<div className="p-6 text-sm text-[#6f6565]">Loading order...</div>}>
        <OrderDetailsInner />
      </Suspense>
    </AdminShell>
  );
}


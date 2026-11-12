"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  IndianRupee,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { KEYS, inr, useStored } from "@/lib/izha-store";
import {
  DEFAULT_ADMIN_PRODUCTS,
  DEFAULT_CUSTOMERS,
  DEFAULT_ORDERS,
  MONTHLY_REVENUE_SERIES,
  type AdminProduct,
  type DemoCustomer,
  type DemoOrder,
} from "@/lib/demo-store";
import AdminShell, { card, outlineBtn } from "@/components/admin/AdminShell";
import { serif } from "@/components/izha/ui";

const STATUS_STYLE: Record<string, string> = {
  Processing: "bg-[#FFF5F7] text-[#B20947]",
  Packed: "bg-[#F9E3E9] text-[#8F3057]",
  Shipped: "bg-[#eef4ff] text-[#2b529a]",
  Delivered: "bg-[#eef7f0] text-[#3a6b42]",
  Cancelled: "bg-[#f3efef] text-[#6f6565]",
};

export default function AdminDashboardPage() {
  const [orders] = useStored<DemoOrder[]>(KEYS.orders, DEFAULT_ORDERS);
  const [customers] = useStored<DemoCustomer[]>(KEYS.customers, DEFAULT_CUSTOMERS);
  const [products] = useStored<AdminProduct[]>(KEYS.adminProducts, DEFAULT_ADMIN_PRODUCTS);

  const metrics = useMemo(() => {
    const orderRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const metaOrders = orders.filter((o) => o.source === "Meta Ads").length;
    const lowStock = products.filter((p) => p.stock <= 5).length;
    const topProducts = [...products]
      .sort((a, b) => b.soldCount * b.price - a.soldCount * a.price)
      .slice(0, 5);

    const series = MONTHLY_REVENUE_SERIES.map((m, i) =>
      i === MONTHLY_REVENUE_SERIES.length - 1
        ? {
            ...m,
            revenue: m.revenue + Math.max(0, orderRevenue - 13583),
            orders: m.orders + Math.max(0, orders.length - 6),
          }
        : m
    );

    const maxRevenue = Math.max(...series.map((s) => s.revenue), 1);

    const sourceBreakdown = [
      {
        label: "Meta Ads",
        count: orders.filter((o) => o.source === "Meta Ads").length,
        color: "#B20947",
      },
      {
        label: "Instagram",
        count: orders.filter((o) => o.source === "Instagram").length,
        color: "#E99A9F",
      },
      {
        label: "Direct Store",
        count: orders.filter((o) => o.source === "Direct").length,
        color: "#8F3057",
      },
    ];

    return {
      totalRevenue: 277000 + orderRevenue,
      totalOrders: 157 + orders.length,
      metaOrders,
      lowStock,
      topProducts,
      series,
      maxRevenue,
      sourceBreakdown,
    };
  }, [orders, products]);

  const recentOrders = orders.slice(0, 4);
  const recentCustomers = customers.slice(0, 4);

  const customerTotals = useMemo(() => {
    const map = new Map<string, { count: number; spent: number }>();
    for (const o of orders) {
      const prev = map.get(o.customerId) ?? { count: 0, spent: 0 };
      map.set(o.customerId, { count: prev.count + 1, spent: prev.spent + o.total });
    }
    return map;
  }, [orders]);

  return (
    <AdminShell
      title="Business Dashboard"
      subtitle="Live overview of Izha Blooms sales, orders, customers, inventory & Meta Ads performance"
      actions={
        <Link href="/admin/products" className={outlineBtn}>
          + Manage Products
        </Link>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total Revenue",
            value: inr(metrics.totalRevenue),
            hint: "+18% vs last month",
            icon: IndianRupee,
          },
          {
            label: "Total Orders",
            value: String(metrics.totalOrders),
            hint: `${orders.length} active recent orders`,
            icon: ShoppingBag,
          },
          {
            label: "Customers",
            value: String(customers.length),
            hint: `${metrics.metaOrders} orders via Meta Ads`,
            icon: Users,
          },
          {
            label: "Low / Out of Stock",
            value: String(metrics.lowStock),
            hint: `${products.length} catalog styles`,
            icon: AlertTriangle,
          },
        ].map(({ label, value, hint, icon: Icon }) => (
          <div key={label} className={`${card} min-w-0 p-4 sm:p-5`}>
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B5607A] sm:tracking-[0.16em]">
                {label}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF5F7] text-[#B20947]">
                <Icon size={16} />
              </span>
            </div>
            <p className={`${serif} lining-nums mt-2 text-[24px] font-semibold leading-none text-[#332B2B] sm:text-[34px]`}>
              {value}
            </p>
            <p className="mt-2 text-[12px] text-[#6f6565]">{hint}</p>
          </div>
        ))}
      </div>

      {/* Business Growth Chart + Sales Attribution */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className={`${card} min-w-0 p-4 sm:p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B5607A]">
                Business Growth
              </p>
              <h2 className={`${serif} text-[22px] font-medium text-[#332B2B] sm:text-[24px]`}>
                6-Month Revenue &amp; Order Trend
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eef7f0] px-3 py-1 text-[11px] font-semibold text-[#3a6b42] sm:text-[12px]">
              <TrendingUp size={14} /> Growing steadily
            </span>
          </div>

          <div className="mt-5 grid grid-cols-6 items-end gap-1.5 pt-3 sm:mt-6 sm:gap-5 sm:pt-4">
            {metrics.series.map((item) => {
              const pct = Math.max(18, Math.round((item.revenue / metrics.maxRevenue) * 100));
              return (
                <div key={item.month} className="flex min-w-0 flex-col items-center">
                  <span className="mb-1.5 text-[10px] font-semibold text-[#332B2B] sm:text-[11px]">
                    ₹{Math.round(item.revenue / 1000)}k
                  </span>
                  <div className="flex h-28 w-full max-w-[48px] items-end rounded-t-xl bg-[#EFE2CE] p-1 sm:h-40">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-[#B20947] to-[#E99A9F] transition-all duration-500"
                      style={{ height: `${pct}%` }}
                      title={`${item.month}: ${inr(item.revenue)} (${item.orders} orders)`}
                    />
                  </div>
                  <span className="mt-2 text-[11px] font-medium text-[#6f6565] sm:text-[12px]">{item.month}</span>
                  <span className="text-[9px] text-[#9b9090] sm:text-[10px]">{item.orders} ord</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Product-wise sales & Meta Ads tracking */}
        <section className={`${card} flex min-w-0 flex-col justify-between p-4 sm:p-6`}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B5607A]">
              Sales Report &amp; Meta Ads
            </p>
            <h2 className={`${serif} text-[24px] font-medium text-[#332B2B]`}>
              Top Products &amp; Channels
            </h2>

            <ul className="mt-4 space-y-2.5">
              {metrics.topProducts.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-[#DFCBB3] bg-[#EFE2CE] px-3 py-2 text-[13px]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#332B2B]">{p.name}</p>
                    <p className="text-[11px] text-[#6f6565]">
                      {p.soldCount} sold · Stock {p.stock}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold text-[#B20947]">
                    {inr(p.soldCount * p.price)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* <div className={`${cardCream} mt-4 p-3.5`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#332B2B]">
              Order Attribution (Meta Pixel Connected)
            </p>
            <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
              {metrics.sourceBreakdown.map((s) => (
                <div key={s.label} className="rounded-lg bg-white p-2">
                  <p className="text-[16px] font-semibold text-[#332B2B]">{s.count}</p>
                  <p className="text-[11px] text-[#6f6565]">{s.label}</p>
                </div>
              ))}
            </div>
          </div> */}
        </section>
      </div>

      {/* Recent 4 Orders & Recent 4 Customers */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <section className={`${card} min-w-0 p-4 sm:p-6`}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B5607A]">
                Recent 4 Orders
              </p>
              <h2 className={`${serif} text-[24px] font-medium text-[#332B2B]`}>
                Latest Orders
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#B20947] hover:underline"
            >
              All Orders <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DFCBB3] bg-[#EFE2CE] p-3.5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/orders/details?id=${encodeURIComponent(ord.id)}`}
                      className="font-semibold text-[#B20947] hover:underline"
                    >
                      {ord.id}
                    </Link>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        STATUS_STYLE[ord.status] ?? "bg-[#FFF5F7] text-[#332B2B]"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-[#6f6565]">
                    By{" "}
                    <Link
                      href={`/admin/customers/details?id=${encodeURIComponent(ord.customerId)}`}
                      className="font-medium text-[#332B2B] underline decoration-[#E8B8C5] underline-offset-2 hover:text-[#B20947]"
                    >
                      {ord.customerName}
                    </Link>{" "}
                    · {ord.city}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-semibold text-[#332B2B]">{inr(ord.total)}</p>
                  <Link
                    href={`/admin/orders/details?id=${encodeURIComponent(ord.id)}`}
                    className="text-[11px] font-medium text-[#B20947] hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Customers */}
        <section className={`${card} min-w-0 p-4 sm:p-6`}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B5607A]">
                Recent 4 Customers
              </p>
              <h2 className={`${serif} text-[24px] font-medium text-[#332B2B]`}>
                Customer Directory
              </h2>
            </div>
            <Link
              href="/admin/customers"
              className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#B20947] hover:underline"
            >
              All Customers <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {recentCustomers.map((cust) => {
              const summary = customerTotals.get(cust.id) ?? { count: 0, spent: 0 };
              return (
                <Link
                  key={cust.id}
                  href={`/admin/customers/details?id=${encodeURIComponent(cust.id)}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#DFCBB3] bg-[#EFE2CE] p-3.5 transition-colors hover:border-[#B20947] hover:bg-[#F8EAE4]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E8B8C5] bg-[#FAF3E8] font-semibold text-[#B20947]">
                      {cust.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#332B2B]">{cust.name}</p>
                      <p className="truncate text-[12px] text-[#6f6565]">
                        +91 {cust.phone} · {cust.city}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[13px] font-semibold text-[#332B2B]">
                      {inr(summary.spent)}
                    </p>
                    <p className="text-[11px] text-[#6f6565]">
                      {summary.count} {summary.count === 1 ? "order" : "orders"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-[#DFCBB3] pt-4">
            <Link href="/admin/coupons" className="inline-flex items-center gap-1.5 rounded-full border border-[#E8B8C5] bg-[#FAF3E8] px-3.5 py-1.5 text-[12px] font-medium text-[#332B2B] hover:text-[#B20947]">
              <Package size={13} /> Coupon Generator
            </Link>
            <Link href="/admin/homepage" className="inline-flex items-center gap-1.5 rounded-full border border-[#E8B8C5] bg-[#FAF3E8] px-3.5 py-1.5 text-[12px] font-medium text-[#332B2B] hover:text-[#B20947]">
              Edit Homepage Hero &amp; Categories
            </Link>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
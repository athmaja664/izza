"use client";

import { useMemo } from "react";
import Link from "next/link";
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
import AdminShell from "@/components/admin/AdminShell";
import { serif } from "@/components/izha/ui";

const CRIMSON = "#B20947";
const LOW_STOCK = 5;

const STATUSES = ["Processing", "Packed", "Shipped", "Delivered", "Cancelled"] as const;

const PILL: Record<string, string> = {
  Processing: "bg-[#FFF5F7] text-[#B20947]",
  Packed: "bg-[#F9E3E9] text-[#8F3057]",
  Shipped: "bg-[#eef4ff] text-[#2b529a]",
  Delivered: "bg-[#eef7f0] text-[#3a6b42]",
  Cancelled: "bg-[#f3efef] text-[#6f6565]",
};

const BAR: Record<string, string> = {
  Processing: "#E99A9F",
  Packed: "#8F3057",
  Shipped: "#2b529a",
  Delivered: "#3a6b42",
  Cancelled: "#9b9090",
};

function StatCard({
  label,
  value,
  note,
  href,
}: {
  label: string;
  value: string;
  note?: string;
  href?: string;
}) {
  const body = (
    <div className="h-full rounded-sm border border-[#E8CFD2] bg-[#FAF1E4] p-4 transition-colors hover:border-[#B20947]/40 sm:p-6">
      <p className="m-0 text-[10px] uppercase tracking-[0.15em] text-black/50 sm:text-[11px] sm:tracking-[0.25em]">
        {label}
      </p>
      <p
        className={`${serif} lining-nums mb-0 mt-3 break-words font-medium leading-none sm:mt-4 ${
          value.startsWith("₹") ? "text-[26px] sm:text-[34px]" : "text-[32px] sm:text-[46px]"
        }`}
        style={{ color: CRIMSON }}
      >
        {value}
      </p>
      {note && <p className="mb-0 mt-2 text-[11px] text-black/45 sm:mt-3 sm:text-[12px]">{note}</p>}
    </div>
  );
  return href ? (
    <Link href={href} className="block no-underline">
      {body}
    </Link>
  ) : (
    body
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

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-block shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
        PILL[status] ?? "bg-[#FFF5F7] text-[#332B2B]"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminDashboardPage() {
  const [orders] = useStored<DemoOrder[]>(KEYS.orders, DEFAULT_ORDERS);
  const [customers] = useStored<DemoCustomer[]>(KEYS.customers, DEFAULT_CUSTOMERS);
  const [products] = useStored<AdminProduct[]>(KEYS.adminProducts, DEFAULT_ADMIN_PRODUCTS);

  const m = useMemo(() => {
    const orderRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalRevenue = 277000 + orderRevenue;
    const totalOrders = 157 + orders.length;
    const collected = orders
      .filter((o) => o.status === "Delivered")
      .reduce((sum, o) => sum + o.total, 0);
    const average = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const pending = orders.filter((o) => o.status === "Processing").length;

    const series = MONTHLY_REVENUE_SERIES.map((s, i) =>
      i === MONTHLY_REVENUE_SERIES.length - 1
        ? {
            ...s,
            revenue: s.revenue + Math.max(0, orderRevenue - 13583),
            orders: s.orders + Math.max(0, orders.length - 6),
          }
        : s
    );
    const maxRevenue = Math.max(...series.map((s) => s.revenue), 1);

    const topProducts = [...products]
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 5);

    const lowStockList = products
      .filter((p) => p.stock <= LOW_STOCK)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);
    const lowStockCount = products.filter((p) => p.stock <= LOW_STOCK).length;

    const statusCount = new Map<string, number>();
    for (const o of orders) statusCount.set(o.status, (statusCount.get(o.status) ?? 0) + 1);

    return {
      totalRevenue,
      totalOrders,
      collected,
      average,
      pending,
      series,
      maxRevenue,
      topProducts,
      lowStockList,
      lowStockCount,
      statusCount,
    };
  }, [orders, products]);

  const recentOrders = orders.slice(0, 4);
  const recentCustomers = customers.slice(0, 4);

  return (
    <AdminShell title="Dashboard">
      <p className="m-0 text-[10px] uppercase tracking-[0.2em] text-black/50 sm:text-[11px] sm:tracking-[0.3em]">
        Signed in as Izha Admin
      </p>
      <h2
        className={`${serif} mb-2 mt-3 break-words font-medium leading-tight`}
        style={{ color: CRIMSON, fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
      >
        Welcome back, Izha Admin
      </h2>
      <p className="mb-6 mt-0 text-[14px] text-black/60 sm:text-[15px] md:mb-10">
        Here is a quick look at your store.
      </p>

      {/* Counts: two per row on phones */}
      <section aria-label="Store counts" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="Customers"
          value={String(customers.length)}
          note="Registered accounts"
          href="/admin/customers"
        />
        <StatCard
          label="Products"
          value={String(products.length)}
          note="Catalog styles"
          href="/admin/products"
        />
        <StatCard
          label="Orders"
          value={String(m.totalOrders)}
          note="All orders"
          href="/admin/orders"
        />
        <StatCard
          label="Pending orders"
          value={String(m.pending)}
          note="Waiting to be packed"
          href="/admin/orders"
        />
      </section>

      {/* Sales: one per row on phones, because the amounts are wide */}
      <section
        aria-label="Sales figures"
        className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:grid-cols-3 sm:gap-4"
      >
        <StatCard label="Sales" value={inr(m.totalRevenue)} note="All orders placed" />
        <StatCard label="Collected" value={inr(m.collected)} note="Delivered orders only" />
        <StatCard label="Average order" value={inr(m.average)} note="Sales divided by orders" />
      </section>

      {/* Chart + status */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-3">
        <Panel
          title="Sales, last 6 months"
          note="Number on top = sales in thousands"
          className="lg:col-span-2"
        >
          <div className="flex h-44 items-end gap-2 sm:gap-4" role="img" aria-label="Bar chart of sales for the last 6 months">
            {m.series.map((item) => {
              const pct = Math.max(6, Math.round((item.revenue / m.maxRevenue) * 100));
              return (
                <div
                  key={item.month}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                  title={`${item.month}: ${inr(item.revenue)}, ${item.orders} orders`}
                >
                  <span className="lining-nums mb-1 text-[11px] text-black/55">
                    ₹{Math.round(item.revenue / 1000)}k
                  </span>
                  <div className="w-full rounded-t-sm" style={{ height: `${pct}%`, background: CRIMSON }} />
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex gap-2 sm:gap-4">
            {m.series.map((item) => (
              <div key={item.month} className="min-w-0 flex-1 text-center">
                <p className="m-0 text-[11px] uppercase tracking-[0.1em] text-black/60">{item.month}</p>
                <p className="lining-nums m-0 text-[10px] text-black/45">{item.orders} orders</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Orders by status" note="Recent orders">
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {STATUSES.map((s) => {
              const n = m.statusCount.get(s) ?? 0;
              const pct = orders.length > 0 ? Math.round((n / orders.length) * 100) : 0;
              return (
                <li key={s}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span>{s}</span>
                    <span className="lining-nums text-black/60">{n}</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-[#F6DADD]">
                    <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: BAR[s] }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      {/* Top selling + low stock */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-2">
        <Panel title="Top selling styles" note="By units sold">
          {m.topProducts.length === 0 ? (
            <p className="m-0 text-[14px] text-black/55">No sales yet.</p>
          ) : (
            <ol className="m-0 list-none p-0">
              {m.topProducts.map((p, i) => (
                <li key={p.id} className="flex items-center gap-3 border-b border-black/5 py-3 last:border-0">
                  <span className="lining-nums w-5 shrink-0 text-[13px] text-black/40">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-[14px]">{p.name}</span>
                  <span className="shrink-0 text-right text-[12px] text-black/55">
                    <span className="lining-nums">{p.soldCount}</span> sold
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Panel>

        <Panel title="Low stock" note={`Styles with ${LOW_STOCK} or fewer left`}>
          {m.lowStockList.length === 0 ? (
            <p className="m-0 text-[14px] text-black/55">All styles have enough stock.</p>
          ) : (
            <ul className="m-0 list-none p-0">
              {m.lowStockList.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 border-b border-black/5 py-3 last:border-0">
                  <span className="min-w-0 flex-1 truncate text-[14px]">{p.name}</span>
                  <span
                    className={`lining-nums shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                      p.stock <= 0 ? "bg-[#f3efef] text-[#6f6565]" : "bg-[#FFF5F7] text-[#B20947]"
                    }`}
                  >
                    {p.stock <= 0 ? "Out of stock" : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/products"
            className="mt-4 inline-block py-2 text-[12px] uppercase tracking-[0.15em] underline underline-offset-4"
            style={{ color: CRIMSON }}
          >
            Manage products
          </Link>
        </Panel>
      </div>

      {/* Recent orders */}
      <section aria-labelledby="recent-orders-title" className="mt-8 md:mt-10">
        <h2
          id="recent-orders-title"
          className={`${serif} m-0 text-[26px] font-medium sm:text-[30px]`}
          style={{ color: CRIMSON }}
        >
          Recent orders
        </h2>
        <div className="mt-4 rounded-sm border border-[#E8CFD2] bg-[#FAF1E4] sm:mt-5">
          {recentOrders.length === 0 ? (
            <p className="m-0 p-5 text-[15px] text-black/55 sm:p-6">No orders yet.</p>
          ) : (
            <ul className="m-0 list-none p-0">
              {recentOrders.map((o) => (
                <li key={o.id} className="border-b border-black/5 p-4 last:border-0 sm:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={`/admin/orders/details?id=${encodeURIComponent(o.id)}`}
                      className="lining-nums min-w-0 truncate text-[14px] underline underline-offset-4"
                      style={{ color: CRIMSON }}
                    >
                      {o.id}
                    </Link>
                    <StatusPill status={o.status} />
                  </div>
                  <p className="m-0 mt-2 truncate text-[14px]">
                    {o.customerName} · {o.city}
                  </p>
                  <p className="lining-nums m-0 mt-1 text-[13px] text-black/60">{inr(o.total)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link
          href="/admin/orders"
          className="mt-3 inline-block py-2 text-[12px] uppercase tracking-[0.15em] underline underline-offset-4"
          style={{ color: CRIMSON }}
        >
          See all orders
        </Link>
      </section>

      {/* Recent customers */}
      <section aria-labelledby="recent-customers-title" className="mt-8 md:mt-12">
        <h2
          id="recent-customers-title"
          className={`${serif} m-0 text-[26px] font-medium sm:text-[30px]`}
          style={{ color: CRIMSON }}
        >
          Recent customers
        </h2>
        <div className="mt-4 rounded-sm border border-[#E8CFD2] bg-[#FAF1E4] sm:mt-5">
          {recentCustomers.length === 0 ? (
            <p className="m-0 p-5 text-[15px] text-black/55 sm:p-6">No customers have registered yet.</p>
          ) : (
            <ul className="m-0 list-none p-0">
              {recentCustomers.map((c) => (
                <li key={c.id} className="border-b border-black/5 p-4 last:border-0 sm:px-6">
                  <Link
                    href={`/admin/customers/details?id=${encodeURIComponent(c.id)}`}
                    className="block no-underline hover:opacity-80"
                  >
                    <p className="m-0 text-[14px] font-medium text-[#332B2B]">{c.name}</p>
                    <p className="lining-nums m-0 mt-1 text-[13px] text-black/60">
                      +91 {c.phone} · {c.city}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link
          href="/admin/customers"
          className="mt-3 inline-block py-2 text-[12px] uppercase tracking-[0.15em] underline underline-offset-4"
          style={{ color: CRIMSON }}
        >
          See all customers
        </Link>
      </section>
    </AdminShell>
  );
}
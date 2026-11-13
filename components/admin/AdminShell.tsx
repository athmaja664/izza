"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  Image as ImageIcon,
  LayoutDashboard,
  Menu,
  Package,
  Percent,
  ShoppingBag,
  Tag,
  BarChart3,
  UserStar,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { focusRing, serif } from "@/components/izha/ui";

/** Admin-panel beige card/box & control classes (keeps storefront ui.tsx untouched). */
export const card =
  "rounded-2xl border-2 border-[#E8B8C5] bg-[#F3E8D8] ring-2 ring-inset ring-[#F8EFE2]";
export const cardCream =
  "rounded-2xl border-2 border-[#E8B8C5] bg-[#EFE2CE] ring-2 ring-inset ring-[#F6EBDC]";
export const outlineBtn = `inline-flex items-center justify-center rounded-[10px] border-[1.5px] border-[#E99A9F] bg-[#FAF3E8] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#B20947] transition-colors hover:bg-[#EFE2CE] sm:px-5 sm:py-2.5 sm:text-xs md:text-sm disabled:cursor-not-allowed disabled:border-[#d9cfd2] disabled:text-[#b3a9ab] ${focusRing}`;
export const inputCls =
  "w-full min-w-0 rounded-[10px] border border-[#D8BFA8] bg-[#FAF3E8] px-3.5 py-2.5 text-[16px] text-[#332B2B] placeholder:text-[#9c8c80] focus:border-[#B20947] focus:outline-none focus:ring-2 focus:ring-[#E99A9F]/40 sm:px-4 sm:py-3 sm:text-[15px]";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "Customer Track", href: "/admin/reports", icon: BarChart3  },
  { label: "Customer Review", href: "/admin/reviews", icon: UserStar },
  { label: "Offers & Shipping", href: "/admin/offers", icon: Percent },
  { label: "Home & Instagram", href: "/admin/homepage", icon: ImageIcon },
  { label: "Admin Profile", href: "/admin/profile", icon: UserCog },
];

export default function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname() ?? "/admin";
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock body scroll while mobile admin drawer is open
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const sidebarBody = (
    <div className="flex h-full flex-col bg-[#E99A9F]">
      {/* Brand header */}
      <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-black/10 bg-white p-1">
            <Image
              src="/images/logoo.png"
              alt="Izha Blooms"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
          <div>
            <p className={`${serif} text-[20px] font-semibold leading-none text-[#332B2B]`}>
              IZHA BLOOMS
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#382B2B]">
              Admin Studio
            </p>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close sidebar"
          className="rounded-lg p-1.5 text-[#332B2B] hover:bg-white/40 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav aria-label="Admin navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {ADMIN_NAV.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setDrawerOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition-colors ${focusRing} ${
                active
                  ? "border border-[#E8B8C5] bg-[#FFF5F7] text-[#B20947] shadow-sm"
                  : "text-[#332B2B] hover:bg-white/40 hover:text-[#B20947]"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={1.7}
                className={active ? "text-[#B20947]" : "text-[#332B2B]"}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Storefront shortcut */}
      <div className="border-t border-black/10 p-4">
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-[#E99A9F] bg-white px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#B20947] transition-colors hover:bg-[#FFF5F7]"
        >
          <ExternalLink size={15} />
          View Storefront
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen overflow-x-clip bg-[#EBDEC9] text-[#332B2B] lg:grid lg:h-screen lg:grid-cols-[260px_1fr] lg:overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden h-full border-r border-black/10 lg:block lg:overflow-y-auto">
        {sidebarBody}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[90] bg-[#382B2B]/50 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            className="h-full w-[85vw] max-w-[288px] overscroll-contain border-r border-black/10 bg-[#E99A9F] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarBody}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-col lg:h-screen lg:overflow-y-auto">
        <header className="sticky top-0 z-30 border-b border-[#D7C3AA] bg-[#EBDEC9]/95 px-3.5 py-3.5 backdrop-blur-md sm:px-8 sm:py-4">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:items-center">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open admin menu"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E8B8C5] bg-[#FAF3E8] text-[#332B2B] lg:hidden"
              >
                <Menu size={20} />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className={`${serif} text-[22px] font-medium leading-tight text-[#332B2B] sm:text-[34px]`}>
                  {title}
                </h1>
                {subtitle && <p className="mt-0.5 text-[12px] leading-snug text-[#6f6565] sm:text-[13px]">{subtitle}</p>}
              </div>
            </div>
            {actions && <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-2.5">{actions}</div>}
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1240px] flex-1 px-3.5 py-5 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
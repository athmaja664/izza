"use client";

import { useState } from "react";
import { Check, Percent, Truck } from "lucide-react";
import { KEYS, inr, useStored } from "@/lib/izha-store";
import { DEFAULT_OFFER_SETTINGS, type OfferSettings } from "@/lib/demo-store";
import AdminShell, { inputCls } from "@/components/admin/AdminShell";
import AlertBox from "@/components/izha/AlertBox";
import { serif, solidBtn } from "@/components/izha/ui";

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
        className={`${serif} m-0 flex items-start gap-2 break-words text-[22px] font-medium leading-tight sm:text-[28px]`}
        style={{ color: CRIMSON }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useStored<OfferSettings>(
    KEYS.offers,
    DEFAULT_OFFER_SETTINGS
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setOffers({ ...offers });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminShell title="Offers, Combos & Shipping">
      {/* Heading block */}
      <h2
        className={`${serif} mb-2 mt-0 break-words font-medium leading-tight`}
        style={{ color: CRIMSON, fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
      >
        Offers, Combos &amp; Shipping
      </h2>
      <p className="mb-6 mt-0 text-[14px] text-black/60 sm:text-[15px] md:mb-10">
        Manage first-order discounts, combo deals, Kerala free shipping, outside-Kerala rates &amp; Meta Pixel
      </p>

      {/* Quick look: two per row on phones */}
      <section aria-label="Current settings" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          label="First order"
          value={`${offers.firstOrderDiscountPct}%`}
          note={offers.firstOrderEnabled ? "Discount is on" : "Discount is off"}
        />
        <StatCard
          label="Combo offer"
          value={`${offers.comboDiscountPct}%`}
          note={offers.comboEnabled ? `On, from ${offers.comboMinItems} items` : "Combo is off"}
        />
        <StatCard
          label="Kerala shipping"
          value={offers.freeShippingKerala ? "Free" : "Paid"}
          note="PIN 67xxxx–69xxxx"
        />
        <StatCard
          label="Outside Kerala"
          value={inr(offers.outsideKeralaShipping)}
          note="Standard shipping charge"
        />
      </section>

      <form
        onSubmit={handleSave}
        className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-2"
      >
        {/* Combo & First Order Discounts */}
        <Panel
          title={
            <>
              <Percent size={20} className="mt-1 shrink-0" />
              <span>Offers &amp; Combo Rules</span>
            </>
          }
        >
          <div className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">
            <div className="rounded-sm border border-[#DFCBB3] bg-[#EFE2CE] p-4">
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <span className="text-[14px] font-semibold text-[#332B2B]">
                  Enable First Order Discount
                </span>
                <input
                  type="checkbox"
                  checked={offers.firstOrderEnabled}
                  onChange={(e) =>
                    setOffers({ ...offers, firstOrderEnabled: e.target.checked })
                  }
                  className="h-5 w-5 shrink-0 accent-[#B20947]"
                />
              </label>
              <label className="mt-3 block">
                <span className="mb-1 block text-[12px] text-[#6f6565]">
                  First Order Discount (%)
                </span>
                <input
                  type="number"
                  className={inputCls}
                  value={offers.firstOrderDiscountPct}
                  onChange={(e) =>
                    setOffers({
                      ...offers,
                      firstOrderDiscountPct: Number(e.target.value) || 0,
                    })
                  }
                />
              </label>
            </div>

            <div className="rounded-sm border border-[#DFCBB3] bg-[#EFE2CE] p-4">
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <span className="text-[14px] font-semibold text-[#332B2B]">
                  Enable Combo Offer
                </span>
                <input
                  type="checkbox"
                  checked={offers.comboEnabled}
                  onChange={(e) =>
                    setOffers({ ...offers, comboEnabled: e.target.checked })
                  }
                  className="h-5 w-5 shrink-0 accent-[#B20947]"
                />
              </label>

              <div className="mt-3 space-y-3">
                <label className="block">
                  <span className="mb-1 block text-[12px] text-[#6f6565]">
                    Combo Offer Label
                  </span>
                  <input
                    className={inputCls}
                    value={offers.comboTitle}
                    onChange={(e) => setOffers({ ...offers, comboTitle: e.target.value })}
                  />
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block min-w-0">
                    <span className="mb-1 block text-[12px] text-[#6f6565]">
                      Minimum Items
                    </span>
                    <input
                      type="number"
                      className={inputCls}
                      value={offers.comboMinItems}
                      onChange={(e) =>
                        setOffers({
                          ...offers,
                          comboMinItems: Math.max(2, Number(e.target.value) || 2),
                        })
                      }
                    />
                  </label>
                  <label className="block min-w-0">
                    <span className="mb-1 block text-[12px] text-[#6f6565]">
                      Combo Discount (%)
                    </span>
                    <input
                      type="number"
                      className={inputCls}
                      value={offers.comboDiscountPct}
                      onChange={(e) =>
                        setOffers({
                          ...offers,
                          comboDiscountPct: Number(e.target.value) || 0,
                        })
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* Shipping & Meta Ads */}
        <Panel
          title={
            <>
              <Truck size={20} className="mt-1 shrink-0" />
              <span>Kerala &amp; Pan-India Shipping + Meta Ads</span>
            </>
          }
          className="flex flex-col justify-between"
        >
          <div className="mt-4 space-y-4 sm:mt-5">
            <div className="rounded-sm border border-[#DFCBB3] bg-[#EFE2CE] p-4">
              <label className="flex cursor-pointer items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="m-0 text-[14px] font-semibold text-[#332B2B]">
                    Free Shipping in Kerala (PIN 67xxxx–69xxxx)
                  </p>
                  <p className="m-0 mt-0.5 text-[12px] text-[#6f6565]">
                    Checked live by the Checkout PIN code checker
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={offers.freeShippingKerala}
                  onChange={(e) =>
                    setOffers({ ...offers, freeShippingKerala: e.target.checked })
                  }
                  className="h-5 w-5 shrink-0 accent-[#B20947]"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                Outside Kerala Standard Shipping Charge (₹)
              </span>
              <input
                type="number"
                className={inputCls}
                value={offers.outsideKeralaShipping}
                onChange={(e) =>
                  setOffers({
                    ...offers,
                    outsideKeralaShipping: Number(e.target.value) || 0,
                  })
                }
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                Pan-India Free Shipping Order Threshold (₹)
              </span>
              <input
                type="number"
                className={inputCls}
                value={offers.freeShippingThreshold}
                onChange={(e) =>
                  setOffers({
                    ...offers,
                    freeShippingThreshold: Number(e.target.value) || 0,
                  })
                }
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-[#332B2B]">
                Meta Ads Pixel ID (Purchase Attribution)
              </span>
              <input
                className={inputCls}
                value={offers.metaPixelId}
                onChange={(e) => setOffers({ ...offers, metaPixelId: e.target.value })}
              />
            </label>
          </div>

          <div>
            {saved && (
              <AlertBox
                variant="success"
                message="Offer & shipping rules saved live for storefront Checkout."
                onClose={() => setSaved(false)}
                className="mt-5"
              />
            )}

            <button type="submit" className={`${solidBtn} mt-6 w-full gap-2`}>
              {saved && <Check size={16} />}
              {saved ? "Settings Updated Live" : "Save Offer & Shipping Rules"}
            </button>
          </div>
        </Panel>
      </form>
    </AdminShell>
  );
}
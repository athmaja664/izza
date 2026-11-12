"use client";

import { useState } from "react";
import { Check, Percent, Truck } from "lucide-react";
import { KEYS, useStored } from "@/lib/izha-store";
import { DEFAULT_OFFER_SETTINGS, type OfferSettings } from "@/lib/demo-store";
import AdminShell, { card, cardCream, inputCls } from "@/components/admin/AdminShell";
import { serif, solidBtn } from "@/components/izha/ui";

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
    <AdminShell
      title="Offers, Combos & Shipping"
      subtitle="Manage first-order discounts, combo deals, Kerala free shipping, outside-Kerala rates & Meta Pixel"
    >
      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-2">
        {/* Combo & First Order Discounts */}
        <section className={`${card} p-5 sm:p-6`}>
          <h2 className={`${serif} flex items-center gap-2 text-[24px] font-medium text-[#332B2B]`}>
            <Percent size={20} className="text-[#B20947]" />
            Offers &amp; Combo Rules
          </h2>

          <div className="mt-5 space-y-5">
            <div className="rounded-xl border border-[#DFCBB3] bg-[#EFE2CE] p-4">
              <label className="flex cursor-pointer items-center justify-between">
                <span className="text-[14px] font-semibold text-[#332B2B]">
                  Enable First Order Discount
                </span>
                <input
                  type="checkbox"
                  checked={offers.firstOrderEnabled}
                  onChange={(e) =>
                    setOffers({ ...offers, firstOrderEnabled: e.target.checked })
                  }
                  className="h-4 w-4 accent-[#B20947]"
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

            <div className="rounded-xl border border-[#DFCBB3] bg-[#EFE2CE] p-4">
              <label className="flex cursor-pointer items-center justify-between">
                <span className="text-[14px] font-semibold text-[#332B2B]">
                  Enable Combo Offer
                </span>
                <input
                  type="checkbox"
                  checked={offers.comboEnabled}
                  onChange={(e) =>
                    setOffers({ ...offers, comboEnabled: e.target.checked })
                  }
                  className="h-4 w-4 accent-[#B20947]"
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
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
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
                  <label className="block">
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
        </section>

        {/* Shipping & Meta Ads */}
        <section className={`${card} flex flex-col justify-between p-5 sm:p-6`}>
          <div>
            <h2 className={`${serif} flex items-center gap-2 text-[24px] font-medium text-[#332B2B]`}>
              <Truck size={20} className="text-[#B20947]" />
              Kerala &amp; Pan-India Shipping + Meta Ads
            </h2>

            <div className="mt-5 space-y-4">
              <div className={`${cardCream} p-4`}>
                <label className="flex cursor-pointer items-center justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-[#332B2B]">
                      Free Shipping in Kerala (PIN 67xxxx–69xxxx)
                    </p>
                    <p className="text-[12px] text-[#6f6565]">
                      Checked live by the Checkout PIN code checker
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={offers.freeShippingKerala}
                    onChange={(e) =>
                      setOffers({ ...offers, freeShippingKerala: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#B20947]"
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
          </div>

          <button type="submit" className={`${solidBtn} mt-6 w-full gap-2`}>
            {saved && <Check size={16} />}
            {saved ? "Settings Updated Live" : "Save Offer & Shipping Rules"}
          </button>
        </section>
      </form>
    </AdminShell>
  );
}


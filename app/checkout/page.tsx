"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Tag,
  Truck,
  UserCheck,
  X,
} from "lucide-react";
import {
  KEYS,
  inr,
  useStored,
  type Address,
  type AppUser,
  type CartItem,
} from "@/lib/izha-store";
import {
  DEFAULT_COUPONS,
  DEFAULT_CUSTOMERS,
  DEFAULT_OFFER_SETTINGS,
  DEFAULT_ORDERS,
  checkIndiaPincode,
  type Coupon,
  type DemoCustomer,
  type DemoOrder,
  type OfferSettings,
} from "@/lib/demo-store";
import { WhatsAppSvg } from "@/components/WhatsAppFloat";
import AlertBox from "@/components/izha/AlertBox";
import {
  EmptyBlock,
  FlowerBadge,
  PageShell,
  PageTitle,
  card,
  cardCream,
  focusRing,
  inputCls,
  outlineBtn,
  serif,
  solidBtn,
} from "@/components/izha/ui";

type CheckoutMode = "guest" | "signin" | "register";
type PaymentMethod = "UPI" | "Card" | "NetBanking" | "Cash on Delivery";

export default function CheckoutPage() {
  const [cart, setCart, ready] = useStored<CartItem[]>(KEYS.cart, []);
  const [user, setUser] = useStored<AppUser | null>(KEYS.user, null);
  const [savedAddresses] = useStored<Address[]>(KEYS.addresses, []);
  const [coupons] = useStored<Coupon[]>(KEYS.coupons, DEFAULT_COUPONS);
  const [offers] = useStored<OfferSettings>(KEYS.offers, DEFAULT_OFFER_SETTINGS);
  const [orders, setOrders] = useStored<DemoOrder[]>(KEYS.orders, DEFAULT_ORDERS);
  const [customers, setCustomers] = useStored<DemoCustomer[]>(
    KEYS.customers,
    DEFAULT_CUSTOMERS
  );

  const [mode, setMode] = useState<CheckoutMode>("guest");
  const defaultAddr = savedAddresses.find((a) => a.isDefault) ?? savedAddresses[0];

  const [name, setName] = useState(user?.name || defaultAddr?.name || "");
  const [phone, setPhone] = useState(user?.phone || defaultAddr?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState(defaultAddr?.line || "");
  const [city, setCity] = useState(defaultAddr?.city || "");
  const [stateName, setStateName] = useState("Kerala");
  const [pincode, setPincode] = useState(defaultAddr?.pincode || "");
  const [password, setPassword] = useState("");

  // Inline sign-in state
  const [signinId, setSigninId] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [authNote, setAuthNote] = useState("");

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // PIN code serviceability check state
  const [pinChecked, setPinChecked] = useState<ReturnType<typeof checkIndiaPincode> | null>(
    null
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState<DemoOrder | null>(null);

  const { subtotal, productSavings, totalQty } = useMemo(() => {
    let subtotal = 0;
    let productSavings = 0;
    let totalQty = 0;
    for (const item of cart) {
      subtotal += item.price * item.qty;
      totalQty += item.qty;
      if (item.oldPrice && item.oldPrice > item.price) {
        productSavings += (item.oldPrice - item.price) * item.qty;
      }
    }
    return { subtotal, productSavings, totalQty };
  }, [cart]);

  const comboDiscount = useMemo(() => {
    if (!offers.comboEnabled || totalQty < offers.comboMinItems) return 0;
    return Math.round((subtotal * offers.comboDiscountPct) / 100);
  }, [offers, subtotal, totalQty]);

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (subtotal < appliedCoupon.minOrder) return 0;
    return appliedCoupon.type === "percent"
      ? Math.round((subtotal * appliedCoupon.value) / 100)
      : Math.min(subtotal, appliedCoupon.value);
  }, [appliedCoupon, subtotal]);

  const activePinCheck = useMemo(() => {
    if (pinChecked) return pinChecked;
    if (/^[1-8]\d{5}$/.test(pincode.trim())) {
      return checkIndiaPincode(pincode, Math.max(0, subtotal - comboDiscount - couponDiscount), offers);
    }
    return null;
  }, [pinChecked, pincode, subtotal, comboDiscount, couponDiscount, offers]);

  const shippingCost = activePinCheck?.serviceable ? activePinCheck.shipping : 0;
  const totalDiscount = comboDiscount + couponDiscount;
  const finalPayable = Math.max(0, subtotal - totalDiscount + shippingCost);

  const changeQty = (id: string, size: string, delta: number) =>
    setCart((items) =>
      items.map((i) =>
        i.id === id && i.size === size
          ? { ...i, qty: Math.min(10, Math.max(1, i.qty + delta)) }
          : i
      )
    );

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponMsg({ ok: false, text: "Enter a coupon code to apply." });
      return;
    }
    const found = coupons.find((c) => c.code.toUpperCase() === code && c.active);
    if (!found) {
      setCouponMsg({
        ok: false,
        text: `Coupon "${code}" is invalid or inactive. Try BLOOM10, FIRST15, or IZHA200.`,
      });
      return;
    }
    if (subtotal < found.minOrder) {
      setCouponMsg({
        ok: false,
        text: `Minimum order of ${inr(found.minOrder)} required for ${found.code}.`,
      });
      return;
    }
    setAppliedCoupon(found);
    setCouponMsg({
      ok: true,
      text: `Coupon ${found.code} applied (${
        found.type === "percent" ? `${found.value}% OFF` : `${inr(found.value)} OFF`
      }).`,
    });
  };

  const handleCheckPincode = () => {
    const res = checkIndiaPincode(
      pincode,
      Math.max(0, subtotal - totalDiscount),
      offers
    );
    setPinChecked(res);
  };

  const handleInlineSignin = () => {
    const id = signinId.trim();
    if (!/^\S+@\S+\.\S+$/.test(id) && !/^[6-9]\d{9}$/.test(id)) {
      setAuthNote("Enter a valid email address or 10-digit mobile number.");
      return;
    }
    if (signinPassword.length < 6) {
      setAuthNote("Password must be at least 6 characters.");
      return;
    }
    const isMail = /^\S+@\S+\.\S+$/.test(id);
    setUser({
      name: name.trim() || (isMail ? id.split("@")[0] : "IZHA Circle Member"),
      email: isMail ? id : email.trim(),
      phone: !isMail ? id : phone.trim(),
      role: "customer",
    });
    if (!isMail && !phone) setPhone(id);
    if (isMail && !email) setEmail(id);
    setAuthNote("Signed in! Your details are ready for checkout.");
  };

  const handlePlaceOrder = () => {
    if (name.trim().length < 2) return setError("Please enter the recipient's full name.");
    if (!/^[6-9]\d{9}$/.test(phone.trim()))
      return setError("Please enter a valid 10-digit Indian mobile number.");
    if (address.trim().length < 6)
      return setError("Please enter your complete house / street delivery address.");
    if (city.trim().length < 2) return setError("Please enter your town or city.");
    const pinResult = checkIndiaPincode(
      pincode,
      Math.max(0, subtotal - totalDiscount),
      offers
    );
    if (!pinResult.valid) return setError(pinResult.message);

    if (mode === "register" && !user) {
      if (!/^\S+@\S+\.\S+$/.test(email.trim()))
        return setError("Enter a valid email address to create your IZHA Circle account.");
      if (password.length < 6)
        return setError("Choose a password of at least 6 characters to create your account.");
      setUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: "customer",
      });
    }

    setError("");
    const orderNumber = `IZB-${1007 + orders.length}`;
    const existingCustomer = customers.find(
      (c) => c.phone === phone.trim() || (email.trim() && c.email === email.trim())
    );
    const customerId = existingCustomer?.id ?? `cust-${Date.now()}`;

    if (!existingCustomer) {
      const newCustomer: DemoCustomer = {
        id: customerId,
        name: name.trim(),
        email: email.trim() || "guest@izhablooms.in",
        phone: phone.trim(),
        city: city.trim(),
        state: stateName.trim() || pinResult.region,
        pincode: pincode.trim(),
        address: address.trim(),
        joinedAt: new Date().toISOString().slice(0, 10),
        source: "Direct",
        savedAddresses: [],
      };
      setCustomers((prev) => [newCustomer, ...prev]);
    }

    const newOrder: DemoOrder = {
      id: orderNumber,
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      customerId,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerEmail: email.trim() || "guest@izhablooms.in",
      address: address.trim(),
      city: city.trim(),
      state: stateName.trim() || pinResult.region,
      pincode: pincode.trim(),
      items: cart.map((c) => ({
        id: c.id,
        name: c.name,
        image: c.image,
        size: c.size,
        qty: c.qty,
        price: c.price,
      })),
      subtotal,
      discount: totalDiscount,
      couponCode: appliedCoupon?.code,
      shipping: pinResult.shipping,
      total: Math.max(0, subtotal - totalDiscount + pinResult.shipping),
      paymentMethod,
      paymentStatus: paymentMethod === "Cash on Delivery" ? "COD Pending" : "Paid",
      paymentRef: `${paymentMethod.slice(0, 3).toUpperCase()}-${Math.floor(
        100000 + Math.random() * 899999
      )}`,
      status: "Processing",
      source: "Direct",
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setPlacedOrder(newOrder);
  };

  if (placedOrder) {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl py-8">
          <div className={`${card} relative px-6 pb-8 pt-10 text-center sm:px-10`}>
            <FlowerBadge />
            <CheckCircle2 size={46} className="mx-auto text-[#5f7a62]" />
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#B20947]">
              Order Confirmed
            </p>
            <h1 className={`${serif} mt-1 text-[34px] font-medium text-[#332B2B]`}>
              Thank you, {placedOrder.customerName}!
            </h1>
            <p className="mt-2 text-[14px] text-[#6f6565]">
              Your Izha Blooms order <strong className="text-[#332B2B]">{placedOrder.id}</strong>{" "}
              is confirmed and queued for dispatch to {placedOrder.city}, {placedOrder.pincode}.
            </p>

            <div className="mt-6 rounded-xl border border-[#E8CFD2] bg-[#FCF8F3] p-4 text-left text-[13px]">
              <div className="flex flex-wrap justify-between gap-2 border-b border-[#E8CFD2] pb-3">
                <span>
                  Payment: <strong>{placedOrder.paymentMethod}</strong> ({placedOrder.paymentStatus})
                </span>
                <span>
                  Total Paid: <strong>{inr(placedOrder.total)}</strong>
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {placedOrder.items.map((item) => (
                  <li key={`${item.id}-${item.size}`} className="flex justify-between gap-2">
                    <span>
                      {item.name} · Size {item.size} × {item.qty}
                    </span>
                    <span className="font-medium">{inr(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/track-order" className={solidBtn}>
                Track Order
              </Link>
              <Link href="/shop" className={outlineBtn}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageTitle
        title="Checkout"
        sub="Complete your order as a guest, sign in with OTP, or join IZHA Circle."
      />

      {ready && cart.length === 0 && (
        <EmptyBlock
          text="Your shopping bag is empty"
          href="/shop"
          action="Explore Styles"
        />
      )}

      {ready && cart.length > 0 && (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_400px]">
          <div className="space-y-6">
            {/* 3 Checkout Options */}
            <section className={`${card} p-5 sm:p-6`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B5607A]">
                Step 1 · Choose How You Would Like to Checkout
              </p>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                {(
                  [
                    { id: "guest", label: "Continue as Guest", sub: "No account required" },
                    { id: "signin", label: "Sign In", sub: user ? `Signed in: ${user.name}` : "Email / Mobile & Password" },
                    { id: "register", label: "Create an Account", sub: "Join IZHA Circle" },
                  ] as const
                ).map((opt) => {
                  const active = mode === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setMode(opt.id)}
                      className={`rounded-xl border p-3.5 text-left transition-colors ${focusRing} ${
                        active
                          ? "border-[#B20947] bg-[#FFF5F7]"
                          : "border-[#E8CFD2] bg-[#FCF8F3] hover:border-[#E99A9F]"
                      }`}
                    >
                      <p className={`text-[13px] font-semibold ${active ? "text-[#B20947]" : "text-[#332B2B]"}`}>
                        {opt.label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#6f6565]">{opt.sub}</p>
                    </button>
                  );
                })}
              </div>

              {mode === "signin" && !user && (
                <div className="mt-4 rounded-xl border border-[#E8CFD2] bg-[#FCF8F3] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-[#332B2B]">
                      Sign in with your account (or open full Sign-in page)
                    </p>
                    <Link
                      href="/account?next=/checkout"
                      className="text-[12px] font-medium text-[#B20947] underline underline-offset-4"
                    >
                      Open Sign-In Modal
                    </Link>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <input
                      className={inputCls}
                      value={signinId}
                      placeholder="Email or mobile number"
                      onChange={(e) => setSigninId(e.target.value)}
                    />
                    <input
                      type="password"
                      className={inputCls}
                      value={signinPassword}
                      placeholder="Password"
                      onChange={(e) => setSigninPassword(e.target.value)}
                    />
                    <button type="button" onClick={handleInlineSignin} className={outlineBtn}>
                      Sign In
                    </button>
                  </div>
                  {authNote && (
                    <AlertBox
                      variant={authNote.startsWith("Signed in") ? "success" : "error"}
                      message={authNote}
                      onClose={() => setAuthNote("")}
                      className="mt-3"
                    />
                  )}
                </div>
              )}

              {user && (
                <p className="mt-3 flex items-center gap-2 text-[13px] text-[#3f6a46]">
                  <UserCheck size={16} />
                  Checking out as <strong>{user.name}</strong>
                </p>
              )}
            </section>

            {/* Billing & Delivery Details */}
            <section className={`${card} p-5 sm:p-6`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B5607A]">
                Step 2 · Billing &amp; Delivery Address
              </p>

              {error && (
                <AlertBox
                  variant="error"
                  message={error}
                  onClose={() => setError("")}
                  className="mt-4"
                />
              )}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-medium text-[#332B2B]">
                    Full Name *
                  </span>
                  <input
                    className={inputCls}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Recipient full name"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-medium text-[#332B2B]">
                    Mobile Number *
                  </span>
                  <div className="flex">
                    <span className="flex items-center rounded-l-[10px] border border-r-0 border-[#E8B8C5] bg-[#FFF5F7] px-3 text-[14px] text-[#6f6565]">
                      +91
                    </span>
                    <input
                      className={`${inputCls} !rounded-l-none`}
                      value={phone}
                      maxLength={10}
                      inputMode="tel"
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="10 digit mobile"
                    />
                  </div>
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[13px] font-medium text-[#332B2B]">
                    Email Address {mode === "register" ? "*" : "(for order updates)"}
                  </span>
                  <input
                    className={inputCls}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </label>

                {mode === "register" && !user && (
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-[13px] font-medium text-[#332B2B]">
                      Create Account Password *
                    </span>
                    <input
                      className={inputCls}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                    />
                  </label>
                )}

                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[13px] font-medium text-[#332B2B]">
                    House Name / Flat / Street Address *
                  </span>
                  <input
                    className={inputCls}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House name, building, street & landmark"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-medium text-[#332B2B]">
                    Town / City *
                  </span>
                  <input
                    className={inputCls}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Aluva / Kochi / Bengaluru"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-[13px] font-medium text-[#332B2B]">
                    State *
                  </span>
                  <input
                    className={inputCls}
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="Kerala"
                  />
                </label>
              </div>

              {/* Delivery PIN Code Checker */}
              <div className="mt-5 rounded-xl border border-[#E8CFD2] bg-[#FCF8F3] p-4">
                <span className="flex items-center gap-2 text-[13px] font-semibold text-[#332B2B]">
                  <MapPin size={15} className="text-[#B20947]" />
                  Delivery PIN Code Check (India)
                </span>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <input
                    className={`${inputCls} max-w-[200px]`}
                    value={pincode}
                    maxLength={6}
                    inputMode="numeric"
                    placeholder="6-digit PIN code"
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, ""));
                      setPinChecked(null);
                    }}
                  />
                  <button type="button" onClick={handleCheckPincode} className={outlineBtn}>
                    Check Availability
                  </button>
                </div>
                {activePinCheck && (
                  <p
                    className={`mt-2.5 flex items-center gap-2 text-[13px] ${
                      activePinCheck.serviceable ? "text-[#3f6a46]" : "text-[#B20947]"
                    }`}
                  >
                    <Truck size={15} />
                    {activePinCheck.message}
                  </p>
                )}
              </div>
            </section>

            {/* Payment Method */}
            <section className={`${card} p-5 sm:p-6`}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B5607A]">
                Step 3 · Payment Method
              </p>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {(["UPI", "Card", "NetBanking", "Cash on Delivery"] as const).map((method) => {
                  const active = paymentMethod === method;
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-left text-[14px] font-medium transition-colors ${focusRing} ${
                        active
                          ? "border-[#B20947] bg-[#FFF5F7] text-[#B20947]"
                          : "border-[#E8CFD2] bg-[#FCF8F3] text-[#332B2B]"
                      }`}
                    >
                      <CreditCard size={17} />
                      {method}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className={`${card} relative px-5 pb-6 pt-9 sm:px-6`}>
              <FlowerBadge />
              <h2 className={`${serif} text-center text-[26px] font-medium text-[#332B2B]`}>
                Order Summary
              </h2>
              <span className="mx-auto mt-2 block h-[2px] w-14 bg-[#E8B8C5]" />

              {/* Bag Items with quick qty updates */}
              <ul className="mt-5 divide-y divide-[#E8CFD2]">
                {cart.map((item) => (
                  <li key={`${item.id}-${item.size}`} className="flex items-center gap-3 py-3">
                    <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-[#E8B8C5] bg-[#FFF5F7]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        quality={75}
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-[13px] font-medium text-[#332B2B]">
                        {item.name}
                      </p>
                      <p className="text-[12px] text-[#6f6565]">
                        Size {item.size} · {inr(item.price)}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => changeQty(item.id, item.size, -1)}
                          disabled={item.qty <= 1}
                          aria-label="Decrease quantity"
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E8B8C5] text-[#332B2B] disabled:opacity-40"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-[12px] font-medium">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => changeQty(item.id, item.size, 1)}
                          disabled={item.qty >= 10}
                          aria-label="Increase quantity"
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E8B8C5] text-[#332B2B] disabled:opacity-40"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <span className="text-[13px] font-semibold text-[#332B2B]">
                      {inr(item.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Coupon Code Section */}
              <div className="mt-4 border-t border-[#E8CFD2] pt-4">
                <label className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#332B2B]">
                  <Tag size={14} className="text-[#B20947]" />
                  Apply Coupon Code
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    className={`${inputCls} !py-2.5 text-[13px] uppercase`}
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="BLOOM10 / FIRST15"
                  />
                  <button type="button" onClick={handleApplyCoupon} className={outlineBtn}>
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-[#f0f7f1] px-3 py-1.5 text-[12px] text-[#3f6a46]">
                    <span>
                      Code <strong>{appliedCoupon.code}</strong> active
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponMsg(null);
                      }}
                      aria-label="Remove coupon"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {couponMsg && (
                  <AlertBox
                    variant={couponMsg.ok ? "success" : "error"}
                    message={couponMsg.text}
                    onClose={() => setCouponMsg(null)}
                    className="mt-2.5"
                  />
                )}
              </div>

              {/* Price Breakdown */}
              <dl className="mt-5 space-y-2.5 border-t border-[#E8CFD2] pt-4 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-[#6f6565]">Subtotal ({totalQty} items)</dt>
                  <dd className="font-medium text-[#332B2B]">{inr(subtotal)}</dd>
                </div>
                {productSavings > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-[#6f6565]">MRP Savings</dt>
                    <dd className="font-medium text-[#5f7a62]">−{inr(productSavings)}</dd>
                  </div>
                )}
                {comboDiscount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-[#6f6565]">{offers.comboTitle}</dt>
                    <dd className="font-medium text-[#5f7a62]">−{inr(comboDiscount)}</dd>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-[#6f6565]">Coupon ({appliedCoupon?.code})</dt>
                    <dd className="font-medium text-[#5f7a62]">−{inr(couponDiscount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-[#6f6565]">
                    Shipping {activePinCheck?.region ? `(${activePinCheck.region})` : ""}
                  </dt>
                  <dd className="font-medium text-[#332B2B]">
                    {activePinCheck
                      ? shippingCost === 0
                        ? "FREE"
                        : inr(shippingCost)
                      : "Enter PIN code"}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-[#E8CFD2] pt-3">
                  <dt className={`${serif} text-[22px] font-semibold text-[#332B2B]`}>
                    Final Payable
                  </dt>
                  <dd className={`${serif} text-[26px] font-semibold text-[#B20947]`}>
                    {inr(finalPayable)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className={`${solidBtn} mt-5 w-full`}
              >
                Place Order · {inr(finalPayable)}
              </button>

              <div className={`${cardCream} mt-4 flex items-center justify-between gap-2 px-3.5 py-2.5 text-[12px] text-[#6f6565]`}>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-[#B20947]" />
                  Safe &amp; Secure Checkout
                </span>
                <a
                  href="https://wa.me/919995757612"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-[#B20947] hover:underline"
                >
                  <WhatsAppSvg size={14} />
                  Help
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}
    </PageShell>
  );
}

